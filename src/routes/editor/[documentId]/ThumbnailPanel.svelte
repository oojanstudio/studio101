<script lang="ts">
  import { enhance } from "$app/forms";
  import type { DocumentThumbnail } from "$lib/types/documents";

  interface Props {
    documentId: string;
    thumbnails: Array<
      Pick<
        DocumentThumbnail,
        | "id"
        | "sequence_number"
        | "file_name"
        | "mime_type"
        | "size_bytes"
        | "storage_path"
        | "created_at"
      > & {
        thumbnail_url: string | null;
      }
    >;
    uploadError?: string | null;
  }

  let { documentId, thumbnails, uploadError = null }: Props = $props();

  let dragOver = $state(false);
  let uploading = $state(false);
  let fileInput: HTMLInputElement;
  let sequenceInput = $state("");

  const sortedThumbnails = $derived(
    [...thumbnails].sort((a, b) => a.sequence_number - b.sequence_number),
  );

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    dragOver = true;
  }

  function onDragLeave() {
    dragOver = false;
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    dragOver = false;
    const files = e.dataTransfer?.files;
    if (files?.length) submitFile(files[0]);
  }

  function onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) submitFile(file);
  }

  function submitFile(file: File) {
    const form = document.getElementById(
      "thumbnail-upload-form",
    ) as HTMLFormElement;
    const dt = new DataTransfer();
    dt.items.add(file);
    fileInput.files = dt.files;
    form.requestSubmit();
  }
</script>

<aside class="thumbnail-panel">
  <header class="tp-header">
    <span class="tp-kicker">Thumbnails</span>
    <span class="tp-count"
      >{sortedThumbnails.length} item{sortedThumbnails.length !== 1
        ? "s"
        : ""}</span
    >
  </header>

  <form
    id="thumbnail-upload-form"
    action="?/uploadThumbnail"
    method="post"
    enctype="multipart/form-data"
    use:enhance={() => {
      uploading = true;
      return async ({ update }) => {
        uploading = false;
        await update();
      };
    }}
  >
    <label class="tp-sequence-row" for="thumbnail-sequence">
      Sequence
      <input
        id="thumbnail-sequence"
        name="sequenceNumber"
        type="number"
        min="1"
        step="1"
        bind:value={sequenceInput}
        placeholder="Auto"
      />
    </label>

    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="drop-zone"
      class:drag-active={dragOver}
      ondragover={onDragOver}
      ondragleave={onDragLeave}
      ondrop={onDrop}
      onclick={() => fileInput.click()}
      onkeydown={(e) => e.key === "Enter" && fileInput.click()}
      tabindex="0"
      role="button"
      aria-label="Upload thumbnail image"
    >
      {#if uploading}
        <span class="dz-label">Uploading…</span>
      {:else}
        <span class="dz-icon">🖼</span>
        <span class="dz-label">Drop screenshot or click to browse</span>
        <span class="dz-hint">Image only · sequence optional (auto next)</span>
      {/if}
    </div>

    <input
      bind:this={fileInput}
      name="file"
      type="file"
      accept="image/*"
      class="sr-only"
      onchange={onFileChange}
    />
  </form>

  {#if uploadError}
    <p class="tp-error">{uploadError}</p>
  {/if}

  {#if sortedThumbnails.length === 0}
    <p class="tp-empty">No thumbnails yet.</p>
  {:else}
    <ol class="tp-list">
      {#each sortedThumbnails as item (item.id)}
        <li class="tp-item">
          <span class="tp-seq">#{item.sequence_number}</span>
          <div class="tp-thumb">
            {#if item.thumbnail_url}
              <img
                src={item.thumbnail_url}
                alt={`Thumbnail ${item.sequence_number}`}
                loading="lazy"
              />
            {:else}
              <span class="tp-placeholder">No preview</span>
            {/if}
          </div>
          <div class="tp-meta">
            <span class="tp-name" title={item.file_name}>{item.file_name}</span>
            <span class="tp-detail">{formatBytes(item.size_bytes)}</span>
          </div>
        </li>
      {/each}
    </ol>
  {/if}
</aside>

<style>
  .thumbnail-panel {
    background: rgba(255, 255, 255, 0.82);
    border: 1px solid rgba(13, 26, 45, 0.1);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    overflow: hidden;
    padding: 1rem;
  }

  .tp-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .tp-kicker {
    color: var(--color-accent-strong, #eb4d00);
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .tp-count {
    background: rgba(13, 26, 45, 0.07);
    border-radius: 999px;
    color: rgba(13, 26, 45, 0.65);
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.2rem 0.55rem;
  }

  .tp-sequence-row {
    align-items: center;
    color: rgba(13, 26, 45, 0.68);
    display: flex;
    font-size: 0.8rem;
    font-weight: 600;
    gap: 0.55rem;
    margin-bottom: 0.6rem;
  }

  .tp-sequence-row input {
    border: 1px solid rgba(13, 26, 45, 0.18);
    border-radius: 8px;
    font-size: 0.8rem;
    padding: 0.3rem 0.45rem;
    width: 84px;
  }

  .drop-zone {
    align-items: center;
    background: rgba(13, 26, 45, 0.03);
    border: 1.5px dashed rgba(13, 26, 45, 0.18);
    border-radius: 14px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    outline: none;
    padding: 1rem 0.9rem;
    text-align: center;
    transition:
      background 180ms ease,
      border-color 180ms ease;
  }

  .drop-zone:hover,
  .drop-zone:focus-visible,
  .drag-active {
    background: rgba(255, 107, 44, 0.06);
    border-color: var(--color-accent, #ff6b2c);
  }

  .dz-icon {
    font-size: 1.2rem;
    opacity: 0.7;
  }

  .dz-label {
    color: rgba(13, 26, 45, 0.75);
    font-size: 0.84rem;
    font-weight: 600;
  }

  .dz-hint {
    color: rgba(13, 26, 45, 0.42);
    font-size: 0.74rem;
  }

  .sr-only {
    clip: rect(0, 0, 0, 0);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  .tp-error {
    background: rgba(255, 107, 44, 0.14);
    border-radius: 10px;
    color: #c03800;
    font-size: 0.82rem;
    padding: 0.5rem 0.75rem;
  }

  .tp-empty {
    color: rgba(13, 26, 45, 0.45);
    font-size: 0.83rem;
    text-align: center;
  }

  .tp-list {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    list-style: none;
    margin: 0;
    max-height: 320px;
    overflow-y: auto;
    padding: 0;
  }

  .tp-item {
    align-items: center;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(13, 26, 45, 0.08);
    border-radius: 12px;
    display: grid;
    gap: 0.6rem;
    grid-template-columns: auto 52px minmax(0, 1fr);
    padding: 0.5rem 0.6rem;
  }

  .tp-seq {
    color: rgba(13, 26, 45, 0.6);
    font-size: 0.75rem;
    font-weight: 700;
    min-width: 38px;
  }

  .tp-thumb {
    align-items: center;
    background: rgba(13, 26, 45, 0.05);
    border-radius: 8px;
    display: flex;
    height: 44px;
    justify-content: center;
    overflow: hidden;
    width: 52px;
  }

  .tp-thumb img {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  .tp-placeholder {
    color: rgba(13, 26, 45, 0.45);
    font-size: 0.68rem;
    padding: 0 0.3rem;
    text-align: center;
  }

  .tp-meta {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .tp-name {
    font-size: 0.82rem;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tp-detail {
    color: rgba(13, 26, 45, 0.52);
    font-size: 0.72rem;
  }
</style>
