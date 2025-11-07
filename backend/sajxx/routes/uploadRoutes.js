const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const { uploadFile } = require('../controllers/uploadController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
    cb(null, `${timestamp}-${sanitized}`);
  }
});

const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const fileFilter = (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: Number(process.env.UPLOAD_LIMIT_BYTES) || 5 * 1024 * 1024
  }
});

/**
 * POST /api/upload
 * Uploads a single image file. Requires admin token.
 * Payload: multipart/form-data with field "file" containing an image (jpeg/png/webp/gif).
 * Response: { url, filename, size, mimetype }
 */
router.post('/', protect, upload.single('file'), uploadFile);

module.exports = router;
