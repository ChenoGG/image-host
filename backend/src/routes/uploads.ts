import { Hono } from 'hono';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import type { IncomingMessage } from 'http';

const uploads = new Hono();

// Upload directory
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

uploads.post('/', async (c) => {
  const form = formidable({ uploadDir, keepExtensions: true });

  return new Promise((resolve, reject) => {
    form.parse(c.req.raw as unknown as IncomingMessage, (err, fields, files) => {
      if (err) {
        return resolve(c.json({ error: 'Upload failed' }, 500));
      }

      const uploadedFiles = files;
      return resolve(c.json({ message: 'Upload successful', files: uploadedFiles }));
    });
  });
});

export default uploads;
