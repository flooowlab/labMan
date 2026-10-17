<script lang="ts">
  import type { PageData } from './$types';
  let { data } = $props<{ data: PageData }>();
  const k = data.kit;
</script>

<svelte:head><title>{k.name} — Lab Manager</title></svelte:head>

<div class="ph">
  <div>
    <a href="../kits" class="back-link">← Kits</a>
    <h1 class="ph-title">{k.name}</h1>
    {#if k.version}<p class="ph-sub">{k.version}</p>{/if}
  </div>
  <a href="/{data.labSlug}/borrows/new?kit_id={k.id}" class="btn btn-primary">Borrow this Kit</a>
</div>

{#if k.description}
  <div class="card mb2"><div class="card-body text-sm">{k.description}</div></div>
{/if}

<div class="card">
  <div class="card-head"><span class="card-title">Contents</span></div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Item</th><th>Quantity</th></tr></thead>
      <tbody>
        {#each k.lines as l}
          <tr>
            <td>{data.itemMap[l.item_id] ?? l.item_id}</td>
            <td>{l.quantity}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
