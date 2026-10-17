<script lang="ts">
  import type { PageData } from './$types';
  import { fmtDate, statusClass } from '$lib/utils.js';
  let { data } = $props<{ data: PageData }>();
  const r = $derived(data.res);
</script>

<svelte:head><title>Reservation — Lab Manager</title></svelte:head>

<div class="ph">
  <div>
    <h1 class="ph-title">Reservation</h1>
    <p class="ph-sub">{data.requester?.name ?? r.user_id}</p>
  </div>
  <div class="flex-gap">
    {#if data.canApproveInstructor}
      <button class="btn btn-primary btn-sm" onclick={() => fetch(`/api/${data.labId}/reservations/${r.id}/instructor-approve`,{method:'POST'}).then(()=>location.reload())}>Approve (Instructor)</button>
      <button class="btn btn-ghost btn-sm" onclick={() => fetch(`/api/${data.labId}/reservations/${r.id}/instructor-reject`,{method:'POST'}).then(()=>location.reload())}>Reject</button>
    {/if}
    {#if data.canApproveManager}
      <button class="btn btn-primary btn-sm" onclick={() => fetch(`/api/${data.labId}/reservations/${r.id}/manager-approve`,{method:'POST'}).then(()=>location.reload())}>Approve (Manager)</button>
      <button class="btn btn-ghost btn-sm" onclick={() => fetch(`/api/${data.labId}/reservations/${r.id}/manager-reject`,{method:'POST'}).then(()=>location.reload())}>Reject</button>
    {/if}
    {#if data.canConvert}
      <button class="btn btn-secondary btn-sm" onclick={() => fetch(`/api/${data.labId}/reservations/${r.id}/convert-to-borrow`,{method:'POST'}).then(()=>location.href='../../borrows')}>Convert to Borrow</button>
    {/if}
    <a href="../reservations" class="btn btn-ghost btn-sm">← Back</a>
  </div>
</div>

<div class="tiles mb2">
  <div class="tile"><div class="tile-label">Status</div><div class="tile-val"><span class={statusClass(r.status)}>{r.status.replace(/_/g,' ')}</span></div></div>
  <div class="tile"><div class="tile-label">Start</div><div class="tile-val" style="font-size:1rem">{fmtDate(r.start_at)}</div></div>
  <div class="tile"><div class="tile-label">End</div><div class="tile-val" style="font-size:1rem">{fmtDate(r.end_at)}</div></div>
</div>

<div class="card mb2">
  <div class="card-head"><span class="card-title">Items Requested</span></div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Item</th><th>Quantity</th></tr></thead>
      <tbody>
        {#each r.lines as l}
          <tr>
            <td>{data.itemMap[l.item_id] ?? l.item_id}</td>
            <td>{l.quantity}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

{#if r.purpose}
  <div class="card"><div class="card-head"><span class="card-title">Purpose</span></div><div class="card-body text-sm">{r.purpose}</div></div>
{/if}
