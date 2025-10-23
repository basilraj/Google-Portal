import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// A simple (and insecure) hashing function for demonstration.
const simpleHash = (s: string) => {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        const char = s.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString();
};


export async function POST(request: Request) {
    try {
        const { model, action, data, id, ids, where, include } = await request.json();

        if (!model || !action) {
            return new Response(JSON.stringify({ error: 'Model and action are required' }), { status: 400 });
        }
        
        // @ts-ignore
        const dbModel = prisma[model];
        
        if (!dbModel) {
            return new Response(JSON.stringify({ error: 'Invalid model' }), { status: 400 });
        }

        let result;

        switch (action) {
            case 'findMany':
                result = await dbModel.findMany({ where, include });
                break;
            case 'findUnique':
                 if (!where) return new Response(JSON.stringify({ error: '`where` clause is required for findUnique' }), { status: 400 });
                result = await dbModel.findUnique({ where });
                break;
            case 'create':
                 if (!data) return new Response(JSON.stringify({ error: '`data` is required for create' }), { status: 400 });
                result = await dbModel.create({ data });
                break;
            case 'createMany':
                if (!data) return new Response(JSON.stringify({ error: '`data` is required for createMany' }), { status: 400 });
                result = await dbModel.createMany({ data });
                break;
            case 'update':
                if (!where || !data) return new Response(JSON.stringify({ error: '`where` and `data` are required for update' }), { status: 400 });
                result = await dbModel.update({ where, data });
                break;
            case 'delete':
                if (!where) return new Response(JSON.stringify({ error: '`where` clause is required for delete' }), { status: 400 });
                result = await dbModel.delete({ where });
                break;
            case 'deleteMany':
                if (!where) return new Response(JSON.stringify({ error: '`where` clause is required for deleteMany' }), { status: 400 });
                result = await dbModel.deleteMany({ where });
                break;
            // Auth specific actions
            case 'signup':
                const existingUser = await prisma.user.findFirst({ where: { OR: [{ username: data.username }, { email: data.email }] } });
                if (existingUser) {
                    return new Response(JSON.stringify({ error: 'Username or email already exists' }), { status: 409 });
                }
                const newUser = await prisma.user.create({
                    data: { username: data.username, email: data.email, passwordHash: simpleHash(data.password) }
                });
                result = { success: true, user: { id: newUser.id, username: newUser.username } };
                break;
            case 'login':
                const user = await prisma.user.findUnique({ where: { username: data.username } });
                if (user && user.passwordHash === simpleHash(data.password)) {
                    result = { success: true, user: { id: user.id, username: user.username, email: user.email } };
                } else {
                    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
                }
                break;
             case 'updateCredentials':
                const userToUpdate = await prisma.user.findFirst(); // Assuming single admin
                 if (userToUpdate && userToUpdate.passwordHash === simpleHash(data.currentPassword)) {
                    result = await prisma.user.update({
                        where: { id: userToUpdate.id },
                        data: { username: data.newUsername, passwordHash: simpleHash(data.newPassword) }
                    });
                } else {
                    return new Response(JSON.stringify({ error: 'Invalid current password' }), { status: 401 });
                }
                break;
            default:
                return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
        }

        return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ error: 'An internal server error occurred' }), { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const model = searchParams.get('model');

        if (!model) {
            return new Response(JSON.stringify({ error: 'Model parameter is required' }), { status: 400 });
        }

        // @ts-ignore
        const dbModel = prisma[model];
        if (!dbModel) {
            return new Response(JSON.stringify({ error: 'Invalid model' }), { status: 400 });
        }

        // Special case for settings, get the first and only row
        if (model === 'settings') {
            const settings = await prisma.settings.findFirst();
            return new Response(JSON.stringify(settings || {}), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        
        if (model === 'user') {
            const user = await prisma.user.findFirst();
            return new Response(JSON.stringify(user || null), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        const data = await dbModel.findMany();
        return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('API GET Error:', error);
        return new Response(JSON.stringify({ error: 'An internal server error occurred' }), { status: 500 });
    }
}
