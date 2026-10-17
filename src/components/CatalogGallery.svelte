<script lang="ts">
  import type { Item } from '$lib/types.js';

  let { items, labId, labSlug } = $props<{ items: Item[]; labId: string; labSlug: string }>();

  const PALETTE = ['#0f62fe','#6929c4','#9f1853','#b45309','#005d5d','#198038','#00539a','#8a3800','#1192e8','#a2191f','#007d79','#4d5358'];
  function categoryColor(cat: string): string {
    let h = 0;
    for (let i = 0; i < cat.length; i++) h = (h * 31 + cat.charCodeAt(i)) >>> 0;
    return PALETTE[h % PALETTE.length]!;
  }

  let query = $state('');
  let view = $state<'gallery'|'list'>('gallery');
  let activeCategory = $state<string|null>(null);

  const categories = $derived([...new Set(items.map(i=>i.category).filter(Boolean))].sort() as string[]);

  const results = $derived((() => {
    let list = items;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(i => (i.name+' '+(i.brand??'')+' '+(i.model??'')+' '+(i.category??'')).toLowerCase().includes(q));
    }
    if (activeCategory) list = list.filter(i => i.category === activeCategory);
    return list;
  })());
</script>

<div>
  <div style="display:flex;gap:0.75rem;align-items:center;margin-bottom:1rem;flex-wrap:wrap">
    <input type="search" bind:value={query} placeholder="Search by name, brand, model…" style="flex:1 1 240px;padding:0.625rem 0.875rem;border:2px solid var(--c-border-2);font-size:var(--text-sm);min-width:0" autofocus />
    <div style="display:flex;flex-shrink:0">
      <button class="view-btn {view==='list'?'active':''}" onclick={() => view='list'} style="border-right:none" title="List view">☰ List</button>
      <button class="view-btn {view==='gallery'?'active':''}" onclick={() => view='gallery'} title="Gallery view">⊞ Gallery</button>
    </div>
  </div>

  {#if categories.length > 0}
    <div style="display:flex;gap:0.375rem;flex-wrap:wrap;margin-bottom:1.5rem">
      <button class="chip {!activeCategory?'active':''}" onclick={() => activeCategory=null}>All <span style="opacity:.6">({items.length})</span></button>
      {#each categories as cat}
        <button class="chip {activeCategory===cat?'active':''}" onclick={() => activeCategory = activeCategory===cat ? null : cat}>{cat} <span style="opacity:.6">({items.filter(i=>i.category===cat).length})</span></button>
      {/each}
    </div>
  {/if}

  {#if results.length === 0}
    <p style="color:var(--c-text-2);text-align:center;padding:3rem 0">No items found.</p>
  {:else if view === 'gallery'}
    <div style="columns:260px;column-gap:1rem">
      {#each results as item}
        {@const bg = categoryColor(item.category || 'other')}
        {@const imgSrc = item.image_path ? `/api/${labId}/items/${item.id}/image` : (item.photo_url ?? null)}
        <a href="/{labSlug}/catalog/{item.id}" class="gallery-card" style="break-inside:avoid;display:block;margin-bottom:1rem;text-decoration:none;color:var(--c-text);border:1px solid var(--c-border);background:var(--c-surface);overflow:hidden">
          {#if imgSrc}
            <div style="position:relative;height:160px;overflow:hidden;background:{bg}">
              <img src={imgSrc} alt={item.name} style="width:100%;height:160px;object-fit:cover;display:block" onerror={(e)=>{(e.currentTarget as HTMLElement).style.display='none'}} />
              <span style="position:absolute;bottom:0.5rem;left:0.75rem;background:{bg};color:#fff;font-size:var(--text-xs);font-weight:600;padding:.15rem .5rem;text-transform:uppercase;letter-spacing:.06em">{item.category || '—'}</span>
            </div>
          {:else}
            <div style="background:{bg};padding:1.25rem 1rem 0.875rem;color:#fff;display:flex;align-items:flex-end;gap:.75rem;min-height:72px">
              <span style="font-size:2.25rem;font-weight:700;line-height:1;opacity:.25">{(item.name||'?')[0]!.toUpperCase()}</span>
              <span style="font-size:var(--text-xs);opacity:.9;text-transform:uppercase;letter-spacing:.08em;font-weight:600">{item.category||'—'}</span>
            </div>
          {/if}
          <div style="padding:.875rem 1rem">
            <div style="font-weight:600;margin-bottom:.25rem;font-size:var(--text-sm);line-height:1.4">{item.name}</div>
            {#if item.brand || item.model}
              <div style="font-size:var(--text-xs);color:var(--c-text-2)">{[item.brand,item.model].filter(Boolean).join(' · ')}</div>
            {/if}
          </div>
        </a>
      {/each}
    </div>
  {:else}
    <div style="border:1px solid var(--c-border)">
      {#each results as item}
        {@const bg = categoryColor(item.category || 'other')}
        {@const imgSrc = item.image_path ? `/api/${labId}/items/${item.id}/image` : (item.photo_url ?? null)}
        <a href="/{labSlug}/catalog/{item.id}" style="display:flex;align-items:center;gap:1rem;padding:.75rem 1rem;background:var(--c-surface);border-bottom:1px solid var(--c-border);text-decoration:none;color:var(--c-text)">
          {#if imgSrc}
            <img src={imgSrc} alt={item.name} style="width:48px;height:48px;object-fit:cover;flex-shrink:0" onerror={(e)=>{(e.currentTarget as HTMLElement).style.display='none'}} />
          {:else}
            <div style="width:48px;height:48px;background:{bg};flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:var(--text-sm)">{(item.name||'?')[0]!.toUpperCase()}</div>
          {/if}
          <div style="flex:1;min-width:0">
            <div style="font-weight:600;font-size:var(--text-sm)">{item.name}</div>
            {#if item.brand || item.model}
              <div style="font-size:var(--text-xs);color:var(--c-text-2)">{[item.brand,item.model].filter(Boolean).join(' · ')}</div>
            {/if}
          </div>
          {#if item.category}
            <span style="background:{bg};color:#fff;font-size:var(--text-xs);padding:.125rem .5rem;white-space:nowrap;font-weight:600">{item.category}</span>
          {/if}
        </a>
      {/each}
    </div>
  {/if}
</div>

<style>
  .view-btn { background: var(--c-surface); color: var(--c-text); border: 1px solid var(--c-border); padding: 0.5rem 0.75rem; cursor: pointer; font-size: var(--text-xs); }
  .view-btn.active { background: #161616; color: #fff; border-color: #161616; font-weight: 600; }
  .chip { padding: .25rem .75rem; border: 1px solid var(--c-border); background: var(--c-surface); color: var(--c-text); font-size: var(--text-xs); cursor: pointer; white-space: nowrap; }
  .chip.active { background: #161616; color: #fff; border-color: #161616; font-weight: 600; }
</style>
