<script lang="ts">
  import type { DocumentRecord } from "$lib/types/documents";

  interface Props {
    document: Pick<DocumentRecord, "id" | "title" | "content" | "updated_at">;
  }

  let { document }: Props = $props();

  const modules = [
    "Canvas renderer package boundary",
    "Worker orchestration bridge",
    "Iframe popup hosts",
    "WASM adapter layer",
  ];
</script>

<section class="editor-grid">
  <aside class="panel rail left-rail">
    <p class="eyebrow">Document</p>
    <h2>{document.title ?? "Untitled design"}</h2>
    <p class="copy-muted">
      Editor integration host for document {document.id.slice(0, 8)}.
    </p>
    <div class="stack">
      {#each modules as module}
        <div class="pill">{module}</div>
      {/each}
    </div>
  </aside>

  <div class="panel canvas-shell subtle-grid">
    <div class="canvas-toolbar">
      <span class="pill">Zoom 100%</span>
      <span class="pill">Draft mode</span>
      <span class="pill">Autosave pending</span>
    </div>
    <div class="canvas-stage">
      <article class="canvas-sheet">
        <h3>{document.title ?? "Untitled design"}</h3>
        <p>
          {document.content?.slice(0, 180) ??
            "The future editor package can mount into this panel while preserving surrounding route data, document loading, and auth state."}
        </p>
      </article>
    </div>
  </div>

  <aside class="panel rail right-rail">
    <p class="eyebrow">Integration status</p>
    <h2>Ready for external editor package</h2>
    <p class="copy-muted">
      Replace this placeholder component with the existing editor repo import
      when that package path is available.
    </p>
    <p class="copy-muted">
      Last updated {new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(document.updated_at))}
    </p>
  </aside>
</section>

<style>
  .editor-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: 280px minmax(0, 1fr) 280px;
  }

  .rail,
  .canvas-shell {
    min-height: 72vh;
    padding: 1.25rem;
  }

  .rail h2 {
    font-family: var(--font-display);
    margin: 0.35rem 0 0;
  }

  .canvas-shell {
    display: grid;
    gap: 1rem;
    grid-template-rows: auto 1fr;
  }

  .canvas-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem;
  }

  .canvas-stage {
    align-items: center;
    display: grid;
    justify-items: center;
  }

  .canvas-sheet {
    background: white;
    border-radius: 24px;
    box-shadow: 0 24px 60px rgba(17, 58, 93, 0.16);
    max-width: 740px;
    min-height: 480px;
    padding: 2rem;
    width: min(100%, 740px);
  }

  .canvas-sheet h3 {
    font-family: var(--font-display);
    font-size: 2rem;
    margin: 0 0 1rem;
  }

  .canvas-sheet p {
    color: var(--color-muted);
    line-height: 1.7;
  }

  @media (max-width: 1080px) {
    .editor-grid {
      grid-template-columns: 1fr;
    }

    .rail,
    .canvas-shell {
      min-height: auto;
    }
  }
</style>
