-- Workouts: where each lifter's log is kept, in the same Supabase project as Xenon (same accounts).
-- Paste this once into the project's SQL Editor and press Run. It adds one table and touches nothing of Xenon's.
-- Running it again is safe.

create table if not exists public.workouts (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint workouts_data_size check (octet_length(data::text) < 2000000)
);

alter table public.workouts enable row level security;

-- A lifter can read and write their own row, and nobody else's.
drop policy if exists "own workouts only" on public.workouts;
create policy "own workouts only" on public.workouts
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

grant select, insert, update, delete on public.workouts to authenticated;
