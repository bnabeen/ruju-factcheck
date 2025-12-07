import { Router, Request, Response } from 'express';
import Joi from 'joi';
import pool from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all articles (with optional language filter and pagination)
router.get('/', async (req: Request, res: Response) => {
    try {
        const lang = (req.query.lang as string) || 'EN';
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0;

        // Select appropriate fields based on language
        // If lang is NP, prefer NP fields, fallback to EN if null? 
        // For now, let's just return the raw fields and let frontend handle or project here.
        // Actually, to make frontend transition easier, let's project to the shape frontend expects.

        const query = `
            SELECT 
                id,
                CASE WHEN $1 = 'NP' THEN COALESCE(title_np, title_en) ELSE title_en END as title,
                CASE WHEN $1 = 'NP' THEN COALESCE(summary_np, summary_en) ELSE summary_en END as summary,
                CASE WHEN $1 = 'NP' THEN COALESCE(content_np, content_en) ELSE content_en END as content,
                verdict,
                category,
                image_url as "imageUrl",
                published_at as date,
                (SELECT full_name FROM users WHERE users.id = articles.author_id) as author
            FROM articles
            ORDER BY published_at DESC
            LIMIT $2 OFFSET $3
        `;

        const result = await pool.query(query, [lang, limit, offset]);

        // Format date to YYYY-MM-DD
        const formattedRows = result.rows.map(row => ({
            ...row,
            date: row.date ? new Date(row.date).toISOString().split('T')[0] : null
        }));

        res.json(formattedRows);
    } catch (err) {
        console.error('Error fetching articles:', err);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

// Get single article by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const lang = (req.query.lang as string) || 'EN';

        const query = `
            SELECT 
                id,
                CASE WHEN $2 = 'NP' THEN COALESCE(title_np, title_en) ELSE title_en END as title,
                CASE WHEN $2 = 'NP' THEN COALESCE(summary_np, summary_en) ELSE summary_en END as summary,
                CASE WHEN $2 = 'NP' THEN COALESCE(content_np, content_en) ELSE content_en END as content,
                verdict,
                category,
                image_url as "imageUrl",
                published_at as date,
                (SELECT full_name FROM users WHERE users.id = articles.author_id) as author
            FROM articles
            WHERE id = $1
        `;

        const result = await pool.query(query, [id, lang]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Article not found' });
        }

        const row = result.rows[0];
        const article = {
            ...row,
            date: row.date ? new Date(row.date).toISOString().split('T')[0] : null
        };

        res.json(article);
    } catch (err) {
        console.error('Error fetching article:', err);
        res.status(500).json({ error: 'Failed to fetch article' });
    }
});

// Validation schema for article
const articleSchema = Joi.object({
    title_en: Joi.string().required(),
    title_np: Joi.string().allow(''),
    summary_en: Joi.string().required(),
    summary_np: Joi.string().allow(''),
    content_en: Joi.string().required(),
    content_np: Joi.string().allow(''),
    verdict: Joi.string().valid('TRUE', 'FALSE', 'MISLEADING', 'UNVERIFIED').required(),
    category: Joi.string().required(),
    image_url: Joi.string().uri().allow(''),
    author_id: Joi.string().uuid(),
});

// Create article (Admin/Editor)
router.post('/', authenticate, authorize('admin', 'editor'), async (req: AuthRequest, res: Response) => {
    try {
        const { error, value } = articleSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { title_en, title_np, summary_en, summary_np, content_en, content_np, verdict, category, image_url } = value;
        const author_id = value.author_id || req.user?.id;

        const result = await pool.query(
            `INSERT INTO articles (title_en, title_np, summary_en, summary_np, content_en, content_np, verdict, category, image_url, author_id, published_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
             RETURNING *`,
            [title_en, title_np, summary_en, summary_np, content_en, content_np, verdict, category, image_url, author_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating article:', err);
        res.status(500).json({ error: 'Failed to create article' });
    }
});

// Update article (Admin/Editor)
router.put('/:id', authenticate, authorize('admin', 'editor'), async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { error, value } = articleSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { title_en, title_np, summary_en, summary_np, content_en, content_np, verdict, category, image_url } = value;

        const result = await pool.query(
            `UPDATE articles 
             SET title_en = $1, title_np = $2, summary_en = $3, summary_np = $4, 
                 content_en = $5, content_np = $6, verdict = $7, category = $8, image_url = $9, updated_at = CURRENT_TIMESTAMP
             WHERE id = $10
             RETURNING *`,
            [title_en, title_np, summary_en, summary_np, content_en, content_np, verdict, category, image_url, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Article not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating article:', err);
        res.status(500).json({ error: 'Failed to update article' });
    }
});

// Delete article (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM articles WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Article not found' });
        }

        res.json({ message: 'Article deleted successfully' });
    } catch (err) {
        console.error('Error deleting article:', err);
        res.status(500).json({ error: 'Failed to delete article' });
    }
});

export default router;
