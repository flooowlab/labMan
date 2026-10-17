<script lang="ts">
  import type { PageData } from './$types';
  let { data } = $props<{ data: PageData }>();
  let error = $state('');
  let loading = $state(false);

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    loading = true;
    const fd = new FormData(e.target as HTMLFormElement);
    const body = {
      serial_number: fd.get('serial_number') || undefined,
      asset_tag: fd.get('asset_tag') || undefined,
      condition: fd.get('condition'),
      notes: fd.get('notes') || undefined,
    };
    const res = await fetch(`/api/${data.labId}/items/${data.itemId}/units`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const json = await res.json();
    loading = false;
    if (!res.ok) { error = json.error ?? 'Failed'; return; }
    window.location.href = `/${data.labSlug}/inventory/${data.itemId}`;
  }
</script>

<svelte:head><title>Add Unit — Lab Manager</title></svelte:head>

<div class="ph">
  <div>
    <a href="../../../{data.itemId}" class="back-link">← Item Detail</a>
    <h1 class="ph-title">Add Unit</h1>
  </div>
</div>

<div class="card" style="max-width:480px">
  <form onsubmit={submit}>
    <div class="form-grid">
      <div class="form-group span-2">
        <label class="form-label" for="serial_number">Serial Number</label>
        <input id="serial_number" name="serial_number" class="input-field" />
      </div>
      <div class="form-group span-2">
        <label class="form-label" for="asset_tag">Asset Tag</label>
        <input id="asset_tag" name="asset_tag" class="input-field" />
      </div>
      <div class="form-group span-2">
        <label class="form-label" for="condition">Condition *</label>
        <select id="condition" name="condition" class="input-field" required>
          <option value="new">New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>
      </div>
      <div class="form-group span-2">
        <label class="form-label" for="notes">Notes</label>
        <textarea id="notes" name="notes" class="input-field" rows="2"></textarea>
      </div>
    </div>
    {#if error}<p class="error-msg">{error}</p>{/if}
    <div class="form-actions">
      <a href="../../../{data.itemId}" class="btn btn-ghost">Cancel</a>
      <button type="submit" class="btn btn-primary" disabled={loading}>{loading ? 'Adding…' : 'Add Unit'}</button>
    </div>
  </form>
</div>
