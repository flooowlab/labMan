<script lang="ts">
  import type { PageData } from './$types';
  import { statusClass } from '$lib/utils.js';
  let { data } = $props<{ data: PageData }>();
  const i = $derived(data.item);
</script>

<svelte:head><title>{data.item.name} — Lab Manager</title></svelte:head>

<div class="ph">
  <div>
    <h1 class="ph-title">{i.name}</h1>
    <p class="ph-sub">{i.sku ?? ''} · {i.brand ?? ''} {i.model ?? ''}</p>
  </div>
  <div class="flex-gap">
    <a href="/api/{data.labId}/items/{i.id}/label" class="btn btn-ghost btn-sm" target="_blank">Print Label</a>
    {#if data.canEdit}
      <a href="{i.id}/edit" class="btn btn-secondary btn-sm">Edit</a>
    {/if}
  </div>
</div>

{#if i.image_path}
  <div class="card mb2" style="overflow:hidden">
    <img src="/api/{data.labId}/items/{i.id}/image" alt={i.name} style="width:100%;max-height:320px;object-fit:cover" />
  </div>
{/if}

<div class="card mb2">
  <div class="card-head"><span class="card-title">Details</span></div>
  <div class="card-body">
    <div class="field-row">
      <div><p class="text-xs text-muted mb1">Category</p><p>{i.category ?? '—'}</p></div>
      <div><p class="text-xs text-muted mb1">Tracking</p><p><span class="badge badge-gray">{i.tracking_mode}</span></p></div>
      <div>
        <p class="text-xs text-muted mb1">Available</p>
        <p>{data.availCount}{i.tracking_mode === 'bulk' ? ` / ${i.quantity_total}` : ` unit${data.units.length !== 1 ? 's' : ''}`}</p>
      </div>
      <div><p class="text-xs text-muted mb1">Barcode</p><p class="mono">{i.barcode ?? '—'}</p></div>
    </div>
    {#if i.notes}<p class="mt1 text-sm text-muted">{i.notes}</p>{/if}
  </div>
</div>

{#if i.tracking_mode === 'serialized'}
  <div class="card">
    <div class="card-head">
      <span class="card-title">Units ({data.units.length})</span>
      {#if data.canEdit}
        <a href="{i.id}/units/new" class="btn btn-ghost btn-sm">Add Unit</a>
      {/if}
    </div>
    <div class="table-wrap">
      {#if data.units.length === 0}
        <p class="empty-msg">No units yet.</p>
      {:else}
        <table>
          <thead><tr><th>Barcode</th><th>Serial</th><th>Asset Tag</th><th>Status</th><th>Condition</th><th></th></tr></thead>
          <tbody>
            {#each data.units as u}
              <tr>
                <td class="td-mono">{u.barcode}</td>
                <td class="td-mono">{u.serial_number ?? '—'}</td>
                <td class="td-mono">{u.asset_tag ?? '—'}</td>
                <td><span class={statusClass(u.status)}>{u.status}</span></td>
                <td><span class={statusClass(u.condition)}>{u.condition}</span></td>
                <td style="display:flex;gap:.5rem;align-items:center">
                  <a href="/api/{data.labId}/units/{u.id}/label" class="btn btn-ghost btn-sm" target="_blank">Label</a>
                  {#if data.canEdit}
                    <a href="{i.id}/units/{u.id}/edit" class="btn btn-ghost btn-sm">Edit</a>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    </div>
  </div>
{/if}
