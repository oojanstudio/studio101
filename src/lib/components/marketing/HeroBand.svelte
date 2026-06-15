<script lang="ts">
  import MetricPill from "$components/ui/MetricPill.svelte";

  interface Props {
    title: string;
    copy: string;
  }

  let { title, copy }: Props = $props();

  const metrics = [
    { label: "Stack", value: "SvelteKit + Supabase" },
    { label: "Editor mode", value: "SPA host boundary" },
    { label: "Testing", value: "Vitest + Storybook" },
  ];
</script>

<section class="hero panel subtle-grid">
  <div class="stack">
    <p class="eyebrow">Design Faster</p>
    <h1 class="section-title">{title}</h1>
    <p class="copy-muted intro">{copy}</p>
    <div class="metrics">
      {#each metrics as metric}
        <MetricPill {...metric} />
      {/each}
    </div>
  </div>

  <div class="showcase panel">
    <div class="showcase-top">
      <span class="pill">Live editor host</span>
      <span class="pill">Portable source layout</span>
    </div>
    <div class="canvas-preview">
      <div class="poster coral"></div>
      <div class="poster mint"></div>
      <div class="poster ink"></div>
    </div>
  </div>
</section>

<style>
  .hero {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: 1.4fr 1fr;
    padding: clamp(1.4rem, 4vw, 2rem);
  }

  .intro {
    font-size: 1.08rem;
    line-height: 1.7;
    max-width: 58ch;
  }

  .metrics {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .showcase {
    align-content: start;
    background: linear-gradient(
      180deg,
      rgba(17, 58, 93, 0.94),
      rgba(11, 19, 32, 0.92)
    );
    color: white;
    display: grid;
    gap: 1rem;
    padding: 1.2rem;
  }

  .showcase-top {
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem;
  }

  .showcase-top :global(.pill) {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.88);
  }

  .canvas-preview {
    align-items: end;
    display: grid;
    gap: 0.85rem;
    grid-template-columns: repeat(3, 1fr);
    min-height: 250px;
  }

  .poster {
    border-radius: 20px;
    min-height: 150px;
    transform-origin: bottom center;
  }

  .poster.coral {
    background: linear-gradient(180deg, #ffd4c1, #ff6b2c);
    transform: rotate(-6deg);
  }

  .poster.mint {
    background: linear-gradient(180deg, #cdfaf1, #1fc0a0);
    min-height: 210px;
  }

  .poster.ink {
    background: linear-gradient(180deg, #90b8dd, #113a5d);
    transform: rotate(8deg);
  }

  @media (max-width: 880px) {
    .hero {
      grid-template-columns: 1fr;
    }
  }
</style>
