/// <reference types="vitest/config" />
import path from 'node:path';
// 
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

const studioFeComponentsRoot = path.resolve('/Users/avikpaul/github-oojanstudio/studio-fe-components/src/lib');
const studioFeComponentsStyles = path.resolve('/Users/avikpaul/github-oojanstudio/studio-fe-components/dist/styles');

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      'studio-fe-components': studioFeComponentsRoot,
      '$studioFeStyles': studioFeComponentsStyles
    }
  },
  server: {
    fs: {
      allow: ['/Users/avikpaul/github-oojanstudio/studio101', '/Users/avikpaul/github-oojanstudio/studio-fe-components']
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,js}']
  }
});