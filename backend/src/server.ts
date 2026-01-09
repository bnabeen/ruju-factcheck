import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';

// Import routes
import authRoutes from './routes/auth.routes';
import verifyRoutes from './routes/verify.routes';
import articlesRoutes from './routes/articles.routes';
import claimsRoutes from './routes/claims.routes';
import newsletterRoutes from './routes/newsletter.routes';
import adminRoutes from './routes/admin.routes';
import contentRoutes from './routes/content.routes';
import careersRoutes from './routes/careers.routes';
import uploadRoutes from './routes/upload.routes';
import settingsRoutes from './routes/settings.routes';
import contentGenRoutes from './routes/content-gen.routes';
import videoUrlRoutes from './routes/videoUrl.routes';


const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: config.cors.origin,
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Rate limiting
app.use('/api/', apiLimiter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/claims', claimsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/careers', careersRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/ai-content', contentGenRoutes);
app.use('/api/video-url', videoUrlRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`🚀 RUJU Backend Server running on port ${PORT}`);
    console.log(`📍 Environment: ${config.nodeEnv}`);
    console.log(`🌐 CORS enabled for: ${config.cors.origin}`);

    // Warn if Gemini API key is missing
    if (!config.gemini.apiKey || config.gemini.apiKey.trim() === '') {
        console.warn('⚠️  WARNING: GEMINI_API_KEY is not set in .env file');
        console.warn('   Verification endpoints will fail. Please set GEMINI_API_KEY in your .env file.');
    } else {
        console.log('✅ Gemini API key configured');
    }
});

export default app;
