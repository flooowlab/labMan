<script lang="ts">
  let { next = '/' } = $props<{ next?: string }>();

  let email = $state('');
  let password = $state('');
  let totp = $state('');
  let needsTotp = $state(false);
  let error = $state('');
  let loading = $state(false);

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    error = '';
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, totp_token: needsTotp ? totp : undefined }),
    });
    const data = await res.json();
    if (!res.ok) { error = data.error ?? 'Login failed'; loading = false; return; }
    if (data.totp_required) { needsTotp = true; loading = false; return; }
    window.location.href = next;
  }
</script>

<div style="text-align:center;margin-bottom:1.25rem">
  <h2 style="font-size:1.25rem;font-weight:700;margin:0 0 0.25rem">Login</h2>
  <!--<p style="font-size:0.85rem;color:var(--c-text-2);margin:0">This area is for lab staff and instructors only.</p>-->
</div>

{#if error}<div class="notice notice-error" style="margin-bottom:1rem">{error}</div>{/if}

<form onsubmit={submit}>
  <div class="field">
    <label for="email">Email</label>
    <input id="email" type="email" bind:value={email} required autocomplete="email" />
  </div>
  <div class="field">
    <label for="password">Password</label>
    <input id="password" type="password" bind:value={password} required autocomplete="current-password" />
  </div>
  {#if needsTotp}
    <div class="field">
      <label for="totp">Authenticator Code</label>
      <input id="totp" type="text" bind:value={totp} inputmode="numeric" pattern="[0-9]{'{'}6{'}'}" maxlength="6" required autofocus />
    </div>
  {/if}
  <button class="btn btn-primary" type="submit" disabled={loading} style="width:100%;justify-content:center">
    {loading ? 'Signing in…' : 'Sign in'}
  </button>
</form>
