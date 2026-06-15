<script lang="ts">
  import DocEditor from "./DocEditor.svelte";
  import MediaPanel from "./MediaPanel.svelte";
  import ThumbnailPanel from "./ThumbnailPanel.svelte";

  let { data, form } = $props();
</script>

<div class="editor-root app-shell">
  <div class="editor-columns">
    <div class="editor-main">
      <DocEditor document={data.document} />
    </div>

    <div class="editor-sidebar">
      <MediaPanel
        documentId={data.document.id}
        mediaFiles={data.mediaFiles}
        uploadError={form?.uploadError ?? data.mediaError}
        deleteError={form?.deleteError ?? null}
      />

      <ThumbnailPanel
        documentId={data.document.id}
        thumbnails={data.thumbnails}
        uploadError={form?.thumbnailUploadError ?? data.thumbnailError}
      />
    </div>
  </div>
</div>

<style>
  .editor-root {
    padding-bottom: 2rem;
  }

  .editor-columns {
    display: grid;
    gap: 1rem;
    grid-template-columns: minmax(0, 1fr) 300px;
  }

  .editor-sidebar {
    display: grid;
    gap: 1rem;
  }

  @media (max-width: 1100px) {
    .editor-columns {
      grid-template-columns: 1fr;
    }
  }
</style>
