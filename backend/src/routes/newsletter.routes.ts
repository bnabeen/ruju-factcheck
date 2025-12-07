import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Subscribe to newsletter
router.post('/', async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const query = `
            INSERT INTO newsletter_subscribers (email)
            VALUES ($1)
            ON CONFLICT (email) DO NOTHING
            RETURNING id, email, created_at
        `;

        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            // Email already exists (due to ON CONFLICT DO NOTHING)
            return res.status(200).json({ message: 'Already subscribed' });
        }

        res.status(201).json({
            message: 'Subscribed successfully',
            subscriber: result.rows[0]
        });
    } catch (err) {
        console.error('Error subscribing to newsletter:', err);
        res.status(500).json({ error: 'Failed to subscribe' });
    }
});

// Get all subscribers (Admin)
router.get('/', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT id, email, created_at FROM newsletter_subscribers ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching subscribers:', err);
        res.status(500).json({ error: 'Failed to fetch subscribers' });
    }
});

export default router;
