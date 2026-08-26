# ShopSphere Backend - Production

Production backend for ShopSphere using Express, PostgreSQL on Supabase, JWT authentication, Helmet, CORS and rate limiting.

## Required environment variables

- `DATABASE_URL` - Supabase PostgreSQL connection string
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Database setup

Run `src/config/schema.sql` against the Supabase PostgreSQL database, then run `npm run seed` with production environment variables.

## Vercel

The `vercel.json` file exposes `api/index.js` as the serverless backend entry point. The public health endpoint is `/api/health`.
