# General Builder — E2E Test Report

Automated end-to-end tests with **Playwright**, run against the app on a
dedicated test server (port **3100**) backed by an isolated database
(**`general-builder-test`**).

_Last run: full suite across Chromium, Firefox, WebKit, and Pixel 5 (mobile)._

## Summary

| Metric | Result |
| --- | --- |
| Browser projects | 4 (Chromium, Firefox, WebKit, Pixel 5 mobile) |
| Total test instances | 152 |
| ✅ Passed | 134 (133 first-try + 1 on retry) |
| ❌ Failed | 0 |
| ⚠️ Flaky (passed on retry) | 1 |
| ⏭️ Skipped | 18 |
| Duration | ~2 minutes |

**Skipped breakdown:** 14 are chromium-only screenshot captures that don't run
on Firefox/WebKit; 4 are the "unverified email" login scenario, which is **not
applicable** to this app (see Deviations below).

## How the tests are isolated

- A separate dev server is auto-started on **port 3100** (never collides with
  your normal `npm run dev` on 3000).
- It points at the **`general-builder-test`** database via
  `webServer.env.MONGODB_URI`, so real data is never touched.
- The test DB is wiped + re-seeded with one known user before the suite, and
  wiped again after. Signup tests use unique emails and clean up after
  themselves, so the suite is re-runnable.
- `EMAIL_PASS` is blanked for tests → the reset link is console-logged, no real
  emails are sent.
- Global setup performs a warm-up login to pre-compile the NextAuth route +
  middleware, removing dev-mode cold-start flakiness.

## Scenarios covered

### `signup.spec.ts`
- ✅ Successful signup → redirects to `/login?registered=1` with "Account created" banner, and the user is persisted.
- ✅ Already-registered email → "Email already registered" error, stays on `/signup`.
- ✅ Invalid email format → zod validation error, no submit.
- ✅ Empty fields → email/phone/password validation errors, no submit.

### `login.spec.ts`
- ✅ Correct credentials → redirect to `/dashboard`.
- ✅ Wrong password → "Invalid credentials".
- ✅ Non-existent email → "Invalid credentials" (same message; no account enumeration).
- ⏭️ Unverified email → **skipped** (feature not part of this app).

### `forgot-password.spec.ts`
- ✅ Valid registered email → generic "reset link has been sent" message.
- ✅ Unregistered email → **same** message (no account enumeration).
- ✅ `/reset-password` with no token → "Invalid link".
- ✅ Invalid/expired token → "invalid or has expired" error.
- ✅ Full reset with an injected valid token → success, then login with the new password works.

### `auth-protection.spec.ts`
- ✅ `/dashboard` while logged out → redirects to `/login`.
- ✅ `/dashboard` while logged in → dashboard renders.
- ✅ After logout, `/dashboard` → redirects to `/login`.
- ✅ `/contact` while logged out → redirects to `/login`.

### `dashboard.spec.ts`
- ✅ All 5 service cards render (New Extensions, Refurbishment, Electrical Work, Plumbing Work, Painting).
- ✅ "Request a Quote" opens the quote modal with the pre-selected service.
- ✅ Logout clears the session (dashboard then redirects to login).

### `contact.spec.ts`
- ✅ Valid quote submission → success message.
- ✅ Empty fields → validation errors.

### `responsive.spec.ts`
- ✅ Mobile: navbar collapses to a hamburger that opens/closes.
- ✅ Desktop: full nav shown, no hamburger.
- ✅ No horizontal overflow on landing/signup/login/forgot @ mobile, tablet, desktop.
- ✅ No horizontal overflow on dashboard/contact @ mobile, tablet, desktop.
- ✅ Service cards: 1 column (mobile) / 2 (tablet) / 3 (desktop).

## Deviations from the original request

This app was built with **no email verification** (an explicit product
requirement — signup needs only email, phone, password). Two requested
assertions were therefore adapted to the app's real behavior:

1. **"Signup shows *verify your email*"** → the app instead redirects to
   `/login?registered=1` and shows **"Account created! Please log in."** The
   test asserts this real behavior.
2. **"Login with unverified email shows *please verify your email*"** → there is
   no unverified state, so this test is **skipped** with a documented reason.

## Known issues / limitations

- **Dev-server timing (mitigated):** tests run against `next dev`, which compiles
  routes on demand. This can cause an occasional first-hit login timeout under
  parallel load. Mitigations in place: a warm-up login in global setup and
  `retries: 1`. In the final run this surfaced as **1 flaky test**
  (`responsive › no horizontal overflow on protected pages @ mobile`) that
  passed on retry. For maximum stability you could run tests against a
  production build (`next build && next start`) instead of `next dev`.
- **Login uses a hard navigation:** after a successful credential login the app
  navigates with `window.location` (not client-side `router.push`) so the
  freshly-set session cookie is always sent to middleware. This eliminated an
  intermittent post-login bounce back to `/login`.
- **Screenshots run on chromium-based projects only** (Chromium + Pixel 5),
  skipped on Firefox/WebKit by design.

## Key-flow screenshots

Captured automatically by `tests/screenshots.spec.ts` into `screenshots/`:

| Flow | File |
| --- | --- |
| Landing (desktop) | `screenshots/01-landing-desktop.png` |
| Signup | `screenshots/02-signup.png` |
| Login | `screenshots/03-login.png` |
| Dashboard (desktop) | `screenshots/04-dashboard-desktop.png` |
| Quote modal | `screenshots/05-quote-modal.png` |
| Landing (mobile) | `screenshots/06-landing-mobile.png` |
| Mobile menu (open) | `screenshots/07-mobile-menu.png` |

Failed tests additionally capture a screenshot + video under `test-results/`.

## Commands

```bash
# Run the whole suite (all browsers + mobile). Auto-starts the test server.
npm run test:e2e

# Just Chromium (fastest feedback)
npm run test:e2e:chromium

# Interactive UI mode (watch / debug / time-travel)
npm run test:e2e:ui

# Open the HTML report from the last run
npm run test:e2e:report

# A single file, or filter by title
npx playwright test tests/login.spec.ts
npx playwright test -g "wrong password"

# One specific browser project
npx playwright test --project=webkit
```

> Requires local MongoDB running on `127.0.0.1:27017`. The suite creates and
> uses the `general-builder-test` database automatically.
