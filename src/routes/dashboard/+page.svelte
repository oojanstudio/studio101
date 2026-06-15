<script lang="ts">
  import DocumentSummaryList from "$features/dashboard/DocumentSummaryList.svelte";
  import Panel from "$components/ui/Panel.svelte";
  import { goto } from "$app/navigation";
  import { ButtonGroup, StyledTextbox, LeftAppBar } from "studio-fe-components";
  import SiteTopBar from "../../apps/layouts/SiteTopBar.svelte";

  type ButtonOption = {
    label: string;
    code: string;
  };

  let { data, form } = $props();
  let sampleTitle = $state("Hero Concept");
  let selectedDensity = $state<string | null>("balanced");

  const densityOptions: ButtonOption[] = [
    { label: "Compact", code: "compact" },
    { label: "Balanced", code: "balanced" },
    { label: "Airy", code: "airy" },
  ];
</script>

<div class="shell flxrows">
  <SiteTopBar />
  <div class="mainspace flxcols">
    <div>
      <LeftAppBar />
    </div>
    <div class="content">
      <Panel eyebrow="Dashboard" title="Your design documents">
        {@render renderDashboard()}
      </Panel>
      <DocumentSummaryList
        documents={data.documents}
        thumbnailsByDocId={data.thumbnailsByDocId}
      />
    </div>
  </div>
</div>

{#snippet renderDashboard()}
  <p class="copy-muted">
    Signed in as <strong>{data.user?.email}</strong>. New documents are created
    in Supabase and open directly in the editor route.
  </p>

  <form action="?/createDocument" class="create-form" method="post">
    <input
      class="field"
      name="title"
      placeholder="Campaign cover, social card, pitch slide..."
      required
    />
    <button class="button" type="submit">Create new document</button>
  </form>
{/snippet}

<!-- <div class="app-shell dashboard-grid">
  <Panel eyebrow="Dashboard" title="Your design documents">
    <p class="copy-muted">
      Signed in as <strong>{data.user?.email}</strong>. New documents are
      created in Supabase and open directly in the editor route.
    </p>

    <form action="?/createDocument" class="create-form" method="post">
      <input
        class="field"
        name="title"
        placeholder="Campaign cover, social card, pitch slide..."
        required
      />
      <button class="button" type="submit">Create new document</button>
    </form>

    {#if form?.createError}
      <p class="pill notice">{form.createError}</p>
    {/if}

    {#if data.documentsError}
      <p class="pill notice">{data.documentsError}</p>
    {/if}

    <section class="library-proof">
      <p class="eyebrow">studio-fe-components verification</p>
      <StyledTextbox
        label="Draft title"
        placeholder="Type to verify StyledTextbox"
        hint="This control is rendered from studio-fe-components."
        bind:value={sampleTitle}
      />
      <ButtonGroup buttons={densityOptions} bind:value={selectedDensity} />
      <p class="copy-muted">
        Live value: <strong>{sampleTitle || "(empty)"}</strong> | Density:
        <strong>{selectedDensity ?? "none"}</strong>
      </p>
    </section>
  </Panel>

  <DocumentSummaryList documents={data.documents} />

  <button
    onclick={() => goto("/logout")}
    class="button secondary"
    type="button"
  >
    Sign out
  </button>
</div> -->

<style>
  .shell {
    min-height: 100vh;
    width: 100%;
    margin: 0 auto;
  }

  .flxcols {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    align-content: stretch;
  }

  .flxrows {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    align-content: stretch;
  }

  .mainspace {
    flex-grow: 1;
    @apply gap-4 h-full;
  }

  .content {
    flex-grow: 1;
    padding: 1rem;
  }

  .dashboard-grid {
    display: grid;
    gap: 1rem;
  }

  .create-form {
    display: grid;
    gap: 0.8rem;
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .notice {
    background: rgba(255, 107, 44, 0.18);
    width: fit-content;
  }

  .library-proof {
    border-top: 1px dashed rgba(17, 58, 93, 0.2);
    display: grid;
    gap: 0.75rem;
    margin-top: 0.8rem;
    padding-top: 1rem;
  }

  @media (max-width: 720px) {
    .create-form {
      grid-template-columns: 1fr;
    }
  }
</style>
