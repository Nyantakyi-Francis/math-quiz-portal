# Math Quiz Portal

Math Quiz Portal is a branded Elective Mathematics learning portal by Nyantakyi Francis. It combines topic-based quizzes, protected learner accounts, server-side scoring, score history, structured explanations, downloadable learning resources, and admin messaging.

The current product contains 11 quiz modules and 470 authored questions with explanations. Learners sign up, confirm their email, log in, practise by module, submit answers to a trusted server route, and review their results after scoring. Admin users can monitor recent learners and attempts, send announcements, manage learner roles, and reply to messages.

## Product Highlights

- Branded learner portal for Elective Mathematics.
- 470 questions across 11 modules.
- Authenticated learner and admin areas.
- Server-side quiz scoring so answer keys are not exposed before submission.
- Post-submission explanations, correct answers, selected answers, and misconception feedback.
- Learner dashboard with recommendations, score history, messages, and progress analytics.
- Admin console for recent learners, recent performance, announcements, direct messages, and role management.
- Protected PDF resource library with 19 authored study packs.
- PWA assets and offline fallback page.
- Supabase schema with row-level security policies for profiles, quiz data, attempts, messages, and admin-only answer data.

## Tech Stack

- Next.js App Router
- React and TypeScript
- Supabase Auth and Postgres
- Tailwind CSS
- KaTeX for mathematical notation
- Vitest and ESLint

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create an environment file:

   ```bash
   copy .env.example .env.local
   ```

3. Fill in the required values:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SITE_URL=http://localhost:3000`

4. Apply the database schema in Supabase:

   - Run `supabase/schema.sql`
   - Run `supabase/seed.sql`

5. Import quiz modules:

   ```bash
   npm run import:all-modules -- --replace
   ```

6. Optional: create synthetic reviewer data:

   ```bash
   npm run demo:reviewer-data
   ```

7. Start the app:

   ```bash
   npm run dev
   ```

8. Open:

   ```text
   http://localhost:3000
   ```

## Admin Setup

After creating the first account, set that account's `profiles.role` to `admin` in Supabase. Once one admin exists, the Admin Console can promote or demote other users through the role-management controls.

Do not commit `.env.local` or service-role credentials. `.env.example` is the only environment file intended for source control.

## Validation

Use the combined check before packaging or deployment:

```bash
npm run check
```

Useful individual commands:

```bash
npm run typecheck
npm run lint
npm test -- --run
npm run build
```

## Licensing Materials

The repository includes supporting documents for review:

- `PRODUCT_BRIEF.md`
- `ASSET_OWNERSHIP.md`
- `PRIVACY_AND_DATA_HANDLING.md`
- `REVIEWER_WALKTHROUGH.md`

These files describe the licensing offer, owned assets, data handling, reviewer flow, and deployment expectations.
