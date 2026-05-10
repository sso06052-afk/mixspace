-- MixSpace Database Schema
-- Run this in Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- ─── Tracks ───────────────────────────────────────────────────────────────────
create table public.tracks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  original_filename text not null,
  duration_seconds float,
  file_size_bytes bigint,
  storage_path text not null,
  status text not null default 'uploaded'
    check (status in ('uploaded', 'analyzing', 'separating', 'ready', 'error')),
  error_message text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ─── Analysis Results ─────────────────────────────────────────────────────────
create table public.track_analysis (
  id uuid primary key default uuid_generate_v4(),
  track_id uuid references public.tracks(id) on delete cascade not null unique,
  bpm float,
  musical_key text,                  -- e.g. "C major"
  loudness_lufs float,
  stems_data jsonb,                  -- { version, windowSec, totalWindows, stems: {vocals,drums,bass,other} }
  masking_data jsonb,                -- [{ time, stemA, stemB, severity }]
  prescription text,                 -- Claude 자연어 처방
  analyzed_at timestamptz default now() not null
);

-- ─── Billing Events ───────────────────────────────────────────────────────────
create table public.billing_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  event_type text not null,
  amount float,
  currency text,
  lemon_squeezy_id text,
  raw_payload jsonb,
  created_at timestamptz default now() not null
);

-- ─── User Profiles ────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  plan text not null default 'free'
    check (plan in ('free', 'pro', 'studio')),
  free_uses_remaining int default 3,
  pro_until timestamptz,
  created_at timestamptz default now() not null
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tracks_updated_at
  before update on public.tracks
  for each row execute function update_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.tracks enable row level security;
alter table public.track_analysis enable row level security;
alter table public.profiles enable row level security;
alter table public.billing_events enable row level security;

create policy "users can crud own tracks"
  on public.tracks for all
  using (auth.uid() = user_id);

create policy "users can read own analysis"
  on public.track_analysis for all
  using (
    exists (
      select 1 from public.tracks
      where tracks.id = track_analysis.track_id
        and tracks.user_id = auth.uid()
    )
  );

create policy "users can read own profile"
  on public.profiles for all
  using (auth.uid() = id);

create policy "users can read own billing"
  on public.billing_events for select
  using (auth.uid() = user_id);

-- ─── Auto-delete tracks older than 30 days ───────────────────────────────────
-- Run as a Supabase scheduled function (pg_cron)
-- select cron.schedule('cleanup-old-tracks', '0 3 * * *',
--   $$delete from public.tracks where created_at < now() - interval '30 days'$$
-- );
