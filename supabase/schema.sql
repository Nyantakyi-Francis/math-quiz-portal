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
  message_type text not null default 'system' check (message_type in ('system', 'score', 'admin', 'announcement', 'peer')),
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

create table if not exists public.directory_profiles (
  id uuid primary key references public.profiles (id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists directory_profiles_set_updated_at on public.directory_profiles;

create trigger directory_profiles_set_updated_at
before update on public.directory_profiles
for each row execute procedure public.update_timestamp();

create or replace function public.sync_directory_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role = 'learner' then
    insert into public.directory_profiles (id, display_name)
    values (new.id, coalesce(new.full_name, ''))
    on conflict (id) do update
    set display_name = excluded.display_name,
        updated_at = timezone('utc', now());
  else
    delete from public.directory_profiles where id = new.id;
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_sync_directory_profile on public.profiles;

create trigger profiles_sync_directory_profile
after insert or update of full_name, role on public.profiles
for each row execute procedure public.sync_directory_profile();

create or replace function public.prevent_non_admin_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.role is distinct from new.role
    and auth.uid() is not null
    and not public.is_admin(auth.uid())
  then
    raise exception 'ROLE_CHANGE_REQUIRES_ADMIN';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_prevent_non_admin_role_change on public.profiles;

create trigger profiles_prevent_non_admin_role_change
before update on public.profiles
for each row execute procedure public.prevent_non_admin_role_change();

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

create or replace function public.submit_quiz_attempt(
  p_learner_id uuid,
  p_module_slug text,
  p_answers jsonb
)
returns table (
  attempt_id uuid,
  score_raw integer,
  score_total integer,
  score_percent numeric,
  breakdown jsonb,
  module_title text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_module_id uuid;
  v_module_title text;
  v_attempt_id uuid;
  v_score_raw integer;
  v_score_total integer;
  v_score_percent numeric;
begin
  select modules.id, modules.title
  into v_module_id, v_module_title
  from public.modules
  where modules.slug = p_module_slug;

  if v_module_id is null then
    raise exception 'MODULE_NOT_FOUND';
  end if;

  select count(*)
  into v_score_total
  from public.questions
  where questions.module_id = v_module_id;

  if v_score_total = 0 then
    raise exception 'QUESTION_BANK_EMPTY';
  end if;

  insert into public.attempts (
    learner_id,
    module_id,
    score_raw,
    score_total,
    score_percent,
    completed_at
  )
  values (
    p_learner_id,
    v_module_id,
    0,
    v_score_total,
    0,
    timezone('utc', now())
  )
  returning id into v_attempt_id;

  with submitted_answers as (
    select distinct on (answer ->> 'questionId')
      answer ->> 'questionId' as question_id,
      answer ->> 'selectedOptionId' as selected_option_id
    from jsonb_array_elements(coalesce(p_answers, '[]'::jsonb)) as answer
    where answer ? 'questionId'
    order by answer ->> 'questionId'
  )
  insert into public.attempt_answers (
    attempt_id,
    question_id,
    selected_option_id,
    is_correct
  )
  select
    v_attempt_id,
    questions.id,
    valid_options.id,
    valid_options.id is not null
      and valid_options.id = question_answer_keys.correct_option_id
  from public.questions
  left join submitted_answers
    on submitted_answers.question_id = questions.id::text
  left join public.question_options as valid_options
    on valid_options.id::text = submitted_answers.selected_option_id
    and valid_options.question_id = questions.id
  left join public.question_answer_keys
    on question_answer_keys.question_id = questions.id
  where questions.module_id = v_module_id
  order by questions.order_index;

  select count(*)
  into v_score_raw
  from public.attempt_answers
  where attempt_answers.attempt_id = v_attempt_id
    and attempt_answers.is_correct;

  v_score_percent := round((v_score_raw::numeric / v_score_total::numeric) * 100, 1);

  update public.attempts
  set
    score_raw = v_score_raw,
    score_total = v_score_total,
    score_percent = v_score_percent
  where attempts.id = v_attempt_id;

  return query
  select
    v_attempt_id,
    v_score_raw,
    v_score_total,
    v_score_percent,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'questionId', questions.id,
          'isCorrect', attempt_answers.is_correct
        )
        order by questions.order_index
      ),
      '[]'::jsonb
    ),
    v_module_title
  from public.questions
  join public.attempt_answers
    on attempt_answers.question_id = questions.id
    and attempt_answers.attempt_id = v_attempt_id
  where questions.module_id = v_module_id;
end;
$$;

revoke all on function public.submit_quiz_attempt(uuid, text, jsonb) from public;
revoke all on function public.submit_quiz_attempt(uuid, text, jsonb) from anon;
revoke all on function public.submit_quiz_attempt(uuid, text, jsonb) from authenticated;
grant execute on function public.submit_quiz_attempt(uuid, text, jsonb) to service_role;

alter table public.profiles enable row level security;
alter table public.modules enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.question_answer_keys enable row level security;
alter table public.attempts enable row level security;
alter table public.attempt_answers enable row level security;
alter table public.messages enable row level security;
alter table public.message_recipients enable row level security;
alter table public.directory_profiles enable row level security;

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
drop policy if exists "Messages are readable by admins senders or recipients" on public.messages;
create policy "Messages are readable by admins senders or recipients"
on public.messages
for select
to authenticated
using (
  public.is_admin(auth.uid())
  or sender_id = auth.uid()
  or exists (
    select 1
    from public.message_recipients
    where public.message_recipients.message_id = public.messages.id
      and public.message_recipients.recipient_id = auth.uid()
  )
);

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

drop policy if exists "Senders can read message links" on public.message_recipients;
create policy "Senders can read message links"
on public.message_recipients
for select
to authenticated
using (
  exists (
    select 1
    from public.messages
    where public.messages.id = public.message_recipients.message_id
      and public.messages.sender_id = auth.uid()
  )
);

drop policy if exists "Admins manage recipients" on public.message_recipients;
create policy "Admins manage recipients"
on public.message_recipients
for all
to authenticated
using (recipient_id = auth.uid() or public.is_admin(auth.uid()))
with check (recipient_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "Directory is readable by authenticated users" on public.directory_profiles;
create policy "Directory is readable by authenticated users"
on public.directory_profiles
for select
to authenticated
using (auth.uid() is not null);

insert into public.directory_profiles (id, display_name)
select profiles.id, coalesce(profiles.full_name, '')
from public.profiles
where profiles.role = 'learner'
on conflict (id) do update
set display_name = excluded.display_name,
    updated_at = timezone('utc', now());

delete from public.directory_profiles
using public.profiles
where directory_profiles.id = profiles.id
  and profiles.role <> 'learner';
