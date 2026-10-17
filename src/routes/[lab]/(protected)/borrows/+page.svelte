<script lang="ts">
  import type { PageData } from './$types';
  import { fmtDate, statusClass } from '$lib/utils.js';
  let { data } = $props<{ data: PageData }>();
  const STATUSES = ['active', 'overdue', 'partially_returned', 'returned', 'cancelled'];
</script>

<svelte:head><title>Borrows — Lab Manager</title></svelte:head>

<div class="ph">
  <h1 class="ph-title">Borrows</h1>
  {#if data.canCreate}<a href="borrows/new" class="btn btn-primary">New Borrow</a>{/if}
</div>

<div class="flex-gap mb2">
  <a href="?" class="btn btn-sm {!data.statusFilter ? 'btn-primary' : 'btn-ghost'}">All</a>
  {#each STATUSES as s}
    <a href="?status={s}" class="btn btn-sm {data.statusFilter === s ? 'btn-primary' : 'btn-ghost'}">{s}</a>
  {/each}
</div>

<div class="card">
  <div class="table-wrap">
    {#if data.borrows.length === 0}
      <p class="empty-msg">No borrows found.</p>
    {:else}
      <table>
        <thead><tr><th>Borrower</th><th>Items</th><th>Borrowed</th><th>Due</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {#each data.borrows as b}
            <tr>
              <td>{data.userMap[b.user_id] ?? b.user_id.slice(0,8)}</td>
              <td class="text-sm">{b.lines.length} line{b.lines.length !== 1 ? 's' : ''}</td>
              <td class="text-sm">{fmtDate(b.borrowed_at)}</td>
              <td class="text-sm {b.status === 'overdue' ? 'badge-red' : ''}">{fmtDate(b.due_date)}</td>
              <td><span class={statusClass(b.status)}>{b.status}</span></td>
              <td><a href="borrows/{b.id}" class="btn btn-ghost btn-sm">View</a></td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>
