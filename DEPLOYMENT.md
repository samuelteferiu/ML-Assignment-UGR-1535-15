# Deployment Guide

## Quick Deployment Steps

### Backend Deployment (Render/Railway)

#### Option 1: Render

1. **Create Account**: Sign up at [render.com](https://render.com)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**:
   - **Name**: `loan-approval-api` (or your choice)
   - **Environment**: Python 3
   - **Build Command**: `pip install -r Backend/requirements.txt`
   - **Start Command**: `cd Backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: Leave empty (or set to project root)

4. **Important**: 
   - Upload model files (`loan_approval_lr.pkl`, `loan_approval_dt.pkl`, `model_info.json`) to `Backend/model/` directory
   - Or use a cloud storage service (S3, etc.) and update code to load from there

5. **Deploy**: Click "Create Web Service"

6. **Get URL**: Your API will be available at `https://your-service-name.onrender.com`

#### Option 2: Railway

1. **Create Account**: Sign up at [railway.app](https://railway.app)

2. **New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure**:
   - Railway auto-detects Python
   - Set start command in `Procfile`: `web: cd Backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Ensure `requirements.txt` is in `Backend/` directory

4. **Deploy**: Railway will automatically deploy

5. **Get URL**: Your API will be available at `https://your-project.up.railway.app`

### Frontend Deployment (Vercel)

1. **Create Account**: Sign up at [vercel.com](https://vercel.com)

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

4. **Environment Variables**:
   - Add `NEXT_PUBLIC_API_URL` = `https://your-backend-url.onrender.com`
   - Or update `BASE_URL` in `frontend/app/Home/page.tsx`

5. **Deploy**: Click "Deploy"

6. **Get URL**: Your frontend will be available at `https://your-project.vercel.app`

## Post-Deployment Checklist

- [ ] Backend is accessible and returns data from `/` endpoint
- [ ] Frontend can connect to backend API
- [ ] Model files are accessible (check `/predict` endpoint)
- [ ] CORS is properly configured
- [ ] Environment variables are set correctly
- [ ] Both models (LR and DT) are working

## Troubleshooting

### Backend Issues

**Problem**: Models not found
- **Solution**: Ensure model files are in `Backend/model/` directory
- Or update code to load from cloud storage

**Problem**: CORS errors
- **Solution**: Check CORS middleware in `Backend/main.py`
- Ensure frontend URL is allowed

**Problem**: Port issues
- **Solution**: Use `$PORT` environment variable in start command
- Render/Railway provide this automatically

### Frontend Issues

**Problem**: Cannot connect to backend
- **Solution**: Check `BASE_URL` in `frontend/app/Home/page.tsx`
- Verify backend URL is correct and accessible
- Check CORS settings on backend

**Problem**: Build fails
- **Solution**: Run `npm install` locally first to check for errors
- Ensure all dependencies are in `package.json`

## Alternative Deployment Options

### Backend Alternatives
- **Heroku**: Similar to Render, uses Procfile
- **AWS EC2**: Full control, requires server setup
- **Google Cloud Run**: Container-based deployment
- **DigitalOcean App Platform**: Simple deployment

### Frontend Alternatives
- **Netlify**: Similar to Vercel, great for Next.js
- **AWS Amplify**: AWS-based deployment
- **GitHub Pages**: Static hosting (requires static export)

## Environment Variables Reference

### Backend
```bash
# Usually not required for basic setup
PORT=8000  # Auto-set by platform
```

### Frontend
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

## Testing Deployment

1. **Test Backend**:
   ```bash
   curl https://your-backend-url.onrender.com/
   ```

2. **Test Prediction**:
   ```bash
   curl -X POST "https://your-backend-url.onrender.com/predict?model_type=lr" \
     -H "Content-Type: application/json" \
     -d '{"income": 50000, "credit_score": 650, "employment_years": 5, "loan_amount": 30000}'
   ```

3. **Test Frontend**:
   - Visit your Vercel URL
   - Fill out the form
   - Submit and verify prediction works

## Notes

- Free tiers on Render/Railway may have cold starts
- Vercel has excellent Next.js support and fast deployments
- Consider using a database for storing predictions in production
- Add authentication for production use
- Monitor API usage and costs

