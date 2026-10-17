# FinBridge AI — Complete Cloud Deployment Guide

This guide provides step-by-step instructions to deploy **FinBridge AI** online for public evaluation and the 2026 Shenzhen International FinTech Competition review.

---

## 🌟 Recommended Cloud Deployment (Free Tier)

The recommended setup is **Vercel** for the React frontend and **Render** for the FastAPI backend. Both platforms connect directly to your GitHub repository: [`https://github.com/mohammademon10/FinBridge-AI`](https://github.com/mohammademon10/FinBridge-AI) and provide automatic continuous deployment (CI/CD).

```
[Student / Reviewer Browser]
           │
           ├────────► https://finbridge-ai.vercel.app (React 19 Frontend on Vercel)
           │                        │
           │                        ▼ (HTTPS REST Calls)
           └────────► https://finbridge-api.onrender.com (FastAPI Backend on Render)
```

---

## Part 1: Deploy Backend to Render (Takes ~3 minutes)

1. **Sign in to Render:**  
   Go to [https://render.com](https://render.com) and sign in with your GitHub account.

2. **Create New Web Service:**  
   Click the **"New +"** button in the dashboard and select **"Web Service"**.

3. **Connect GitHub Repository:**  
   Select `mohammademon10/FinBridge-AI` from your repository list.

4. **Configure Web Service:**
   - **Name:** `finbridge-ai-api` (or your choice)
   - **Region:** Any region close to you (e.g., Singapore, Frankfurt, or Oregon)
   - **Branch:** `main`
   - **Root Directory:** *(leave empty or set to root)*
   - **Runtime:** `Python 3`
   - **Build Command:**  
     ```bash
     pip install -r backend/requirements.txt
     ```
   - **Start Command:**  
     ```bash
     cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type:** `Free`

5. **Set Environment Variables:**  
   Click on the **"Environment Variables"** section and add:
   | Key | Value | Notes |
   |---|---|---|
   | `APP_ENV` | `production` | Enables production mode |
   | `CORS_ORIGINS` | `*` | Allows your frontend domain |
   | `LLM_PROVIDER` | `mock` | High-fidelity deterministic mode |
   | `PYTHON_VERSION` | `3.11.9` | Pinned Python runtime |

6. **Deploy:**  
   Click **"Create Web Service"**. Render will install requirements and start Uvicorn.

7. **Verify Live Backend:**  
   Once deployment completes (shows green "Live"), copy your service URL (e.g., `https://finbridge-ai-api.onrender.com`).  
   Open in browser:  
   `https://finbridge-ai-api.onrender.com/health`  
   You should see:
   ```json
   {
     "status": "ok",
     "app_name": "FinBridge AI",
     "version": "1.0.0",
     "environment": "production"
   }
   ```

---

## Part 2: Deploy Frontend to Vercel (Takes ~2 minutes)

1. **Sign in to Vercel:**  
   Go to [https://vercel.com](https://vercel.com) and log in with your GitHub account.

2. **Import Repository:**  
   Click **"Add New..."** > **"Project"**, then select `mohammademon10/FinBridge-AI`.

3. **Configure Project Settings:**
   - **Framework Preset:** `Vite` (Vercel detects this automatically)
   - **Root Directory:** Click "Edit" and choose `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Add Environment Variable:**
   In the **Environment Variables** section, add:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** Your live Render backend URL from Part 1 (e.g. `https://finbridge-ai-api.onrender.com` — *no trailing slash*)

5. **Deploy:**  
   Click **"Deploy"**. Vercel will install dependencies, compile TypeScript, run Vite build, and publish the site.

6. **Done!**  
   Your frontend is now live at `https://finbridge-ai.vercel.app` (or your assigned Vercel URL).  
   When opened, the dashboard will connect to the live Render backend, showing the green **"API Online"** badge!

---

## Part 3: Alternative — Docker Compose Deployment (Any VPS or Local)

If you wish to run the full stack containerized on any virtual server (AWS EC2, DigitalOcean droplet, or local machine):

1. **Clone repository:**
   ```bash
   git clone https://github.com/mohammademon10/FinBridge-AI.git
   cd FinBridge-AI
   ```

2. **Start both containers with Docker Compose:**
   ```bash
   docker compose up -d --build
   ```

3. **Access services:**
   - Frontend UI: `http://localhost:3000`
   - Backend API: `http://localhost:8000`
   - API Docs: `http://localhost:8000/docs`
   - Health Check: `http://localhost:8000/health`

---

## Part 4: Troubleshooting & Checklist

- **"API Offline (Demo Mode Available)" pill appears:**  
  1. Check if your Render service is waking up (Render free tier sleeps after 15 minutes of inactivity; initial wake-up takes ~30 seconds).  
  2. Verify that `VITE_API_BASE_URL` in Vercel settings matches your exact Render URL without trailing slash.
- **CORS Error:**  
  Make sure `CORS_ORIGINS` on Render is set to `*` or includes your Vercel frontend domain.
