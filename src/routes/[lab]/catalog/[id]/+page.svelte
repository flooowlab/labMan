<script lang="ts">
  import type { PageData } from './$types';
  let { data } = $props<{ data: PageData }>();
  const item = data.item;
  // Role-aware CTA: staff/instructor/technician/admin can borrow; students/unauthenticated can reserve
  const canBorrow = ['admin', 'manager', 'technician', 'instructor'].includes(data.userMembership?.role ?? '');
  const canReserve = !!data.token; // any authenticated user can reserve
  const loginNext = `/login?next=${encodeURIComponent(`/${data.lab.slug}/borrows/new?item_id=${item.id}`)}`;
  const reserveNext = `/login?next=${encodeURIComponent(`/${data.lab.slug}/reservations/new?item_id=${item.id}`)}`;
</script>

<svelte:head><title>{item.name} — {data.lab.name}</title></svelte:head>

<div style="max-width:800px;margin:0 auto;padding:1.5rem">
  <a href="../catalog" class="back-link" style="font-size:0.85rem;color:var(--c-text-2);text-decoration:none">← Catalog</a>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-top:1rem" class="item-detail-grid">
    <div>
      {#if item.image_path}
        <img src="/api/{data.lab.id}/items/{item.id}/image" alt={item.name} style="width:100%;border-radius:8px;object-fit:cover;aspect-ratio:4/3" />
      {:else if item.photo_url}
        <img src={item.photo_url} alt={item.name} style="width:100%;border-radius:8px;object-fit:cover;aspect-ratio:4/3" onerror={(e)=>{(e.currentTarget as HTMLElement).style.display='none'}} />
      {:else}
        <div style="width:100%;aspect-ratio:4/3;background:var(--c-bg-2);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--c-text-3);font-size:3rem">📦</div>
      {/if}
    </div>

    <div>
      <h1 style="font-size:1.5rem;font-weight:700;margin:0 0 0.25rem">{item.name}</h1>
      {#if item.brand || item.model}<p style="color:var(--c-text-2);margin:0 0 1rem">{item.brand ?? ''} {item.model ?? ''}</p>{/if}

      <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem">
        {#if item.category}<span class="badge badge-blue">{item.category}</span>{/if}
        <span class="badge badge-gray">{item.tracking_mode}</span>
      </div>

      {#if item.notes}<p style="font-size:0.9rem;color:var(--c-text-2)">{item.notes}</p>{/if}

      {#if (item.included_accessories ?? []).length > 0}
        <div style="margin-top:1rem">
          <p style="font-size:0.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--c-text-2);margin:0 0 0.5rem">What's included</p>
          <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.25rem">
            {#each item.included_accessories ?? [] as acc}
              <li style="font-size:0.9rem;display:flex;gap:0.5rem"><span style="color:#198038">✓</span>{acc}</li>
            {/each}
          </ul>
        </div>
      {/if}

      <div style="margin-top:1.5rem;display:flex;flex-direction:column;gap:0.5rem">
        {#if canBorrow}
          <a href="/{data.lab.slug}/borrows/new?item_id={item.id}" class="btn btn-primary">Borrow this Item</a>
        {:else if canReserve}
          <a href="/{data.lab.slug}/reservations/new?item_id={item.id}" class="btn btn-primary">Reserve this Item</a>
        {:else}
          <a href={loginNext} class="btn btn-primary">Sign in to Borrow</a>
          <a href={reserveNext} class="btn btn-secondary btn-sm">Sign in to Reserve</a>
        {/if}
        {#if item.datasheet_url}
          <a href={item.datasheet_url} target="_blank" rel="noopener" class="btn btn-ghost btn-sm">Datasheet ↗</a>
        {/if}
        {#if item.official_page_url}
          <a href={item.official_page_url} target="_blank" rel="noopener" class="btn btn-ghost btn-sm">Manufacturer Page ↗</a>
        {/if}
        {#if (item.tutorial_links ?? []).length > 0}
          <div style="margin-top:0.5rem">
            <p style="font-size:0.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--c-text-2);margin:0 0 0.25rem">Tutorials</p>
            {#each item.tutorial_links as url, i}
              <a href={url} target="_blank" rel="noopener" class="btn btn-ghost btn-sm" style="margin-top:0.25rem">Tutorial {i + 1} ↗</a>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  @media (max-width: 600px) {
    .item-detail-grid { grid-template-columns: 1fr !important; }
  }
</style>
