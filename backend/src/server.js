const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); // For cross-origin requests from the React frontend

const app = express();
const PORT = process.env.PORT || 5000;

// Set up storage engine for uploaded files
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Init multer with the storage config
const upload = multer({ storage });

// Middleware to allow the React app to communicate with the backend
app.use(cors());

// Serve static files (like uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// POST route to handle file uploads
app.post('/upload', upload.array('images', 10), (req, res) => {
  // Respond with the file paths of the uploaded images
  const filePaths = req.files.map(file => `/uploads/${file.filename}`);
  res.json({ message: 'Files uploaded successfully', filePaths });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
