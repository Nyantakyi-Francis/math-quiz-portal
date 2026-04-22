create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  full_name text,
  phone text,
  role text not null default 'learner' check (role in ('learner', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  difficulty text not null check (difficulty in ('Intermediate', 'Hard')),
  question_count integer not null default 0,
  topic_order integer not null unique,
  is_published boolean not null default true,
  legacy_data_path text,
  legacy_quiz_path text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  prompt text not null,
  explanation text,
  points integer not null default 1,
  order_index integer not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  unique (module_id, order_index)
);

create table if not exists public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  option_text text not null,
  order_index integer not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (question_id, order_index)
);

create table if not exists public.question_answer_keys (
  question_id uuid primary key references public.questions (id) on delete cascade,
  correct_option_id uuid not null references public.question_options (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.profiles (id) on delete cascade,
  module_id uuid not null references public.modules (id) on delete cascade,
  score_raw integer not null default 0,
  score_total integer not null default 0,
  score_percent numeric(5, 2) not null default 0,
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.attempts (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  selected_option_id uuid references public.question_options (id) on delete set null,
  is_correct boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  unique (attempt_id, question_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references public.profiles (id) on delete set null,
  subject text not null,
  body text not null,
  message_type text not null default 'system' check (message_type in ('system', 'score', 'admin', 'announcement')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.message_recipients (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages (id) on delete cascade,
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  unique (message_id, recipient_id)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = nullif(excluded.full_name, ''),
      updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.update_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.update_timestamp();

create or replace function public.is_admin(check_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = check_user_id
      and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.modules enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.question_answer_keys enable row level security;
alter table public.attempts enable row level security;
alter table public.attempt_answers enable row level security;
alter table public.messages enable row level security;
alter table public.message_recipients enable row level security;

drop policy if exists "Profiles are readable by owner or admin" on public.profiles;
create policy "Profiles are readable by owner or admin"
on public.profiles
for select
to authenticated
using (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "Profiles are writable by owner or admin" on public.profiles;
create policy "Profiles are writable by owner or admin"
on public.profiles
for update
to authenticated
using (auth.uid() = id or public.is_admin(auth.uid()))
with check (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "Profiles can be inserted by service role" on public.profiles;
create policy "Profiles can be inserted by service role"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "Published modules are readable to authenticated users" on public.modules;
create policy "Published modules are readable to authenticated users"
on public.modules
for select
to authenticated
using (is_published or public.is_admin(auth.uid()));

drop policy if exists "Only admins manage modules" on public.modules;
create policy "Only admins manage modules"
on public.modules
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Questions are readable to authenticated users" on public.questions;
create policy "Questions are readable to authenticated users"
on public.questions
for select
to authenticated
using (
  exists (
    select 1
    from public.modules
    where public.modules.id = public.questions.module_id
      and (public.modules.is_published or public.is_admin(auth.uid()))
  )
);

drop policy if exists "Only admins manage questions" on public.questions;
create policy "Only admins manage questions"
on public.questions
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Options are readable to authenticated users" on public.question_options;
create policy "Options are readable to authenticated users"
on public.question_options
for select
to authenticated
using (
  exists (
    select 1
    from public.questions
    join public.modules on public.modules.id = public.questions.module_id
    where public.questions.id = public.question_options.question_id
      and (public.modules.is_published or public.is_admin(auth.uid()))
  )
);

drop policy if exists "Only admins manage options" on public.question_options;
create policy "Only admins manage options"
on public.question_options
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Answer keys are hidden from learners" on public.question_answer_keys;
create policy "Answer keys are hidden from learners"
on public.question_answer_keys
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Learners can read their own attempts" on public.attempts;
create policy "Learners can read their own attempts"
on public.attempts
for select
to authenticated
using (auth.uid() = learner_id or public.is_admin(auth.uid()));

drop policy if exists "Learners can create their own attempts" on public.attempts;
create policy "Learners can create their own attempts"
on public.attempts
for insert
to authenticated
with check (auth.uid() = learner_id or public.is_admin(auth.uid()));

drop policy if exists "Learners can update their own attempts" on public.attempts;
create policy "Learners can update their own attempts"
on public.attempts
for update
to authenticated
using (auth.uid() = learner_id or public.is_admin(auth.uid()))
with check (auth.uid() = learner_id or public.is_admin(auth.uid()));

drop policy if exists "Attempt answers are readable by owner or admin" on public.attempt_answers;
create policy "Attempt answers are readable by owner or admin"
on public.attempt_answers
for select
to authenticated
using (
  exists (
    select 1
    from public.attempts
    where public.attempts.id = public.attempt_answers.attempt_id
      and (public.attempts.learner_id = auth.uid() or public.is_admin(auth.uid()))
  )
);

drop policy if exists "Attempt answers are writable by owner or admin" on public.attempt_answers;
create policy "Attempt answers are writable by owner or admin"
on public.attempt_answers
for all
to authenticated
using (
  exists (
    select 1
    from public.attempts
    where public.attempts.id = public.attempt_answers.attempt_id
      and (public.attempts.learner_id = auth.uid() or public.is_admin(auth.uid()))
  )
)
with check (
  exists (
    select 1
    from public.attempts
    where public.attempts.id = public.attempt_answers.attempt_id
      and (public.attempts.learner_id = auth.uid() or public.is_admin(auth.uid()))
  )
);

drop policy if exists "Messages are readable by admins or senders" on public.messages;
create policy "Messages are readable by admins or senders"
on public.messages
for select
to authenticated
using (public.is_admin(auth.uid()) or sender_id = auth.uid());

drop policy if exists "Messages are writable by admins" on public.messages;
create policy "Messages are writable by admins"
on public.messages
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Recipients can read their own message links" on public.message_recipients;
create policy "Recipients can read their own message links"
on public.message_recipients
for select
to authenticated
using (recipient_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "Admins manage recipients" on public.message_recipients;
create policy "Admins manage recipients"
on public.message_recipients
for all
to authenticated
using (recipient_id = auth.uid() or public.is_admin(auth.uid()))
with check (recipient_id = auth.uid() or public.is_admin(auth.uid()));
