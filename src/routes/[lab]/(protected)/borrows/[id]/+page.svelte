<script lang="ts">
  import type { PageData } from './$types';
  import { fmtDate, statusClass } from '$lib/utils.js';
  let { data } = $props<{ data: PageData }>();

  async function printBorrow() {
    // Open the print endpoint in a new tab — token passed in the URL fragment only to avoid proxy logs,
    // but since this is an HTML page print the token goes in the query per the /print route's contract.
    // The print route validates via Authorization header; we POST to get the print HTML then print it.
    const res = await fetch(`/api/${data.labId}/borrows/${data.borrow.id}/print`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${data.printToken}` },
    });
    if (!res.ok) { alert('Could not generate print form.'); return; }
    const html = await res.text();
    const w = window.open('', '_blank');
    if (!w) { alert('Allow pop-ups to print.'); return; }
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  }
</script>

<svelte:head><title>Borrow Detail — Lab Manager</title></svelte:head>

<div class="ph">
  <div>
    <h1 class="ph-title">Borrow Detail</h1>
    <p class="ph-sub">Borrower: {data.borrower?.name ?? data.borrow.user_id}</p>
  </div>
  <div class="flex-gap">
    {#if data.canReturn}
      <a href="return" class="btn btn-primary">Process Return</a>
    {/if}
    <button class="btn btn-ghost btn-sm" onclick={() => printBorrow()}>Print Form</button>
    <a href="../borrows" class="btn btn-ghost btn-sm">← Back</a>
  </div>
</div>

<div class="tiles mb2">
  <div class="tile">
    <div class="tile-label">Status</div>
    <div class="tile-val"><span class={statusClass(data.borrow.status)}>{data.borrow.status}</span></div>
  </div>
  <div class="tile">
    <div class="tile-label">Borrowed</div>
    <div class="tile-val" style="font-size:1rem">{fmtDate(data.borrow.borrowed_at)}</div>
  </div>
  <div class="tile">
    <div class="tile-label">Due Date</div>
    <div class="tile-val {data.borrow.status === 'overdue' ? 'err' : ''}" style="font-size:1rem">{fmtDate(data.borrow.due_date)}</div>
  </div>
  <div class="tile">
    <div class="tile-label">Lines</div>
    <div class="tile-val" style="font-size:1rem">{data.borrow.lines.length}</div>
  </div>
</div>

<div class="card mb2">
  <div class="card-head"><span class="card-title">Items</span></div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Item</th><th>Unit</th><th>Qty</th><th>Returned</th><th>Condition In</th><th>Condition Out</th></tr></thead>
      <tbody>
        {#each data.borrow.lines as l}
          <tr>
            <td>{data.itemMap[l.item_id] ?? l.item_id}</td>
            <td class="td-mono">{l.unit_id ? (data.unitMap[l.unit_id] ?? l.unit_id) : '—'}</td>
            <td>{l.quantity}</td>
            <td>{l.returned_quantity} / {l.quantity}</td>
            <td>{l.borrowed_condition ? l.borrowed_condition : '—'}</td>
            <td>{l.returned_condition ? l.returned_condition : '—'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

{#if data.borrow.notes}
  <div class="card">
    <div class="card-head"><span class="card-title">Notes</span></div>
    <div class="card-body text-sm">{data.borrow.notes}</div>
  </div>
{/if}
