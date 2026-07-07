# General Builder

Full-stack site for a general building / construction business. Access to the
services dashboard is gated behind a simple 3-field signup (email, phone,
password).

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- NextAuth.js (Credentials provider, JWT sessions)
- MongoDB (local) + Mongoose
- bcryptjs, react-hook-form + zod

## Getting started
1. Set `MONGODB_URI` in `.env.local`. Either a MongoDB Atlas cloud cluster
   (`mongodb+srv://…`) or a local instance (`mongodb://127.0.0.1:27017/general-builder`).
2. Other environment variables are in `.env.local` (see `.env.example`).
3. Install & run:
   ```bash
   npm install
   npm run dev
   ```
4. Open http://localhost:3000

## Flow
Landing (`/`) → Sign Up (`/signup`) → Login (`/login`) → Dashboard (`/dashboard`,
protected) → Request a Quote (modal or `/contact`) → Logout.

Data is stored in the `general-builder` database: `users` and `quotes`
collections (viewable in MongoDB Compass).

## End-to-end tests (Playwright)

Tests live in `tests/` and cover signup, login, forgot/reset password, route
protection, dashboard, contact form, and responsive/mobile behaviour across
Chromium, Firefox, WebKit, and a Pixel 5 mobile viewport.

**Test isolation:** the suite starts its own dev server on **port 3100** pointed
at a **separate database `general-builder-test`** (configured in
`playwright.config.ts` → `webServer.env.MONGODB_URI`), so your real
`general-builder` data is never touched. `EMAIL_PASS` is blanked for tests so no
real reset emails are sent. The test DB is wiped and re-seeded before each run.

> Requires local MongoDB running. Stop any `npm run dev` on port 3000 first is
> **not** needed — tests use port 3100 — but don't run two dev servers on the
> same machine for unrelated reasons.

Commands:

```bash
# Run the whole suite (all browsers + mobile). Auto-starts the test server.
npm run test:e2e

# Run just Chromium (fastest feedback loop)
npm run test:e2e:chromium

# Interactive UI mode (watch, pick tests, time-travel debug)
npm run test:e2e:ui

# Open the HTML report from the last run
npm run test:e2e:report

# Run a single file / filter by title
npx playwright test tests/login.spec.ts
npx playwright test -g "wrong password"
```

Failed tests capture a **screenshot** and **video** automatically (see
`test-results/`), and a full **HTML report** is written to `playwright-report/`.
A human-readable summary lives in `TEST_REPORT.md`.
