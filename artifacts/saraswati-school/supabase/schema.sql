-- Saraswati School content management schema
-- Run this in the Supabase SQL editor, then add approved users in
-- Authentication > Users and insert their roles into public.staff_roles.

create extension if not exists "pgcrypto";

create table if not exists public.staff_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('principal', 'admin')),
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  label text not null default 'School life',
  text text not null default '',
  storage_path text not null,
  public_url text not null default '',
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.disclosure_documents (
  id uuid primary key default gen_random_uuid(),
  section_code text not null check (section_code in ('B', 'C')),
  title text not null,
  storage_path text not null,
  public_url text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists photos_public_sort_idx on public.photos (published, sort_order, created_at desc);
create index if not exists notices_public_date_idx on public.notices (published, published_at desc, created_at desc);
create index if not exists disclosure_public_section_idx on public.disclosure_documents (published, section_code, title);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists photos_set_updated_at on public.photos;
create trigger photos_set_updated_at before update on public.photos
for each row execute function public.set_updated_at();

drop trigger if exists notices_set_updated_at on public.notices;
create trigger notices_set_updated_at before update on public.notices
for each row execute function public.set_updated_at();

drop trigger if exists disclosure_documents_set_updated_at on public.disclosure_documents;
create trigger disclosure_documents_set_updated_at before update on public.disclosure_documents
for each row execute function public.set_updated_at();

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.staff_roles
    where user_id = auth.uid()
      and role in ('principal', 'admin')
  );
$$;

create or replace function public.is_published_photo(object_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.photos
    where storage_path = object_name
      and published = true
  );
$$;

create or replace function public.is_published_document(object_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.disclosure_documents
    where storage_path = object_name
      and published = true
  );
$$;

alter table public.staff_roles enable row level security;
alter table public.photos enable row level security;
alter table public.notices enable row level security;
alter table public.disclosure_documents enable row level security;

drop policy if exists "staff can view own role" on public.staff_roles;
create policy "staff can view own role" on public.staff_roles
for select to authenticated using (user_id = auth.uid());

drop policy if exists "public can view published photos" on public.photos;
create policy "public can view published photos" on public.photos
for select to anon, authenticated using (published = true);

drop policy if exists "staff can manage photos" on public.photos;
create policy "staff can manage photos" on public.photos
for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "public can view published notices" on public.notices;
create policy "public can view published notices" on public.notices
for select to anon, authenticated using (published = true);

drop policy if exists "staff can manage notices" on public.notices;
create policy "staff can manage notices" on public.notices
for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "public can view published disclosure documents" on public.disclosure_documents;
create policy "public can view published disclosure documents" on public.disclosure_documents
for select to anon, authenticated using (published = true);

drop policy if exists "staff can manage disclosure documents" on public.disclosure_documents;
create policy "staff can manage disclosure documents" on public.disclosure_documents
for all to authenticated using (public.is_staff()) with check (public.is_staff());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('school-photos', 'school-photos', false, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('school-documents', 'school-documents', false, 15728640, array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public can read school photos" on storage.objects;
create policy "public can read school photos" on storage.objects
for select to public using (
  bucket_id = 'school-photos'
  and (public.is_published_photo(name) or public.is_staff())
);

drop policy if exists "staff can manage school photos" on storage.objects;
create policy "staff can manage school photos" on storage.objects
for all to authenticated
using (bucket_id = 'school-photos' and public.is_staff())
with check (bucket_id = 'school-photos' and public.is_staff());

drop policy if exists "public can read school documents" on storage.objects;
create policy "public can read school documents" on storage.objects
for select to public using (
  bucket_id = 'school-documents'
  and (public.is_published_document(name) or public.is_staff())
);

drop policy if exists "staff can manage school documents" on storage.objects;
create policy "staff can manage school documents" on storage.objects
for all to authenticated
using (bucket_id = 'school-documents' and public.is_staff())
with check (bucket_id = 'school-documents' and public.is_staff());