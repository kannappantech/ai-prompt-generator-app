# AI Prompt Generator - Deployment Guide

## Overview
This guide covers deploying the AI Prompt Generator application to production using free hosting services.

## Architecture
- **Frontend**: React application (can be deployed to Vercel, Netlify, or GitHub Pages)
- **Backend**: Flask API (can be deployed to Railway, Render, or Heroku)
- **Database**: SQLite (for development) or PostgreSQL (for production)

## Prerequisites
- Git repository (GitHub, GitLab, etc.)
- Node.js and npm installed
- Python 3.11+ installed
- OpenAI API key (optional, for enhanced prompt generation)

## Frontend Deployment (Vercel - Recommended)

### 1. Prepare the Frontend
```bash
cd frontend
npm run build
```

### 2. Deploy to Vercel
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up with GitHub
3. Click "New Project" and import your repository
4. Set the following configuration:
   - **Framework Preset**: React
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. Environment Variables
Add these environment variables in Vercel dashboard:
- `VITE_API_URL`: Your backend URL (e.g., `https://your-app.railway.app`)

## Backend Deployment (Railway - Recommended)

### 1. Prepare the Backend
Create a `Procfile` in the backend directory:
```
web: python src/main.py
```

Update `src/main.py` to use environment port:
```python
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
```

### 2. Deploy to Railway
1. Go to [railway.app](https://railway.app) and sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository and set:
   - **Root Directory**: `backend`
   - **Start Command**: `python src/main.py`

### 3. Environment Variables
Add these environment variables in Railway dashboard:
- `OPENAI_API_KEY`: Your OpenAI API key (optional)
- `SECRET_KEY`: A secure random string for Flask sessions
- `DATABASE_URL`: PostgreSQL URL (Railway provides this automatically)

### 4. Database Setup
Railway automatically provides PostgreSQL. Update your Flask app to use it:

```python
import os
from urllib.parse import urlparse

# Database configuration
database_url = os.environ.get('DATABASE_URL')
if database_url:
    # Parse the DATABASE_URL
    url = urlparse(database_url)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # Fallback to SQLite for local development
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
```

## Alternative Deployment Options

### Frontend Alternatives
1. **Netlify**: Similar to Vercel, drag-and-drop deployment
2. **GitHub Pages**: Free for public repositories
3. **Firebase Hosting**: Google's hosting service

### Backend Alternatives
1. **Render**: Similar to Railway, free tier available
2. **Heroku**: Popular but limited free tier
3. **PythonAnywhere**: Python-focused hosting

## Environment Variables Reference

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.com
```

### Backend (.env)
```
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key-here
DATABASE_URL=your-database-url-here
CORS_ORIGINS=https://your-frontend-url.com
```

## Production Checklist

### Security
- [ ] Set strong SECRET_KEY
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set secure cookie settings
- [ ] Validate all user inputs

### Performance
- [ ] Enable gzip compression
- [ ] Optimize images and assets
- [ ] Set up CDN (optional)
- [ ] Configure caching headers

### Monitoring
- [ ] Set up error logging
- [ ] Monitor API usage
- [ ] Set up uptime monitoring
- [ ] Configure backup strategy

## Local Development Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python src/main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend CORS is configured for your frontend domain
2. **Database Connection**: Check DATABASE_URL format and credentials
3. **API Key Issues**: Verify OPENAI_API_KEY is set correctly
4. **Build Failures**: Check Node.js and Python versions

### Debug Commands
```bash
# Check backend logs
railway logs

# Check frontend build
npm run build

# Test API endpoints
curl https://your-backend-url.com/api/health
```

## Cost Optimization

### Free Tier Limits
- **Vercel**: 100GB bandwidth, unlimited projects
- **Railway**: $5 credit monthly, then pay-as-you-go
- **Netlify**: 100GB bandwidth, 300 build minutes

### Tips
- Use SQLite for small applications
- Optimize images and bundle size
- Monitor usage regularly
- Consider upgrading only when necessary

## Support
For deployment issues, check:
1. Platform documentation (Vercel, Railway)
2. GitHub Issues in this repository
3. Community forums and Discord servers
