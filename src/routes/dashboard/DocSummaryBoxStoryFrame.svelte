<script>
  import DocSummaryBox from './DocSummaryBox.svelte';

  export let document;
  export let href = '#';
  export let thumbnails = [];
  export let selected = false;
  export let onSelect = () => {};
</script>

<div class="story-stage">
  <div class="story-card">
    <DocSummaryBox
      {document}
      {href}
      {thumbnails}
      {selected}
      {onSelect}
    />
  </div>
</div>

<style>
  .story-stage {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    width: 100vw;
  }

  .story-card {
    width: min(320px, 100%);
  }
</style>
