import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

// Get all video URLs, latest first
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM video_url ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch video URLs' });
  }
});

// Add a new video URL
router.post('/', async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });
  try {
    const result = await pool.query(
      'INSERT INTO video_url (url, status) VALUES ($1, 1) RETURNING *',
      [url]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save video URL' });
  }
});

// Delete a video URL by id
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM video_url WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete video URL' });
  }
});

export default router;