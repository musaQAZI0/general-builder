# Vercel Deployment

## Required Environment Variables

Add these in Vercel Project Settings -> Environment Variables.

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/general-builder?retryWrites=true&w=majority
NEXTAUTH_SECRET=<long-random-secret>
NEXTAUTH_URL=https://your-project.vercel.app
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-google-app-password
OWNER_EMAIL=owner@example.com
ADMIN_EMAILS=owner@example.com
```

When you connect a custom domain, update `NEXTAUTH_URL` to the final production domain:

```bash
NEXTAUTH_URL=https://your-domain.co.uk
```

Do not include a trailing slash.

## MongoDB Atlas

Use MongoDB Atlas for Vercel.

1. Create an Atlas database user.
2. Add network access for Vercel. The simplest option is `0.0.0.0/0`; for tighter security, use Atlas/Vercel integration or managed IP controls.
3. Copy the Drivers connection string.
4. Make sure the URI includes the database name: `/general-builder`.

## Vercel Build Settings

Vercel should auto-detect Next.js. Use:

```bash
Install Command: npm install
Build Command: npm run build
Output Directory: .next
Node.js Version: 20.x
```

## Pre-Deploy Check

Run:

```bash
npm install
npm run build
```

## Post-Deploy Smoke Test

Check:

- `/`
- `/signup`
- `/login`
- `/dashboard`
- `/dashboard/request`
- `/admin`
- `/contact`

Then:

1. Create a test user.
2. Submit a quote request.
3. Confirm it appears in the customer dashboard.
4. Sign in with an email from `ADMIN_EMAILS`.
5. Confirm `/admin` can view and update request status.
