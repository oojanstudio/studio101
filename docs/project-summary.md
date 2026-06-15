# Project Summary: studio101

## Purpose

studio101 is a SvelteKit web app for a browser-based design editor. The current codebase provides the product shell, authentication, dashboard, document persistence, media storage, thumbnail handling, and a JSON payload editor. The richer canvas/editor runtime is intentionally kept behind the `/editor/[documentId]` route boundary for future integration.

## Product Surface

- Landing page: marketing-oriented home page with section-based content for design creation, editing, collaboration, and export positioning.
- Authentication: Supabase Auth login via email magic link and Google OAuth.
- Dashboard: authenticated document list, thumbnail previews, and document creation.
- Editor route: authenticated document workspace for viewing metadata, editing raw document JSON, uploading media, uploading ordered thumbnails, and deleting uploaded media.
- About, error, logout, and auth callback routes round out the app shell.

## Technical Stack

- Framework: SvelteKit with Svelte 5.
- Runtime/build: Vite, TypeScript, `@sveltejs/adapter-node`.
- Backend services: Supabase Auth, Postgres, Row Level Security, and Storage.
- UI: local Svelte components plus `studio-fe-components` from `../studio-fe-components`.
- Tests/tooling: Vitest, Testing Library, Svelte Check, Storybook.
- Package manager: pnpm.

## Main Commands

- `pnpm dev`: run the Vite dev server.
- `pnpm build`: build the SvelteKit app.
- `pnpm preview`: preview the production build.
- `pnpm check`: sync SvelteKit and run `svelte-check`.
- `pnpm test`: run Vitest.
- `pnpm storybook`: run Storybook on port 6006.

## Source Layout

- `src/routes`: SvelteKit routes, server loads, and form actions.
- `src/apps`: landing page and layout-specific app components.
- `src/lib/components`: shared UI, marketing, and editor host components.
- `src/lib/features`: feature-specific UI such as the dashboard document list.
- `src/lib/integrations`: Supabase client boundaries.
- `src/lib/types`: shared domain types.
- `src/lib/styles`: global styles and design tokens.
- `db/supabase`: baseline SQL schema and Supabase setup notes.
- `docs`: project implementation notes and setup plans.
- `prompts`: prompt/reference material for implementation work.
- `static`: public images and static assets.

## Data Model

Supabase stores the core app data:

- `users`: profile row linked to `auth.users`.
- `documents`: user-owned design documents with `title`, optional `content`, and `doc_payload` JSON.
- `document_media`: image/video uploads attached to a document.
- `doc_thumbnails`: ordered screenshot thumbnails attached to a document.

All app tables use Row Level Security so users can only access rows where they are the owner. Media and thumbnails store metadata in Postgres and bytes in the private `user-media` storage bucket.

## Storage Model

- Bucket: `user-media`.
- Media path convention: `{owner_id}/{document_id}/{media_id}/{file_name}`.
- Thumbnail path convention: `{owner_id}/{document_id}/thumbnails/{thumbnail_id}/{file_name}`.
- Files are served through signed URLs, not public bucket access.
- Media uploads accept `image/*` and `video/*` up to 50 MB.
- Thumbnail uploads accept `image/*` up to 20 MB and support explicit or auto-incremented sequence numbers.

## Auth Flow

- Browser login uses `@supabase/ssr` through a cached browser client.
- Email login sends a magic link to `/auth/callback?next=/dashboard`.
- Google OAuth redirects through the same callback route.
- Server hooks create a per-request Supabase server client and expose `locals.safeGetSession()`.
- Protected dashboard and editor routes redirect anonymous users to `/login`.
- `/logout` signs out through Supabase and redirects to `/login`.

## Document Flow

1. A signed-in user opens `/dashboard`.
2. The dashboard loads the user's documents ordered by `updated_at`.
3. Creating a document inserts a starter `doc_payload` with a 512 by 512 canvas and a red background rectangle.
4. The user is redirected to `/editor/[documentId]`.
5. The editor loads the document, related media, and thumbnails.
6. The user can update raw JSON payload data, upload media, upload thumbnails, or delete media.

## Current Implementation Notes

- The root layout currently returns `user: null`; the session lookup is present but commented out.
- The editor is currently a host/workspace surface around raw JSON, media, and thumbnails rather than a complete visual canvas editor.
- Dashboard thumbnail loading supports two strategies: fetching all thumbnails via `fetchAllThumbnails=true`, or fetching thumbnails for the visible document IDs.
- Existing Storybook stories cover selected UI components.
- Existing unit coverage is narrow and currently includes duration utility tests.

## Environment Requirements

Required public environment variables:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

Setup starts from `.env.example`, then the Supabase schema in `db/supabase/init.sql` should be applied and the private `user-media` bucket configured with owner-folder RLS policies.

## Open Work

- Integrate the full visual editor runtime behind `/editor/[documentId]`.
- Re-enable or finalize layout-level session propagation if global user state is needed.
- Expand tests around auth-gated routes, document creation, payload updates, media uploads, and thumbnail sequencing.
- Tighten generated type coverage for Supabase rows and payload schemas.
