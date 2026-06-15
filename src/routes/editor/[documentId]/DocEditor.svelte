<script lang="ts">
  import { enhance } from "$app/forms";
  import DocRawPayload from "./DocRawPayload.svelte";
  import type { DocumentRecord } from "$lib/types/documents";

  interface Props {
    document: Pick<
      DocumentRecord,
      "id" | "title" | "created_at" | "updated_at"
    > & {
      doc_payload: unknown;
    };
  }

  let { document }: Props = $props();

  let payloadForm = $state<HTMLFormElement>();
  let payloadInput = $state<HTMLInputElement>();
  let payloadString = $state(JSON.stringify(document.doc_payload, null, 2));

  function formatDateTime(isoString: string): string {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  }

  function handleSavePayload(content: string) {
    payloadString = content;
    if (payloadForm && payloadInput) {
      payloadInput.value = content;
      payloadForm.requestSubmit();
    }
  }
</script>

<div class="doc-editor">
  <div class="doc-header">
    <h2 class="doc-title">{document.title ?? "Untitled design"}</h2>
    <div class="doc-info">
      <div class="info-item">
        <span class="info-label">Created</span>
        <span class="info-value">{formatDateTime(document.created_at)}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Last updated</span>
        <span class="info-value">{formatDateTime(document.updated_at)}</span>
      </div>
    </div>
  </div>

  <div class="doc-content">
    <DocRawPayload
      documentId={document.id}
      initialPayload={payloadString}
      onSaveNewPayload={handleSavePayload}
    />

    <form
      bind:this={payloadForm}
      id="payload-form"
      action="?/updatePayload"
      method="post"
      use:enhance
      style="display: none;"
    >
      <input bind:this={payloadInput} type="hidden" name="payload" />
    </form>
  </div>
</div>

<style>
  .doc-editor {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(13, 26, 45, 0.1);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
  }

  .doc-header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .doc-title {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0;
    color: rgba(13, 26, 45, 0.9);
  }

  .doc-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .info-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(13, 26, 45, 0.5);
  }

  .info-value {
    font-size: 0.95rem;
    color: rgba(13, 26, 45, 0.8);
    font-family: "Monaco", "Courier New", monospace;
  }

  .doc-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
