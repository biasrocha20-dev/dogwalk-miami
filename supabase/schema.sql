-- Miami Dog Walking Booking System — Phase 1 schema
-- Run against a Supabase Postgres project (SQL editor or `supabase db push`)

create extension if not exists "pgcrypto";

-- Miami service neighborhoods used for zoning/validation
create table if not exists neighborhoods (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  zip_codes text[] not null default '{}'
);

insert into neighborhoods (name, zip_codes) values
  ('Brickell', array['33129','33130','33131']),
  ('Wynwood', array['33127']),
  ('South Beach', array['33139']),
  ('Coral Gables', array['33134','33146']),
  ('Downtown Miami', array['33128','33132']),
  ('Coconut Grove', array['33133']),
  ('Little Havana', array['33135']),
  ('Doral', array['33166','33172','33178'])
on conflict (name) do nothing;

-- One row per authenticated user (mirrors auth.users), role-tagged
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('owner', 'walker', 'admin')),
  full_name text not null,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles (id) on delete cascade,
  name text not null,
  breed text,
  size text check (size in ('small', 'medium', 'large')),
  notes text,
  vaccination_status text check (vaccination_status in ('up_to_date', 'pending', 'unknown')) default 'unknown',
  created_at timestamptz not null default now()
);

create table if not exists walker_profiles (
  user_id uuid primary key references profiles (id) on delete cascade,
  bio text,
  photo_url text,
  rate_per_walk numeric(10, 2) not null default 25.00,
  active boolean not null default true,
  service_neighborhoods text[] not null default '{}', -- neighborhood names, see src/lib/neighborhoods.ts
  rating_avg numeric(3, 2) not null default 0,
  rating_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists availability (
  id uuid primary key default gen_random_uuid(),
  walker_id uuid not null references walker_profiles (user_id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6), -- 0 = Sunday
  start_time time not null,
  end_time time not null,
  constraint availability_time_order check (start_time < end_time)
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles (id) on delete cascade,
  walker_id uuid not null references walker_profiles (user_id),
  pet_id uuid not null references pets (id) on delete cascade,
  scheduled_at timestamptz not null,
  duration_minutes smallint not null check (duration_minutes in (20, 30, 60)),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  price numeric(10, 2) not null,
  recurring_rule text, -- e.g. 'weekly:mon,wed,fri' — null means one-time
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists walk_sessions (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references bookings (id) on delete cascade,
  start_time timestamptz,
  end_time timestamptz,
  gps_route jsonb, -- array of {lat, lng, ts}
  photo_urls text[] not null default '{}'
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references bookings (id) on delete cascade,
  stripe_payment_intent text,
  status text not null default 'unpaid'
    check (status in ('unpaid', 'held', 'released', 'refunded', 'failed')),
  payout_status text not null default 'pending'
    check (payout_status in ('pending', 'paid', 'failed')),
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings (id) on delete cascade,
  author_id uuid not null references profiles (id),
  direction text not null check (direction in ('owner_to_walker', 'walker_to_owner')),
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

-- Keep walker_profiles.rating_avg in sync
create or replace function refresh_walker_rating() returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  update walker_profiles wp
  set rating_avg = coalesce((
        select avg(r.rating) from reviews r
        join bookings b on b.id = r.booking_id
        where b.walker_id = wp.user_id and r.direction = 'owner_to_walker'
      ), 0),
      rating_count = coalesce((
        select count(*) from reviews r
        join bookings b on b.id = r.booking_id
        where b.walker_id = wp.user_id and r.direction = 'owner_to_walker'
      ), 0)
  where wp.user_id = (
    select b.walker_id from bookings b where b.id = new.booking_id
  );
  return new;
end;
$$;

drop trigger if exists trg_refresh_walker_rating on reviews;
create trigger trg_refresh_walker_rating
  after insert on reviews
  for each row execute function refresh_walker_rating();

-- Auto-create profiles/walker_profiles rows on signup, reading role/full_name
-- from auth.signUp's options.data. SECURITY DEFINER so it works even when no
-- session exists yet (e.g. email confirmation pending).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text := coalesce(new.raw_user_meta_data->>'role', 'owner');
  v_full_name text := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
begin
  insert into public.profiles (id, role, full_name)
  values (new.id, v_role, v_full_name)
  on conflict (id) do nothing;

  if v_role = 'walker' then
    insert into public.walker_profiles (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table neighborhoods enable row level security;
create policy "neighborhoods viewable by everyone" on neighborhoods for select using (true);

alter table profiles enable row level security;
alter table pets enable row level security;
alter table walker_profiles enable row level security;
alter table availability enable row level security;
alter table bookings enable row level security;
alter table walk_sessions enable row level security;
alter table payments enable row level security;
alter table reviews enable row level security;

create policy "profiles are viewable by everyone" on profiles for select using (true);
create policy "users manage own profile" on profiles for insert with check (auth.uid() = id);
create policy "users update own profile" on profiles for update using (auth.uid() = id);

create policy "owners manage own pets" on pets for all
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "walker profiles viewable by everyone" on walker_profiles for select using (true);
create policy "walkers manage own profile" on walker_profiles for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "availability viewable by everyone" on availability for select using (true);
create policy "walkers manage own availability" on availability for all
  using (auth.uid() = walker_id) with check (auth.uid() = walker_id);

create policy "participants view bookings" on bookings for select
  using (auth.uid() = owner_id or auth.uid() = walker_id);
create policy "owners create bookings" on bookings for insert
  with check (auth.uid() = owner_id);
create policy "participants update bookings" on bookings for update
  using (auth.uid() = owner_id or auth.uid() = walker_id);

create policy "participants view walk sessions" on walk_sessions for select
  using (exists (
    select 1 from bookings b where b.id = walk_sessions.booking_id
    and (auth.uid() = b.owner_id or auth.uid() = b.walker_id)
  ));
create policy "walker manages walk session" on walk_sessions for all
  using (exists (
    select 1 from bookings b where b.id = walk_sessions.booking_id and auth.uid() = b.walker_id
  ));

create policy "participants view payments" on payments for select
  using (exists (
    select 1 from bookings b where b.id = payments.booking_id
    and (auth.uid() = b.owner_id or auth.uid() = b.walker_id)
  ));

create policy "reviews viewable by everyone" on reviews for select using (true);
create policy "participants create reviews" on reviews for insert
  with check (auth.uid() = author_id and exists (
    select 1 from bookings b where b.id = reviews.booking_id
    and (auth.uid() = b.owner_id or auth.uid() = b.walker_id)
  ));
