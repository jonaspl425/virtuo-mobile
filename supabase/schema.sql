create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  avatar_url text,
  level integer default 1,
  total_xp integer default 0,
  lifetime_xp integer default 0,
  streak_current integer default 0,
  streak_record integer default 0,
  total_speaking_seconds integer default 0,
  last_active_date date,
  created_at timestamptz default now()
);

create table if not exists public.islands (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  order_index integer not null,
  created_at timestamptz default now()
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  island_id uuid references public.islands(id) on delete cascade,
  title text not null,
  description text,
  instructions text,
  exercise_type text not null,
  skill_targets text[] default '{}',
  order_index integer not null,
  is_checkpoint boolean default false,
  checkpoint_pass_threshold numeric default 0.7,
  duration_target_seconds integer,
  created_at timestamptz default now()
);

create table if not exists public.user_exercise_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  exercise_id uuid references public.exercises(id) on delete cascade,
  completion_count integer default 0,
  best_grade numeric,
  last_grade numeric,
  glow_level integer default 0,
  is_favorited boolean default false,
  updated_at timestamptz default now(),
  unique(user_id, exercise_id)
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  started_at timestamptz default now(),
  ended_at timestamptz,
  xp_earned integer default 0
);

create table if not exists public.exercise_attempts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  exercise_id uuid references public.exercises(id) on delete cascade,
  generated_prompt text,
  recording_url text,
  transcript text,
  grade numeric,
  grade_breakdown jsonb,
  ai_feedback text,
  duration_seconds integer,
  xp_earned integer default 0,
  completed_at timestamptz default now()
);

create table if not exists public.daily_xp_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  date date not null,
  xp_earned integer default 0,
  daily_bonus_claimed boolean default false,
  unique(user_id, date)
);

create table if not exists public.banned_words (
  word text primary key
);

alter table public.profiles enable row level security;
alter table public.islands enable row level security;
alter table public.exercises enable row level security;
alter table public.user_exercise_progress enable row level security;
alter table public.sessions enable row level security;
alter table public.exercise_attempts enable row level security;
alter table public.daily_xp_log enable row level security;
alter table public.banned_words enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Anyone can view islands" on public.islands for select using (true);
create policy "Anyone can view exercises" on public.exercises for select using (true);
create policy "Users can view own progress" on public.user_exercise_progress for select using (auth.uid() = user_id);
create policy "Users can upsert own progress" on public.user_exercise_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can view own sessions" on public.sessions for select using (auth.uid() = user_id);
create policy "Users can create own sessions" on public.sessions for insert with check (auth.uid() = user_id);
create policy "Users can update own sessions" on public.sessions for update using (auth.uid() = user_id);
create policy "Users can view own attempts" on public.exercise_attempts for select using (auth.uid() = user_id);
create policy "Users can create own attempts" on public.exercise_attempts for insert with check (auth.uid() = user_id);
create policy "Users can view own daily xp" on public.daily_xp_log for select using (auth.uid() = user_id);
create policy "Users can upsert own daily xp" on public.daily_xp_log for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Authenticated users can read banned words" on public.banned_words for select using (auth.role() = 'authenticated');

create or replace function public.increment_xp(user_id uuid, amount integer)
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
  set
    total_xp = total_xp + amount,
    lifetime_xp = lifetime_xp + amount,
    level = floor((total_xp + amount) / 500) + 1
  where id = user_id;
$$;
