<script lang="ts">
  import Panel from "$components/ui/Panel.svelte";
  import { sourceLayout } from "$config/source-layout";
</script>

<div class="app-shell about-grid">
  <Panel eyebrow="Blueprint" title="Extensible source layout">
    <p class="copy-muted">
      The bootstrap keeps source areas intentionally separated so the editor,
      worker code, and shared UI can move into packages later without rewriting
      the routing surface.
    </p>
  </Panel>

  <div class="layout-list">
    {#each sourceLayout as group}
      <Panel
        compact={true}
        eyebrow={group.title}
        title={group.paths.join(" / ")}
      >
        <p class="copy-muted">{group.description}</p>
      </Panel>
    {/each}
  </div>
</div>

<style>
  .about-grid,
  .layout-list {
    display: grid;
    gap: 1rem;
  }
</style>
