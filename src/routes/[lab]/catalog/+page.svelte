<script lang="ts">
  import type { PageData } from './$types';
  import CatalogGallery from '$components/CatalogGallery.svelte';
  import LoginForm from '$components/LoginForm.svelte';
  let { data } = $props<{ data: PageData }>();
</script>

<svelte:head><title>{data.lab?.name ?? 'Catalog'} — Lab Manager</title></svelte:head>

<div style="display:flex;gap:1.5rem;align-items:flex-start;padding:1.5rem">
  <div style="flex:1;min-width:0">
    <div style="margin-bottom:1rem">
      <h1 style="font-size:1.5rem;font-weight:700;margin:0">{data.lab?.name ?? 'Lab'} — Catalog</h1>
      <p style="color:var(--c-text-2);font-size:0.9rem;margin:0.25rem 0 0">Public equipment catalog</p>
    </div>
    <CatalogGallery items={data.items} labId={data.lab?.id ?? ''} labSlug={data.lab?.slug ?? ''} />
  </div>

  <aside style="width:260px;flex-shrink:0;position:sticky;top:1rem">
    {#if data.token}
      <div class="card">
        <div class="card-body">
          <p class="text-sm mb1">You are signed in.</p>
          <a href="/{data.lab?.slug}" class="btn btn-primary" style="width:100%">Go to Dashboard</a>
        </div>
      </div>
    {:else}
      <div class="card">
        <div class="card-head"><span class="card-title">Staff & Instructor Login</span></div>
        <div class="card-body"><LoginForm next="/{data.lab?.slug}" /></div>
      </div>
    {/if}
    {#if data.lab}
      <div class="card mt2">
        <div class="card-body">
          <p style="font-size:0.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--c-text-2);margin-bottom:0.25rem">Lab</p>
          <p style="font-weight:600;margin:0 0 0.25rem">{data.lab.name}</p>
          {#if data.lab.room}<p style="font-size:0.85rem;color:var(--c-text-2);margin:0 0 0.15rem">📍 {data.lab.room}</p>{/if}
          {#if data.coordinator}
            <p style="font-size:0.85rem;color:var(--c-text-2);margin:0 0 0.15rem">👤 {data.coordinator.name}</p>
            <p style="font-size:0.85rem;color:var(--c-text-2);margin:0">✉️ {data.coordinator.email}</p>
          {:else if data.lab.contact_email}
            <p style="font-size:0.85rem;color:var(--c-text-2);margin:0">✉️ {data.lab.contact_email}</p>
          {/if}
        </div>
      </div>
    {/if}
  </aside>
</div>
