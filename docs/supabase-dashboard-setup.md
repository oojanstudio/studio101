# Supabase dashboard steps

The SQL in [db/supabase/init.sql](/Users/avikpaul/github-oojanstudio/studio101/db/supabase/init.sql) only creates the baseline schema and RLS policies. The hosted project still needs dashboard configuration before the app routes will work.

1. Create a Supabase project and copy `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` into the local `.env` file.
2. In Authentication -> URL Configuration, add these values:
   Site URL: `http://localhost:5173`
   Redirect URLs: `http://localhost:5173/auth/callback`, your production app URL, and its `/auth/callback` route.
3. In Authentication -> Providers, enable Google and paste the Google OAuth client ID and secret. Set the authorized redirect URI in Google Cloud to `https://<project-ref>.supabase.co/auth/v1/callback`.
4. In Authentication -> Email, keep magic link enabled. If you customize templates later, preserve the `{{ .ConfirmationURL }}` placeholder because the login route depends on the callback flow.
5. Run [db/supabase/init.sql](/Users/avikpaul/github-oojanstudio/studio101/db/supabase/init.sql) in SQL Editor.
6. Create two storage buckets in Storage:
   `template-media`: public read, write restricted to service jobs or trusted admin paths.
   `user-media`: private bucket with signed URL access and owner-scoped policies.
7. Add storage RLS policies after bucket creation so template assets stay curated while user uploads remain per-user isolated.
8. Seed at least one user through Auth so the `public.users` profile row can be inserted after first login.
9. Confirm thumbnail schema support exists after running SQL:
   `public.doc_thumbnails` with `sequence_number` and unique `(document_id, sequence_number)`.
10. Keep thumbnail files in the same `user-media` bucket under:
   `{owner_id}/{document_id}/thumbnails/{thumbnail_uuid}/{file_name}`
   and keep object ownership policy owner-scoped as already configured for `user-media`.

Recommended next SQL additions:

1. Add a trigger to mirror new `auth.users` records into `public.users`.
2. Add a `document_assets` table once the editor starts persisting media references.
3. Add storage policies tied to `auth.uid()` for the `user-media` bucket.
4. Add a helper function or trigger later if you want automatic sequence compaction after deletes in `doc_thumbnails`.
