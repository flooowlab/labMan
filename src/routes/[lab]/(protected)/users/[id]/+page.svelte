<script lang="ts">
  import type { PageData } from './$types';
  import { fmtDate, statusClass } from '$lib/utils.js';
  let { data } = $props<{ data: PageData }>();
  const u = $derived(data.targetUser);
</script>

<svelte:head><title>{u.name} — Lab Manager</title></svelte:head>

<div class="ph">
  <div>
    <a href="../users" class="back-link">← Users</a>
    <h1 class="ph-title">{u.name}</h1>
    <p class="text-muted text-sm">{u.email}</p>
  </div>
  {#if data.isManagerPlus}
    <a href="/api/{data.labId}/users/{u.id}/export" class="btn btn-secondary btn-sm" target="_blank">Export Data</a>
  {/if}
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
  <div class="card">
    <div class="card-head"><span class="card-title">Profile</span></div>
    <dl class="def-list">
      <dt>Name</dt><dd>{u.name}</dd>
      <dt>Email</dt><dd>{u.email}</dd>
      <dt>RFID Tag</dt><dd class="td-mono">{u.rfid_tag ?? '—'}</dd>
      <dt>Status</dt>
      <dd>
        <span class="badge {u.is_active ? 'badge-green' : 'badge-red'}">{u.is_active ? 'Active' : 'Inactive'}</span>
        {#if u.redacted_at}<span class="badge badge-gray" style="margin-left:0.25rem">PII Redacted</span>{/if}
      </dd>
      <dt>2FA</dt>
      <dd><span class="badge {u.totp_enabled ? 'badge-green' : 'badge-gray'}">{u.totp_enabled ? 'Enabled' : 'Disabled'}</span></dd>
    </dl>
  </div>

  <div class="card">
    <div class="card-head"><span class="card-title">Membership</span></div>
    <dl class="def-list">
      <dt>Role</dt><dd><span class="badge badge-blue">{data.membership.role}</span></dd>
      <dt>Type</dt><dd>{data.membership.user_type ?? '—'}</dd>
      <dt>No-Shows</dt><dd>{data.membership.no_show_count}</dd>
      <dt>Restricted Until</dt><dd>{data.membership.borrow_restricted_until ? fmtDate(data.membership.borrow_restricted_until) : '—'}</dd>
    </dl>
  </div>
</div>

<div class="card">
  <div class="card-head"><span class="card-title">Borrow History</span></div>
  <div class="table-wrap">
    {#if data.borrows.length === 0}
      <p class="empty-msg">No borrows found.</p>
    {:else}
      <table>
        <thead><tr><th>Borrowed</th><th>Due</th><th>Status</th><th>Lines</th><th></th></tr></thead>
        <tbody>
          {#each data.borrows as b}
            <tr>
              <td class="text-sm">{fmtDate(b.borrowed_at)}</td>
              <td class="text-sm">{fmtDate(b.due_date)}</td>
              <td><span class={statusClass(b.status)}>{b.status}</span></td>
              <td class="text-sm">{b.lines.length}</td>
              <td><a href="../../borrows/{b.id}" class="btn btn-ghost btn-sm">View</a></td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>
