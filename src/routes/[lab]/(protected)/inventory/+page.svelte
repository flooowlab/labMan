<script lang="ts">
  import type { PageData } from './$types';
  let { data } = $props<{ data: PageData }>();

  const canManage = ['admin', 'manager'].includes(data.role);
  let showImport = $state(false);
  let importResult = $state('');
  let importError = $state('');
  let importLoading = $state(false);

  async function importCsv(e: SubmitEvent) {
    e.preventDefault();
    importResult = ''; importError = ''; importLoading = true;
    const fd = new FormData(e.target as HTMLFormElement);
    const res = await fetch(`/api/${data.labId}/items/bulk-import`, { method: 'POST', body: fd });
    const json = await res.json();
    importLoading = false;
    if (!res.ok) { importError = json.error ?? 'Import failed'; return; }
    importResult = `Imported ${json.imported ?? json.count ?? '?'} items successfully.`;
    setTimeout(() => { showImport = false; importResult = ''; window.location.reload(); }, 2000);
  }
</script>

<svelte:head><title>Inventory — Lab Manager</title></svelte:head>

<div class="ph">
  <div><h1 class="ph-title">Inventory</h1></div>
  <div style="display:flex;gap:.5rem">
    {#if canManage}
      <button class="btn btn-secondary btn-sm" onclick={() => showImport = !showImport}>Import CSV</button>
    {/if}
    <a href="/{data.labSlug}/inventory/new" class="btn btn-primary">+ Add Item</a>
  </div>
</div>

{#if showImport && canManage}
  <div class="card mb2">
    <div class="card-head"><span class="card-title">Bulk Import via CSV</span></div>
    <div class="card-body">
      {#if importError}<div class="notice notice-error mb1">{importError}</div>{/if}
      {#if importResult}<div class="notice notice-success mb1">{importResult}</div>{/if}
      <p class="text-sm text-muted mb1">CSV must have headers: <code>name, category, tracking_mode, quantity_total, sku, description</code>.<br>tracking_mode must be <code>bulk</code> or <code>serialized</code>.</p>
      <form onsubmit={importCsv} style="display:flex;gap:.5rem;align-items:flex-end">
        <div>
          <label class="form-label">CSV File</label>
          <input class="input-field" type="file" name="csv" accept=".csv" required style="padding:.35rem" />
        </div>
        <button type="submit" class="btn btn-primary btn-sm" disabled={importLoading}>{importLoading ? 'Importing…' : 'Import'}</button>
        <button type="button" class="btn btn-ghost btn-sm" onclick={() => showImport = false}>Cancel</button>
      </form>
    </div>
  </div>
{/if}

<form method="GET" class="flex-gap mb2">
  <input name="q" value={data.q} placeholder="Search name or SKU…" style="padding:0.5rem 0.75rem;border:1px solid var(--c-border-2);min-width:220px" />
  <select name="category" style="padding:0.5rem;border:1px solid var(--c-border-2)">
    <option value="">All categories</option>
    {#each data.categories as c}
      <option value={c} selected={c === data.catFilter}>{c}</option>
    {/each}
  </select>
  <select name="mode" style="padding:0.5rem;border:1px solid var(--c-border-2)">
    <option value="">All modes</option>
    <option value="serialized" selected={data.modeFilter === 'serialized'}>Serialized</option>
    <option value="bulk" selected={data.modeFilter === 'bulk'}>Bulk</option>
  </select>
  <button type="submit" class="btn btn-secondary btn-sm">Filter</button>
  {#if data.q || data.catFilter || data.modeFilter}
    <a href="?" class="btn btn-ghost btn-sm">Clear</a>
  {/if}
</form>

<div class="card">
  <div class="table-wrap">
    {#if data.rows.length === 0}
      <p class="empty-msg">No items match your filters.</p>
    {:else}
      <table>
        <thead>
          <tr><th>Name</th><th>SKU</th><th>Category</th><th>Mode</th><th>Available</th><th></th></tr>
        </thead>
        <tbody>
          {#each data.rows as item}
            <tr>
              <td><a href="inventory/{item.id}">{item.name}</a></td>
              <td class="td-mono">{item.sku ?? '—'}</td>
              <td>{item.category ?? '—'}</td>
              <td><span class="badge badge-gray">{item.tracking_mode}</span></td>
              <td>
                <span class="badge {item.avail === 0 ? 'badge-red' : item.avail < item.total ? 'badge-yellow' : 'badge-green'}">
                  {item.avail} / {item.total}
                </span>
              </td>
              <td><a href="inventory/{item.id}" class="btn btn-ghost btn-sm">View</a></td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>
