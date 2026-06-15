<script lang="ts">
  import { enhance } from "$app/forms";

  interface Props {
    documentId: string;
    initialPayload: string;
    onSaveNewPayload?: (content: string) => void;
  }

  let { documentId, initialPayload, onSaveNewPayload = () => {} }: Props = $props();

  let payloadText = $state(initialPayload);
  let isSaving = $state(false);
  let saveError = $state<string | null>(null);
  let saveSuccess = $state(false);

  function validateJSON(text: string): boolean {
    try {
      JSON.parse(text);
      return true;
    } catch {
      return false;
    }
  }

  function handleSave() {
    saveError = null;
    saveSuccess = false;

    if (!payloadText.trim()) {
      saveError = "Payload cannot be empty.";
      return;
    }

    if (!validateJSON(payloadText)) {
      saveError = "Invalid JSON syntax. Please check and try again.";
      return;
    }

    isSaving = true;
    onSaveNewPayload(payloadText);
    saveSuccess = true;

    setTimeout(() => {
      saveSuccess = false;
      isSaving = false;
    }, 2000);
  }

  function handlePayloadChange(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    payloadText = target.value;
  }
</script>

<div class="doc-raw-payload">
  <div class="drp-header">
    <h3 class="drp-title">Payload</h3>
  </div>

  <textarea
    class="drp-textarea"
    value={payloadText}
    onchange={handlePayloadChange}
    oninput={handlePayloadChange}
    placeholder="Enter valid JSON payload"
    disabled={isSaving}
  ></textarea>

  <div class="drp-footer">
    {#if saveError}
      <p class="drp-error">{saveError}</p>
    {/if}
    {#if saveSuccess}
      <p class="drp-success">✓ Saved successfully</p>
    {/if}
    <button class="drp-save-btn" onclick={handleSave} disabled={isSaving}>
      {isSaving ? "Saving..." : "UPDATE"}
    </button>
  </div>
</div>

<style>
  .doc-raw-payload {
    background: rgba(255, 255, 255, 0.82);
    border: 1px solid rgba(13, 26, 45, 0.1);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    overflow: hidden;
    padding: 1rem;
  }

  .drp-header {
    margin-bottom: 0.25rem;
  }

  .drp-title {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0;
    color: rgba(13, 26, 45, 0.8);
  }

  .drp-textarea {
    background: rgba(13, 26, 45, 0.03);
    border: 1px solid rgba(13, 26, 45, 0.15);
    border-radius: 8px;
    font-family: "Monaco", "Courier New", monospace;
    font-size: 0.8rem;
    line-height: 1.5;
    min-height: 200px;
    max-height: 400px;
    overflow-y: auto;
    padding: 0.75rem;
    resize: vertical;
    color: rgba(13, 26, 45, 0.85);
  }

  .drp-textarea:focus {
    outline: none;
    border-color: var(--color-accent, #ff6b2c);
    background: rgba(255, 107, 44, 0.04);
  }

  .drp-textarea:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .drp-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(13, 26, 45, 0.08);
  }

  .drp-error {
    color: #c03800;
    font-size: 0.8rem;
    margin: 0;
    flex: 1;
  }

  .drp-success {
    color: #2d7c3e;
    font-size: 0.8rem;
    margin: 0;
    flex: 1;
  }

  .drp-save-btn {
    background: var(--color-accent, #ff6b2c);
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.5rem 1rem;
    transition:
      background 180ms ease,
      opacity 180ms ease;
    white-space: nowrap;
  }

  .drp-save-btn:hover:not(:disabled) {
    background: #ff5a0c;
  }

  .drp-save-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
