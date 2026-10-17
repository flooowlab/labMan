<script lang="ts">
  import type { PageData } from './$types';
  import { fmtDate, statusClass } from '$lib/utils.js';
  let { data } = $props<{ data: PageData }>();
</script>

<svelte:head><title>Pending Approvals — Lab Manager</title></svelte:head>

<div class="ph"><h1 class="ph-title">Pending Approvals</h1></div>

{#if data.pending.length === 0}
  <div class="card"><p class="empty-msg">No pending reservations.</p></div>
{:else}
  <div class="card">
    <div class="table-wrap">
      <table>
        <thead><tr><th>Requester</th><th>Start</th><th>Purpose</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {#each data.pending as r}
            <tr>
              <td>{data.userMap[r.user_id] ?? r.user_id.slice(0,8)}</td>
              <td class="text-sm">{fmtDate(r.start_at)}</td>
              <td class="text-sm text-muted">{r.purpose?.slice(0,60)}</td>
              <td><span class={statusClass(r.status)}>{r.status.replace(/_/g,' ')}</span></td>
              <td><a href="../reservations/{r.id}" class="btn btn-ghost btn-sm">Review</a></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
{/if}
