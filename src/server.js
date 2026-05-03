import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
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
 * Helper to decode image buffer using Sharp
 */
const decodeImageData = async (buffer) => {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  return { 
    width: info.width, 
    height: info.height, 
    data: new Uint8ClampedArray(data) 
  };
};

/**
 * Helper to encode image data back to buffer using Sharp
 */
const encodeImageData = async (imageData, context = {}) => {
  const { width, height, data } = imageData;
  const format = context.mimeType === 'image/jpeg' ? 'jpeg' : 
                 (context.mimeType === 'image/webp' ? 'webp' : 'png');
  
  let pipeline = sharp(Buffer.from(data), {
    raw: { width, height, channels: 4 }
  });

  if (format === 'jpeg') {
    pipeline = pipeline.jpeg({ quality: 95 });
  } else if (format === 'webp') {
    pipeline = pipeline.webp({ quality: 95 });
  } else {
    pipeline = pipeline.png();
  }

  return await pipeline.toBuffer();
};

// API Routes
app.get('/health', (req, res) => res.status(200).send('OK'));

app.post('/api/clean', upload.single('image'), async (req, res) => {
  const startTime = Date.now();
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    console.log(`[${new Date().toISOString()}] Processing: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB)`);

    const result = await removeWatermarkFromBuffer(req.file.buffer, {
      mimeType: req.file.mimetype,
      decodeImageData,
      encodeImageData
    });

    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] Completed in ${duration}ms`);

    res.set('Content-Type', req.file.mimetype.startsWith('image/') ? req.file.mimetype : 'image/png');
    res.send(result.buffer);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Processing error:`, error);
    res.status(500).json({ error: 'Failed to process image', details: error.message });
  }
});

// Fallback to index.html for SPA-like behavior or direct access
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Pristine Server running on http://0.0.0.0:${PORT}`);
});
