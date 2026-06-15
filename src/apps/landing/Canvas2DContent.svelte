<script lang="ts">
  import { getContext, onDestroy, onMount } from "svelte";
  import {
    LANDING_SECTION_STATE_KEY,
    type LandingSectionStateContext,
    type SectionDimensions,
    type VisibleFrac,
  } from "./section-observer";

  interface Props {
    colors?: string[];
  }

  let {
    colors = [
      "#ff4d6d",
      "#ff9e00",
      "#ffee32",
      "#47ff8a",
      "#2ec4ff",
      "#7f5af0",
      "#f15bb5",
    ],
  }: Props = $props();

  let shellEl: HTMLDivElement | null = null;
  let canvasEl: HTMLCanvasElement | null = null;

  let currentVisibleFrac: VisibleFrac = null;
  let currentDimensions: SectionDimensions | null = null;

  const sectionState = getContext<LandingSectionStateContext | undefined>(
    LANDING_SECTION_STATE_KEY,
  );

  function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }

  function draw() {
    if (!canvasEl || !shellEl) {
      return;
    }

    const ctx = canvasEl.getContext("2d");
    if (!ctx) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    if (
      canvasEl.width !== Math.floor(viewportW * dpr) ||
      canvasEl.height !== Math.floor(viewportH * dpr)
    ) {
      canvasEl.width = Math.floor(viewportW * dpr);
      canvasEl.height = Math.floor(viewportH * dpr);
      canvasEl.style.width = `${viewportW}px`;
      canvasEl.style.height = `${viewportH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    ctx.clearRect(0, 0, viewportW, viewportH);

    const visiblePct = currentVisibleFrac ?? 0;
    const progress = clamp(visiblePct / 100, 0, 1);

    const componentRect = shellEl.getBoundingClientRect();
    const observedWidth = currentDimensions?.width ?? 0;
    const measuredWidth = Math.round(componentRect.width);
    const componentWidth = Math.max(1, observedWidth, measuredWidth);
    const drawWidth = componentWidth;

    const desiredBarWidth = clamp(componentWidth / 22, 14, 30);
    const barCount = Math.max(12, Math.floor(componentWidth / desiredBarWidth));
    const barWidth = drawWidth / barCount;

    const xOffset = (viewportW - drawWidth) * 0.5;
    const phase = progress * Math.PI * 2;

    for (let index = 0; index < barCount; index += 1) {
      const wave = Math.sin(phase + index * 0.55);
      const wave2 = Math.sin(phase * 0.7 + index * 0.31);

      const topPct = clamp(0.2 * (0.5 + 0.5 * wave), 0, 0.2);
      const bottomPct = clamp(0.8 + 0.2 * (0.5 + 0.5 * wave2), 0.8, 1);

      const yTop = viewportH * topPct;
      const yBottom = viewportH * bottomPct;

      const x = xOffset + index * barWidth;
      const color = colors[index % colors.length];
      const radius = barWidth * 0.5;

      ctx.fillStyle = color;
      if (typeof ctx.roundRect === "function") {
        ctx.beginPath();
        ctx.roundRect(x, yTop, barWidth, Math.max(1, yBottom - yTop), radius);
        ctx.fill();
      } else {
        ctx.fillRect(x, yTop, barWidth, Math.max(1, yBottom - yTop));
      }
    }
  }

  onMount(() => {
    const unsubscribers: Array<() => void> = [];

    if (sectionState) {
      unsubscribers.push(
        sectionState.onVisibleFracChange((value) => {
          currentVisibleFrac = value;
          draw();
        }),
      );

      unsubscribers.push(
        sectionState.onDimensionsChange((value) => {
          currentDimensions = value;
          draw();
        }),
      );
    }

    const handleResize = () => {
      draw();
    };

    window.addEventListener("resize", handleResize, { passive: true });
    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      for (const unsubscribe of unsubscribers) {
        unsubscribe();
      }
    };
  });

  onDestroy(() => {
    // Lifecycle cleanup is handled in onMount's return block.
  });
</script>

<div class="canvas-shell" bind:this={shellEl}>
  <canvas bind:this={canvasEl} aria-hidden="true"></canvas>
</div>

<style>
  .canvas-shell {
    height: 100vh;
    inset: 0;
    pointer-events: none;
    position: sticky;
    top: 0;
    width: 100%;
  }

  canvas {
    display: block;
    height: 100%;
    width: 100%;
  }
</style>
