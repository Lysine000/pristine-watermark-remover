import express from 'express';
import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { removeWatermarkFromBuffer } from '@pilio/gemini-watermark-remover/node';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 8080;

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }
});

const decodeImageData = async (buffer) => {
    const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    return { width: info.width, height: info.height, data: Uint8ClampedArray.from(data) };
};

const encodeImageData = async (imageData, context = {}) => {
    const format = context.mimeType === 'image/jpeg' ? 'jpeg' : (context.mimeType === 'image/webp' ? 'webp' : 'png');
    let encoder = sharp(Buffer.from(imageData.data), {
        raw: { width: imageData.width, height: imageData.height, channels: 4 }
    });
    if (format === 'jpeg') encoder = encoder.jpeg({ quality: 95 });
    else if (format === 'webp') encoder = encoder.webp({ quality: 95 });
    else encoder = encoder.png();
    return encoder.toBuffer();
};

app.use(express.static('public'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/clean', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
        if (!req.file.mimetype.startsWith('image/')) return res.status(400).json({ error: 'Invalid file type. Only images are allowed.' });
        const result = await removeWatermarkFromBuffer(req.file.buffer, {
            mimeType: req.file.mimetype, decodeImageData, encodeImageData
        });
        res.set('Content-Type', req.file.mimetype);
        res.send(result.buffer);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed', message: error.message });
    }
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    next(err);
});

app.listen(port, '0.0.0.0', () => {
    console.log('Pristine server running at http://0.0.0.0:8080');
});
