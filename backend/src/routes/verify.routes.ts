import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { GeminiService, Language } from '../services/gemini.service';
import { aiLimiter } from '../middleware/rateLimiter';
import pool from '../config/database';
import { AuthRequest, authenticate } from '../middleware/auth';

const router = Router();

// Validation schemas
const textVerifySchema = Joi.object({
    claim: Joi.string().min(10).required(),
    lang: Joi.string().valid('EN', 'NP').default('EN'),
});

const imageVerifySchema = Joi.object({
    image: Joi.string().required(), // base64 string
    context: Joi.string().allow('').optional(),
    lang: Joi.string().valid('EN', 'NP').default('EN'),
});

// Verify text claim
router.post('/text', aiLimiter, async (req: Request, res: Response) => {
    try {
        const { error, value } = textVerifySchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { claim, lang } = value;

        const result = await GeminiService.verifyTextClaim(claim, lang as Language);

        // Save to verification history if user is authenticated
        const authReq = req as AuthRequest;
        if (authReq.user) {
            await pool.query(
                `INSERT INTO verification_history (user_id, claim_text, verdict, confidence)
         VALUES ($1, $2, $3, $4)`,
                [authReq.user.id, claim, result.verdict, result.confidence]
            );
        }

        res.json(result);
    } catch (err) {
        console.error('Text verification error:', err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        
        // Provide more specific error messages
        if (errorMessage.includes('API key') || errorMessage.includes('GEMINI_API_KEY') || errorMessage.includes('not configured')) {
            return res.status(500).json({ 
                error: 'Gemini API key is missing or invalid. Please set GEMINI_API_KEY in your .env file.' 
            });
        }
        if (errorMessage.includes('quota') || errorMessage.includes('429')) {
            return res.status(500).json({ 
                error: 'Gemini API quota exceeded. Please check your API usage limits.' 
            });
        }
        if (errorMessage.includes('401') || errorMessage.includes('403')) {
            return res.status(500).json({ 
                error: 'Invalid Gemini API key. Please check your GEMINI_API_KEY in .env file.' 
            });
        }
        
        // In development, show the full error message
        const isDev = process.env.NODE_ENV === 'development';
        res.status(500).json({ 
            error: isDev ? errorMessage : 'Verification failed. Please check backend logs for details.' 
        });
    }
});

// Verify image
router.post('/image', aiLimiter, async (req: Request, res: Response) => {
    try {
        const { error, value } = imageVerifySchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { image, context, lang } = value;

        const result = await GeminiService.verifyImage(image, context || '', lang as Language);

        res.json(result);
    } catch (err) {
        console.error('Image verification error:', err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        
        // Provide more specific error messages
        if (errorMessage.includes('API key') || errorMessage.includes('GEMINI_API_KEY') || errorMessage.includes('not configured')) {
            return res.status(500).json({ 
                error: 'Gemini API key is missing or invalid. Please set GEMINI_API_KEY in your .env file.' 
            });
        }
        if (errorMessage.includes('quota') || errorMessage.includes('429')) {
            return res.status(500).json({ 
                error: 'Gemini API quota exceeded. Please check your API usage limits.' 
            });
        }
        if (errorMessage.includes('401') || errorMessage.includes('403')) {
            return res.status(500).json({ 
                error: 'Invalid Gemini API key. Please check your GEMINI_API_KEY in .env file.' 
            });
        }
        
        // In development, show the full error message
        const isDev = process.env.NODE_ENV === 'development';
        res.status(500).json({ 
            error: isDev ? errorMessage : 'Image verification failed. Please check backend logs for details.' 
        });
    }
});

// Get verification history (authenticated users only)
router.get('/history', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const result = await pool.query(
            `SELECT id, claim_text, verdict, confidence, created_at
       FROM verification_history
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
            [req.user.id]
        );

        res.json(result.rows);
    } catch (err) {
        console.error('History fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

export default router;
