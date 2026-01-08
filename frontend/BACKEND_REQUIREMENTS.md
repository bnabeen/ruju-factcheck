# RUJU FactCheck - Backend Development Requirements

## Overview
This document outlines the complete backend infrastructure needed for the RUJU FactCheck platform.

---

## 1. Technology Stack

### Core Backend Framework
**Recommended: Node.js with Express.js or NestJS**
- **Express.js**: Lightweight, flexible, easy to start
- **NestJS**: Enterprise-grade, TypeScript-first, better for scaling

**Alternative Options:**
- **Python (FastAPI/Django)**: Good for ML integration
- **Go**: High performance, good for microservices

### Database
**Primary Database: PostgreSQL**
- Stores fact-check articles, user data, verdicts
- Supports full-text search
- ACID compliance for data integrity

**Cache Layer: Redis**
- Cache API responses
- Session management
- Rate limiting

**File Storage: AWS S3 / Cloudinary**
- Store uploaded images/videos
- CDN for fast media delivery

---

## 2. Core Backend Features

### A. Authentication & Authorization
```
- User registration/login (Email, Google OAuth)
- JWT-based authentication
- Role-based access control (Admin, Editor, User)
- Password reset functionality
```

### B. Fact-Check Management
```
- CRUD operations for fact-check articles
- Verdict assignment (True, False, Misleading, Unverified)
- Category management (Politics, Technology, Economy, etc.)
- Multi-language support (English/Nepali)
```

### C. AI Integration
```
- Gemini API integration (already done in frontend)
- Rate limiting for API calls
- Error handling and fallback mechanisms
- Cost tracking for API usage
```

### D. Media Processing
```
- Image upload and validation
- Image compression and optimization
- Video processing (future)
- OCR for text extraction from images
```

### E. User Submissions
```
- Accept claim submissions from users
- Moderation queue for editors
- Email notifications for submission status
- Spam detection
```

### F. Search & Feed
```
- Full-text search across articles
- Filter by category, verdict, date
- Pagination
- Trending/popular articles
```

### G. Analytics & Reporting
```
- Track page views, shares
- User engagement metrics
- API usage statistics
- Admin dashboard
```

---

## 3. Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user', -- user, editor, admin
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Articles Table
```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_np TEXT,
  summary_en TEXT,
  summary_np TEXT,
  content_en TEXT,
  content_np TEXT,
  verdict VARCHAR(50) NOT NULL, -- TRUE, FALSE, MISLEADING, UNVERIFIED
  category VARCHAR(100),
  image_url TEXT,
  author_id UUID REFERENCES users(id),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  views_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0
);
```

### Claims Table (User Submissions)
```sql
CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_text TEXT NOT NULL,
  source_url TEXT,
  evidence_url TEXT,
  submitted_by UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending', -- pending, reviewing, published, rejected
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Sources Table
```sql
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id),
  title TEXT,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 4. API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### Articles
```
GET    /api/articles              # List all articles (with pagination)
GET    /api/articles/:id          # Get single article
POST   /api/articles              # Create article (Admin/Editor only)
PUT    /api/articles/:id          # Update article (Admin/Editor only)
DELETE /api/articles/:id          # Delete article (Admin only)
GET    /api/articles/search       # Search articles
GET    /api/articles/trending     # Get trending articles
```

### Fact-Checking (AI)
```
POST   /api/verify/text           # Verify text claim
POST   /api/verify/image          # Verify image
GET    /api/verify/history        # Get user's verification history
```

### Claims (User Submissions)
```
POST   /api/claims                # Submit a claim
GET    /api/claims                # List claims (Admin/Editor)
GET    /api/claims/:id            # Get single claim
PUT    /api/claims/:id/status     # Update claim status
```

### Media
```
POST   /api/media/upload          # Upload image/video
GET    /api/media/:id             # Get media file
DELETE /api/media/:id             # Delete media
```

### Analytics
```
GET    /api/analytics/overview    # Dashboard stats
GET    /api/analytics/articles    # Article performance
POST   /api/analytics/track       # Track events (views, shares)
```

---

## 5. Infrastructure Requirements

### Hosting Options

**Option 1: Cloud Platform (Recommended)**
- **Vercel/Netlify**: Frontend hosting (already suitable for your React app)
- **Railway/Render/Fly.io**: Backend API hosting (Node.js)
- **Supabase**: PostgreSQL database + Authentication
- **Cloudinary**: Image storage and CDN

**Option 2: Traditional VPS**
- **DigitalOcean/Linode**: $12-20/month
- **AWS EC2**: More scalable but complex
- Self-managed PostgreSQL, Redis, Nginx

**Option 3: Serverless**
- **AWS Lambda + API Gateway**
- **Google Cloud Functions**
- **Vercel Serverless Functions**

### Estimated Costs (Monthly)
```
- Backend Hosting (Railway/Render): $5-20
- Database (Supabase Free tier or $25)
- Redis (Upstash Free tier or $10)
- Image Storage (Cloudinary Free tier or $10)
- Gemini API: Pay-per-use (~$20-50 depending on usage)
- Domain + SSL: $10-15/year

Total: ~$50-100/month for production
```

---

## 6. Security Considerations

### Essential Security Measures
```
✓ Input validation and sanitization
✓ SQL injection prevention (use parameterized queries)
✓ XSS protection
✓ CSRF tokens
✓ Rate limiting (prevent API abuse)
✓ HTTPS/SSL encryption
✓ Environment variables for secrets
✓ CORS configuration
✓ File upload validation (type, size)
✓ Password hashing (bcrypt)
```

---

## 7. Development Roadmap

### Phase 1: MVP Backend (2-3 weeks)
- [ ] Set up Node.js/Express server
- [ ] Configure PostgreSQL database
- [ ] Implement authentication (JWT)
- [ ] Create Articles CRUD API
- [ ] Integrate Gemini API (move from frontend)
- [ ] Deploy to Railway/Render

### Phase 2: User Features (2 weeks)
- [ ] User claim submission system
- [ ] Email notifications
- [ ] Search functionality
- [ ] Admin dashboard

### Phase 3: Optimization (1-2 weeks)
- [ ] Add Redis caching
- [ ] Implement rate limiting
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Performance optimization

### Phase 4: Advanced Features (Ongoing)
- [ ] Social media integration
- [ ] Newsletter system
- [ ] Advanced analytics
- [ ] Mobile app API support

---

## 8. Recommended Tools & Libraries

### Node.js Backend
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "pg": "^8.11.0",              // PostgreSQL client
    "bcrypt": "^5.1.0",           // Password hashing
    "jsonwebtoken": "^9.0.0",     // JWT authentication
    "multer": "^1.4.5",           // File uploads
    "joi": "^17.9.0",             // Input validation
    "cors": "^2.8.5",
    "helmet": "^7.0.0",           // Security headers
    "express-rate-limit": "^6.0.0",
    "nodemailer": "^6.9.0",       // Email sending
    "dotenv": "^16.0.0"
  }
}
```

### Development Tools
```
- Postman/Insomnia: API testing
- pgAdmin/DBeaver: Database management
- Docker: Containerization
- GitHub Actions: CI/CD
```

---

## 9. Next Steps

### Immediate Actions:
1. **Choose your tech stack** (I recommend Node.js + Express + PostgreSQL)
2. **Set up development environment**
   ```bash
   mkdir ruju-backend
   cd ruju-backend
   npm init -y
   npm install express pg bcrypt jsonwebtoken cors dotenv
   ```
3. **Create database schema** (use the SQL above)
4. **Move Gemini API calls to backend** (for security - API key shouldn't be in frontend)
5. **Set up authentication system**

### Would you like me to:
- Generate the complete backend starter code?
- Create specific API endpoint implementations?
- Set up the database migrations?
- Write deployment instructions?

Let me know which part you'd like to start with!
