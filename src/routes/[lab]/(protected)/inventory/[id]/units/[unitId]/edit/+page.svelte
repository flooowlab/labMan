<script lang="ts">
  import type { PageData } from './$types';
  let { data } = $props<{ data: PageData }>();

  const u = $derived(data.unit);
  const backHref = $derived(`/${data.labSlug}/inventory/${data.itemId}`);

  // Normalise datetime strings to "YYYY-MM-DDThh:mm" for <input type="datetime-local">
  function toLocalInput(iso: string | null | undefined): string {
    if (!iso) return '';
    return iso.slice(0, 16); // "YYYY-MM-DDTHH:MM"
  }

  // Convert "YYYY-MM-DDThh:mm" back to full ISO string for the API
  function toIso(local: string): string | null {
    if (!local) return null;
    return new Date(local).toISOString();
  }

  let error = $state('');
  let success = $state(false);
  let loading = $state(false);

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    success = false;
    loading = true;

    const fd = new FormData(e.target as HTMLFormElement);

    const body: Record<string, unknown> = {
      serial_number: fd.get('serial_number') || null,
      asset_tag: fd.get('asset_tag') || null,
      status: fd.get('status'),
      condition: fd.get('condition'),
      location_id: fd.get('location_id') || null,
      purchase_price: fd.get('purchase_price') ? Number(fd.get('purchase_price')) : null,
      notes: fd.get('notes') || '',
    };

    const purchaseDateRaw = fd.get('purchase_date') as string;
    const warrantyRaw = fd.get('warranty_until') as string;
    body.purchase_date = purchaseDateRaw ? toIso(purchaseDateRaw) : null;
    body.warranty_until = warrantyRaw ? toIso(warrantyRaw) : null;

    const res = await fetch(`/api/${data.labId}/units/${u.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    loading = false;

    if (!res.ok) {
      error = json.error ?? 'Failed to save changes';
      return;
    }
    success = true;
    // Redirect back after a brief flash
    setTimeout(() => { window.location.href = backHref; }, 800);
  }

  async function deleteUnit() {
    if (!confirm('Delete this unit? This action cannot be undone.')) return;
    const res = await fetch(`/api/${data.labId}/units/${u.id}`, { method: 'DELETE' });
    if (res.ok) {
      window.location.href = backHref;
    } else {
      const json = await res.json();
      error = json.error ?? 'Failed to delete unit';
    }
  }
</script>

<svelte:head><title>Edit Unit {u.barcode} — Lab Manager</title></svelte:head>

<div class="ph">
  <div>
    <a href={backHref} class="back-link">← Item Detail</a>
    <h1 class="ph-title">Edit Unit</h1>
    <p class="ph-sub">{u.barcode}</p>
  </div>
</div>

<div class="card" style="max-width:600px">
  <form onsubmit={submit}>
    <div class="form-grid">

      <!-- Identity -->
      <div class="form-group span-2">
        <label class="form-label" for="serial_number">Serial Number</label>
        <input id="serial_number" name="serial_number" class="input-field" value={u.serial_number ?? ''} />
      </div>
      <div class="form-group span-2">
        <label class="form-label" for="asset_tag">Asset Tag</label>
        <input id="asset_tag" name="asset_tag" class="input-field" value={u.asset_tag ?? ''} />
      </div>

      <!-- Status & Condition -->
      <div class="form-group">
        <label class="form-label" for="status">Status *</label>
        <select id="status" name="status" class="input-field" required>
          {#each ['available','maintenance','retired','lost'] as s}
            <option value={s} selected={u.status === s}>{s}</option>
          {/each}
        </select>
        <p class="form-hint">Cannot manually set <em>borrowed</em> or <em>reserved</em>.</p>
      </div>
      <div class="form-group">
        <label class="form-label" for="condition">Condition *</label>
        <select id="condition" name="condition" class="input-field" required>
          {#each ['new','good','fair','damaged'] as c}
            <option value={c} selected={u.condition === c}>{c}</option>
          {/each}
        </select>
      </div>

      <!-- Location -->
      <div class="form-group span-2">
        <label class="form-label" for="location_id">Location</label>
        <select id="location_id" name="location_id" class="input-field">
          <option value="">— None —</option>
          {#each data.locations as loc}
            <option value={loc.id} selected={u.location_id === loc.id}>{loc.name}</option>
          {/each}
        </select>
      </div>

      <!-- Purchase info -->
      <div class="form-group">
        <label class="form-label" for="purchase_date">Purchase Date</label>
        <input id="purchase_date" name="purchase_date" type="datetime-local" class="input-field"
               value={toLocalInput(u.purchase_date)} />
      </div>
      <div class="form-group">
        <label class="form-label" for="purchase_price">Purchase Price</label>
        <input id="purchase_price" name="purchase_price" type="number" min="0" step="0.01"
               class="input-field" value={u.purchase_price ?? ''} />
      </div>
      <div class="form-group span-2">
        <label class="form-label" for="warranty_until">Warranty Until</label>
        <input id="warranty_until" name="warranty_until" type="datetime-local" class="input-field"
               value={toLocalInput(u.warranty_until)} />
      </div>

      <!-- Notes -->
      <div class="form-group span-2">
        <label class="form-label" for="notes">Notes</label>
        <textarea id="notes" name="notes" class="input-field" rows="3">{u.notes ?? ''}</textarea>
      </div>

    </div>

    {#if error}<p class="error-msg">{error}</p>{/if}
    {#if success}<p class="success-msg">Saved! Redirecting…</p>{/if}

    <div class="form-actions">
      <a href={backHref} class="btn btn-ghost">Cancel</a>
      <button type="submit" class="btn btn-primary" disabled={loading}>{loading ? 'Saving…' : 'Save Changes'}</button>
    </div>
  </form>
</div>

<div class="card mt2" style="max-width:600px;border-color:var(--color-danger,#dc2626)">
  <div class="card-head"><span class="card-title" style="color:var(--color-danger,#dc2626)">Danger Zone</span></div>
  <div class="card-body">
    <p class="text-sm text-muted mb2">Deleting a unit is permanent (soft-delete). You cannot delete a unit that is currently borrowed.</p>
    <button type="button" class="btn btn-danger" onclick={deleteUnit}>Delete Unit</button>
  </div>
</div>

<style>
  .success-msg { color: var(--color-success, #16a34a); font-size: .875rem; margin-top: .5rem; }
  .form-hint { font-size: .75rem; color: var(--color-muted, #6b7280); margin-top: .25rem; }
  .mt2 { margin-top: 1rem; }
</style>
