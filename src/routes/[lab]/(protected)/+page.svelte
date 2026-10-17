<script lang="ts">
  import type { PageData } from './$types';
  import { fmtDate, statusClass } from '$lib/utils.js';

  let { data } = $props<{ data: PageData }>();
  let overdue = $derived(data.overdue);
  let pendingRes = $derived(data.pendingRes);
  let userMap = $derived(data.userMap);
</script>

<svelte:head><title>Dashboard — Lab Manager</title></svelte:head>

<div class="ph">
  <div>
    <h1 class="ph-title">Dashboard</h1>
  </div>
  <a href="/{data.lab.slug}/borrows/new" class="btn btn-primary">New Borrow</a>
</div>

<!-- Stat tiles -->
<div class="tiles">
  <div class="tile">
    <div class="tile-label">Overdue</div>
    <div class="tile-val {overdue.length > 0 ? 'err' : 'ok'}">{overdue.length}</div>
  </div>
  <div class="tile">
    <div class="tile-label">Active Loans</div>
    <div class="tile-val">{data.activeLoans}</div>
  </div>
  <div class="tile">
    <div class="tile-label">Pending Approvals</div>
    <div class="tile-val {pendingRes.length > 0 ? 'warn' : 'ok'}">{pendingRes.length}</div>
  </div>
  <div class="tile">
    <div class="tile-label">Open Alerts</div>
    <div class="tile-val {data.openAlerts > 0 ? 'warn' : 'ok'}">{data.openAlerts}</div>
  </div>
  <div class="tile">
    <div class="tile-label">Members</div>
    <div class="tile-val">{data.memberCount}</div>
  </div>
</div>

{#if overdue.length > 0}
  <div class="card mb2">
    <div class="card-head">
      <span class="card-title">Overdue Borrows</span>
      <a href="borrows?status=overdue" class="btn btn-ghost btn-sm">View all</a>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Borrower</th><th>Due Date</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {#each overdue.slice(0, 10) as b}
            <tr>
              <td>{userMap[b.user_id] ?? b.user_id.slice(0,8)}</td>
              <td>{fmtDate(b.due_date)}</td>
              <td><span class={statusClass(b.status)}>{b.status}</span></td>
              <td><a href="borrows/{b.id}" class="btn btn-ghost btn-sm">View</a></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
{/if}

{#if pendingRes.length > 0}
  <div class="card mb2">
    <div class="card-head">
      <span class="card-title">Pending Reservations</span>
      <a href="reservations/pending" class="btn btn-ghost btn-sm">Review</a>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Requester</th><th>Start</th><th>Purpose</th><th>Status</th></tr></thead>
        <tbody>
          {#each pendingRes.slice(0, 10) as r}
            <tr>
              <td>{userMap[r.user_id] ?? r.user_id.slice(0,8)}</td>
              <td>{fmtDate(r.start_at)}</td>
              <td class="text-muted">{r.purpose?.slice(0, 60)}</td>
              <td><span class={statusClass(r.status)}>{r.status.replace('_', ' ')}</span></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
{/if}
