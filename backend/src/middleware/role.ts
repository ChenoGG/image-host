import { Context, Next } from 'hono';

// Middleware to require a specific user role
export const requireRole = (role: string) => {
  return async (c: Context, next: Next) => {
    const user = c.get('user'); // Retrieve user from context
    if (!user || user.role !== role) {
      return c.json({ error: 'Access denied' }, 403);
    }
    await next(); // Proceed if the user has the required role
  };
};
