<script lang="ts">
  import type { PageData } from './$types';
  let { data } = $props<{ data: PageData }>();
  const i = data.item;
  let error = $state('');
  let loading = $state(false);
  let imageFile = $state<File | null>(null);

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    loading = true;
    const fd = new FormData(e.target as HTMLFormElement);
    const body: Record<string, unknown> = {
      name: fd.get('name'),
      category: fd.get('category') || undefined,
      sku: fd.get('sku') || undefined,
      brand: fd.get('brand') || undefined,
      model: fd.get('model') || undefined,
      default_location_id: fd.get('default_location_id') || undefined,
      label_size: fd.get('label_size') || 'standard',
      photo_url: fd.get('photo_url') || undefined,
      notes: fd.get('notes') || undefined,
      included_accessories: ((fd.get('included_accessories') as string) || '').split('\n').map(s=>s.trim()).filter(Boolean),
    };
    const res = await fetch(`/api/${data.labId}/items/${i.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) { const j = await res.json(); error = j.error ?? 'Failed to update'; loading = false; return; }

    // Upload image if provided
    if (imageFile) {
      const imgFd = new FormData();
      imgFd.append('image', imageFile);
      const imgRes = await fetch(`/api/${data.labId}/items/${i.id}/image`, { method: 'POST', body: imgFd });
      if (!imgRes.ok) { error = 'Item saved but image upload failed.'; loading = false; return; }
    }

    window.location.href = `/${data.labSlug}/inventory/${i.id}`;
  }
</script>

<svelte:head><title>Edit {data.item.name} — Lab Manager</title></svelte:head>

<div class="ph">
  <div>
    <a href="../../{i.id}" class="back-link">← {i.name}</a>
    <h1 class="ph-title">Edit Item</h1>
  </div>
</div>

<div class="card" style="max-width:640px">
  <form onsubmit={submit}>
    <div class="form-grid">
      <div class="form-group span-2">
        <label class="form-label" for="name">Name *</label>
        <input id="name" name="name" class="input-field" required value={i.name} />
      </div>
      <div class="form-group">
        <label class="form-label" for="category">Category</label>
        <input id="category" name="category" class="input-field" value={i.category ?? ''} />
      </div>
      <div class="form-group">
        <label class="form-label" for="sku">SKU</label>
        <input id="sku" name="sku" class="input-field" value={i.sku ?? ''} />
      </div>
      <div class="form-group">
        <label class="form-label" for="brand">Brand</label>
        <input id="brand" name="brand" class="input-field" value={i.brand ?? ''} />
      </div>
      <div class="form-group">
        <label class="form-label" for="model">Model</label>
        <input id="model" name="model" class="input-field" value={i.model ?? ''} />
      </div>
      <div class="form-group span-2">
        <label class="form-label" for="image-upload">Item Image</label>
        {#if i.image_path}
          <div style="margin-bottom:0.5rem">
            <img src="/api/{data.labId}/items/{i.id}/image" alt={i.name} style="max-height:140px;border-radius:4px;object-fit:cover" />
          </div>
        {/if}
        <input id="image-upload" type="file" accept="image/jpeg,image/png,image/webp" class="input-field" onchange={(e)=>imageFile=(e.target as HTMLInputElement).files?.[0]??null} />
        <p class="text-xs text-muted mt1">Upload a JPG, PNG, or WebP image (max 5 MB). This replaces the current image.</p>
      </div>
      <div class="form-group span-2">
        <label class="form-label" for="photo_url">Photo URL <span class="text-muted" style="font-weight:400">(external link)</span></label>
        <input id="photo_url" name="photo_url" type="url" class="input-field" value={i.photo_url ?? ''} placeholder="https://..." />
      </div>
      <div class="form-group">
        <label class="form-label" for="default_location_id">Default Location</label>
        <select id="default_location_id" name="default_location_id" class="input-field">
          <option value="">— None —</option>
          {#each data.locations as loc}
            <option value={loc.id} selected={loc.id === i.default_location_id}>{loc.name}</option>
          {/each}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="label_size">Label Size</label>
        <select id="label_size" name="label_size" class="input-field">
          <option value="standard" selected={i.label_size === 'standard'}>Standard</option>
          <option value="card" selected={i.label_size === 'card'}>Card</option>
        </select>
      </div>
      <div class="form-group span-2">
        <label class="form-label" for="included_accessories">What's included (one per line)</label>
        <textarea id="included_accessories" name="included_accessories" class="input-field" rows="3">{(i.included_accessories ?? []).join('\n')}</textarea>
      </div>
      <div class="form-group span-2">
        <label class="form-label" for="notes">Notes</label>
        <textarea id="notes" name="notes" class="input-field" rows="3">{i.notes ?? ''}</textarea>
      </div>
    </div>
    {#if error}<p class="error-msg">{error}</p>{/if}
    <div class="form-actions">
      <a href="../../{i.id}" class="btn btn-ghost">Cancel</a>
      <button type="submit" class="btn btn-primary" disabled={loading}>{loading ? 'Saving…' : 'Save Changes'}</button>
    </div>
  </form>
</div>
