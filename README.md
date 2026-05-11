# Overview

Math Quiz Portal is a protected learner platform for Elective Mathematics. I built it to practice designing a real full‑stack workflow: authentication, role-based access (learner vs admin), database-backed quiz delivery, server-side scoring, progress tracking, and a simple in-app messaging system.

The app is written with Node.js, Next.js (App Router) and Supabase. Learners sign up, confirm their email, log in, and then access quiz modules through a dashboard. Quiz submissions are handled on the server so answer keys stay protected. Admins can view recent learner activity and send announcements or direct messages.

## Running locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create an environment file:
   ```bash
   copy .env.example .env.local
   ```

3. Fill in at least these values in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (required for the module import script)
   - `SITE_URL=http://localhost:3000`

4. Apply the database schema in your Supabase project:
   - Run `supabase/schema.sql`
   - Optionally run `supabase/seed.sql` (module shell rows)

5. Start the dev server:
   ```bash
   npm run dev
   ```

6. Open the app:
   - http://localhost:3000

## Demo video

This project includes a short demo video showing the app running (starting the server, navigating the pages, and a quick code walkthrough):

[Software Demo Video](https://youtu.be/Ix951WLkg9c)

# Web Pages

The UI is organized into route groups under `app/`.

- Public landing page (`/`)
  - Shows the module catalog and high-level stats (module count, question count).
  - Dynamically displays a setup banner when Supabase env vars/schema are missing.
  - Primary navigation flows into `/signup` and `/login`.

- Signup (`/signup`)
  - Creates a Supabase Auth user with `full_name` metadata.
  - Shows success/error banners and instructs the user to confirm email.

- Login (`/login`)
  - Signs in with email + password and redirects to the protected dashboard.
  - Accepts a `next` parameter so protected routes can send users back after login.

- Learner dashboard (`/dashboard`) (protected)
  - Dynamically builds a snapshot for the signed-in user (attempt totals, average score, unread message count).
  - Shows a list of recent attempts and a scrollable module list.

- Module catalog (`/modules`) (protected)
  - Lists modules available to the learner account.

- Module page (`/modules/[slug]`) (protected)
  - Loads the module snapshot from the database.
  - If questions have been imported, renders the quiz runner; otherwise shows status messaging.
  - Quiz submission is server-handled so answer keys remain hidden from learners.

- Message center (`/messages`) (protected)
  - Learner view: a single “conversation-style” thread with admin/system messages and score notifications.
  - Learners can send messages to admins (if an admin account exists).
  - If the signed-in user is an admin, this route redirects to `/admin/messages`.

- Message detail (`/messages/[messageId]`) (protected)
  - Opens a single message and displays sender and read timestamps.

- Admin console (`/admin`) (protected + admin role)
  - Requires the signed-in user’s `profiles.role` to be set to `admin` in Supabase.
  - Shows recent learners, performance snapshots, and provides an admin “send message” form.

- Admin messages (`/admin/messages`) (protected + admin role)
  - Select a learner to open a thread-style conversation and reply directly.

# Development Environment

- Tools
  - Visual Studio Code
  - Node.js + npm
  - Supabase (Auth + Postgres)

- Language and libraries
  - TypeScript + React
  - Next.js (App Router)
  - Supabase SSR helpers (`@supabase/ssr`) + client SDK (`@supabase/supabase-js`)
  - Tailwind CSS
  - Vitest (unit tests)
  - ESLint (linting)

# Useful Websites

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth (Email) Guides](https://supabase.com/docs/guides/auth)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev/guide/)
- [Vercel Documentation](https://vercel.com/docs)

# Future Work

- Finish importing the full legacy quiz bank into Postgres and remove remaining placeholders.
- Add an admin UI to manage roles (promote/demote users) instead of editing `profiles.role` manually.
- Expand learner analytics (per-topic breakdowns, attempt history charting, and export for admins).
