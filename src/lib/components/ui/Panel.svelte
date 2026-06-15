<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    eyebrow?: string;
    title?: string;
    compact?: boolean;
    children?: Snippet;
  }

  let { eyebrow, title, compact = false, children }: Props = $props();
</script>

<section class:compact class="panel panel-wrap">
  {#if eyebrow}
    <p class="eyebrow">{eyebrow}</p>
  {/if}

  {#if title}
    <h2>{title}</h2>
  {/if}

  <div class="content">
    {@render children?.()}
  </div>
</section>

<style>
  .panel-wrap {
    padding: 1.4rem;
  }

  .compact {
    border-radius: var(--radius-md);
    padding: 1rem;
  }

  h2 {
    font-family: var(--font-display);
    font-size: 1.35rem;
    margin: 0.35rem 0 0;
  }

  .content {
    display: grid;
    gap: 0.95rem;
    margin-top: 1rem;
  }
</style>