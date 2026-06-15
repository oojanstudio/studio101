import nodeAdapter from '@sveltejs/adapter-node';
import vercelAdapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const isProductionBuild = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: isProductionBuild ? vercelAdapter({ runtime: 'nodejs22.x' }) : nodeAdapter(),
    alias: {
      '$components': 'src/lib/components',
      '$config': 'src/lib/config',
      '$features': 'src/lib/features',
      '$integrations': 'src/lib/integrations',
      '$styles': 'src/lib/styles',
      'studio-fe-components': '../studio-fe-components/src/lib',
      '$studioFeStyles': '../studio-fe-components/dist/styles'
    }
  }
};

export default config;
