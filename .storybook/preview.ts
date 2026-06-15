import type { Preview } from '@storybook/sveltekit';
import '../src/lib/styles/app.css';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen'
  }
};

export default preview;