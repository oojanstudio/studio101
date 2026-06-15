# studio101

SvelteKit + Supabase bootstrap for a browser-based design editor. The scaffold separates lightweight app pages from the heavier future editor integration surface while keeping auth, document routes, tests, and Storybook ready from the start.

## Stack

- SvelteKit with Svelte 5
- Supabase auth and data access
- Adapter Node for server deployment
- Vitest + Testing Library
- Storybook for component previews

## Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm preview`
- `pnpm check`
- `pnpm test`
- `pnpm storybook`

## Source layout

- `src/routes`: app routes and server handlers
- `src/lib/components`: shared UI, marketing shells, editor host components
- `src/lib/features`: domain-specific dashboard and editor helpers
- `src/lib/integrations`: Supabase clients and external service boundaries
- `src/workers`, `src/iframes`, `src/wasm`: reserved boundaries for the future editor runtime pieces

## Supabase setup

1. Copy `.env.example` to `.env` and fill in project values.
2. Run [db/supabase/init.sql](/Users/avikpaul/github-oojanstudio/studio101/db/supabase/init.sql).
3. Follow [docs/supabase-dashboard-setup.md](/Users/avikpaul/github-oojanstudio/studio101/docs/supabase-dashboard-setup.md).

## Open point

The actual rich editor implementation is intentionally left behind a host boundary in the `/editor/[documentId]` route until the existing editor repo or package source is provided.# studio101
Main web app for studio backend and frontend
