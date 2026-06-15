import Panel from './Panel.svelte';

export default {
  title: 'UI/Panel',
  component: Panel,
  args: {
    eyebrow: 'Starter story',
    title: 'Panel container'
  }
};

export const Default = {
  render: (args) => ({
    Component: Panel,
    props: args,
    slots: {
      default: 'Use this panel to wrap dashboard modules, marketing sections, or editor side rails.'
    }
  })
};