import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin', 'editor'));

// Get admin dashboard statistics
router.get('/stats', async (req: AuthRequest, res: Response) => {
    try {
        // Prevent caching for admin stats - always get fresh data
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');

        const stats = await Promise.all([
            pool.query('SELECT COUNT(*) as count FROM articles'),
            pool.query('SELECT COUNT(*) as count FROM claims WHERE status = $1', ['pending']),
            pool.query('SELECT COUNT(*) as count FROM newsletter_subscribers'),
            pool.query('SELECT COUNT(*) as count FROM job_applications WHERE status = $1', ['pending']),
            pool.query('SELECT COUNT(*) as count FROM users'),
        ]);

        res.json({
            totalArticles: parseInt(stats[0].rows[0].count),
            pendingClaims: parseInt(stats[1].rows[0].count),
            newsletterSubscribers: parseInt(stats[2].rows[0].count),
            pendingApplications: parseInt(stats[3].rows[0].count),
            totalUsers: parseInt(stats[4].rows[0].count),
        });
    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Get all users (admin only)
router.get('/users', authorize('admin'), async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT id, email, full_name, role, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Update user role (admin only)
router.put('/users/:id/role', authorize('admin'), async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['admin', 'editor', 'user'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const result = await pool.query(
            'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, email, full_name, role',
            [role, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating user role:', err);
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

export default router;
