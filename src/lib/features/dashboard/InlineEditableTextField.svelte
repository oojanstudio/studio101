<script lang="ts">
  import { onDestroy, tick } from "svelte";

  type EditResult = string | Error;

  interface Props {
    text: string;
    onEditText: (text: string) => EditResult | Promise<EditResult>;
    ariaLabel?: string;
  }

  let { text, onEditText, ariaLabel = "Edit text" }: Props = $props();

  let inputElement = $state<HTMLInputElement>();
  let editing = $state(false);
  let saving = $state(false);
  let showError = $state(false);
  let draftText = $state("");
  let committedText = $state("");
  let errorTimer: ReturnType<typeof setTimeout> | undefined;
  let saveToken = 0;
  let latestPropText = "";

  $effect(() => {
    if (text !== latestPropText && !editing && !saving) {
      latestPropText = text;
      committedText = text;
      draftText = text;
    }
  });

  onDestroy(() => {
    if (errorTimer) {
      clearTimeout(errorTimer);
    }
  });

  async function startEditing() {
    if (saving) return;
    clearError();
    draftText = committedText;
    editing = true;
    await tick();
    inputElement?.focus();
    inputElement?.select();
  }

  function stopEditingIfUnchanged() {
    if (draftText === committedText) {
      editing = false;
    }
  }

  async function saveDraft() {
    const nextText = draftText;
    const previousText = committedText;
    const currentToken = ++saveToken;

    clearError();
    editing = false;
    saving = true;

    try {
      const result = await onEditText(nextText);
      if (currentToken !== saveToken) return;

      if (result instanceof Error) {
        showSaveError(previousText);
        return;
      }

      latestPropText = result;
      committedText = result;
      draftText = result;
    } catch {
      if (currentToken === saveToken) {
        showSaveError(previousText);
      }
    } finally {
      if (currentToken === saveToken) {
        saving = false;
      }
    }
  }

  function showSaveError(previousText: string) {
    committedText = previousText;
    draftText = previousText;
    showError = true;
    errorTimer = setTimeout(() => {
      showError = false;
      errorTimer = undefined;
    }, 5000);
  }

  function clearError() {
    showError = false;
    if (errorTimer) {
      clearTimeout(errorTimer);
      errorTimer = undefined;
    }
  }

  function handleBlur() {
    if (!editing) return;

    if (draftText !== committedText) {
      void saveDraft();
      return;
    }

    stopEditingIfUnchanged();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      void saveDraft();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      draftText = committedText;
      editing = false;
    }
  }
</script>

<span class="inline-edit" class:editing class:saving class:error={showError}>
  <span class="text-sizer" aria-hidden="true">{editing ? draftText : committedText}</span>

  {#if editing}
    <input
      bind:this={inputElement}
      class="text-input"
      bind:value={draftText}
      aria-label={ariaLabel}
      onblur={handleBlur}
      onkeydown={handleKeydown}
    />
  {:else}
    <span class="text-label">{committedText}</span>
  {/if}

  <span class="status-slot" aria-hidden="true">
    {#if saving}
      <span class="spinner"></span>
    {:else if showError}
      <svg class="status-icon error-icon" viewBox="0 0 16 16">
        <path d="M8 1.4 14.6 14H1.4L8 1.4Zm0 4.1v3.9m0 2.4h.01" />
      </svg>
    {:else}
      <button
        type="button"
        class="edit-button"
        aria-label={ariaLabel}
        onclick={startEditing}
      >
        <svg class="status-icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d="m10.9 2.2 2.9 2.9-7.4 7.4-3.4.5.5-3.4 7.4-7.4Z" />
          <path d="m9.6 3.5 2.9 2.9" />
        </svg>
      </button>
    {/if}
  </span>
</span>

<style>
  .inline-edit {
    align-items: center;
    background: inherit;
    color: inherit;
    display: inline-grid;
    font: inherit;
    grid-template-columns: minmax(1ch, auto) 1.25em;
    line-height: inherit;
    max-width: 100%;
    min-width: 0;
    position: relative;
    vertical-align: baseline;
  }

  .text-sizer,
  .text-label,
  .text-input {
    font: inherit;
    grid-column: 1;
    grid-row: 1;
    letter-spacing: inherit;
    line-height: inherit;
    min-width: 1ch;
    white-space: pre;
  }

  .text-sizer {
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
  }

  .text-label {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .text-input {
    appearance: none;
    background: inherit;
    border: 0;
    border-radius: 0;
    box-sizing: border-box;
    color: inherit;
    margin: 0;
    outline: 1px solid currentColor;
    outline-offset: 2px;
    padding: 0;
    width: 100%;
  }

  .status-slot {
    align-items: center;
    display: inline-flex;
    grid-column: 2;
    grid-row: 1;
    height: 1em;
    justify-content: center;
    margin-left: 0.25em;
    width: 1em;
  }

  .edit-button {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    height: 1.15em;
    justify-content: center;
    margin: 0;
    opacity: 0;
    padding: 0;
    transition: opacity 120ms ease;
    width: 1.15em;
  }

  .inline-edit:hover .edit-button,
  .edit-button:focus-visible {
    opacity: 0.65;
  }

  .edit-button:hover {
    opacity: 1;
  }

  .status-icon {
    fill: none;
    height: 1em;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.6;
    width: 1em;
  }

  .error-icon {
    color: #c62828;
  }

  .spinner {
    animation: spin 800ms linear infinite;
    border: 0.13em solid currentColor;
    border-radius: 999px;
    border-right-color: transparent;
    box-sizing: border-box;
    display: inline-block;
    height: 0.9em;
    opacity: 0.7;
    width: 0.9em;
  }

  .saving .text-label,
  .error .text-label {
    padding-right: 0;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
