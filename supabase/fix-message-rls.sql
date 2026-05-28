create or replace function public.is_message_recipient(
  check_message_id uuid,
  check_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.message_recipients
    where message_id = check_message_id
      and recipient_id = check_user_id
  );
$$;

create or replace function public.is_message_sender(
  check_message_id uuid,
  check_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.messages
    where id = check_message_id
      and sender_id = check_user_id
  );
$$;

drop policy if exists "Messages are readable by admins or senders" on public.messages;
drop policy if exists "Messages are readable by admins senders or recipients" on public.messages;

create policy "Messages are readable by admins senders or recipients"
on public.messages
for select
to authenticated
using (
  public.is_admin(auth.uid())
  or sender_id = auth.uid()
  or public.is_message_recipient(public.messages.id, auth.uid())
);

drop policy if exists "Senders can read message links" on public.message_recipients;

create policy "Senders can read message links"
on public.message_recipients
for select
to authenticated
using (public.is_message_sender(public.message_recipients.message_id, auth.uid()));
