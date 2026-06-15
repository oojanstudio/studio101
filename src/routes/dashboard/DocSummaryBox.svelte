<script lang="ts">
  import { formatDurationSince } from "$lib/utils/duration";
  import type { DocumentRecord } from "$lib/types/documents";

  interface Thumbnail {
    id: string;
    sequence_number: number;
    file_name: string;
    mime_type: string;
    size_bytes: number;
    storage_path: string;
    created_at: string;
    thumbnail_url: string | null;
  }

  interface Props {
    document: Pick<DocumentRecord, "id" | "title" | "updated_at">;
    href?: string;
    thumbnails?: Thumbnail[];
    selected?: boolean;
    onSelect?: (documentId: string, selected: boolean) => void;
  }

  let {
    document,
    href = "#",
    thumbnails = [],
    selected = false,
    onSelect = () => {},
  }: Props = $props();

  let currentThumbnailIndex = $state(0);

  const currentThumbnail = $derived(
    thumbnails.length > 0 ? thumbnails[currentThumbnailIndex] : null,
  );

  function prevThumbnail(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    if (thumbnails.length === 0) return;
    currentThumbnailIndex =
      (currentThumbnailIndex - 1 + thumbnails.length) % thumbnails.length;
  }

  function nextThumbnail(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    if (thumbnails.length === 0) return;
    currentThumbnailIndex = (currentThumbnailIndex + 1) % thumbnails.length;
  }

  function toggleSelect(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    onSelect(document.id, !selected);
  }

  function blockPreviewNavigation(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }
</script>

<div class="doc-summary-box" class:selected>
  <!-- Header with title and checkbox -->
  <div class="dsb-header">
    <label class="dsb-checkbox">
      <input
        type="checkbox"
        checked={selected}
        onclick={(e) => toggleSelect(e)}
        aria-label="Select {document.title ?? 'Untitled'}"
      />
      <span class="checkbox-visual"></span>
    </label>
    <h3 class="dsb-title">{document.title ?? "Untitled design"}</h3>
  </div>

  <!-- Thumbnail preview with navigation -->
  <div class="dsb-preview-wrap">
    <a
      class="dsb-preview"
      {href}
      aria-label={`Open ${document.title ?? "Untitled design"}`}
    >
      {#if currentThumbnail && currentThumbnail.thumbnail_url}
        <img
          src={currentThumbnail.thumbnail_url}
          alt={`${document.title} - Thumbnail ${currentThumbnailIndex + 1}`}
          class="dsb-image"
        />
      {:else}
        <div class="dsb-placeholder">
          <span class="placeholder-icon">🖼</span>
          <span class="placeholder-text">No thumbnail</span>
        </div>
      {/if}
    </a>

    <!-- Navigation controls -->
    {#if thumbnails.length > 1}
      <button
        type="button"
        class="dsb-arrow dsb-arrow-left"
        onclick={(e) => prevThumbnail(e)}
        aria-label="Previous thumbnail"
      >
        ←
      </button>
      <button
        type="button"
        class="dsb-arrow dsb-arrow-right"
        onclick={(e) => nextThumbnail(e)}
        aria-label="Next thumbnail"
      >
        →
      </button>
      <div class="dsb-counter" onclick={blockPreviewNavigation}>
        {currentThumbnailIndex + 1} of {thumbnails.length}
      </div>
    {/if}
  </div>

  <!-- Footer with metadata -->
  <div class="dsb-footer">
    <div class="dsb-metadata">
      <span class="dsb-type">Design File</span>
      <span class="dsb-updated">
        {formatDurationSince(document.updated_at)}
      </span>
    </div>
  </div>
</div>

<style>
  .doc-summary-box {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(13, 26, 45, 0.1);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    overflow: hidden;
    padding: 1rem;
    transition:
      border-color 200ms ease,
      box-shadow 200ms ease,
      background 200ms ease;
  }

  .doc-summary-box.selected {
    background: rgba(255, 107, 44, 0.08);
    border-color: var(--color-accent, #ff6b2c);
    box-shadow: 0 0 0 2px rgba(255, 107, 44, 0.15);
  }

  /* Header */
  .dsb-header {
    align-items: center;
    display: flex;
    gap: 0.6rem;
  }

  .dsb-checkbox {
    align-items: center;
    cursor: pointer;
    display: flex;
    flex-shrink: 0;
    height: 20px;
    justify-content: center;
    width: 20px;
  }

  .dsb-checkbox input {
    appearance: none;
    margin: 0;
    opacity: 0;
    position: absolute;
  }

  .checkbox-visual {
    align-items: center;
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid rgba(13, 26, 45, 0.2);
    border-radius: 6px;
    display: flex;
    height: 18px;
    justify-content: center;
    transition:
      background 180ms ease,
      border-color 180ms ease;
    width: 18px;
  }

  .dsb-checkbox input:checked ~ .checkbox-visual {
    background: var(--color-accent, #ff6b2c);
    border-color: var(--color-accent, #ff6b2c);
  }

  .dsb-checkbox input:checked ~ .checkbox-visual::after {
    color: white;
    content: "✓";
    font-size: 0.75rem;
    font-weight: 800;
  }

  .dsb-title {
    flex: 1;
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Thumbnail preview */
  .dsb-preview-wrap {
    position: relative;
  }

  .dsb-preview {
    aspect-ratio: 3 / 2;
    background: rgba(13, 26, 45, 0.05);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    text-decoration: none;
  }

  .dsb-image {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  .dsb-placeholder {
    align-items: center;
    color: rgba(13, 26, 45, 0.4);
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    text-align: center;
  }

  .placeholder-icon {
    font-size: 2rem;
    opacity: 0.5;
  }

  .placeholder-text {
    font-size: 0.8rem;
  }

  /* Navigation arrows */
  .dsb-arrow {
    background: rgba(0, 0, 0, 0.5);
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: 700;
    height: 32px;
    opacity: 0;
    padding: 0;
    position: absolute;
    transition: opacity 180ms ease;
    width: 32px;
    z-index: 2;
  }

  .dsb-preview-wrap:hover .dsb-arrow {
    opacity: 0.8;
  }

  .dsb-arrow:hover {
    opacity: 1 !important;
  }

  .dsb-arrow-left {
    left: 0.5rem;
  }

  .dsb-arrow-right {
    right: 0.5rem;
  }

  .dsb-counter {
    background: rgba(0, 0, 0, 0.5);
    border-radius: 6px;
    bottom: 0.5rem;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.3rem 0.6rem;
    position: absolute;
    right: 0.5rem;
  }

  /* Footer */
  .dsb-footer {
    border-top: 1px solid rgba(13, 26, 45, 0.08);
    padding-top: 0.6rem;
  }

  .dsb-metadata {
    align-items: center;
    color: rgba(13, 26, 45, 0.6);
    display: flex;
    font-size: 0.75rem;
    gap: 0.5rem;
    justify-content: space-between;
  }

  .dsb-type {
    background: rgba(13, 26, 45, 0.05);
    border-radius: 6px;
    font-weight: 600;
    padding: 0.2rem 0.45rem;
    text-transform: capitalize;
  }

  .dsb-updated {
    font-size: 0.72rem;
    font-weight: 500;
  }
</style>
