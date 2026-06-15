<script lang="ts">
  import type { DocumentRecord } from "$lib/types/documents";
  import DocSummaryBox from "../../../routes/dashboard/DocSummaryBox.svelte";

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
    documents: Pick<
      DocumentRecord,
      "id" | "title" | "updated_at" | "created_at"
    >[];
    thumbnailsByDocId?: Record<string, Thumbnail[]>;
  }

  let { documents, thumbnailsByDocId = {} }: Props = $props();

  let selectedDocIds = $state(new Set<string>());

  function handleSelect(documentId: string, isSelected: boolean) {
    if (isSelected) {
      selectedDocIds.add(documentId);
    } else {
      selectedDocIds.delete(documentId);
    }
    selectedDocIds = selectedDocIds; // Trigger reactivity
  }
</script>

{#if documents.length === 0}
  <div class="empty-state panel">
    <p class="eyebrow">No documents yet</p>
    <h3>Start with a blank canvas from the dashboard form.</h3>
    <p class="copy-muted">
      New documents are inserted through Supabase and immediately opened in the
      editor host route.
    </p>
  </div>
{:else}
  <div class="document-grid">
    {#each documents as document (document.id)}
      <DocSummaryBox
        {document}
        href={`/editor/${document.id}`}
        thumbnails={thumbnailsByDocId[document.id] ?? []}
        selected={selectedDocIds.has(document.id)}
        onSelect={handleSelect}
      />
    {/each}
  </div>
{/if}

<style>
  .empty-state {
    padding: 1.2rem;
  }

  .document-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    padding: 0 0.5rem;
  }

  h3 {
    font-family: var(--font-display);
    margin: 0;
  }
</style>
