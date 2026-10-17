<script lang="ts">
  import { onMount } from 'svelte';

  let { labId, labSlug, borrowId } = $props<{ labId: string; labSlug: string; borrowId: string }>();

  interface LineInput { line_id: string; returned_quantity: number; returned_condition: string; has_incident: boolean; label: string; remaining: number; }
  const CONDITIONS = ['new','good','fair','damaged'] as const;

  let lineInputs = $state<LineInput[]>([]);
  let notes = $state('');
  let error = $state('');
  let fetchError = $state('');
  let loading = $state(false);
  let fetching = $state(true);

  onMount(async () => {
    const res = await fetch(`/api/${labId}/borrows/${borrowId}`);
    if (!res.ok) { fetchError = 'Could not load borrow'; fetching = false; return; }
    const borrow = await res.json();
    const itemIds = [...new Set(borrow.lines.map((l: any) => l.item_id))] as string[];
    const itemMap: Record<string, string> = {};
    await Promise.all(itemIds.map(async (id) => {
      const ir = await fetch(`/api/${labId}/items/${id}`);
      if (ir.ok) { const it = await ir.json(); itemMap[id] = it.name ?? id; }
    }));
    lineInputs = borrow.lines
      .filter((l: any) => l.returned_quantity < l.quantity)
      .map((l: any) => ({ line_id: l.id, returned_quantity: l.quantity - l.returned_quantity, returned_condition: l.borrowed_condition, has_incident: false, label: itemMap[l.item_id] ?? l.item_id, remaining: l.quantity - l.returned_quantity }));
    fetching = false;
  });

  function update(idx: number, key: keyof LineInput, value: unknown) {
    lineInputs = lineInputs.map((l, i) => i === idx ? { ...l, [key]: value } : l);
  }

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    loading = true; error = '';
    const res = await fetch(`/api/${labId}/borrows/${borrowId}/return`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lines: lineInputs.map(l=>({line_id:l.line_id,returned_quantity:l.returned_quantity,returned_condition:l.returned_condition,has_incident:l.has_incident})), notes: notes||undefined }),
    });
    const data = await res.json();
    loading = false;
    if (!res.ok) { error = data.error ?? 'Return failed'; return; }
    window.location.href = `/${labSlug}/borrows/${borrowId}`;
  }
</script>

{#if fetching}
  <p style="color:var(--c-text-2)">Loading borrow…</p>
{:else if fetchError}
  <div class="notice notice-error">{fetchError}</div>
{:else if lineInputs.length === 0}
  <div class="notice notice-ok">All items already returned.</div>
{:else}
  <form onsubmit={submit}>
    {#if error}<div class="notice notice-error" style="margin-bottom:1rem">{error}</div>{/if}

    <table style="width:100%;border-collapse:collapse;margin-bottom:1.5rem;font-size:var(--text-sm)">
      <thead>
        <tr>
          <th style="text-align:left;padding:.5rem;border-bottom:2px solid var(--c-border)">Item</th>
          <th style="text-align:center;padding:.5rem;border-bottom:2px solid var(--c-border)">Qty</th>
          <th style="text-align:left;padding:.5rem;border-bottom:2px solid var(--c-border)">Condition</th>
          <th style="text-align:center;padding:.5rem;border-bottom:2px solid var(--c-border)">Incident?</th>
        </tr>
      </thead>
      <tbody>
        {#each lineInputs as l, idx}
          <tr>
            <td style="padding:.5rem;border-bottom:1px solid var(--c-border)">{l.label}</td>
            <td style="padding:.5rem;border-bottom:1px solid var(--c-border);text-align:center">
              <input type="number" min="1" max={l.remaining} value={l.returned_quantity} style="width:60px;text-align:center" onchange={(e)=>update(idx,'returned_quantity',Number((e.target as HTMLInputElement).value))} />
              <span style="color:var(--c-text-2);font-size:.8rem">/{l.remaining}</span>
            </td>
            <td style="padding:.5rem;border-bottom:1px solid var(--c-border)">
              <select value={l.returned_condition} onchange={(e)=>update(idx,'returned_condition',(e.target as HTMLSelectElement).value)} style="padding:.25rem .5rem">
                {#each CONDITIONS as c}<option value={c}>{c}</option>{/each}
              </select>
            </td>
            <td style="padding:.5rem;border-bottom:1px solid var(--c-border);text-align:center">
              <input type="checkbox" checked={l.has_incident} onchange={(e)=>update(idx,'has_incident',(e.target as HTMLInputElement).checked)} />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    <div class="form-group">
      <label class="form-label text-sm" for="notes">Notes</label>
      <textarea id="notes" class="input-field" rows="2" bind:value={notes}></textarea>
    </div>

    <div class="form-actions">
      <a href="/{labSlug}/borrows/{borrowId}" class="btn btn-ghost">Cancel</a>
      <button type="submit" class="btn btn-primary" disabled={loading}>{loading ? 'Processing…' : 'Process Return'}</button>
    </div>
  </form>
{/if}
