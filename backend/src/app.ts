import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import comics from './routes/comics';
import 'dotenv/config';
import users from './routes/users';
import uploads from './routes/uploads';

const app = new Hono();

app.get('/', (c) => c.text('Welcome to the Webcomic Image Sharing API!'));

// Use the comics route
app.route('/comics', comics);

// Users route
app.route('/users', users);

// Upload a comic route
app.route('/uploads', uploads);

serve(app);
