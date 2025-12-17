const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = './uploads';

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save files to a dedicated uploads directory
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // Sanitize filename to prevent path traversal attacks
    const sanitizedFilename = path.basename(file.originalname);
    cb(null, sanitizedFilename);
  }
});

// File filter to only accept zip files
const fileFilter = (req, file, cb) => {
  if (path.extname(file.originalname).toLowerCase() === '.zip') {
    cb(null, true);
  } else {
    cb(new Error('Only .zip files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max file size
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Zip File Upload Server',
    endpoints: {
      upload: 'POST /upload - Upload a zip file',
      files: 'GET /files - List all zip files'
    }
  });
});

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    size: req.file.size,
    path: req.file.path
  });
});

// List all zip files endpoint
// Note: For production use, consider adding rate limiting to prevent abuse
app.get('/files', (req, res) => {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read directory' });
    }
    
    const zipFiles = files.filter(file => path.extname(file).toLowerCase() === '.zip');
    res.json({
      count: zipFiles.length,
      files: zipFiles
    });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Max 100MB allowed.' });
    }
    return res.status(400).json({ error: err.message });
  }
  
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Upload files using: curl -F "file=@yourfile.zip" http://localhost:${PORT}/upload`);
});
