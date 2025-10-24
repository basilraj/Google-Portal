import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import { VercelRequest, VercelResponse } from '@vercel/node';

// This is the shape of the data that will be stored in the session.
export interface SessionData {
  userId?: string;
  isDemo?: boolean;
  isAdmin?: boolean;
  resetUserId?: string; // For password reset flow
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'jobtica-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
};

// Helper function to get the session from a Vercel Serverless Function request/response.
export async function getSession(
  req: VercelRequest, 
  res: VercelResponse
): Promise<IronSession<SessionData>> {
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  return session;
}