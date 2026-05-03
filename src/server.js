import express from 'express';
import multer from 'multer';
import Jimp from 'jimp';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { removeWatermarkFromBuffer } from '@pilio/gemini-watermark-remover/node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

// Multer configuration for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * Helper to decode image buffer using Jimp
 */
const decodeImageData = async (buffer) => {
  const image = await Jimp.read(buffer);
  return { 
    width: image.bitmap.width, 
    height: image.bitmap.height, 
    data: new Uint8ClampedArray(image.bitmap.data) 
  };
};

/**
 * Helper to encode image data back to buffer using Jimp
 */
const encodeImageData = async (imageData) => {
  const image = new Jimp({
    width: imageData.width,
    height: imageData.height,
    data: Buffer.from(imageData.data)
  });
  return await image.getBufferAsync(Jimp.MIME_PNG);
};

// API Routes
app.post('/api/clean', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    console.log(`Processing image: ${req.file.originalname} (${req.file.size} bytes)`);

    const result = await removeWatermarkFromBuffer(req.file.buffer, {
      mimeType: req.file.mimetype,
      decodeImageData,
      encodeImageData
    });

    res.set('Content-Type', 'image/png');
    res.send(result.buffer);
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

// Fallback to index.html for SPA-like behavior or direct access
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Pristine Server running on http://0.0.0.0:${PORT}`);
});
