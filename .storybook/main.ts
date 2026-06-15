import { defineMain } from '@storybook/sveltekit/node';

export default defineMain({
  stories: ['../src/**/*.stories.@(ts|js|svelte)'],
  framework: {
    name: '@storybook/sveltekit',
    options: {}
  }
});