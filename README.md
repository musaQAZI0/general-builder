# General Builder

Full-stack website and client portal for a building/construction business.

## Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- NextAuth.js credentials auth with JWT sessions
- MongoDB Atlas/local MongoDB + Mongoose
- Nodemailer email notifications
- React Hook Form + Zod validation
- Playwright end-to-end tests

## Local Setup

1. Copy `.env.example` to `.env.local`.
2. Set `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and email variables.
3. Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Main Flow

Landing (`/`) -> Sign Up (`/signup`) -> Login (`/login`) -> Dashboard (`/dashboard`) -> Request a Quote (`/dashboard/request`) -> Admin management (`/admin`).

Quote requests are stored in MongoDB and visible to:

- Customers in `/dashboard`
- Admin users in `/admin`

Admin access is controlled by `ADMIN_EMAILS` or `OWNER_EMAIL`.

## Vercel

See `VERCEL_DEPLOYMENT.md`.

## Tests

Playwright tests use port `3300` and a separate test database:

```bash
npm run test:e2e
npm run test:e2e:chromium
npm run test:e2e:ui
npm run test:e2e:report
```

Before deployment, run:

```bash
npm run build
```
