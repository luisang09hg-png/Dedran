-- Dedran Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor → New query)

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Profiles table
create table if not exists public.profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  full_name text not null,
  title text default '',
  location text default '',
  bio text default '',
  avatar_url text default 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format',
  banner_url text default 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=300&fit=crop&auto=format',
  connections_count int default 0,
  profile_views int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Posts table
create table if not exists public.posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references auth.users(id) on delete cascade not null,
  type text default 'regular' check (type in ('regular', 'temporary')),
  content text not null,
  image_url text,
  likes_count int default 0,
  comments_count int default 0,
  shares_count int default 0,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- Courses table
create table if not exists public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  instructor text not null,
  category text not null,
  level text not null,
  duration text not null,
  enrolled_count int default 0,
  rating numeric(2,1) default 0,
  reviews_count int default 0,
  thumbnail_url text default '',
  price text default 'Free',
  tags text[] default '{}',
  created_at timestamptz default now()
);

-- Course enrollments table
create table if not exists public.course_enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  progress int default 0,
  enrolled_at timestamptz default now(),
  unique(user_id, course_id)
);

-- Applications table
create table if not exists public.applications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  company text not null,
  role text not null,
  location text default '',
  type text default 'Full-time',
  salary text default '',
  status text default 'Applied',
  recruiter text,
  next_action text,
  applied_date timestamptz default now(),
  created_at timestamptz default now()
);

-- Payments table
create table if not exists public.payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  provider text not null check (provider in ('stripe', 'paypal')),
  provider_payment_id text not null,
  amount numeric(10,2) not null,
  currency text default 'EUR',
  status text not null,
  description text,
  created_at timestamptz default now()
);

-- Saved posts table
create table if not exists public.saved_posts (
  user_id uuid references auth.users(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  saved_at timestamptz default now(),
  primary key (user_id, post_id)
);

-- Post likes table
create table if not exists public.post_likes (
  user_id uuid references auth.users(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  liked_at timestamptz default now(),
  primary key (user_id, post_id)
);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.courses enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.applications enable row level security;
alter table public.payments enable row level security;
alter table public.saved_posts enable row level security;
alter table public.post_likes enable row level security;

-- Profiles: users can read all profiles, update only their own
create policy "Profiles: public read" on public.profiles for select using (true);
create policy "Profiles: own update" on public.profiles for update using (auth.uid() = user_id);
create policy "Profiles: own insert" on public.profiles for insert with check (auth.uid() = user_id);

-- Posts: everyone can read, authors can CRUD their own
create policy "Posts: public read" on public.posts for select using (true);
create policy "Posts: own insert" on public.posts for insert with check (auth.uid() = author_id);
create policy "Posts: own update" on public.posts for update using (auth.uid() = author_id);
create policy "Posts: own delete" on public.posts for delete using (auth.uid() = author_id);

-- Courses: everyone can read, only service role can insert/update
create policy "Courses: public read" on public.courses for select using (true);

-- Course enrollments: users manage their own
create policy "Enrollments: own read" on public.course_enrollments for select using (auth.uid() = user_id);
create policy "Enrollments: own insert" on public.course_enrollments for insert with check (auth.uid() = user_id);
create policy "Enrollments: own update" on public.course_enrollments for update using (auth.uid() = user_id);

-- Applications: users manage their own
create policy "Applications: own read" on public.applications for select using (auth.uid() = user_id);
create policy "Applications: own insert" on public.applications for insert with check (auth.uid() = user_id);
create policy "Applications: own update" on public.applications for update using (auth.uid() = user_id);
create policy "Applications: own delete" on public.applications for delete using (auth.uid() = user_id);

-- Payments: users can only see their own
create policy "Payments: own read" on public.payments for select using (auth.uid() = user_id);
create policy "Payments: own insert" on public.payments for insert with check (auth.uid() = user_id);

-- Saved posts: users manage their own
create policy "Saved posts: own read" on public.saved_posts for select using (auth.uid() = user_id);
create policy "Saved posts: own insert" on public.saved_posts for insert with check (auth.uid() = user_id);
create policy "Saved posts: own delete" on public.saved_posts for delete using (auth.uid() = user_id);

-- Post likes: users manage their own
create policy "Likes: own read" on public.post_likes for select using (auth.uid() = user_id);
create policy "Likes: own insert" on public.post_likes for insert with check (auth.uid() = user_id);
create policy "Likes: own delete" on public.post_likes for delete using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
