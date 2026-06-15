# Vercel Deployment

This app keeps both SvelteKit adapters installed:

- `@sveltejs/adapter-node` for local development.
- `@sveltejs/adapter-vercel` for production and Vercel builds.

`svelte.config.js` selects the Vercel adapter when `NODE_ENV=production` or `VERCEL=1`; otherwise it uses the Node adapter. The Vercel adapter is pinned to the `nodejs22.x` runtime so local builds do not depend on the Node version used by the developer machine.

## Prerequisites

1. A Vercel account connected to the Git provider that hosts this repo.
2. A Supabase project with the schema from `db/supabase/init.sql`.
3. Supabase auth redirect URLs configured for the Vercel domain.

## Environment Variables

Add these variables in Vercel Project Settings > Environment Variables:

```text
PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

Set them for Production, Preview, and Development environments as needed.

Do not expose `SUPABASE_SERVICE_ROLE_KEY` in browser code. It must remain server-only.

## Vercel Project Settings

Use these settings when importing the project:

```text
Framework Preset: SvelteKit
Install Command: pnpm install
Build Command: pnpm build
Output Directory: .vercel/output
Node.js Version: 22.x
```

Vercel sets `VERCEL=1` during deployment, so the SvelteKit Vercel adapter will be selected automatically.

## Manual Deploy Steps

1. Commit the deployment changes:

   ```sh
   git add package.json pnpm-lock.yaml svelte.config.js docs/vercel-deploy.md
   git commit -m "Configure Vercel deployment"
   ```

2. Push the branch to the remote Git provider:

   ```sh
   git push
   ```

3. In Vercel, create a new project from the repository.

4. Confirm the project settings listed above.

5. Add the Supabase environment variables.

6. Deploy.

7. After the first deploy, add the deployed URL to Supabase:

   ```text
   Site URL: https://YOUR_VERCEL_DOMAIN
   Redirect URLs:
   https://YOUR_VERCEL_DOMAIN/auth/callback
   https://YOUR_VERCEL_DOMAIN/**
   ```

8. Trigger a redeploy after changing Supabase auth settings.

## Local Verification

Run these before deploying:

```sh
pnpm check
pnpm test
pnpm build
```

`pnpm dev` continues to use the Node adapter path. `pnpm build` runs in production mode and uses the Vercel adapter with the `nodejs22.x` runtime.
