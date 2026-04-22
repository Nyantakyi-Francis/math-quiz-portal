# Math Quiz Portal

The project is now being migrated from a static quiz site into a modular learner platform built for:

- `Next.js` on Vercel
- `Supabase Auth`
- `Supabase Postgres`
- protected learner dashboards
- admin performance monitoring
- in-app messaging

## What is already scaffolded

- Public landing page at `/`
- Auth pages at `/login` and `/signup`
- Protected routes at `/dashboard`, `/messages`, `/modules/[slug]`, and `/admin`
- Supabase SSR helpers and auth middleware
- Initial Postgres schema in [supabase/schema.sql](./supabase/schema.sql)
- Initial module seed in [supabase/seed.sql](./supabase/seed.sql)
- Legacy quiz metadata mapped into [lib/data/modules.ts](./lib/data/modules.ts)

## Current migration principle

The existing static quiz files are still in the repo as source material, but the new app layer is where protected access, scoring, messaging, and admin workflows will live. That keeps the migration incremental instead of forcing a risky rewrite.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and add:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. In Supabase SQL Editor, run:

- [supabase/schema.sql](./supabase/schema.sql)
- [supabase/seed.sql](./supabase/seed.sql)

4. Start the app:

```bash
npm run dev
```

## Suggested next phase

1. Import one module from `data/*.json` into `modules`, `questions`, `question_options`, and `question_answer_keys`.
2. Use the protected quiz runner at `/modules/[slug]`.
3. Submit attempts into `attempts` and `attempt_answers`.
4. Auto-create score messages in the learner inbox.
5. Expand the admin page into real learner analytics and broadcast messaging.

## Importing a legacy module

The first end-to-end migration path is now wired up for protected quiz delivery.

Run:

```bash
npm run import:module -- binary-sets-binomial
```

To import every module from the `data/` folder in one go:

```bash
npm run import:all-modules
```

If you need to rebuild an already imported module:

```bash
npm run import:module -- binary-sets-binomial --replace
```

What that script does:

- reads `data/<module-slug>.json`
- inserts `questions`
- inserts `question_options`
- inserts `question_answer_keys`
- updates `modules.question_count`

After import, open:

- `/modules/binary-sets-binomial`

Submitting the quiz now:

- creates an `attempt`
- stores `attempt_answers`
- sends a score message into the learner inbox
- updates dashboard/admin data sources

## Admin messaging

Once your account is marked as `admin` in the `profiles` table, the `/admin` page can:

- view recent learners
- review recent performance
- send a direct message to one learner
- broadcast an announcement to all learners
- see recently sent messages and recipient counts

## Notes

- `pgAdmin` is optional and can still be used to inspect your Postgres database, but Supabase is now the actual hosted Postgres backend for the app.
- The schema intentionally keeps answer keys separate from visible question options so learners cannot read correct answers directly from the client-side data model.
