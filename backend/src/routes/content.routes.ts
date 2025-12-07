import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Get page content by slug (Public)
router.get('/:slug', async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const result = await pool.query(
            'SELECT slug, title, content, meta_description, updated_at FROM site_content WHERE slug = $1',
            [slug]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Page not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching content:', err);
        res.status(500).json({ error: 'Failed to fetch content' });
    }
});

// Get all pages (Admin)
router.get('/', authenticate, authorize('admin', 'editor'), async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT slug, title, meta_description, updated_at FROM site_content ORDER BY slug'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching pages:', err);
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
});

// Update page content (Admin)
router.put('/:slug', authenticate, authorize('admin', 'editor'), async (req: AuthRequest, res: Response) => {
    try {
        const { slug } = req.params;
        const { title, content, meta_description } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const result = await pool.query(
            `UPDATE site_content 
             SET title = $1, content = $2, meta_description = $3, updated_by = $4, updated_at = CURRENT_TIMESTAMP 
             WHERE slug = $5 
             RETURNING slug, title, content, meta_description, updated_at`,
            [title, content, meta_description, req.user?.id, slug]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Page not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating content:', err);
        res.status(500).json({ error: 'Failed to update content' });
    }
});

export default router;
