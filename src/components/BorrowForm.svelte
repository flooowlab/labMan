<script lang="ts">
  interface Line { item_id: string; unit_id?: string; quantity: number; label: string; }
  interface UserData { id: string; name: string; email: string; rfid_tag: string | null; user_type?: string; }
  interface ItemData { id: string; name: string; category: string; tracking_mode: 'serialized'|'bulk'; barcode: string; quantity_available: number | null; }
  interface InstructorData { id: string; name: string; role: string; }

  let { labId, labSlug, usersData = [], itemsData = [], instructors = [], initialLines = [], kitId } = $props<{
    labId: string; labSlug: string;
    usersData?: UserData[]; itemsData?: ItemData[];
    instructors?: InstructorData[];
    initialLines?: Line[]; kitId?: string;
  }>();

  let userId = $state('');
  let userHint = $state('');
  let rfid = $state('');
  let nameSearch = $state('');
  let showDropdown = $state(false);
  let barcode = $state('');
  let lines = $state<Line[]>(initialLines);
  let browseCategory = $state('');
  let browseSearch = $state('');
  const _defaultDue = () => { const d = new Date(); d.setDate(d.getDate()+7); return d.toISOString().slice(0,10); };
  let dueDate = $state(_defaultDue());
  let notes = $state('');
  let error = $state('');
  let loading = $state(false);
  let instructorId = $state('');

  const selectedUser = $derived(userId ? usersData.find(u => u.id === userId) : null);
  const isStudent = $derived(selectedUser?.user_type === 'student');

  const filteredUsers = $derived(nameSearch.trim().length < 1 ? [] : usersData.filter(u=>(u.name+' '+u.email).toLowerCase().includes(nameSearch.trim().toLowerCase())).slice(0,8));
  const categories = $derived([...new Set(itemsData.map(i=>i.category))].sort());
  const browseItems = $derived(itemsData.filter(i=>{
    if (browseCategory && i.category !== browseCategory) return false;
    if (browseSearch) { const q=browseSearch.toLowerCase(); return i.name.toLowerCase().includes(q)||i.category.toLowerCase().includes(q); }
    return true;
  }));

  function selectUser(u: UserData) {
    userId = u.id; userHint = u.name ?? u.email; nameSearch = ''; rfid = u.rfid_tag ?? ''; showDropdown = false; error = ''; instructorId = '';
  }

  async function lookupByRfid() {
    if (!rfid.trim()) return;
    const res = await fetch(`/api/${labId}/users/rfid/${encodeURIComponent(rfid.trim())}`);
    const data = await res.json();
    if (!res.ok) { error = data.error ?? 'User not found'; return; }
    userId = data.id; userHint = data.name ?? data.email ?? data.id; error = '';
  }

  function addBrowseItem(item: ItemData) {
    if (item.tracking_mode === 'bulk' && (item.quantity_available ?? 0) <= 0) { error = `${item.name} has no stock`; return; }
    if (lines.some(l=>l.item_id===item.id && !l.unit_id)) { error = `${item.name} already added`; return; }
    lines = [...lines, { item_id: item.id, quantity: 1, label: item.name }]; error = '';
  }

  async function addLine() {
    const code = barcode.trim();
    if (!code) return;
    const res = await fetch(`/api/${labId}/items/barcode/${encodeURIComponent(code)}`);
    const data = await res.json();
    if (!res.ok) { error = data.error ?? 'Not found'; return; }
    let newLine: Line;
    if (data.type === 'unit') {
      const ir = await fetch(`/api/${labId}/items/${data.data.item_id}`);
      const item = ir.ok ? await ir.json() : null;
      newLine = { item_id: data.data.item_id, unit_id: data.data.id, quantity: 1, label: item?.name ?? data.data.barcode };
    } else {
      newLine = { item_id: data.data.id, quantity: 1, label: data.data.name };
    }
    if (newLine.unit_id && lines.some(l=>l.unit_id===newLine.unit_id)) { error = 'Unit already added'; return; }
    lines = [...lines, newLine]; barcode = ''; error = '';
  }

  function removeLine(idx: number) { lines = lines.filter((_,i)=>i!==idx); }
  function updateQty(idx: number, qty: number) { lines = lines.map((l,i)=>i===idx ? {...l,quantity:qty} : l); }

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    if (!userId || lines.length === 0 || !dueDate) return;
    if (isStudent && instructors.length > 0 && !instructorId) { error = 'Please select an authorizing instructor for this student borrow'; return; }
    loading = true; error = '';
    const res = await fetch(`/api/${labId}/borrows`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, lines: lines.map(l=>({item_id:l.item_id,unit_id:l.unit_id,quantity:l.quantity})), due_date: new Date(dueDate).toISOString(), notes: notes||undefined, instructor_id: instructorId||undefined }),
    });
    const data = await res.json();
    loading = false;
    if (!res.ok) { error = data.error ?? 'Failed to create borrow'; return; }
    window.location.href = `/${labSlug}/borrows/${data.id}`;
  }
</script>

<form onsubmit={submit}>
  {#if error}<div class="notice notice-error" style="margin-bottom:1rem">{error}</div>{/if}

  <!-- Borrower -->
  <fieldset style="border:none;margin-bottom:1.5rem;padding:0">
    <legend style="font-weight:600;margin-bottom:.75rem;font-size:.875rem;border-bottom:1px solid var(--c-border);padding-bottom:.5rem;width:100%;display:block">Borrower</legend>
    <div style="position:relative;margin-bottom:.75rem">
      <label class="form-label text-sm">Search by name or email</label>
      <input class="input-field" style="margin-top:.25rem" bind:value={nameSearch} onfocus={()=>showDropdown=true} onblur={()=>setTimeout(()=>showDropdown=false,150)} placeholder="Type to search users…" />
      {#if showDropdown && filteredUsers.length > 0}
        <div style="position:absolute;top:100%;left:0;right:0;z-index:50;background:var(--c-surface);border:1px solid var(--c-border-2);box-shadow:0 4px 12px rgba(0,0,0,.15);max-height:220px;overflow-y:auto">
          {#each filteredUsers as u}
            <button type="button" style="display:block;width:100%;text-align:left;padding:.6rem .75rem;background:none;border:none;cursor:pointer;border-bottom:1px solid var(--c-border);font-size:.875rem" onmousedown={()=>selectUser(u)}>
              <strong>{u.name}</strong><span style="color:var(--c-text-2);margin-left:.5rem">{u.email}</span>
            </button>
          {/each}
        </div>
      {/if}
    </div>
    <div style="text-align:center;color:var(--c-text-2);font-size:.8rem;margin:.5rem 0;border-bottom:1px solid var(--c-border);line-height:0"><span style="background:var(--c-surface);padding:0 .5rem">or look up by RFID</span></div>
    <div style="display:flex;gap:.5rem;align-items:flex-end;margin-top:.75rem">
      <div style="flex:1">
        <label class="form-label text-sm" for="rfid-input">RFID Tag</label>
        <input id="rfid-input" class="input-field" bind:value={rfid} onkeydown={(e)=>{if(e.key==='Enter'){e.preventDefault();lookupByRfid();}}} placeholder="Tap card or type tag…" />
      </div>
      <button type="button" class="btn btn-secondary btn-sm" onclick={lookupByRfid}>Look up</button>
    </div>
    {#if userHint}
      <div class="notice notice-success" style="margin-top:.75rem;padding:.5rem .75rem;font-size:.875rem">✓ <strong>{userHint}</strong>
        {#if selectedUser?.user_type}<span style="margin-left:.5rem;color:var(--c-text-2);font-size:.8rem">({selectedUser.user_type})</span>{/if}
      </div>
    {/if}
    {#if isStudent && instructors.length > 0}
      <div style="margin-top:.75rem">
        <label class="form-label text-sm">Authorizing Instructor <span style="color:var(--c-danger)">*</span></label>
        <select class="input-field" bind:value={instructorId} style="margin-top:.25rem">
          <option value="">— select instructor —</option>
          {#each instructors as ins}
            <option value={ins.id}>{ins.name} ({ins.role})</option>
          {/each}
        </select>
        <p style="font-size:.75rem;color:var(--c-text-2);margin:.25rem 0 0">Student borrows require an instructor's authorisation.</p>
      </div>
    {/if}
  </fieldset>

  <!-- Items -->
  <fieldset style="border:none;margin-bottom:1.5rem;padding:0">
    <legend style="font-weight:600;margin-bottom:.75rem;font-size:.875rem;border-bottom:1px solid var(--c-border);padding-bottom:.5rem;width:100%;display:block">Items</legend>
    <div style="display:flex;gap:.5rem;margin-bottom:.75rem">
      <input class="input-field" style="flex:1" bind:value={barcode} placeholder="Scan or type barcode…" onkeydown={(e)=>{if(e.key==='Enter'){e.preventDefault();addLine();}}} />
      <button type="button" class="btn btn-secondary btn-sm" onclick={addLine}>Add</button>
    </div>
    <div style="display:flex;gap:.5rem;margin-bottom:.5rem">
      <select class="input-field" bind:value={browseCategory} style="flex:1">
        <option value="">All categories</option>
        {#each categories as cat}<option value={cat}>{cat}</option>{/each}
      </select>
      <input class="input-field" style="flex:1" bind:value={browseSearch} placeholder="Browse by name…" />
    </div>
    <div style="max-height:180px;overflow-y:auto;border:1px solid var(--c-border);margin-bottom:.75rem">
      {#each browseItems.slice(0,30) as item}
        <button type="button" style="display:block;width:100%;text-align:left;padding:.5rem .75rem;background:none;border:none;border-bottom:1px solid var(--c-border);cursor:pointer;font-size:.875rem" onclick={()=>addBrowseItem(item)}>
          <strong>{item.name}</strong><span style="color:var(--c-text-2);margin-left:.5rem;font-size:.8rem">{item.category}</span>
          {#if item.tracking_mode === 'bulk'}<span style="color:var(--c-text-2);margin-left:.25rem">(qty: {item.quantity_available})</span>{/if}
        </button>
      {/each}
    </div>
    {#if lines.length > 0}
      <table style="width:100%;font-size:.875rem">
        <thead><tr><th style="text-align:left">Item</th><th style="text-align:right">Qty</th><th></th></tr></thead>
        <tbody>
          {#each lines as l, idx}
            <tr>
              <td>{l.label}{#if l.unit_id} <span class="badge badge-gray">unit</span>{/if}</td>
              <td style="text-align:right"><input type="number" min="1" value={l.quantity} style="width:60px;text-align:right" onchange={(e)=>updateQty(idx,Number((e.target as HTMLInputElement).value))} /></td>
              <td><button type="button" class="btn btn-ghost btn-sm" onclick={()=>removeLine(idx)}>✕</button></td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </fieldset>

  <!-- Schedule -->
  <fieldset style="border:none;margin-bottom:1.5rem;padding:0">
    <legend style="font-weight:600;margin-bottom:.75rem;font-size:.875rem;border-bottom:1px solid var(--c-border);padding-bottom:.5rem;width:100%;display:block">Schedule</legend>
    <div class="form-group">
      <label class="form-label text-sm" for="due_date">Due Date *</label>
      <input id="due_date" type="date" class="input-field" bind:value={dueDate} required />
    </div>
    <div class="form-group">
      <label class="form-label text-sm" for="notes">Notes</label>
      <textarea id="notes" class="input-field" rows="2" bind:value={notes}></textarea>
    </div>
  </fieldset>

  <div class="form-actions">
    <a href="/{labSlug}/borrows" class="btn btn-ghost">Cancel</a>
    <button type="submit" class="btn btn-primary" disabled={loading || !userId || lines.length === 0}>
      {loading ? 'Creating…' : 'Create Borrow'}
    </button>
  </div>
</form>
