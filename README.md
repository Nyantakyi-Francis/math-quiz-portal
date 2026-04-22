# Math Quiz Portal

Math Quiz Portal is an Elective Mathematics learning platform being migrated from a static quiz site into a protected, data-backed web application.

The project keeps the existing quiz content as source material while moving learner access, scoring, progress tracking, messaging, and admin visibility into a modern `Next.js` + `Supabase` stack that can run locally and deploy cleanly on Vercel.

## Vision

The goal is to turn a collection of standalone quiz pages into a full learner platform where:

- students create accounts and access protected quiz modules
- quiz submissions are scored on the server
- score history is stored per learner
- messages and feedback live inside the app
- admins can monitor learner activity and send announcements from one place

This migration is intentionally incremental. The legacy quiz files still exist in the repo, but the protected app layer is now the long-term home of the platform.

## Current platform status

The repo already includes the core foundation for the new portal:

- public landing page and public module catalog
- Supabase-powered sign up, login, and sign out flows
- protected learner dashboard at `/dashboard`
- protected module catalog at `/modules`
- protected module pages at `/modules/[slug]`
- server-side quiz scoring and attempt persistence for imported modules
- learner inbox at `/messages`
- admin console at `/admin`
- direct admin messages and broadcast announcements
- Supabase schema, seed data, and row-level security policies
- import scripts for migrating legacy JSON quiz data into Postgres

The current content foundation includes:

- `11` module shells
- `430` legacy questions available as source material in `data/`
- matching legacy HTML quiz pages preserved in `quizzes/`

## Feature status

- [x] Public landing page and marketing shell
- [x] Learner authentication with Supabase Auth
- [x] Protected learner dashboard with progress summary
- [x] Protected module routes wired for database-backed quiz delivery
- [x] Server-side scoring with saved attempts and attempt answers
- [x] Learner inbox for score notifications and admin messages
- [x] Admin console for learner monitoring and messaging
- [x] Legacy quiz import pipeline from JSON into Postgres
- [ ] Complete migration of every legacy module into live protected delivery
- [ ] Richer learner analytics and weak-topic insights
- [ ] Timed assessment and exam-style practice modes
- [ ] Content authoring and publishing workflows for admins
- [ ] More advanced messaging, intervention, and reporting tools

## Current routes

| Route | Purpose |
| --- | --- |
| `/` | Public landing page and module overview |
| `/signup` | Learner account creation |
| `/login` | Learner sign in |
| `/dashboard` | Learner overview with attempts, average score, and unread messages |
| `/modules` | Protected catalog of available modules |
| `/modules/[slug]` | Protected quiz page with live quiz delivery and submission |
| `/messages` | Learner inbox for score notices and admin communication |
| `/admin` | Admin view for learners, attempts, and message workflows |

## How the app works

At a high level, the new flow is:

1. A learner signs up or logs in through Supabase Auth.
2. The learner opens a protected module page.
3. Questions and options are loaded from Postgres, while answer keys remain server-side.
4. Submitting a quiz writes an `attempt`, stores `attempt_answers`, calculates a score, and creates a learner message.
5. The learner dashboard and inbox reflect that new activity automatically.

This gives the platform a safer and more useful model than the legacy static quiz pages, because grading and answer keys stay off the client.

## Tech stack

- `Next.js 16` with App Router
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `Supabase Auth`
- `Supabase Postgres`
- `@supabase/ssr` for authenticated server rendering
- `Vercel` for deployment

## Project structure

- [app](./app): routes, layouts, route handlers, and page-level UI
- [components](./components): reusable UI such as the dashboard shell, module catalogs, and quiz runner
- [lib](./lib): app data, Supabase helpers, portal snapshots, and quiz utilities
- [supabase](./supabase): SQL schema and seed scripts
- [scripts](./scripts): migration/import scripts for legacy quiz data
- [data](./data): JSON quiz source files used for migration
- [quizzes](./quizzes): preserved legacy HTML quiz pages

## Database model

The protected platform centers around these main tables:

- `profiles`
- `modules`
- `questions`
- `question_options`
- `question_answer_keys`
- `attempts`
- `attempt_answers`
- `messages`
- `message_recipients`

The schema is designed so visible options can be delivered to learners without exposing the correct answers directly on the client.

## Local development

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and add your Supabase credentials:

```bash
SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

If you already use `NEXT_PUBLIC_SITE_URL`, the app still supports it as a fallback. `SITE_URL` is the preferred server-side setting.

3. In the Supabase SQL Editor, run:

- [supabase/schema.sql](./supabase/schema.sql)
- [supabase/seed.sql](./supabase/seed.sql)

4. Start the app:

```bash
npm run dev
```

5. Import at least one legacy module so a protected quiz has live question data:

```bash
npm run import:module -- binary-sets-binomial
```

6. Open `http://localhost:3000`.

## Vercel deployment

Add these environment variables in your Vercel project settings:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Optional:

```bash
SITE_URL=https://your-production-domain.com
```

Deployment notes:

- If `SITE_URL` is not set in Vercel, the app can infer the active deployment origin from the request or `VERCEL_URL`.
- Do not set `SITE_URL` or `NEXT_PUBLIC_SITE_URL` to `http://localhost:3000` in Vercel.
- In Supabase Auth settings, add `http://localhost:3000/auth/callback`.
- In Supabase Auth settings, add `https://your-domain.com/auth/callback`.

## Importing legacy modules

Import one module:

```bash
npm run import:module -- binary-sets-binomial
```

Import every module in `data/`:

```bash
npm run import:all-modules
```

Rebuild an already imported module:

```bash
npm run import:module -- binary-sets-binomial --replace
```

The import script:

- reads `data/<module-slug>.json`
- updates module metadata and question count
- inserts rows into `questions`
- inserts rows into `question_options`
- inserts the correct answer into `question_answer_keys`

Once imported, the protected route for that module becomes a live quiz page backed by Postgres instead of a placeholder shell.

## Admin setup

After creating your first account, promote it manually in Supabase if you want to use the admin console.

Set your row in `profiles` so that:

```text
role = admin
```

That unlocks the learner monitoring and messaging workflows at `/admin`.

## Roadmap

The following features are intended additions for future phases of the project:

- complete migration of all legacy quiz banks into protected database-backed modules
- module completion indicators, best-score tracking, and stronger learner progress history
- topic-level performance summaries and weak-area detection across attempts
- richer learner feedback after submission, including targeted remediation guidance
- timed practice sessions and exam simulation modes
- stronger admin analytics with filtering by learner, module, and performance trend
- tools for creating, editing, publishing, and managing modules without direct SQL edits
- smarter message workflows such as templates, score-based nudges, and follow-up interventions
- improved import validation for new question banks and future content expansion
- downloadable or shareable reporting views for learners and admins

## Why this repo still contains legacy files

The legacy HTML quizzes in [quizzes](./quizzes) and JSON files in [data](./data) are still valuable during migration:

- they preserve the original question bank
- they provide a source of truth for staged imports
- they make it possible to migrate module by module instead of rewriting the entire platform at once

This keeps the transition practical and lowers the risk of breaking the existing learning content while the protected app continues to grow.
