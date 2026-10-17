<script lang="ts">
  import type { PageData } from './$types';
  let { data } = $props<{ data: PageData }>();
</script>

<svelte:head><title>Kits — Lab Manager</title></svelte:head>

<div class="ph">
  <div>
    <h1 class="ph-title">Kits</h1>
    <p class="ph-sub">Named bundles of items for common borrow workflows.</p>
  </div>
  {#if data.isManager}
    <a href="kits/new" class="btn btn-primary btn-sm">+ New Kit</a>
  {/if}
</div>

{#if data.rows.length === 0}
  <div class="card" style="padding:2rem;text-align:center">
    <p>No kits defined yet.{data.isManager ? ' Create one to bundle frequently borrowed items.' : ''}</p>
  </div>
{:else}
  <div class="card">
    <div class="table-wrap">
      <table>
        <thead><tr><th>Name</th><th>Ver.</th><th>Items</th><th>Description</th><th></th></tr></thead>
        <tbody>
          {#each data.rows as k}
            <tr>
              <td><a href="kits/{k.id}">{k.name}</a></td>
              <td class="td-mono">v{k.version}</td>
              <td>{k.lineCount} item{k.lineCount !== 1 ? 's' : ''}</td>
              <td class="text-sm text-muted">{k.linePreview}</td>
              <td><a href="kits/{k.id}" class="btn btn-ghost btn-sm">View</a></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
{/if}
