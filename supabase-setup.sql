-- Run this in Supabase → SQL Editor

create table if not exists prompts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  prompt      text not null,
  tags        text[] default '{}',
  genre       text,
  mood        text,
  bpm         integer,
  is_favorite boolean default false,
  image       text,
  created_at  timestamptz default now()
);

-- Allow full public access (personal app, no auth needed)
alter table prompts enable row level security;

create policy "Public full access"
  on prompts for all
  to anon
  using (true)
  with check (true);
