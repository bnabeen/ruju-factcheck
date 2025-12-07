import { Router, Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { authenticate, AuthRequest } from '../middleware/auth';
import pool from '../config/database';

const router = Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
const imagesDir = path.join(uploadsDir, 'images');
const filesDir = path.join(uploadsDir, 'files');

[uploadsDir, imagesDir, filesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isImage = file.mimetype.startsWith('image/');
        cb(null, isImage ? imagesDir : filesDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow images and common document types
        const allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'video/mp4',
            'video/webm',
            'application/pdf',
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Allowed: images, videos (mp4, webm), PDF'));
        }
    }
});

// Upload image with optimization
router.post('/image', authenticate, upload.single('image'), async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { caption, alt } = req.body;
        const originalPath = req.file.path;
        const optimizedFilename = `optimized-${req.file.filename}`;
        const optimizedPath = path.join(imagesDir, optimizedFilename);

        // Optimize image with sharp
        await sharp(originalPath)
            .resize(1200, 1200, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality: 85 })
            .toFile(optimizedPath);

        // Delete original, keep optimized
        fs.unlinkSync(originalPath);

        // Save to database
        const result = await pool.query(
            `INSERT INTO media_uploads (filename, original_filename, file_path, file_size, mime_type, uploaded_by)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, filename, file_path`,
            [
                optimizedFilename,
                req.file.originalname,
                `/uploads/images/${optimizedFilename}`,
                req.file.size,
                req.file.mimetype,
                req.user?.id
            ]
        );

        res.json({
            id: result.rows[0].id,
            url: `/uploads/images/${optimizedFilename}`,
            filename: optimizedFilename,
            caption,
            alt
        });
    } catch (err) {
        console.error('Image upload error:', err);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Upload file (for evidence, documents)
router.post('/file', upload.single('file'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Save to database
        const result = await pool.query(
            `INSERT INTO media_uploads (filename, original_filename, file_path, file_size, mime_type, uploaded_by)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, filename, file_path`,
            [
                req.file.filename,
                req.file.originalname,
                `/uploads/files/${req.file.filename}`,
                req.file.size,
                req.file.mimetype,
                (req as AuthRequest).user?.id || null
            ]
        );

        res.json({
            id: result.rows[0].id,
            url: `/uploads/files/${req.file.filename}`,
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            mimeType: req.file.mimetype
        });
    } catch (err) {
        console.error('File upload error:', err);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

// Get uploaded file info
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT id, filename, original_filename, file_path, file_size, mime_type, created_at FROM media_uploads WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching file info:', err);
        res.status(500).json({ error: 'Failed to fetch file info' });
    }
});

export default router;
