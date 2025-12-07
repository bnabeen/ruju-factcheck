import { Router, Response } from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { GeminiService } from '../services/gemini.service';

const router = Router();

router.use(authenticate);
router.use(authorize('admin', 'editor'));

router.post('/generate-content', async (req: AuthRequest, res: Response) => {
    try {
        const { claim } = req.body;

        if (!claim) {
            return res.status(400).json({ error: 'Claim is required' });
        }

        const content = await GeminiService.generateContent(claim);
        res.json(content);
    } catch (error) {
        console.error('Content generation error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ error: errorMessage });
    }
});

router.get('/test', (req, res) => {
    res.json({ status: 'ok', message: 'Content Gen API is working' });
});

export default router;
