import { Hono } from 'hono';
import bcrypt from 'bcrypt';
import db from '../db/db';
import { z } from 'zod';

type User = {
  id: number;
  username: string;
  password: string;
  role: string;
};

const users = new Hono();

// User registration schema
const userSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

// Register a new user
users.post('/register', async (c) => {
  const body = await c.req.parseBody();
  const result = userSchema.safeParse(body);

  if (!result.success) {
    return c.json({ error: 'Invalid data' }, 400);
  }

  const { username, password } = result.data;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const stmt = db.prepare(
      'INSERT INTO users (username, password) VALUES (?, ?)'
    );
    stmt.run(username, hashedPassword);

    return c.json({ message: 'User registered successfully' });
  } catch (err) {
    return c.json({ error: 'Username already exists' }, 409);
  }
});

// Login route
users.post('/login', async (c) => {
  const body = await c.req.parseBody();
  const result = userSchema.safeParse(body);

  if (!result.success) {
    return c.json({ error: 'Invalid data' }, 400);
  }

  const { username, password } = result.data;

  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const user = stmt.get(username) as User | undefined;

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  // Store user session logic (JWT, cookies, etc.) would go here

  return c.json({ message: 'Login successful' });
});

export default users;
