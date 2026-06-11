-- ============================================================
-- CareerCraft AI — Supabase Database Schema
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

create extension if not exists "uuid-ossp";

-- ── PROFILES ──────────────────────────────────────────────
create table if not exists public.profiles (
  id                      uuid references auth.users(id) on delete cascade primary key,
  email                   text,
  full_name               text,
  plan                    text not null default 'free',      -- 'free' | 'pro' | 'premium'
  docs_used               integer not null default 0,        -- generations this billing period
  docs_limit              integer not null default 2,        -- 2=free, 999=pro/premium
  paddle_customer_id      text,
  paddle_subscription_id  text,
  subscription_status     text default 'inactive',
  subscription_end_date   timestamptz,
  job_title               text,    -- stored for personalisation
  industry                text,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── CAREER_DOCS ───────────────────────────────────────────
create table if not exists public.career_docs (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references public.profiles(id) on delete cascade not null,
  tool          text not null,   -- 'resume' | 'cover_letter' | 'linkedin' | 'interview'
  title         text not null,
  job_title     text,
  company       text,
  word_count    integer,
  ats_score     integer,         -- 0-100 ATS compatibility score
  is_watermarked boolean default true,
  created_at    timestamptz default now()
);

alter table public.career_docs enable row level security;

create policy "Users can view own docs"
  on public.career_docs for select using (auth.uid() = user_id);

create policy "Users can insert own docs"
  on public.career_docs for insert with check (auth.uid() = user_id);

-- ── SUBSCRIPTION UPDATE FUNCTION ──────────────────────────
create or replace function public.update_subscription(
  p_user_id              uuid,
  p_plan                 text,
  p_paddle_customer_id   text,
  p_paddle_sub_id        text,
  p_status               text,
  p_end_date             timestamptz
)
returns void as $$
begin
  update public.profiles set
    plan                    = p_plan,
    docs_limit              = case when p_plan = 'free' then 2 else 999 end,
    paddle_customer_id      = p_paddle_customer_id,
    paddle_subscription_id  = p_paddle_sub_id,
    subscription_status     = p_status,
    subscription_end_date   = p_end_date,
    updated_at              = now()
  where id = p_user_id;
end;
$$ language plpgsql security definer;

grant execute on function public.update_subscription to service_role;

-- ── INDEXES ───────────────────────────────────────────────
create index if not exists career_docs_user_id_idx  on public.career_docs(user_id);
create index if not exists career_docs_created_idx  on public.career_docs(created_at desc);
create index if not exists career_docs_tool_idx     on public.career_docs(tool);
