-- Quiz attempt rows are score records, not learner-editable profile data.
-- Authenticated clients may read their own attempts through RLS, but writes
-- must go through the trusted server route and service-role RPC so learners
-- cannot forge scores or pollute progress analytics.

drop policy if exists "Learners can create their own attempts" on public.attempts;
drop policy if exists "Learners can update their own attempts" on public.attempts;

drop policy if exists "Attempt answers are writable by owner or admin" on public.attempt_answers;

-- Keep answer review tables admin-only. The submission route returns the
-- appropriate answer review after server-side scoring.
drop policy if exists "Answer keys are hidden from learners" on public.question_answer_keys;
create policy "Answer keys are hidden from learners"
on public.question_answer_keys
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Explanations are hidden from learners" on public.question_explanations;
create policy "Explanations are hidden from learners"
on public.question_explanations
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
