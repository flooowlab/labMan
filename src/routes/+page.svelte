<script lang="ts">
  import type { PageData } from './$types';
  let { data } = $props<{ data: PageData }>();
</script>

<svelte:head><title>Lab Manager</title></svelte:head>

<div style="display:flex;min-height:100vh;align-items:center;justify-content:center;background:var(--c-bg)">
  <div style="width:100%;max-width:520px;padding:2rem">
    <h1 style="font-size:1.5rem;font-weight:300;margin-bottom:0.25rem">Lab Manager</h1>
    <p style="color:var(--c-text-2);font-size:var(--text-sm);margin-bottom:2rem">
      {data.loggedInUser ? 'Select a lab to manage.' : 'Browse equipment catalogs or sign in to manage equipment.'}
    </p>

    {#if data.labs.length === 0}
      <p style="color:var(--c-text-2)">No active labs configured. Contact your system administrator.</p>
    {/if}

    <ul style="list-style:none;display:flex;flex-direction:column;gap:1px;background:var(--c-border);border:1px solid var(--c-border);padding:0;margin:0">
      {#each data.labs as lab}
        {@const memberRole = data.loggedInUser?.memberships.find((x) => x.lab_id === lab.id)?.role}
        <li>
          <div style="display:flex;background:var(--c-surface);padding:1rem 1.25rem;align-items:center;gap:1rem">
            <div style="flex:1;min-width:0">
              <div style="font-weight:600">{lab.name}</div>
              {#if lab.room}<div style="font-size:var(--text-xs);color:var(--c-text-2)">Room {lab.room}</div>{/if}
            </div>
            {#if memberRole}<span class="badge badge-gray">{memberRole}</span>{/if}
            <div style="display:flex;gap:0.5rem;flex-shrink:0">
              <a href="/{lab.slug}/catalog" style="font-size:var(--text-xs);color:var(--c-brand)">Catalog →</a>
              {#if memberRole}
                <a href="/{lab.slug}/" style="font-size:var(--text-xs);color:var(--c-brand)">Dashboard →</a>
              {/if}
            </div>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>
