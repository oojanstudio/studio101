<script lang="ts">
  import { enhance } from "$app/forms";
  import type { DocumentMedia } from "$lib/types/documents";

  interface Props {
    documentId: string;
    mediaFiles: Array<
      Pick<
        DocumentMedia,
        | "id"
        | "file_name"
        | "mime_type"
        | "size_bytes"
        | "storage_path"
        | "created_at"
      > & {
        media_url: string | null;
      }
    >;
    uploadError?: string | null;
    deleteError?: string | null;
  }

  let {
    documentId,
    mediaFiles,
    uploadError = null,
    deleteError = null,
  }: Props = $props();

  let dragOver = $state(false);
  let uploading = $state(false);
  let fileInput: HTMLInputElement;

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function formatDate(iso: string): string {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  }

  function isImage(mimeType: string) {
    return mimeType.startsWith("image/");
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
      "media-upload-form",
    ) as HTMLFormElement;
    const dt = new DataTransfer();
    dt.items.add(file);
    fileInput.files = dt.files;
    form.requestSubmit();
  }
</script>

<aside class="media-panel">
  <header class="mp-header">
    <span class="mp-kicker">Media</span>
    <span class="mp-count"
      >{mediaFiles.length} file{mediaFiles.length !== 1 ? "s" : ""}</span
    >
  </header>

  <!-- Upload zone -->
  <form
    id="media-upload-form"
    action="?/uploadMedia"
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
      aria-label="Upload media file"
    >
      {#if uploading}
        <span class="dz-label">Uploading…</span>
      {:else}
        <span class="dz-icon">↑</span>
        <span class="dz-label">Drop image / video or click to browse</span>
        <span class="dz-hint">Max 50 MB · image/* or video/*</span>
      {/if}
    </div>

    <input
      bind:this={fileInput}
      id="file-input"
      name="file"
      type="file"
      accept="image/*,video/*"
      class="sr-only"
      onchange={onFileChange}
    />
  </form>

  {#if uploadError}
    <p class="mp-error">{uploadError}</p>
  {/if}

  {#if deleteError}
    <p class="mp-error">{deleteError}</p>
  {/if}

  <!-- File list -->
  {#if mediaFiles.length === 0}
    <p class="mp-empty">No media yet. Upload a file above.</p>
  {:else}
    <ul class="mp-list">
      {#each mediaFiles as item (item.id)}
        <li class="mp-item">
          <div class="mp-thumb">
            {#if item.media_url && isImage(item.mime_type)}
              <img src={item.media_url} alt={item.file_name} loading="lazy" />
            {:else if item.media_url}
              <video src={item.media_url} muted preload="metadata" playsinline
              ></video>
            {:else}
              <span class="mp-video-icon">▶</span>
            {/if}
          </div>
          <div class="mp-meta">
            <span class="mp-name" title={item.file_name}>{item.file_name}</span>
            <span class="mp-detail"
              >{formatBytes(item.size_bytes)} · {item.mime_type}</span
            >
            <span class="mp-detail">{formatDate(item.created_at)}</span>
          </div>
          <form
            action="?/deleteMedia"
            method="post"
            use:enhance={() =>
              async ({ update }) => {
                await update();
              }}
          >
            <input type="hidden" name="mediaId" value={item.id} />
            <button
              class="mp-delete"
              type="submit"
              aria-label="Delete {item.file_name}">✕</button
            >
          </form>
        </li>
      {/each}
    </ul>
  {/if}
</aside>

<style>
  .media-panel {
    background: rgba(255, 255, 255, 0.82);
    border: 1px solid rgba(13, 26, 45, 0.1);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    overflow: hidden;
    padding: 1.1rem;
  }

  .mp-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .mp-kicker {
    color: var(--color-accent-strong, #eb4d00);
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .mp-count {
    background: rgba(13, 26, 45, 0.07);
    border-radius: 999px;
    color: rgba(13, 26, 45, 0.65);
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.2rem 0.55rem;
  }

  /* Drop zone */
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
    padding: 1.2rem 1rem;
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
    font-size: 1.4rem;
    opacity: 0.55;
  }

  .dz-label {
    color: rgba(13, 26, 45, 0.75);
    font-size: 0.85rem;
    font-weight: 600;
  }

  .dz-hint {
    color: rgba(13, 26, 45, 0.42);
    font-size: 0.75rem;
  }

  .sr-only {
    clip: rect(0, 0, 0, 0);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  /* Errors */
  .mp-error {
    background: rgba(255, 107, 44, 0.14);
    border-radius: 10px;
    color: #c03800;
    font-size: 0.82rem;
    padding: 0.5rem 0.75rem;
  }

  .mp-empty {
    color: rgba(13, 26, 45, 0.45);
    font-size: 0.83rem;
    text-align: center;
  }

  /* File list */
  .mp-list {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    list-style: none;
    margin: 0;
    max-height: 360px;
    overflow-y: auto;
    padding: 0;
  }

  .mp-item {
    align-items: center;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(13, 26, 45, 0.08);
    border-radius: 12px;
    display: flex;
    gap: 0.7rem;
    padding: 0.55rem 0.65rem;
  }

  .mp-thumb {
    align-items: center;
    background: rgba(13, 26, 45, 0.05);
    border-radius: 8px;
    display: flex;
    flex-shrink: 0;
    height: 44px;
    justify-content: center;
    overflow: hidden;
    width: 44px;
  }

  .mp-thumb img {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  .mp-thumb video {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  .mp-video-icon {
    color: rgba(13, 26, 45, 0.4);
    font-size: 1.2rem;
  }

  .mp-meta {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }

  .mp-name {
    font-size: 0.85rem;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mp-detail {
    color: rgba(13, 26, 45, 0.5);
    font-size: 0.73rem;
  }

  .mp-delete {
    background: transparent;
    border: 1px solid rgba(13, 26, 45, 0.12);
    border-radius: 8px;
    color: rgba(13, 26, 45, 0.45);
    cursor: pointer;
    flex-shrink: 0;
    font-size: 0.75rem;
    height: 28px;
    transition:
      background 150ms ease,
      color 150ms ease;
    width: 28px;
  }

  .mp-delete:hover {
    background: rgba(220, 38, 38, 0.1);
    border-color: rgba(220, 38, 38, 0.3);
    color: #dc2626;
  }
</style>
