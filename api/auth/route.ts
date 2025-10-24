import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';
import { getSession } from '../../lib/session';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const session = await getSession(req, res);

    try {
        if (req.method === 'GET') {
            if (session.isAdmin && session.userId) {
                const user = await prisma.user.findUnique({ where: { id: session.userId } });
                if (user) {
                  return res.status(200).json({ 
                      isLoggedIn: true, 
                      user: { 
                          username: user.username, 
                          email: user.email, 
                          isDemo: !!session.isDemo 
                      } 
                  });
                }
            }
            const adminCount = await prisma.user.count();
            return res.status(200).json({ isLoggedIn: false, adminExists: adminCount > 0 });
        }

        if (req.method === 'POST') {
            const { action, username, password, email, isDemo } = req.body;

            switch (action) {
                case 'signup': {
                    const adminCount = await prisma.user.count();
                    if (adminCount > 0) {
                        return res.status(403).json({ message: 'Admin account already exists.' });
                    }
                    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
                    await prisma.user.create({ data: { username, email, passwordHash } });
                    return res.status(201).json({ message: 'Admin created.' });
                }

                case 'login': {
                    if (isDemo) {
                        session.isAdmin = true;
                        session.isDemo = true;
                        session.userId = 'demo-user';
                        await session.save();
                        await prisma.activityLog.create({data: { action: 'Demo Login', details: `Demo user logged in.` }});
                        return res.status(200).json({ 
                            message: 'Logged in as demo user.', 
                            user: { username: 'Demo User', email: 'demo@example.com', isDemo: true }
                        });
                    }
                    
                    const user = await prisma.user.findUnique({ where: { username } });
                    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
                        return res.status(401).json({ message: 'Invalid credentials.' });
                    }

                    session.userId = user.id;
                    session.isAdmin = true;
                    session.isDemo = false;
                    await session.save();
                    await prisma.activityLog.create({data: { action: 'Admin Login', details: `User ${user.username} logged in.` }});
                    return res.status(200).json({ 
                        message: 'Logged in.', 
                        user: { username: user.username, email: user.email, isDemo: false }
                    });
                }
                
                case 'logout':
                    await prisma.activityLog.create({data: { action: 'Admin Logout', details: `User logged out.` }});
                    session.destroy();
                    return res.status(200).json({ message: 'Logged out.' });

                case 'request_password_reset': {
                    const userToReset = await prisma.user.findFirst({ where: { email } });
                    if (userToReset) {
                        session.resetUserId = userToReset.id;
                        await session.save();
                        return res.status(200).json({ message: 'Proceed to reset.' });
                    }
                    return res.status(404).json({ message: 'Email not found.' });
                }
            }
        }
        
        if (req.method === 'PUT') {
            const { action, currentPassword, newUsername, newPassword } = req.body;

            switch(action) {
                case 'update_credentials': {
                    if (!session.isAdmin || !session.userId) return res.status(401).json({ message: 'Unauthorized' });

                    const userToUpdate = await prisma.user.findUnique({ where: { id: session.userId } });
                    if (!userToUpdate || !(await bcrypt.compare(currentPassword, userToUpdate.passwordHash))) {
                         return res.status(401).json({ message: 'Incorrect current password.' });
                    }
                    const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
                    const updatedUser = await prisma.user.update({
                        where: { id: session.userId },
                        data: { username: newUsername, passwordHash: newPasswordHash }
                    });
                    await prisma.activityLog.create({data: { action: 'Credentials Updated', details: `Admin credentials updated for ${updatedUser.username}.` }});
                     return res.status(200).json({ message: 'Credentials updated.', user: { username: updatedUser.username, email: updatedUser.email } });
                }
                
                case 'reset_password': {
                    if (!session.resetUserId) {
                         return res.status(401).json({ message: 'Invalid reset request.' });
                    }
                    const finalNewPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
                    await prisma.user.update({
                        where: { id: session.resetUserId },
                        data: { passwordHash: finalNewPasswordHash }
                    });
                    session.destroy();
                    return res.status(200).json({ message: 'Password has been reset. Please log in again.' });
                }
            }
        }

        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });

    } catch (error) {
        console.error('Error in /api/auth:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}