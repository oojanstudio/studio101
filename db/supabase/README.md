# Supabase Schema Setup

This folder contains SQL for hosted Supabase setup.

## Files

- `init.sql`: creates `public.users`, `public.documents`, indexes, and RLS policies.

## Option A: Run in Supabase Dashboard (recommended)

1. Open your project in Supabase.
2. Go to SQL Editor.
3. Create a new query.
4. Paste contents of `db/supabase/init.sql`.
5. Run it once.

## Option B: Run via psql

1. Get connection string from Supabase Dashboard -> Project Settings -> Database.
2. Run from repo root:

```bash
psql "postgresql://<user>:<password>@<host>:5432/postgres?sslmode=require" -f db/supabase/init.sql
```

## Verify

Run in SQL Editor:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('users', 'documents');

select * from public.users limit 5;
select * from public.documents limit 5;
```
