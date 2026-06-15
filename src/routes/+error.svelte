<script lang="ts">
  let { error, status } = $props();
</script>

<div class="app-shell error-shell">
  <section class="panel error-panel">
    <p class="eyebrow">Error {status}</p>
    <h1 class="section-title">Something blocked this route.</h1>
    <p class="copy-muted">
      {error?.message ?? "An unexpected application error occurred."}
    </p>
    <div class="button-row">
      <a class="button" href="/">Go home</a>
      <a class="button secondary" href="/dashboard">Dashboard</a>
    </div>
  </section>
</div>

<style>
  .error-shell {
    display: grid;
    min-height: 70vh;
    place-items: center;
  }

  .error-panel {
    max-width: 720px;
    padding: 2rem;
  }
</style>
