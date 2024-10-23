import { verify } from 'jsonwebtoken';
import { Context, Next } from 'hono';

// Define the UserPayload type
export type UserPayload = {
  id: number;
  role: string;
};

// Extend the Hono context
export interface CustomContext extends Context {
  user?: UserPayload; // Optional user property
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Middleware to verify JWT and attach user info to the context
export const verifyJWT = async (c: CustomContext, next: Next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return c.json({ error: 'No token provided' }, 401);
  }

  try {
    const decoded = verify(token, JWT_SECRET) as UserPayload;
    // Attach user data to context
    c.user = decoded; // Assign decoded user info to the custom context
  } catch (err) {
    return c.json({ error: 'Invalid token' }, 403);
  }

  await next();
};
