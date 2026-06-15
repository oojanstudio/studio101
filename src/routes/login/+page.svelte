<script lang="ts">
  import { browser } from "$app/environment";
  import { getBrowserSupabase } from "$integrations/supabase/browser";
  import Panel from "$components/ui/Panel.svelte";

  let { data } = $props();

  let email = $state("");
  let errorMessage = $state<string | null>(null);
  let successMessage = $state<string | null>(null);
  let isSendingMagicLink = $state(false);
  let isSendingGoogle = $state(false);

  async function signInWithEmail(event: SubmitEvent) {
    event.preventDefault();

    if (!browser) {
      return;
    }

    isSendingMagicLink = true;
    errorMessage = null;
    successMessage = null;

    const supabase = getBrowserSupabase();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    isSendingMagicLink = false;

    if (error) {
      errorMessage = error.message;
      return;
    }

    successMessage =
      "Magic link sent. Open the email on this device to finish sign-in.";
  }

  async function signInWithGoogle() {
    if (!browser) {
      return;
    }

    isSendingGoogle = true;
    errorMessage = null;

    const supabase = getBrowserSupabase();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      isSendingGoogle = false;
      errorMessage = error.message;
      return;
    }

    if (data.url) {
      window.location.href = data.url;
    }
  }
</script>

<div class="app-shell login-grid">
  <Panel eyebrow="Authentication" title="Login to your studio">
    <p class="copy-muted">
      Use a magic link for low-friction sign-in or jump to Google SSO through
      Supabase Auth.
    </p>

    {#if data.user}
      <div class="panel compact-callout">
        <p class="copy-muted">
          You are already signed in as <strong>{data.user?.email}</strong>.
        </p>
        <a class="button" href="/dashboard">Open dashboard</a>
      </div>
    {:else}
      <form class="stack" onsubmit={signInWithEmail}>
        <label>
          <span class="copy-muted">Email</span>
          <input
            class="field"
            bind:value={email}
            type="email"
            placeholder="name@studio101.app"
            required
          />
        </label>

        <div class="button-row">
          <button class="button" disabled={isSendingMagicLink} type="submit">
            {isSendingMagicLink
              ? "Sending magic link..."
              : "Continue with email"}
          </button>
          <button
            class="button secondary"
            disabled={isSendingGoogle}
            onclick={signInWithGoogle}
            type="button"
          >
            {isSendingGoogle ? "Redirecting..." : "Continue with Google"}
          </button>
        </div>
      </form>

      {#if successMessage}
        <p class="pill notice success">{successMessage}</p>
      {/if}

      {#if errorMessage}
        <p class="pill notice error">{errorMessage}</p>
      {/if}
    {/if}
  </Panel>
</div>

<style>
  .login-grid {
    display: grid;
  }

  .compact-callout {
    border-radius: var(--radius-md);
    padding: 1rem;
  }

  label {
    display: grid;
    gap: 0.45rem;
  }

  .notice {
    width: fit-content;
  }

  .notice.success {
    background: rgba(31, 192, 160, 0.18);
  }

  .notice.error {
    background: rgba(255, 107, 44, 0.18);
  }
</style>
