import { Router, Request, Response } from 'express';
import Joi from 'joi';
import pool from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Validation schemas
const careerSchema = Joi.object({
    title: Joi.string().required(),
    department: Joi.string().allow(''),
    location: Joi.string().allow(''),
    type: Joi.string().valid('full-time', 'part-time', 'internship').required(),
    description: Joi.string().required(),
    requirements: Joi.string().allow(''),
    responsibilities: Joi.string().allow(''),
    is_active: Joi.boolean(),
});

const applicationSchema = Joi.object({
    full_name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow(''),
    cover_letter: Joi.string().allow(''),
    resume_url: Joi.string().allow(''),
});

// Get all active careers (Public)
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT id, title, department, location, type, description, requirements, responsibilities, created_at FROM careers WHERE is_active = true ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching careers:', err);
        res.status(500).json({ error: 'Failed to fetch careers' });
    }
});

// Get all careers including inactive (Admin)
router.get('/all', authenticate, authorize('admin', 'editor'), async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT * FROM careers ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching all careers:', err);
        res.status(500).json({ error: 'Failed to fetch careers' });
    }
});

// Create career (Admin)
router.post('/', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
    try {
        const { error, value } = careerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { title, department, location, type, description, requirements, responsibilities, is_active } = value;

        const result = await pool.query(
            `INSERT INTO careers (title, department, location, type, description, requirements, responsibilities, is_active, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [title, department, location, type, description, requirements, responsibilities, is_active ?? true, req.user?.id]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating career:', err);
        res.status(500).json({ error: 'Failed to create career' });
    }
});

// Update career (Admin)
router.put('/:id', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { error, value } = careerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { title, department, location, type, description, requirements, responsibilities, is_active } = value;

        const result = await pool.query(
            `UPDATE careers 
             SET title = $1, department = $2, location = $3, type = $4, description = $5, 
                 requirements = $6, responsibilities = $7, is_active = $8, updated_at = CURRENT_TIMESTAMP
             WHERE id = $9
             RETURNING *`,
            [title, department, location, type, description, requirements, responsibilities, is_active, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Career not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating career:', err);
        res.status(500).json({ error: 'Failed to update career' });
    }
});

// Delete career (Admin)
router.delete('/:id', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM careers WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Career not found' });
        }

        res.json({ message: 'Career deleted successfully' });
    } catch (err) {
        console.error('Error deleting career:', err);
        res.status(500).json({ error: 'Failed to delete career' });
    }
});

// Submit job application (Public)
router.post('/:id/apply', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { error, value } = applicationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { full_name, email, phone, cover_letter, resume_url } = value;

        // Check if career exists and is active
        const careerCheck = await pool.query('SELECT id FROM careers WHERE id = $1 AND is_active = true', [id]);
        if (careerCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Career not found or not accepting applications' });
        }

        const result = await pool.query(
            `INSERT INTO job_applications (career_id, full_name, email, phone, cover_letter, resume_url)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, career_id, full_name, email, status, created_at`,
            [id, full_name, email, phone, cover_letter, resume_url]
        );

        res.status(201).json({
            message: 'Application submitted successfully',
            application: result.rows[0]
        });
    } catch (err) {
        console.error('Error submitting application:', err);
        res.status(500).json({ error: 'Failed to submit application' });
    }
});

// Get all applications (Admin)
router.get('/applications/all', authenticate, authorize('admin', 'editor'), async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT ja.*, c.title as career_title 
             FROM job_applications ja
             JOIN careers c ON ja.career_id = c.id
             ORDER BY ja.created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching applications:', err);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

// Update application status (Admin)
router.put('/applications/:id', authenticate, authorize('admin', 'editor'), async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        if (!['pending', 'reviewed', 'shortlisted', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const result = await pool.query(
            `UPDATE job_applications 
             SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP
             WHERE id = $3
             RETURNING *`,
            [status, notes, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating application:', err);
        res.status(500).json({ error: 'Failed to update application' });
    }
});

export default router;
