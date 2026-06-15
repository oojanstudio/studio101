<script lang="ts">
  interface Props {
    label: string;
    value: string;
  }

  let { label, value }: Props = $props();
</script>

<div class="pill metric-pill">
  <span>{label}</span>
  <strong>{value}</strong>
</div>

<style>
  .metric-pill {
    justify-content: space-between;
    min-width: 148px;
  }

  span {
    color: var(--color-muted);
  }

  strong {
    color: var(--color-ink);
    font-family: var(--font-display);
  }
</style>
