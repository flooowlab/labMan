<script lang="ts">
  import type { PageData } from './$types';
  import { fmtDate, statusClass } from '$lib/utils.js';
  let { data } = $props<{ data: PageData }>();
  const STATUSES = ['pending_instructor','pending_manager','approved','active','completed','cancelled'];
</script>

<svelte:head><title>Reservations — Lab Manager</title></svelte:head>

<div class="ph">
  <h1 class="ph-title">Reservations</h1>
  <a href="reservations/new" class="btn btn-primary">New Reservation</a>
</div>

<div class="flex-gap mb2">
  <a href="?" class="btn btn-sm {!data.statusFilter ? 'btn-primary' : 'btn-ghost'}">All</a>
  {#each STATUSES as s}
    <a href="?status={s}" class="btn btn-sm {data.statusFilter === s ? 'btn-primary' : 'btn-ghost'}">{s.replace(/_/g,' ')}</a>
  {/each}
</div>

<div class="card">
  <div class="table-wrap">
    {#if data.reservations.length === 0}
      <p class="empty-msg">No reservations found.</p>
    {:else}
      <table>
        <thead><tr><th>Requester</th><th>Start</th><th>End</th><th>Purpose</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {#each data.reservations as r}
            <tr>
              <td>{data.userMap[r.user_id] ?? r.user_id.slice(0,8)}</td>
              <td class="text-sm">{fmtDate(r.start_at)}</td>
              <td class="text-sm">{fmtDate(r.end_at)}</td>
              <td class="text-sm text-muted">{r.purpose?.slice(0,50) ?? '—'}</td>
              <td><span class={statusClass(r.status)}>{r.status.replace(/_/g,' ')}</span></td>
              <td><a href="reservations/{r.id}" class="btn btn-ghost btn-sm">View</a></td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>
