import { Hono } from 'hono';
import { verifyJWT } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import db from '../db/db';
import { UserPayload, CustomContext } from '../middleware/auth';

const comics = new Hono();

// Route to get all comics, public for regular users, all for admins
comics.get('/comics', verifyJWT, async (c: CustomContext) => {
  const user = c.user as UserPayload; // Use the custom context to get the user

  let stmt;
  if (user.role === 'admin') {
    // Admin can see all webcomics
    stmt = db.prepare('SELECT * FROM comics');
  } else {
    // Regular users can only see public webcomics
    stmt = db.prepare('SELECT * FROM comics WHERE isPublic = 1');
  }

  const comics = stmt.all();

  return c.json({ comics });
});

// Example: Admin-only route to delete a webcomic
comics.delete('/comics/:id', verifyJWT, requireRole('admin'), async (c: CustomContext) => {
  const comicId = c.req.param('id');

  // Delete the webcomic from the database
  const stmt = db.prepare('DELETE FROM comics WHERE id = ?');
  const result = stmt.run(comicId);

  if (result.changes === 0) {
    return c.json({ error: 'Comic not found' }, 404);
  }

  return c.json({ message: 'Comic deleted successfully' });
});

export default comics;
