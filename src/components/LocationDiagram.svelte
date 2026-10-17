<script lang="ts">
  import { onMount } from 'svelte';

  let { labId } = $props<{ labId: string }>();

  interface LocationBucket {
    location: { id: string; name: string; room?: string; shelf?: string | null };
    items: { id: string; name: string; category: string; available_count: number; total_count: number }[];
    units: { id: string; item_name: string; barcode: string; serial_number: string|null; status: string; condition: string }[];
  }
  interface DiagramData { locations: LocationBucket[]; unassigned: { items: any[]; units: any[] }; }

  let data = $state<DiagramData | null>(null);
  let error = $state('');
  let filter = $state('');

  const STATUS_COLOR: Record<string, string> = { available: '#42be65', borrowed: '#0f62fe', reserved: '#f1c21b', maintenance: '#ff832b', retired: '#8d8d8d', lost: '#da1e28' };

  onMount(async () => {
    const res = await fetch(`/api/${labId}/locations/diagram`);
    if (!res.ok) { error = 'Failed to load diagram'; return; }
    data = await res.json();
  });

  const filtered = $derived(!data ? [] : data.locations.filter(b => !filter || b.location.name.toLowerCase().includes(filter.toLowerCase()) || b.items.some(i=>i.name.toLowerCase().includes(filter.toLowerCase()))));
</script>

{#if error}
  <div class="notice notice-error">{error}</div>
{:else if !data}
  <p style="color:var(--c-text-2);padding:2rem;text-align:center">Loading diagram…</p>
{:else}
  <div style="padding:1rem">
    <input class="input-field" style="max-width:320px;margin-bottom:1.5rem" bind:value={filter} placeholder="Filter by location or item…" />

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.25rem">
      {#each filtered as bucket}
        <div class="card">
          <div class="card-head">
            <span class="card-title">{bucket.location.name}</span>
            {#if bucket.location.room}<span class="text-sm text-muted">{bucket.location.room}{bucket.location.shelf ? ` / ${bucket.location.shelf}` : ''}</span>{/if}
          </div>

          {#if bucket.items.length > 0}
            <div style="padding:.75rem 1rem .5rem">
              <p style="font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--c-text-2);margin:0 0 .5rem">Items ({bucket.items.length})</p>
              {#each bucket.items as item}
                <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.35rem">
                  <div style="flex:1;min-width:0;font-size:.875rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{item.name}</div>
                  <div style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;flex-shrink:0">
                    {#each [item.total_count > 0 ? Math.round(item.available_count/item.total_count*100) : 0] as pct}
                    {#each [pct>=50?'#42be65':pct>=20?'#f1c21b':'#da1e28'] as col}
                    <span style="display:inline-block;width:40px;height:6px;border-radius:3px;background:#e0e0e0;overflow:hidden">
                      <span style="display:block;width:{pct}%;height:100%;background:{col}"></span>
                    </span>
                    <span style="color:var(--c-text-2)">{item.available_count}/{item.total_count}</span>
                    {/each}{/each}
                  </div>
                </div>
              {/each}
            </div>
          {/if}

          {#if bucket.units.length > 0}
            <div style="padding:.5rem 1rem .75rem">
              <p style="font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--c-text-2);margin:0 0 .5rem">Units ({bucket.units.length})</p>
              {#each bucket.units as u}
                <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.25rem;font-size:.8rem">
                  <span class="td-mono">{u.barcode}</span>
                  <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--c-text-2)">{u.item_name}</span>
                  <span style="background:{STATUS_COLOR[u.status]??'#c6c6c6'};color:#fff;font-size:.65rem;padding:.1rem .35rem;border-radius:10px;flex-shrink:0">{u.status}</span>
                </div>
              {/each}
            </div>
          {/if}

          {#if bucket.items.length === 0 && bucket.units.length === 0}
            <div style="padding:.75rem 1rem;color:var(--c-text-2);font-size:.875rem">Empty location</div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/if}
