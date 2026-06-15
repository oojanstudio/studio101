<script lang="ts">
  import "$studioFeStyles/index.css";
  //import "$styles/app.css";

  let { children } = $props();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/editor", label: "Editor" },
  ];
</script>

<svelte:head>
  <title>studio101</title>
  <meta
    name="description"
    content="SvelteKit and Supabase starter for a large-scale browser design editor."
  />
</svelte:head>

{@render children()}

<style>
  /* .shell {
    min-height: 100vh;
    padding: 1rem 0 3rem;
  }

  .header {
    align-items: center;
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    margin-bottom: 1.4rem;
  }

  .brand {
    align-items: center;
    display: inline-flex;
    gap: 0.8rem;
  }

  .brand strong {
    display: block;
    font-family: var(--font-display);
    font-size: 1.1rem;
  }

  .brand small {
    color: var(--color-muted);
    display: block;
  }

  .brand-mark {
    background: linear-gradient(
      180deg,
      var(--color-accent) 0%,
      var(--color-aurora) 100%
    );
    border-radius: 18px;
    box-shadow: var(--shadow-soft);
    display: inline-block;
    height: 44px;
    width: 44px;
  }

  .nav {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .nav > a:not(.button) {
    color: var(--color-muted);
    font-weight: 600;
  }

  .main-content {
    display: grid;
    gap: 1rem;
  }

  @media (max-width: 720px) {
    .header {
      align-items: flex-start;
      flex-direction: column;
    }
  } */
</style>
