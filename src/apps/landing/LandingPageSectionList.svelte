<script lang="ts">
  import type { Snippet } from "svelte";
  import { onDestroy, onMount, setContext } from "svelte";
  import {
    LANDING_SECTION_OBSERVER_KEY,
    type LandingSectionRegistration,
    type PartialFromTop,
    type RegisterLandingSection,
    type VisibleFrac,
  } from "./section-observer";

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();

  const registrations = new Map<HTMLElement, LandingSectionRegistration>();
  let observer: IntersectionObserver | null = null;
  let sectionListEl: HTMLDivElement | null = null;
  let listResizeObserver: ResizeObserver | null = null;

  let velocityY = 0;
  let momentumFrame: number | null = null;
  let idleSnapTimer: ReturnType<typeof setTimeout> | null = null;
  let pendingSnap = false;
  let lastScrollDirection: -1 | 0 | 1 = 0;

  const VELOCITY_MULTIPLIER = 0.28;
  const FRICTION = 0.9;
  const MIN_VELOCITY = 0.35;
  const MAX_VELOCITY = 85;
  const SNAP_IDLE_MS = 110;
  const SNAP_MAX_DISTANCE = 120;

  function buildThresholds(step = 0.01) {
    const values: number[] = [];
    for (let cursor = 0; cursor <= 1; cursor += step) {
      values.push(Number(cursor.toFixed(2)));
    }
    return values;
  }

  function toVisibleFrac(entry: IntersectionObserverEntry): VisibleFrac {
    if (!entry.isIntersecting) {
      return null;
    }

    const frac = Math.max(
      0,
      Math.min(100, Math.round(entry.intersectionRatio * 100)),
    );
    return frac;
  }

  function toPartialFromTop(entry: IntersectionObserverEntry): PartialFromTop {
    if (!entry.isIntersecting) {
      return null;
    }

    const rootTop = entry.rootBounds?.top ?? 0;
    const rootBottom = entry.rootBounds?.bottom ?? window.innerHeight;
    const fromTop = entry.boundingClientRect.top < rootTop;
    const fromBottom = entry.boundingClientRect.bottom > rootBottom;

    if (fromTop && !fromBottom) {
      return true;
    }

    if (fromBottom && !fromTop) {
      return false;
    }

    return null;
  }

  const registerSection: RegisterLandingSection = (registration) => {
    registrations.set(registration.element, registration);

    if (observer) {
      observer.observe(registration.element);
    }

    notifyRegistrationDimensions(registration);

    return () => {
      if (observer) {
        observer.unobserve(registration.element);
      }

      registrations.delete(registration.element);
    };
  };

  setContext(LANDING_SECTION_OBSERVER_KEY, registerSection);

  function readSectionDimensions(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    return {
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      top: Math.round(rect.top),
      right: Math.round(rect.right),
      bottom: Math.round(rect.bottom),
      left: Math.round(rect.left),
    };
  }

  function notifyRegistrationDimensions(
    registration: LandingSectionRegistration,
  ) {
    registration.setDimensions(readSectionDimensions(registration.element));
  }

  function notifyAllSectionDimensions() {
    for (const registration of registrations.values()) {
      notifyRegistrationDimensions(registration);
    }
  }

  function scheduleSnapToCenter() {
    if (idleSnapTimer) {
      clearTimeout(idleSnapTimer);
    }

    idleSnapTimer = setTimeout(() => {
      pendingSnap = true;

      if (momentumFrame === null) {
        snapToNearestSectionCenter();
      }
    }, SNAP_IDLE_MS);
  }

  function stopMomentum() {
    if (momentumFrame !== null) {
      cancelAnimationFrame(momentumFrame);
      momentumFrame = null;
    }
  }

  function snapToNearestSectionCenter() {
    if (!sectionListEl) {
      return;
    }

    const sectionNodes = Array.from(sectionListEl.children) as HTMLElement[];
    if (sectionNodes.length === 0) {
      return;
    }

    const viewportCenter =
      sectionListEl.scrollTop + sectionListEl.clientHeight / 2;
    const forwardNodes: HTMLElement[] = [];
    const backwardNodes: HTMLElement[] = [];

    for (const node of sectionNodes) {
      const nodeCenter = node.offsetTop + node.offsetHeight / 2;
      if (nodeCenter >= viewportCenter) {
        forwardNodes.push(node);
      }
      if (nodeCenter <= viewportCenter) {
        backwardNodes.push(node);
      }
    }

    function nearestNode(nodes: HTMLElement[]): HTMLElement | null {
      if (nodes.length === 0) {
        return null;
      }

      let candidate = nodes[0];
      let bestDistance = Number.POSITIVE_INFINITY;
      for (const node of nodes) {
        const nodeCenter = node.offsetTop + node.offsetHeight / 2;
        const distance = Math.abs(nodeCenter - viewportCenter);
        if (distance < bestDistance) {
          bestDistance = distance;
          candidate = node;
        }
      }
      return candidate;
    }

    const directionalTarget =
      lastScrollDirection > 0
        ? nearestNode(forwardNodes)
        : lastScrollDirection < 0
          ? nearestNode(backwardNodes)
          : null;

    const targetNode = directionalTarget ?? nearestNode(sectionNodes);
    if (!targetNode) {
      pendingSnap = false;
      return;
    }

    const targetCenter = targetNode.offsetTop + targetNode.offsetHeight / 2;
    const targetTop = Math.max(
      0,
      targetCenter - sectionListEl.clientHeight / 2,
    );
    const distance = Math.abs(targetTop - sectionListEl.scrollTop);

    // Only snap when already near a center target. If far away, keep natural scroll position.
    if (distance > SNAP_MAX_DISTANCE) {
      pendingSnap = false;
      return;
    }

    sectionListEl.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });

    pendingSnap = false;
  }

  function runMomentumStep() {
    if (!sectionListEl) {
      stopMomentum();
      return;
    }

    sectionListEl.scrollTop += velocityY;
    velocityY *= FRICTION;

    if (Math.abs(velocityY) < MIN_VELOCITY) {
      velocityY = 0;
      stopMomentum();

      if (pendingSnap) {
        snapToNearestSectionCenter();
      }

      return;
    }

    momentumFrame = requestAnimationFrame(runMomentumStep);
  }

  function startMomentumIfNeeded() {
    if (momentumFrame !== null) {
      return;
    }

    momentumFrame = requestAnimationFrame(runMomentumStep);
  }

  function onWheel(event: WheelEvent) {
    if (!sectionListEl) {
      return;
    }

    const inputDirection = event.deltaY > 0 ? 1 : event.deltaY < 0 ? -1 : 0;

    // Keep inertia moving only in the same direction as the latest user input.
    if (
      inputDirection !== 0 &&
      Math.sign(velocityY) !== 0 &&
      Math.sign(velocityY) !== inputDirection
    ) {
      velocityY = 0;
    }

    const nextVelocity = velocityY + event.deltaY * VELOCITY_MULTIPLIER;
    velocityY = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, nextVelocity));
    if (inputDirection !== 0) {
      lastScrollDirection = inputDirection;
    }

    pendingSnap = false;
    startMomentumIfNeeded();
    scheduleSnapToCenter();
  }

  onMount(() => {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const registration = registrations.get(entry.target as HTMLElement);
          if (!registration) {
            continue;
          }

          notifyRegistrationDimensions(registration);
          registration.setVisibleFrac(toVisibleFrac(entry));
          registration.setPartialFromTop(toPartialFromTop(entry));
        }
      },
      {
        root: null,
        rootMargin: "20px 0px 20px 0px",
        threshold: buildThresholds(),
      },
    );

    for (const element of registrations.keys()) {
      observer.observe(element);
    }

    notifyAllSectionDimensions();

    const onResize = () => {
      notifyAllSectionDimensions();
    };

    window.addEventListener("resize", onResize, { passive: true });

    if (sectionListEl) {
      listResizeObserver = new ResizeObserver(() => {
        notifyAllSectionDimensions();
      });
      listResizeObserver.observe(sectionListEl);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      listResizeObserver?.disconnect();
      listResizeObserver = null;
    };
  });

  onDestroy(() => {
    stopMomentum();
    if (idleSnapTimer) {
      clearTimeout(idleSnapTimer);
      idleSnapTimer = null;
    }

    observer?.disconnect();
    observer = null;
    listResizeObserver?.disconnect();
    listResizeObserver = null;
  });
</script>

<div bind:this={sectionListEl} class="section-list" onwheel={onWheel}>
  {@render children()}
</div>

<style>
  .section-list {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex-wrap: nowrap;
    isolation: isolate;
    max-height: 100vh;
    overflow-y: auto;
    overscroll-behavior: contain;
    position: relative;
    scroll-padding-block: 50vh;
  }

  .section-list :global([data-debug-name="LandingPageSection"]) {
    scroll-snap-align: center;
    scroll-snap-stop: always;
  }
</style>
