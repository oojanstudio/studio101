<script lang="ts">
  import type { Snippet } from "svelte";
  import { getContext, onMount, setContext } from "svelte";
  import {
    LANDING_SECTION_OBSERVER_KEY,
    LANDING_SECTION_STATE_KEY,
    type LandingSectionStateContext,
    type PartialFromTop,
    type RegisterLandingSection,
    type SectionDimensions,
    type VisibleFrac,
  } from "./section-observer";

  interface PublicMethods {
    setVisibleFrac?: (next: VisibleFrac) => void;
    setPartialFromTop?: (next: PartialFromTop) => void;
    setDimensions?: (next: SectionDimensions) => void;
  }

  interface Props {
    class?: string;
    children?: Snippet;
    publicMethods?: PublicMethods;
  }

  let { class: className = "", children, publicMethods }: Props = $props();

  let visibleFrac = $state<VisibleFrac>(null);
  let partialFromTop = $state<PartialFromTop>(null);
  let dimensions = $state<SectionDimensions | null>(null);
  let shellEl: HTMLDivElement | null = null;

  const visibleFracListeners = new Set<(next: VisibleFrac) => void>();
  const partialFromTopListeners = new Set<(next: PartialFromTop) => void>();
  const dimensionListeners = new Set<
    (next: SectionDimensions | null) => void
  >();

  const sectionState: LandingSectionStateContext = {
    getVisibleFrac: () => visibleFrac,
    getPartialFromTop: () => partialFromTop,
    getDimensions: () => dimensions,
    onVisibleFracChange: (listener) => {
      visibleFracListeners.add(listener);
      listener(visibleFrac);
      return () => {
        visibleFracListeners.delete(listener);
      };
    },
    onPartialFromTopChange: (listener) => {
      partialFromTopListeners.add(listener);
      listener(partialFromTop);
      return () => {
        partialFromTopListeners.delete(listener);
      };
    },
    onDimensionsChange: (listener) => {
      dimensionListeners.add(listener);
      listener(dimensions);
      return () => {
        dimensionListeners.delete(listener);
      };
    },
  };

  setContext(LANDING_SECTION_STATE_KEY, sectionState);

  const registerSection = getContext<RegisterLandingSection | undefined>(
    LANDING_SECTION_OBSERVER_KEY,
  );

  function setVisibleFrac(next: VisibleFrac) {
    if (visibleFrac !== next) {
      visibleFrac = next;
      for (const listener of visibleFracListeners) {
        listener(next);
      }
    }
  }

  function setPartialFromTop(next: PartialFromTop) {
    if (partialFromTop !== next) {
      partialFromTop = next;
      for (const listener of partialFromTopListeners) {
        listener(next);
      }
    }
  }

  function setDimensions(next: SectionDimensions) {
    if (
      dimensions &&
      dimensions.viewportWidth === next.viewportWidth &&
      dimensions.viewportHeight === next.viewportHeight &&
      dimensions.width === next.width &&
      dimensions.height === next.height &&
      dimensions.top === next.top &&
      dimensions.right === next.right &&
      dimensions.bottom === next.bottom &&
      dimensions.left === next.left
    ) {
      return;
    }

    dimensions = next;
    for (const listener of dimensionListeners) {
      listener(next);
    }
  }

  // Optional imperative API for external callers.
  $effect(() => {
    if (!publicMethods) {
      return;
    }

    publicMethods.setVisibleFrac = setVisibleFrac;
    publicMethods.setPartialFromTop = setPartialFromTop;
    publicMethods.setDimensions = setDimensions;
  });

  onMount(() => {
    if (!registerSection || !shellEl) {
      return;
    }

    return registerSection({
      element: shellEl,
      setVisibleFrac,
      setPartialFromTop,
      setDimensions,
    });
  });
</script>

<div
  bind:this={shellEl}
  class={`shell ${className}`.trim()}
  data-debug-name="LandingPageSection"
  data-visible-frac={visibleFrac === null ? "none" : visibleFrac}
  data-width={dimensions?.width ?? "none"}
  data-height={dimensions?.height ?? "none"}
  data-partial-from-top={partialFromTop === null
    ? "none"
    : partialFromTop
      ? "top"
      : "bottom"}
>
  {#if children}
    {@render children()}
  {:else}
    Section placeholder.
    <br />
    Visible: ${visibleFrac}, Partial from top: ${partialFromTop}.
  {/if}
</div>

<style>
  .shell {
    /* min-height: 10vh; */
    /* overflow: hidden; */
    position: relative;
    /* padding: 1rem; */
  }
</style>
