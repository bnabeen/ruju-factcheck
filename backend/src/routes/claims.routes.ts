import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Submit a new claim
router.post('/', async (req: Request, res: Response) => {
    try {
        const { claim, source, evidence } = req.body;

        if (!claim) {
            return res.status(400).json({ error: 'Claim text is required' });
        }

        const query = `
            INSERT INTO claims (claim_text, source_url, evidence_url, status)
            VALUES ($1, $2, $3, 'pending')
            RETURNING id, claim_text, status, created_at
        `;

        const result = await pool.query(query, [claim, source, evidence]);

        res.status(201).json({
            message: 'Claim submitted successfully',
            claim: result.rows[0]
        });
    } catch (err) {
        console.error('Error submitting claim:', err);
        res.status(500).json({ error: 'Failed to submit claim' });
    }
});

// Get all claims (Admin/Editor)
router.get('/', authenticate, authorize('admin', 'editor'), async (req: AuthRequest, res: Response) => {
    try {
        const status = req.query.status as string;
        let query = 'SELECT * FROM claims ORDER BY created_at DESC';
        const params: string[] = [];

        if (status) {
            query = 'SELECT * FROM claims WHERE status = $1 ORDER BY created_at DESC';
            params.push(status);
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching claims:', err);
        res.status(500).json({ error: 'Failed to fetch claims' });
    }
});

// Update claim status (Admin/Editor)
router.put('/:id', authenticate, authorize('admin', 'editor'), async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'reviewing', 'verified', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const result = await pool.query(
            'UPDATE claims SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Claim not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating claim:', err);
        res.status(500).json({ error: 'Failed to update claim' });
    }
});

export default router;
