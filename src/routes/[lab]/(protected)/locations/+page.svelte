<script lang="ts">
  import type { PageData } from './$types';
  let { data } = $props<{ data: PageData }>();
  let showCreate = $state(false);
  let createError = $state('');
  let createLoading = $state(false);

  const canManage = ['admin', 'manager'].includes(data.role);

  async function createLocation(e: SubmitEvent) {
    e.preventDefault();
    createError = ''; createLoading = true;
    const fd = new FormData(e.target as HTMLFormElement);
    const res = await fetch(`/api/${data.labId}/locations`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: fd.get('name'), description: fd.get('description') || undefined }),
    });
    const json = await res.json();
    createLoading = false;
    if (!res.ok) { createError = json.error ?? 'Failed'; return; }
    window.location.reload();
  }
</script>

<svelte:head><title>Locations — Lab Manager</title></svelte:head>

<div class="ph">
  <h1 class="ph-title">Locations</h1>
  <div class="flex-gap">
    <a href="/{data.labSlug}/locations/diagram" class="btn btn-ghost btn-sm">Floor Plan →</a>
    {#if canManage}
      <button class="btn btn-primary btn-sm" onclick={() => showCreate = !showCreate}>+ New Location</button>
    {/if}
  </div>
</div>

{#if showCreate && canManage}
  <div class="card mb2">
    <div class="card-head"><span class="card-title">Create Location</span></div>
    <div class="card-body">
      {#if createError}<div class="notice notice-error mb1">{createError}</div>{/if}
      <form onsubmit={createLocation} style="display:flex;flex-direction:column;gap:0.75rem;max-width:480px">
        <div>
          <label class="form-label">Name <span style="color:var(--c-danger)">*</span></label>
          <input class="input-field" name="name" required placeholder="e.g. Storage Room A" />
        </div>
        <div>
          <label class="form-label">Description</label>
          <input class="input-field" name="description" placeholder="Optional description" />
        </div>
        <div class="flex-gap">
          <button type="submit" class="btn btn-primary btn-sm" disabled={createLoading}>
            {createLoading ? 'Creating…' : 'Create'}
          </button>
          <button type="button" class="btn btn-ghost btn-sm" onclick={() => showCreate = false}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
{/if}

<div class="card">
  <div class="table-wrap">
    {#if data.locations.length === 0}
      <p class="empty-msg">No locations defined.</p>
    {:else}
      <table>
        <thead><tr><th>Name</th><th>Description</th><th></th></tr></thead>
        <tbody>
          {#each data.locations as loc}
            <tr>
              <td>{loc.name}</td>
              <td class="text-sm text-muted">{loc.description ?? '—'}</td>
              <td><a href="/{data.labSlug}/locations/diagram" class="btn btn-ghost btn-sm">Diagram</a></td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>
