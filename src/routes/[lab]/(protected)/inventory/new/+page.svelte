<script lang="ts">
  import type { PageData } from './$types';
  let { data } = $props<{ data: PageData }>();

  let error = $state('');
  let loading = $state(false);
  let trackingMode = $state('serialized');

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    loading = true;
    const fd = new FormData(e.target as HTMLFormElement);
    const isBulk = trackingMode === 'bulk';
    const body: Record<string, unknown> = {
      name: fd.get('name'),
      category: fd.get('category') || undefined,
      sku: fd.get('sku') || undefined,
      brand: fd.get('brand') || undefined,
      model: fd.get('model') || undefined,
      tracking_mode: trackingMode,
      default_location_id: fd.get('default_location_id') || undefined,
      label_size: fd.get('label_size') || 'standard',
      photo_url: fd.get('photo_url') || undefined,
      official_page_url: fd.get('official_page_url') || undefined,
      datasheet_url: fd.get('datasheet_url') || undefined,
      notes: fd.get('notes') || undefined,
      included_accessories: ((fd.get('included_accessories') as string) || '').split('\n').map(s=>s.trim()).filter(Boolean),
    };
    if (isBulk) {
      body.quantity_total = Number(fd.get('quantity_total'));
      body.quantity_available = Number(fd.get('quantity_available'));
      body.min_stock_alert = fd.get('min_stock_alert') ? Number(fd.get('min_stock_alert')) : undefined;
    }
    const res = await fetch(`/api/${data.labId}/items`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const json = await res.json();
    loading = false;
    if (!res.ok) { error = json.error ?? 'Failed to create item'; return; }
    window.location.href = `/${data.labSlug}/inventory/${json.id}`;
  }
</script>

<svelte:head><title>Add Item — Lab Manager</title></svelte:head>

<div class="ph">
  <div>
    <a href="../inventory" class="back-link">← Inventory</a>
    <h1 class="ph-title">Add Item</h1>
  </div>
</div>

<div class="card" style="max-width:640px">
  <form onsubmit={submit}>
    <div class="form-grid">
      <div class="form-group span-2">
        <label class="form-label" for="name">Name *</label>
        <input id="name" name="name" class="input-field" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="category">Category *</label>
        <input id="category" name="category" class="input-field" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="sku">SKU</label>
        <input id="sku" name="sku" class="input-field" />
      </div>
      <div class="form-group">
        <label class="form-label" for="brand">Brand</label>
        <input id="brand" name="brand" class="input-field" />
      </div>
      <div class="form-group">
        <label class="form-label" for="model">Model</label>
        <input id="model" name="model" class="input-field" />
      </div>
      <div class="form-group span-2">
        <p class="form-label">Tracking Mode *</p>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" name="tracking_mode" value="serialized" checked onchange={() => trackingMode = 'serialized'} />
            <span><strong>Serialized</strong> — individual units with serial numbers</span>
          </label>
          <label class="radio-label">
            <input type="radio" name="tracking_mode" value="bulk" onchange={() => trackingMode = 'bulk'} />
            <span><strong>Bulk</strong> — fungible stock tracked by quantity</span>
          </label>
        </div>
      </div>
      {#if trackingMode === 'bulk'}
        <div class="form-group">
          <label class="form-label" for="quantity_total">Total Quantity *</label>
          <input id="quantity_total" name="quantity_total" type="number" min="1" class="input-field" required />
        </div>
        <div class="form-group">
          <label class="form-label" for="quantity_available">Available *</label>
          <input id="quantity_available" name="quantity_available" type="number" min="0" class="input-field" required />
        </div>
        <div class="form-group">
          <label class="form-label" for="min_stock_alert">Low-Stock Alert Threshold</label>
          <input id="min_stock_alert" name="min_stock_alert" type="number" min="0" class="input-field" />
        </div>
      {/if}
      <div class="form-group">
        <label class="form-label" for="default_location_id">Default Location</label>
        <select id="default_location_id" name="default_location_id" class="input-field">
          <option value="">— None —</option>
          {#each data.locations as loc}
            <option value={loc.id}>{loc.name}</option>
          {/each}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="label_size">Label Size</label>
        <select id="label_size" name="label_size" class="input-field">
          <option value="standard">Standard</option>
          <option value="card">Card</option>
        </select>
      </div>
      <div class="form-group span-2">
        <label class="form-label" for="photo_url">Photo URL</label>
        <input id="photo_url" name="photo_url" type="url" class="input-field" placeholder="https://..." />
      </div>
      <div class="form-group span-2">
        <label class="form-label" for="included_accessories">What's included (one per line)</label>
        <textarea id="included_accessories" name="included_accessories" class="input-field" rows="3"></textarea>
      </div>
      <div class="form-group span-2">
        <label class="form-label" for="notes">Notes</label>
        <textarea id="notes" name="notes" class="input-field" rows="3"></textarea>
      </div>
    </div>
    {#if error}<p class="error-msg">{error}</p>{/if}
    <div class="form-actions">
      <a href="../inventory" class="btn btn-ghost">Cancel</a>
      <button type="submit" class="btn btn-primary" disabled={loading}>{loading ? 'Creating…' : 'Create Item'}</button>
    </div>
  </form>
</div>
