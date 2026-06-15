-- Supabase baseline schema for this API
-- Run in Supabase SQL Editor after enabling pgcrypto extension.

create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  firstname text not null,
  lastname text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  title text,
  content text,
  doc_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_documents_owner_id on public.documents(owner_id);

alter table public.users enable row level security;
alter table public.documents enable row level security;

-- Users can read and update their own profile row.
drop policy if exists users_select_own on public.users;
create policy users_select_own on public.users for select using (auth.uid() = id);

drop policy if exists users_insert_own on public.users;
create policy users_insert_own on public.users for insert with check (auth.uid() = id);

drop policy if exists users_update_own on public.users;
create policy users_update_own
  on public.users
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Users can manage only their own documents.
drop policy if exists documents_select_own on public.documents;
create policy documents_select_own
  on public.documents
  for select
  using (owner_id = auth.uid());

drop policy if exists documents_insert_own on public.documents;
create policy documents_insert_own
  on public.documents
  for insert
  with check (owner_id = auth.uid());

drop policy if exists documents_update_own on public.documents;
create policy documents_update_own
  on public.documents for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists documents_delete_own on public.documents;
create policy documents_delete_own
  on public.documents
  for delete
  using (owner_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────────
-- document_media
-- Tracks every media file (image/video) a user uploads against a document.
-- The actual bytes live in the 'user-media' storage bucket.
-- Storage path convention:  {owner_id}/{document_id}/{media_id}/{file_name}
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.document_media (
  id          uuid        primary key default gen_random_uuid(),
  document_id uuid        not null references public.documents(id) on delete cascade,
  owner_id    uuid        not null references public.users(id)     on delete cascade,
  file_name   text        not null,
  mime_type   text        not null,
  size_bytes  bigint      not null,
  storage_path text       not null,  -- full object path inside the bucket
  created_at  timestamptz not null default now()
);

create index if not exists idx_document_media_document_id on public.document_media(document_id);
create index if not exists idx_document_media_owner_id    on public.document_media(owner_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- doc_thumbnails
-- Stores ordered screenshot thumbnails per document.
-- Bytes are stored in the same 'user-media' bucket using paths like:
--   {owner_id}/{document_id}/thumbnails/{thumbnail_uuid}/{file_name}
-- sequence_number is used by FE to present page order.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.doc_thumbnails (
  id              uuid        primary key default gen_random_uuid(),
  document_id     uuid        not null references public.documents(id) on delete cascade,
  owner_id        uuid        not null references public.users(id)     on delete cascade,
  sequence_number integer     not null check (sequence_number >= 1),
  file_name       text        not null,
  mime_type       text        not null,
  size_bytes      bigint      not null,
  storage_path    text        not null,
  created_at      timestamptz not null default now(),
  unique (document_id, sequence_number)
);

create index if not exists idx_doc_thumbnails_document_id
  on public.doc_thumbnails(document_id);
create index if not exists idx_doc_thumbnails_owner_id
  on public.doc_thumbnails(owner_id);
create index if not exists idx_doc_thumbnails_document_sequence
  on public.doc_thumbnails(document_id, sequence_number);

alter table public.document_media enable row level security;
alter table public.doc_thumbnails enable row level security;

drop policy if exists document_media_select_own on public.document_media;
create policy document_media_select_own
  on public.document_media for select
  using (owner_id = auth.uid());

drop policy if exists document_media_insert_own on public.document_media;
create policy document_media_insert_own
  on public.document_media for insert
  with check (
    owner_id = auth.uid()
    -- also verify the document belongs to the same user
    and exists (
      select 1 from public.documents d
      where d.id = document_id and d.owner_id = auth.uid()
    )
  );

drop policy if exists document_media_delete_own on public.document_media;
create policy document_media_delete_own
  on public.document_media for delete
  using (owner_id = auth.uid());

drop policy if exists doc_thumbnails_select_own on public.doc_thumbnails;
create policy doc_thumbnails_select_own
  on public.doc_thumbnails for select
  using (owner_id = auth.uid());

drop policy if exists doc_thumbnails_insert_own on public.doc_thumbnails;
create policy doc_thumbnails_insert_own
  on public.doc_thumbnails for insert
  with check (
    owner_id = auth.uid()
    and exists (
      select 1 from public.documents d
      where d.id = document_id and d.owner_id = auth.uid()
    )
  );

drop policy if exists doc_thumbnails_update_own on public.doc_thumbnails;
create policy doc_thumbnails_update_own
  on public.doc_thumbnails for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists doc_thumbnails_delete_own on public.doc_thumbnails;
create policy doc_thumbnails_delete_own
  on public.doc_thumbnails for delete
  using (owner_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────────
-- Storage bucket setup (run these steps in Supabase Dashboard > Storage)
-- ─────────────────────────────────────────────────────────────────────────────
--
-- 1. Create a bucket named exactly:  user-media
--    • Public bucket: NO  (private; files served via signed URLs)
--    • File size limit: set to your preference (e.g. 50 MB)
--    • Allowed MIME types: image/*, video/*
--
-- 2. Add the following storage RLS policies on the bucket objects
--    (Dashboard > Storage > user-media > Policies):
--
--    Policy: "Users can upload their own media"
--      Operation: INSERT
--      Expression:
--        (storage.foldername(name))[1] = auth.uid()::text
--
--    Policy: "Users can read their own media"
--      Operation: SELECT
--      Expression:
--        (storage.foldername(name))[1] = auth.uid()::text
--
--    Policy: "Users can delete their own media"
--      Operation: DELETE
--      Expression:
--        (storage.foldername(name))[1] = auth.uid()::text
--
-- 3. Thumbnail uploads use the same bucket and owner-folder policy:
--      {owner_id}/{document_id}/thumbnails/{thumbnail_uuid}/{file_name}
--    Keep thumbnail files as image/* and store order in
--    public.doc_thumbnails.sequence_number.
--
-- ─────────────────────────────────────────────────────────────────────────────
  