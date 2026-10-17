<script lang="ts">
  import type { PageData } from './$types';
  let { data } = $props<{ data: PageData }>();
  let error = $state('');
  let loading = $state(false);
  let lines = $state([{ item_id: '', quantity: 1 }]);

  function addLine() { lines = [...lines, { item_id: '', quantity: 1 }]; }
  function removeLine(idx: number) { lines = lines.filter((_, i) => i !== idx); }

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    loading = true;
    const fd = new FormData(e.target as HTMLFormElement);
    const body = {
      name: fd.get('name'),
      description: fd.get('description') || undefined,
      version: fd.get('version') || undefined,
      lines: lines.map((l) => ({ item_id: l.item_id, quantity: l.quantity })),
    };
    const res = await fetch(`/api/${data.labId}/kits`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const json = await res.json();
    loading = false;
    if (!res.ok) { error = json.error ?? 'Failed'; return; }
    window.location.href = `/${data.labSlug}/kits/${json.id}`;
  }
</script>

<svelte:head><title>New Kit — Lab Manager</title></svelte:head>

<div class="ph">
  <div>
    <a href="../kits" class="back-link">← Kits</a>
    <h1 class="ph-title">New Kit</h1>
  </div>
</div>

<div class="card" style="max-width:640px">
  <form onsubmit={submit}>
    <div class="form-grid">
      <div class="form-group span-2">
        <label class="form-label" for="name">Kit Name *</label>
        <input id="name" name="name" class="input-field" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="version">Version</label>
        <input id="version" name="version" class="input-field" placeholder="e.g. v1.0" />
      </div>
      <div class="form-group span-2">
        <label class="form-label" for="description">Description</label>
        <textarea id="description" name="description" class="input-field" rows="2"></textarea>
      </div>
    </div>

    <div class="mt2 mb1 text-sm" style="font-weight:600">Kit Lines</div>
    {#each lines as line, idx}
      <div class="flex-gap mb1">
        <input class="input-field" placeholder="Item ID" bind:value={line.item_id} style="flex:1" />
        <input class="input-field" type="number" min="1" bind:value={line.quantity} style="width:80px" />
        {#if lines.length > 1}
          <button type="button" class="btn btn-ghost btn-sm" onclick={() => removeLine(idx)}>✕</button>
        {/if}
      </div>
    {/each}
    <button type="button" class="btn btn-ghost btn-sm mb2" onclick={addLine}>+ Add Line</button>

    {#if error}<p class="error-msg">{error}</p>{/if}
    <div class="form-actions">
      <a href="../kits" class="btn btn-ghost">Cancel</a>
      <button type="submit" class="btn btn-primary" disabled={loading}>{loading ? 'Creating…' : 'Create Kit'}</button>
    </div>
  </form>
</div>
