# ShopSphere — Production Deployment (DECI Level 5 Task 1)

ShopSphere is a React/Vite frontend with an Express backend. For production, the backend uses **PostgreSQL hosted on Supabase** and is deployable to **Vercel**.

## Production architecture

- Frontend: React + Vite → Vercel
- Backend: Express serverless function → Vercel
- Database: PostgreSQL → Supabase
- Security: HTTPS (Vercel), CORS, Helmet, rate limiting
- Health check: `GET /api/health`
- Monitoring: register the public health URL with UptimeRobot or an equivalent service

## 1. Supabase database

Create a Supabase project and open its SQL Editor. Run:

`backend/src/config/schema.sql`

Then configure the backend `DATABASE_URL` with the Supabase PostgreSQL connection string.

## 2. Backend environment variables

Set these on Vercel. Never commit real values:

- `NODE_ENV=production`
- `DATABASE_URL=<Supabase PostgreSQL connection string>`
- `JWT_SECRET=<long random secret>`
- `JWT_EXPIRES_IN=7d`
- `CLIENT_URL=<public Vercel frontend URL>`
- `ADMIN_EMAIL=<admin email>`
- `ADMIN_PASSWORD=<strong admin password>`

The repository only contains placeholders in `.env.example`.

## 3. Seed production data

From a machine that has network access to the Supabase database, install backend dependencies and run the seed script with the production environment variables. The script creates an admin account, a test customer and sample products.

## 4. Deploy backend to Vercel

Import the repository into Vercel and set the project root to `backend/`. The included `backend/vercel.json` uses `api/index.js` as the serverless entry point.

After deployment, verify:

`https://YOUR-BACKEND.vercel.app/api/health`

It must return HTTP 200 and JSON containing `success: true`.

## 5. Deploy frontend to Vercel

Create a second Vercel project with root directory `frontend/`.

Set:

`VITE_API_URL=https://YOUR-BACKEND.vercel.app/api`

Then deploy the production build.

## 6. Monitoring

Create an HTTP monitor in UptimeRobot (or an equivalent service) for the exact public backend health URL:

`https://YOUR-BACKEND.vercel.app/api/health`

Confirm the monitor reports the service as UP.

## Security checklist

- [ ] No real secret appears in the repository
- [ ] `DATABASE_URL` is a Vercel environment variable
- [ ] `JWT_SECRET` is a Vercel environment variable
- [ ] Frontend is served over HTTPS
- [ ] Backend is served over HTTPS
- [ ] CORS is active
- [ ] Helmet is active
- [ ] Rate limiting is active
- [ ] `/api/health` returns HTTP 200 publicly
- [ ] UptimeRobot (or equivalent) reports the health endpoint as UP
