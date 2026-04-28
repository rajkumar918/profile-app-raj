Deployment Guide — Vercel (frontend) and Render (backend)

Overview
- This repo contains `profile-app/` (React Create React App frontend) and `profile-app/server/` (example Express backend).
- Two recommended deployment modes:
  1. Vercel (frontend only) — fastest and free for static hosting.
  2. Vercel (frontend) + Render (backend) — use this when you want an API/backend and persistent DB.

Prerequisites
- Push your repository to GitHub.
- Have accounts on Vercel and Render (both support GitHub integration).

Local test commands
- Install frontend deps and run frontend dev server:
```bash
cd profile-app
npm install
npm start
```
- Run example backend locally:
```bash
cd profile-app/server
npm install
npm start
# server runs on http://localhost:4000 by default
```

A — Vercel (frontend only)
1. Go to https://vercel.com, sign in and choose "Import Project".
2. Select your GitHub repo and branch.
3. In the Import settings set:
  - Root Directory: `profile-app`
   - Framework: Create React App (likely detected automatically)
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Deploy. Vercel will provide a public URL and TLS.
5. (Optional) In Vercel Project Settings -> Environment Variables add `REACT_APP_API_BASE` if you later point to a backend API.

B — Vercel (frontend) + Render (backend)
This flow deploys frontend on Vercel and backend on Render.

Backend: create Render service
1. Create a `package.json` in `profile-app/server` (this repo includes one).
2. Go to https://dashboard.render.com and create a new **Web Service**.
3. Connect your GitHub repo and branch.
4. Set Root Directory to `profile-app/server`.
5. Set Build Command: `npm install` (or leave blank if you want Render to run default install)
6. Set Start Command: `npm start`.
7. After deploy, note the public service URL, e.g. `https://profile-app-backend.onrender.com`.

CORS and Environment variables
- The server reads `CORS_ORIGIN` (defaults to `*`). To restrict CORS to your Vercel domain, set `CORS_ORIGIN=https://your-frontend.vercel.app` in Render environment variables.
- To let the frontend call the backend, set the frontend env var in Vercel: `REACT_APP_API_BASE=https://profile-app-backend.onrender.com`.
- In the frontend, use `process.env.REACT_APP_API_BASE` when calling APIs. Example:
```js
const base = process.env.REACT_APP_API_BASE || '';
fetch(`${base}/api/profile/me`)
```

Managed Postgres on Render (optional)
- If you need persistence, create a managed Postgres on Render:
  1. In Render dashboard -> Databases -> Create Database -> Postgres.
  2. Choose name (e.g., `profile-app-db`) and region.
  3. After creation note the connection string.
  4. Add connection string to your backend env vars as `DATABASE_URL`.

Using provided `render.yaml` template
- This repo includes `profile-app/render.yaml` as a template — replace service/database names with your preferred names before using.
- If you prefer manual setup, follow the UI steps above and paste environment variable values into the Render service settings.

Vercel JSON (optional)
- `profile-app/vercel.json` is included to help Vercel detect the Create React App build output.

Testing after deploy
- Frontend: visit your Vercel URL.
- Backend: visit `https://<render-service>/api/profile/me` (should respond 404 or data depending on payload).
- From frontend, ensure `REACT_APP_API_BASE` is set to the Render URL and API calls succeed.

Notes
- Render free tier may sleep services; use a hobby plan for persistent uptime.
- Store secrets (DB URLs, API keys) as environment variables on Render and Vercel — never commit them to source control.

If you'd like, I can now:
- Replace placeholders in `render.yaml` with your chosen service/database names and generate a ready-to-apply file.
- Walk through the Render UI with step-by-step screenshots (I will describe exact clicks; you can paste screenshots if you want me to annotate them).