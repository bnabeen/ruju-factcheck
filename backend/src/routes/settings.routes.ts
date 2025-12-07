import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// Get all site settings
router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT setting_key, setting_value, updated_at FROM site_settings ORDER BY setting_key'
        );

        // Convert to object format for easier frontend consumption
        const settings: Record<string, any> = {};
        result.rows.forEach(row => {
            settings[row.setting_key] = row.setting_value;
        });

        res.json(settings);
    } catch (err) {
        console.error('Error fetching settings:', err);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// Get specific setting by key
router.get('/:key', async (req: Request, res: Response) => {
    try {
        const { key } = req.params;
        const result = await pool.query(
            'SELECT setting_key, setting_value, updated_at FROM site_settings WHERE setting_key = $1',
            [key]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Setting not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching setting:', err);
        res.status(500).json({ error: 'Failed to fetch setting' });
    }
});

// Update site setting
router.put('/:key', async (req: AuthRequest, res: Response) => {
    try {
        const { key } = req.params;
        const { value } = req.body;

        if (!value) {
            return res.status(400).json({ error: 'Setting value is required' });
        }

        const result = await pool.query(
            `INSERT INTO site_settings (setting_key, setting_value, updated_by)
             VALUES ($1, $2, $3)
             ON CONFLICT (setting_key) 
             DO UPDATE SET setting_value = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP
             RETURNING setting_key, setting_value, updated_at`,
            [key, JSON.stringify(value), req.user?.id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating setting:', err);
        res.status(500).json({ error: 'Failed to update setting' });
    }
});

// Bulk update settings
router.put('/', async (req: AuthRequest, res: Response) => {
    try {
        const settings = req.body;

        if (!settings || typeof settings !== 'object') {
            return res.status(400).json({ error: 'Invalid settings format' });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            for (const [key, value] of Object.entries(settings)) {
                await client.query(
                    `INSERT INTO site_settings (setting_key, setting_value, updated_by)
                     VALUES ($1, $2, $3)
                     ON CONFLICT (setting_key) 
                     DO UPDATE SET setting_value = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP`,
                    [key, JSON.stringify(value), req.user?.id]
                );
            }

            await client.query('COMMIT');
            res.json({ message: 'Settings updated successfully' });
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Error bulk updating settings:', err);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

export default router;
