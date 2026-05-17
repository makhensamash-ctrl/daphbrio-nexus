
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "user_roles readable by self" on public.user_roles
  for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "admins manage user_roles" on public.user_roles
  for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null default 'News',
  summary text not null default '',
  body text not null default '',
  cover_url text,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.news_posts enable row level security;
create policy "news public read" on public.news_posts for select using (true);
create policy "news admin write" on public.news_posts for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'IT Cabling',
  image_url text not null,
  caption text default '',
  created_at timestamptz not null default now()
);
alter table public.gallery_items enable row level security;
create policy "gallery public read" on public.gallery_items for select using (true);
create policy "gallery admin write" on public.gallery_items for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger news_posts_updated before update on public.news_posts
  for each row execute function public.tg_set_updated_at();
