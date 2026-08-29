# Math Quiz Portal: Remaining Feature Roadmap

Feature 1, adaptive learning paths, is implemented. This document defines features 2 through 10 so work can resume in a later session without reconstructing scope or decisions.

## Working agreement

Implement one feature at a time in the order below. For each feature:

1. Inspect the current repository and database schema before editing.
2. Add or update automated tests for the core behavior.
3. Run TypeScript, lint, unit tests, and a production build.
4. Test the main interaction in a real browser at desktop and mobile widths.
5. Check day and night modes when the feature adds visible UI.
6. Apply database changes through an idempotent SQL migration or a reviewed update to `supabase/schema.sql`.
7. Stop after the feature passes verification and record any remaining risks.

## 2. Step-by-step answer explanations

### Goal

Help learners understand why an answer is correct and where their reasoning failed. Feedback should teach the method instead of showing only “Correct” or “Incorrect.”

### Learner experience

- After submission, show the correct answer for each question.
- Display a short, ordered solution with mathematical notation rendered through the existing math component.
- Explain the key rule or formula used.
- For an incorrect response, identify the learner's selected answer and explain the likely mistake when misconception data exists.
- Keep explanations hidden before submission.
- Let learners expand and collapse explanations question by question.
- Add an “Expand all explanations” control to the results view.
- Preserve keyboard navigation and screen-reader relationships between each question and explanation.

### Data and backend work

- Audit the existing question JSON files and the `questions.explanation` column.
- Define a structured explanation format if plain text cannot represent steps cleanly. A suggested shape is:

```json
{
  "summary": "Apply the law of indices.",
  "steps": ["Rewrite the expression", "Combine equal bases", "Simplify"],
  "formula": "a^m a^n = a^{m+n}",
  "misconceptions": {
    "option-id": "This adds the bases instead of the powers."
  }
}
```

- Keep backward compatibility with existing plain-text explanations.
- Update the module import script to validate and import explanation data.
- Return explanations only after quiz submission. Do not expose answer keys or explanations in the pre-submission question payload.

### Main files likely involved

- `components/quiz-runner.tsx`
- `components/math-text.tsx`
- `lib/quiz/types.ts`
- `lib/quiz/validation.ts`
- `app/api/modules/[slug]/submit/route.ts`
- `scripts/import-module.mjs`
- `supabase/schema.sql`
- `data/*.json`

### Acceptance criteria

- Correct and incorrect answers show useful explanations after submission.
- A learner cannot retrieve answer explanations before submitting.
- Mathematical expressions render correctly on desktop and mobile.
- Missing explanation data produces a sensible fallback.
- Tests cover structured explanations, plain-text fallbacks, and hidden pre-submission data.

## 3. Progress analytics

### Goal

Give learners and the administrator a clear view of performance, consistency, and improvement over time.

### Learner experience

- Add a progress page linked from the learner navigation.
- Show overall accuracy, modules completed, total attempts, and recent study activity.
- Plot score history over time.
- Show module mastery with the same 70% threshold used by adaptive recommendations.
- Compare the most recent score with the learner's first score for each module.
- Provide useful empty states for new learners.
- Allow time filters such as 30 days, 90 days, and all time.

### Admin experience

- Add aggregate class metrics without exposing one learner's private data to another learner.
- Show completion rates, average scores by module, and modules with the highest failure rates.
- Allow the administrator to open a learner's existing detail view from an analytics row.

### Data and backend work

- Query attempts with indexed filters on `learner_id`, `module_id`, and `created_at`.
- Add indexes only where query plans require them.
- Prefer database aggregation for class-wide reports to avoid transferring every attempt to the application.
- Define whether repeated attempts count equally or whether analytics should expose both best and latest scores.
- Use UTC for storage and the learner's locale for display.

### Acceptance criteria

- Charts work with empty, small, and large attempt histories.
- Learners see only their data under row-level security.
- Admin aggregate queries remain responsive with a large seeded dataset.
- Chart text and colors meet accessibility requirements in both themes.
- Filters update the displayed metrics and URL state consistently.

## 4. Revision and mistake notebook

### Goal

Turn incorrect and skipped answers into a focused revision queue.

### Learner experience

- Add a “Mistake notebook” page.
- Automatically add incorrect and unanswered questions after each completed attempt.
- Group entries by module and show the most recent mistake date.
- Let learners mark an item as understood, restore it, or practise it again.
- Provide a focused practice session using notebook questions.
- Remove or archive an item after the learner answers it correctly a defined number of times.
- Link each entry to its explanation from feature 2.

### Data and backend work

- Add a learner-owned table such as `revision_items` with `learner_id`, `question_id`, status, mistake count, correct-review count, timestamps, and last attempt reference.
- Upsert entries during quiz submission in the same trusted server-side workflow that records attempts.
- Add row-level security so learners can read and update only their entries.
- Preserve notebook history when a question's wording changes.

### Acceptance criteria

- Incorrect and skipped responses create or update notebook entries.
- Correct answers do not create mistake entries.
- Focused practice never exposes answer keys before submission.
- Status changes persist and respect row-level security.
- Empty, filtered, and completed notebook states work on mobile.

## 5. Question difficulty system

### Goal

Classify questions by difficulty and adjust practice sessions to each learner's current level.

### Learner experience

- Label questions as easy, medium, or hard where showing the label helps the learner.
- Start mixed practice near the learner's demonstrated ability.
- Increase difficulty after sustained success and reduce it after repeated errors.
- Explain changes in plain language, such as “Moving to harder questions after three correct answers.”
- Let learners choose a fixed difficulty for manual practice.

### Data and backend work

- Add a constrained difficulty field to questions.
- Seed initial difficulty values from teacher review rather than guessing from question order.
- Track learner performance by difficulty.
- Keep selection logic deterministic enough to test.
- Avoid selecting the same small set of questions repeatedly.
- Record the selected difficulty strategy on each generated practice attempt.

### Acceptance criteria

- Adaptive sessions contain the requested number of valid questions.
- Difficulty changes follow documented thresholds.
- Learners can override adaptive selection for manual practice.
- Tests cover new learners, strong learners, struggling learners, and sparse question banks.
- Admins can inspect and change question difficulty.

## 6. Timed exams and mock tests

### Goal

Provide an exam-style environment with reliable timing, automatic submission, and a useful results report.

### Learner experience

- Add a mock-exam setup page for module selection, question count, and duration.
- Show a visible countdown, answered count, unanswered count, and question navigator.
- Save answers while the learner moves between questions.
- Warn before manual submission when questions remain unanswered.
- Submit automatically when time expires.
- Recover an active exam after refresh or a short connection loss.
- Show score, time used, per-module breakdown, and explanations after submission.
- Offer a print-friendly results page and PDF export only if the browser print version does not meet requirements.

### Data and backend work

- Store exam start time and deadline on the server.
- Treat server time as authoritative; do not trust a browser-only countdown.
- Add attempt mode, duration, deadline, and submission reason fields.
- Prevent answer updates after the deadline or completed submission.
- Make automatic submission idempotent so retries cannot create duplicate attempts.

### Acceptance criteria

- Refreshing the page does not reset the timer.
- Expired exams reject late answer changes and submit once.
- Manual and automatic submissions produce the same scoring result.
- Keyboard navigation works across the question navigator.
- Mobile layouts keep the timer and primary actions visible without covering questions.

## 7. Improved mobile experience

### Goal

Make every learner workflow comfortable on small screens and low-bandwidth mobile connections.

### Scope

- Replace the crowded desktop navigation with an accessible mobile menu.
- Prevent the fixed theme control from covering dashboard and quiz content.
- Keep quiz actions reachable without obscuring answer options.
- Improve touch targets, spacing, text wrapping, and form input behavior.
- Check long module names, mathematical notation, error messages, and tables at 320, 390, and 430 pixel widths.
- Reduce unnecessary image and script transfer.
- Test portrait and landscape quiz layouts.

### Implementation notes

- Use semantic buttons and dialogs for mobile navigation.
- Respect safe-area insets on devices with display cutouts.
- Avoid horizontal scrolling except where mathematical content requires a contained scroll area.
- Preserve visible focus indicators for keyboard and switch-device users.
- Measure performance with production builds instead of development-mode timings.

### Acceptance criteria

- No primary content or controls are clipped or covered at supported widths.
- Every interactive target meets a practical touch size.
- Navigation opens, closes, traps focus where appropriate, and restores focus.
- Quizzes can be completed with one hand on a phone-sized viewport.
- Core pages meet agreed performance targets on a throttled mobile profile.

## 8. Teacher question management

### Goal

Let administrators manage the question bank without editing JSON or running import scripts.

### Admin experience

- Add searchable module and question lists.
- Create, edit, preview, publish, unpublish, duplicate, and archive questions.
- Reorder questions within a module.
- Manage answer options and choose exactly one correct answer.
- Edit explanations, formulas, difficulty, and misconception feedback.
- Validate a question before saving or publishing.
- Import and export reviewed JSON in the repository's supported format.
- Warn when editing a question that appears in prior attempts.

### Data and backend work

- Use server-side authorization for every mutation.
- Preserve historical attempt meaning when questions or options change. Consider immutable question versions if teachers need substantial edits.
- Add audit fields or an audit table for creator, last editor, and timestamps.
- Use transactions for question, option, and answer-key changes.
- Keep answer keys inaccessible to learners under row-level security.

### Acceptance criteria

- Non-admin users cannot access or invoke management actions.
- Validation blocks missing prompts, duplicate option order, and invalid answer keys.
- Editing one question cannot corrupt existing questions or attempts.
- Preview matches the learner quiz presentation.
- Import reports row-level errors without discarding valid rows silently.

## 9. Motivation and consistency features

### Goal

Encourage regular study without rewarding meaningless clicks or pressuring learners with punitive mechanics.

### Learner experience

- Track study streaks from completed learning activity.
- Let learners set a weekly attempt or study goal.
- Award milestones for meaningful outcomes such as first completion, topic mastery, improvement, and curriculum completion.
- Show a weekly summary with completed work and suggested next action.
- Use restrained celebrations that respect reduced-motion settings.
- Allow learners to hide motivational elements.

### Data and backend work

- Define a study day using the learner's chosen timezone.
- Store milestone awards idempotently.
- Calculate streaks from qualified activity, not logins or page views.
- Decide which event types count before implementing the streak query.
- Add notification preferences if summaries will create inbox messages.

### Acceptance criteria

- Duplicate submissions cannot award duplicate milestones.
- Timezone boundaries produce correct streaks.
- Missed days follow a documented reset or grace-period rule.
- Learners can disable nonessential celebrations and summaries.
- Motivation features do not block quizzes or dominate the dashboard.

## 10. Accessibility and quality assurance

### Goal

Make accessibility and regression testing part of the development workflow rather than a final audit.

### Accessibility work

- Audit color contrast in day and night modes.
- Ensure full keyboard access and visible focus states.
- Add correct headings, landmarks, labels, descriptions, and live regions.
- Test quiz feedback and validation messages with a screen reader.
- Support reduced motion and browser zoom up to 200%.
- Give mathematical content readable text alternatives where KaTeX output needs assistance.
- Check focus order after navigation, submission, dialogs, and errors.

### Automated quality work

- Add Playwright end-to-end coverage for signup/login, dashboard recommendations, quiz submission, results, messaging, and admin authorization.
- Add automated accessibility scans to key routes and states.
- Run unit tests, TypeScript, lint, build, and browser tests in continuous integration.
- Seed deterministic test users and data in an isolated test project or local Supabase instance.
- Capture screenshots for key desktop and mobile states.
- Fail CI on new console errors, hydration errors, framework overlays, and serious accessibility violations.

### Acceptance criteria

- Core workflows meet WCAG 2.2 AA requirements agreed for the project.
- Keyboard-only users can finish a quiz and review results.
- Automated tests cover authenticated and unauthenticated authorization boundaries.
- CI produces actionable failure output without exposing credentials.
- The team documents any accepted accessibility exception with an owner and review date.

## Suggested continuation order

Continue in the numbered order. Feature 2 supplies explanation data used by the mistake notebook. Feature 3 establishes analytics queries that features 5 and 9 can reuse. Feature 7 should receive a focused pass after the larger learner workflows exist. Feature 10 closes the roadmap by adding broad regression coverage for the completed platform.

## Resume prompt

Use this prompt in a future session:

> Open `FEATURE_ROADMAP.md`, inspect the current repository state, and implement the next incomplete feature only. Verify it according to the working agreement, update this roadmap with completion notes, and stop before beginning the following feature.
