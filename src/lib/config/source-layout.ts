export const sourceLayout = [
  {
    title: 'Routes',
    description: 'SvelteKit pages and server handlers for marketing, auth, dashboard, and editor entry points.',
    paths: ['src/routes', 'src/routes/auth', 'src/routes/dashboard', 'src/routes/editor']
  },
  {
    title: 'Shared UI',
    description: 'Reusable primitives and branded sections shared across lightweight pages and stories.',
    paths: ['src/lib/components/ui', 'src/lib/components/marketing']
  },
  {
    title: 'Editor Surface',
    description: 'Dedicated host boundary for the future editor package, iframe pages, workers, and wasm assets.',
    paths: ['src/lib/components/editor', 'src/lib/features/editor', 'src/iframes', 'src/workers', 'src/wasm']
  },
  {
    title: 'Integrations',
    description: 'Supabase clients, typed models, and service helpers that should stay portable if split later.',
    paths: ['src/lib/integrations', 'src/lib/services', 'src/lib/types']
  }
] as const;