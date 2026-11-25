-- 言翼 Tsubasa · Supabase 免费云同步与内测反馈数据库表结构
-- 使用方法：打开 Supabase 控制台 -> SQL Editor -> New query -> 粘贴全部内容并点击 Run

-- 1. 用户学习进度表（每位用户只能读写自己的进度）
create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress_json jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

drop policy if exists "Users can read own progress" on public.user_progress;
create policy "Users can read own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

drop policy if exists "Users can upsert own progress" on public.user_progress;
create policy "Users can upsert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own progress" on public.user_progress;
create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

-- 2. 朋友内测反馈表（允许任何访问者匿名提交反馈，仅项目管理员在后台查看）
create table if not exists public.beta_feedback (
  id bigint generated always as identity primary key,
  category text not null,
  rating smallint check (rating between 1 and 5),
  tester_name text,
  message text not null,
  context_page text,
  device_info text,
  created_at timestamptz not null default now()
);

alter table public.beta_feedback enable row level security;

drop policy if exists "Anyone can submit beta feedback" on public.beta_feedback;
create policy "Anyone can submit beta feedback"
  on public.beta_feedback for insert
  with check (true);
