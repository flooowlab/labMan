<script lang="ts">
  import type { PageData } from './$types';
  import { fmtDate } from '$lib/utils.js';
  let { data } = $props<{ data: PageData }>();
</script>

<svelte:head><title>Audit Log — Lab Manager</title></svelte:head>

<div class="ph">
  <h1 class="ph-title">Audit Log</h1>
  <span class="text-sm text-muted">{data.total} entries</span>
</div>

<form method="GET" class="flex-gap mb2">
  <input name="action" value={data.actionFilter} placeholder="Filter by action…" style="padding:0.5rem 0.75rem;border:1px solid var(--c-border-2);min-width:220px" />
  <button type="submit" class="btn btn-secondary btn-sm">Filter</button>
  {#if data.actionFilter}<a href="?" class="btn btn-ghost btn-sm">Clear</a>{/if}
</form>

<div class="card">
  <div class="table-wrap">
    <table>
      <thead><tr><th>Time</th><th>Action</th><th>Entity</th><th>Actor</th></tr></thead>
      <tbody>
        {#each data.entries as e}
          <tr>
            <td class="text-sm td-mono">{fmtDate(e.ts ?? e.created_at)}</td>
            <td class="text-sm td-mono">{e.action}</td>
            <td class="text-sm text-muted">{e.entity_type}/{e.entity_id?.slice(0,8)}</td>
            <td class="text-sm text-muted">{e.actor_id?.slice(0,8)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

{#if data.total > data.perPage}
  <div class="flex-gap mt2">
    {#if data.page > 1}
      <a href="?page={data.page-1}{data.actionFilter ? '&action='+data.actionFilter : ''}" class="btn btn-ghost btn-sm">← Prev</a>
    {/if}
    <span class="text-sm">Page {data.page} of {Math.ceil(data.total/data.perPage)}</span>
    {#if data.page < Math.ceil(data.total/data.perPage)}
      <a href="?page={data.page+1}{data.actionFilter ? '&action='+data.actionFilter : ''}" class="btn btn-ghost btn-sm">Next →</a>
    {/if}
  </div>
{/if}
