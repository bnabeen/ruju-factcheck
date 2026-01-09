import { Router, Request, Response } from 'express';
import Joi from 'joi';
import pool from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Helper function to generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .substring(0, 100); // Limit length
}

// Helper function to ensure unique slug
async function ensureUniqueSlug(baseSlug: string, existingId?: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
        const query = existingId
            ? 'SELECT id FROM articles WHERE slug = $1 AND id != $2'
            : 'SELECT id FROM articles WHERE slug = $1';
        const params = existingId ? [slug, existingId] : [slug];
        
        const result = await pool.query(query, params);
        
        if (result.rows.length === 0) {
            return slug;
        }
        
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
}

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
                title_en,
                title_np,
                summary_en,
                summary_np,
                content_en,
                content_np,
                slug,
                CASE WHEN $1 = 'NP' THEN COALESCE(title_np, title_en) ELSE title_en END as title,
                CASE WHEN $1 = 'NP' THEN COALESCE(summary_np, summary_en) ELSE summary_en END as summary,
                CASE WHEN $1 = 'NP' THEN COALESCE(content_np, content_en) ELSE content_en END as content,
                verdict,
                status,
                category,
                image_url as "imageUrl",
                image_url,
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

// Get single article by slug or ID
router.get('/:identifier', async (req: Request, res: Response) => {
    try {
        const { identifier } = req.params;
        const lang = (req.query.lang as string) || 'EN';

        // Check if identifier is a UUID
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
        const condition = isUUID ? 'id = $1' : 'slug = $1';

        const query = `
            SELECT 
                id,
                title_en,
                title_np,
                summary_en,
                summary_np,
                content_en,
                content_np,
                slug,
                CASE WHEN $2 = 'NP' THEN COALESCE(title_np, title_en) ELSE title_en END as title,
                CASE WHEN $2 = 'NP' THEN COALESCE(summary_np, summary_en) ELSE summary_en END as summary,
                CASE WHEN $2 = 'NP' THEN COALESCE(content_np, content_en) ELSE content_en END as content,
                verdict,
                status,
                category,
                image_url as "imageUrl",
                image_url,
                published_at as date,
                (SELECT full_name FROM users WHERE users.id = articles.author_id) as author
            FROM articles
            WHERE ${condition}
        `;

        const result = await pool.query(query, [identifier, lang]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Article not found' });
        }

        const row = result.rows[0];

        // If accessed by ID, we could potentially redirect to slug here for better SEO
        // But for now, let's just return the data.

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
    slug: Joi.string().optional().pattern(/^[a-z0-9-]+$/).message('Slug must be lowercase, numbers, and hyphens only'),
    summary_en: Joi.string().required(),
    summary_np: Joi.string().allow(''),
    content_en: Joi.string().required(),
    content_np: Joi.string().allow(''),
    verdict: Joi.string().valid('TRUE', 'FALSE', 'MISLEADING', 'UNVERIFIED').required(),
    status: Joi.string().valid('DRAFT', 'PUBLISHED', 'ARCHIVED').default('DRAFT'),
    category: Joi.string().required(),
    image_url: Joi.string().allow(''),
    author_id: Joi.string().uuid(),
});

// Create article (Admin/Editor)
router.post('/', authenticate, authorize('admin', 'editor'), async (req: AuthRequest, res: Response) => {
    try {
        const { error, value } = articleSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        let { title_en, title_np, slug, summary_en, summary_np, content_en, content_np, verdict, status, category, image_url } = value;
        const author_id = value.author_id || req.user?.id;
        const published_at = status === 'PUBLISHED' ? new Date() : null;

        // Auto-generate slug from title if not provided
        if (!slug) {
            const baseSlug = generateSlug(title_en);
            slug = await ensureUniqueSlug(baseSlug);
        } else {
            // Ensure provided slug is unique
            slug = await ensureUniqueSlug(slug);
        }

        const result = await pool.query(
            `INSERT INTO articles (title_en, title_np, slug, summary_en, summary_np, content_en, content_np, verdict, status, category, image_url, author_id, published_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
             RETURNING *`,
            [title_en, title_np, slug, summary_en, summary_np, content_en, content_np, verdict, status, category, image_url, author_id, published_at]
        );

        res.status(201).json(result.rows[0]);
    } catch (err: any) {
        console.error('Error creating article:', err);
        if (err.code === '23505') {
            return res.status(400).json({ error: 'An article with this slug already exists. Please choose a different slug.' });
        }
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

        let { title_en, title_np, slug, summary_en, summary_np, content_en, content_np, verdict, status, category, image_url } = value;

        // Check if article is being published for the first time
        const currentArticle = await pool.query('SELECT status, published_at FROM articles WHERE id = $1', [id]);
        let published_at = currentArticle.rows[0]?.published_at;

        if (status === 'PUBLISHED' && !published_at) {
            published_at = new Date();
        }

        // Auto-generate slug from title if not provided
        if (!slug) {
            const baseSlug = generateSlug(title_en);
            slug = await ensureUniqueSlug(baseSlug, id);
        } else {
            // Ensure provided slug is unique (excluding current article)
            slug = await ensureUniqueSlug(slug, id);
        }

        const result = await pool.query(
            `UPDATE articles 
             SET title_en = $1, title_np = $2, slug = $3, summary_en = $4, summary_np = $5, 
                 content_en = $6, content_np = $7, verdict = $8, status = $9, category = $10, image_url = $11, 
                 published_at = $12, updated_at = CURRENT_TIMESTAMP
             WHERE id = $13
             RETURNING *`,
            [title_en, title_np, slug, summary_en, summary_np, content_en, content_np, verdict, status, category, image_url, published_at, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Article not found' });
        }

        res.json(result.rows[0]);
    } catch (err: any) {
        console.error('Error updating article:', err);
        if (err.code === '23505') {
            return res.status(400).json({ error: 'An article with this slug already exists. Please choose a different slug.' });
        }
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
