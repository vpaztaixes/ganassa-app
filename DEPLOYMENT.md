# GANASSA App - Setup & Deployment Guide

## Quick Start (Local Development)

### Prerequisites
- Docker Desktop (with compose)
- Node.js v20+
- PostgreSQL (via Docker)

### 1. Start Local Development Environment

```bash
# Start Docker containers (PostgreSQL + Node.js)
docker compose up -d --build

# App will be available at http://localhost:3000

# Admin panel at http://localhost:3000/admin/login
# Default credentials:
#   Email: admin@ganassa.jp
#   Password: ganassa2026
```

### 2. Environment Variables

Create `.env.docker` (already created, update if needed):
```env
DATABASE_URL=postgresql://ganassa:ganassa_dev_password@db:5432/ganassa
JWT_SECRET=ganassa_local_dev_secret_change_me
GOOGLE_TRANSLATE_API_KEY=
```

**Important:** For production on Render, create `.env.production`:
- Update all URLs to production domain
- Set strong JWT_SECRET
- Add GOOGLE_TRANSLATE_API_KEY

---

## Google Translate API Setup

### Get Free $300 Credit

1. Go to https://cloud.google.com/


2. Create New Project or use existing one

3. Enable Translation API:
   - Search "Cloud Translation API"
   - Click Enable

4. Create Service Account & API Key:
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Or use service account JSON for production

5. Set `GOOGLE_TRANSLATE_API_KEY` in your `.env` file

6. **FREE TIER:** Google gives $300 free credit! Enough for thousands of translations

### Automatic Translation on Content Creation

When creating/editing content in admin panel:
- Check "Auto Translate" checkbox
- English content will auto-translate to Japanese & Korean
- Uses your $300 free credit

---

## Phase 2: Dynamic Content (✅ COMPLETE)

- [x] API endpoints for form submissions
- [x] Database fully populated with seed data
- [x] Frontend pages loading dynamic content from DB
- [x] Contact form functional
- [x] Summit registration form functional

Test: Visit http://localhost:3000/en/contact and submit form

---

## Phase 3: Admin Panel (✅ COMPLETE)

- [x] Authentication (JWT)
- [x] Admin dashboard
- [x] CRUD for Team Members
- [x] CRUD for Clients
- [x] CRUD for Partners
- [x] CRUD for Content Blocks
- [x] View contact submissions

Access at: http://localhost:3000/admin

---

## Phase 4: Google Translate API (✅ COMPLETE)

- [x] Service implemented in `services/translationService.js`
- [x] Auto-translation on content creation
- [x] Japanese & Korean support
- [x] Fallback to English if API unavailable

---

## Phase 5: Deployment to Render

### Step 1: Prepare for Production

```bash
# Push to GitHub (Render deploys from GitHub)
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### Step 2: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access repositories

### Step 3: Deploy PostgreSQL Database

1. In Render Dashboard: "New +" → "PostgreSQL"
2. Configuration:
   - Name: `ganassa-postgres` 
   - Max connections: DEFAULT
   - Plan: Free tier ($0/month)

3. Copy the `Internal Database URL` (for app to connect)
4. Save this for step 4

### Step 4: Deploy Node.js App

1. "New +" → "Web Service"
2. Connect to your `ganassa-app` GitHub repo
3. Configuration:
   - Name: `ganassa-app`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm run start`  (NOT `npm run dev`)
   - Plan: Free tier ($0/month with auto-sleep)

4. Add Environment Variables:
   ```
   DATABASE_URL=<paste from PostgreSQL step>
   JWT_SECRET=<generate strong random string>
   GOOGLE_TRANSLATE_API_KEY=<your API key>
   NODE_ENV=production
   ```

5. Deploy!

### Step 5: Database Migration

Once app is deployed on Render:

```bash
# In your local terminal
npm run db:init  # Creates schema (you might need to adjust for production DB)
npm run db:seed  # Seeds initial data
```

Or add init command to Render build:
1. Edit Web Service settings
2. In "Build Command" add initialization after npm install

### Step 6: Connect Custom Domain

1. Buy domain from any registrar (Godaddy, Namecheap, etc.)
2. In Render Dashboard:
   - Service → Settings → Custom Domains
   - Add your domain
   - Render gives you nameserver records to add to registrar
3. Update DNS records at your domain registrar
4. Wait 15-30 minutes for DNS propagation
5. HTTPS automatically enabled ✅

---

## Production Costs

**FREE TIER (what you have):**
- PostgreSQL: $0/month (Tier 0 - paused if inactive)
- Node.js App: $0/month (paused if inactive)
- Google Translate: $0/month (free $300 credit, then ~$15/million chars)

**When to pay:**
- Only if your site gets 10,000+ daily visitors
- Or if you exceed $300 Google Translate credit

**Your website won't cost anything unless it goes viral!**

---

## Management After Deployment

### Update Content
1. Visit https://yourdomain.com/admin
2. Login with admin credentials
3. Edit pages, add team members, update clients, etc.

### Monitor Performance
- Render Dashboard shows:
  - CPU usage
  - Memory usage
  - Error logs
  - Request metrics

### Backup Database
Render automatically backs up PostgreSQL daily
- Accessible in PostgreSQL service settings

---

## Troubleshooting

### "Database connection failed"
- Check DATABASE_URL in Render env variables
- Ensure PostgreSQL service is active

### "Translation API not working"
- Verify GOOGLE_TRANSLATE_API_KEY is set correctly
- Check Google Cloud Console for API quota
- Falls back to English if API down

### "App showing "cannot get /en/""
- Check app logs in Render
- Verify npm start is working locally first
- Check all dependency imports

---

## Support

For questions about:
- **Render**: Check https://render.com/docs
- **Google Translate**: Check https://cloud.google.com/translate/docs
- **This project**: Review code in relevant folders

Enjoy your global website! 🚀
