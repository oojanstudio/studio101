import InlineEditableTextField from './InlineEditableTextField.svelte';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  title: 'Dashboard/InlineEditableTextField',
  component: InlineEditableTextField,
  args: {
    text: 'Untitled design',
    ariaLabel: 'Edit document title',
    onEditText: (text) => text
  }
};

export const Default = {
  args: {
    text: 'My Design 01',
    onEditText: (text) => text
  }
};

export const InHeading = {
  render: (args) => ({
    Component: InlineEditableTextField,
    props: args
  }),
  args: {
    text: 'Homepage header exploration',
    onEditText: (text) => text
  },
  parameters: {
    docs: {
      description: {
        story: 'Uses inherited font, color, and background from its parent.'
      }
    }
  }
};

export const SlowSave = {
  args: {
    text: 'Brand launch concepts',
    onEditText: async (text) => {
      await wait(1200);
      return text;
    }
  }
};

export const ErrorRollback = {
  args: {
    text: 'Client review deck',
    onEditText: async () => {
      await wait(600);
      return new Error('Save failed');
    }
  }
};
