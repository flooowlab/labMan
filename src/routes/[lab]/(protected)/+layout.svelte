<script lang="ts">
  import type { LayoutData } from './$types';
  import type { Snippet } from 'svelte';

  interface Props { data: LayoutData; children: Snippet }
  let { data, children } = $props<Props>();

  let user = $derived(data.user);
  let membership = $derived(data.membership);
  let lab = $derived(data.lab);
  let base = $derived(`/${lab?.slug ?? ''}`);
  let role = $derived(membership?.role ?? 'viewer');
  let canManageUsers = $derived(['admin', 'manager'].includes(role));
  let canApprovePending = $derived(['admin', 'manager', 'instructor'].includes(role));
  let isAdmin = $derived(role === 'admin');
</script>

<div class="shell">
  <header class="shell-header">
    <a href="{base}/" class="shell-logo">{lab?.name ?? 'Lab Manager'}</a>
    <span class="shell-spacer"></span>
    <span class="shell-user">{user?.email} · {role}</span>
    <form method="POST" action="/api/auth/logout" style="display:inline">
      <button class="shell-logout" type="submit">Sign out</button>
    </form>
  </header>

  <div class="shell-body">
    <nav class="sidebar">
      <ul class="nav-list">
        <li class="nav-item"><a href="{base}/">Dashboard</a></li>
        <li class="nav-item"><a href="{base}/inventory">Inventory</a></li>
        <li class="nav-item"><a href="{base}/borrows">Borrows</a></li>
        <li class="nav-item"><a href="{base}/reservations">Reservations</a></li>
        {#if canApprovePending}
          <li class="nav-item"><a href="{base}/reservations/pending">Pending Approvals</a></li>
        {/if}
        {#if canManageUsers}
          <li class="nav-item"><a href="{base}/users">Users</a></li>
        {/if}
        <li class="nav-item"><a href="{base}/kits">Kits</a></li>
        <li class="nav-item"><a href="{base}/locations">Locations</a></li>
        {#if isAdmin}
          <li class="nav-item"><a href="{base}/audit">Audit Log</a></li>
        {/if}
      </ul>
    </nav>

    <main class="content">
      {@render children()}
    </main>
  </div>
</div>
