import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs (increased for development)
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for AI verification endpoints
export const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 20 AI requests per hour
    message: 'AI verification limit reached. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth limiter for registration (strict)
export const authLimiterRegister = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 registration attempts per window
    message: 'Too many registration attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth limiter for login (more permissive, keyed by IP+email to avoid blocking whole IP)
export const authLimiterLogin = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Increased from 10 to 50 for development - adjust in production
    message: 'Too many authentication attempts, please try again later.',
    keyGenerator: (req) => {
        // Use combination of IP and provided email (if any) to avoid blocking shared IPs
        const ip = (req.ip || req.connection?.remoteAddress || '').toString();
        const email = (req.body && (req.body.email || req.body.username)) ? String(req.body.email || req.body.username) : '';
        return `${ip}|${email}`;
    },
    standardHeaders: true,
    legacyHeaders: false,
});
