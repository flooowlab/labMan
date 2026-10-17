<script lang="ts">
  import { onMount } from 'svelte';

  interface ItemOption { id: string; name: string; category: string | null; }
  interface InstructorOption { id: string; name: string; }

  let { labId, labSlug, userId, isStudent, items, instructors } = $props<{
    labId: string; labSlug: string; userId: string; isStudent: boolean;
    items: ItemOption[]; instructors: InstructorOption[];
  }>();

  let calEl = $state<HTMLDivElement | undefined>(undefined);
  let selStart = $state('');
  let selEnd = $state('');
  let purpose = $state('');
  let courseCode = $state('');
  let instructorId = $state('');
  let lines = $state([{ id: 0, itemId: '', qty: 1 }]);
  let error = $state('');
  let submitting = $state(false);
  let lineCounter = 1;

  function addLine() { lines = [...lines, { id: lineCounter++, itemId: '', qty: 1 }]; }
  function removeLine(id: number) { if (lines.length > 1) lines = lines.filter(l=>l.id!==id); }
  function updateLine(id: number, key: 'itemId'|'qty', val: string|number) { lines = lines.map(l=>l.id===id?{...l,[key]:val}:l); }

  const fmtRange = (s: string, e: string) => {
    const f = (iso: string) => new Intl.DateTimeFormat(undefined,{weekday:'short',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(iso));
    return `${f(s)} → ${f(e)}`;
  };

  onMount(async () => {
    if (!calEl) return;
    const [{ Calendar }, timeGridPlugin, dayGridPlugin, interactionPlugin] = await Promise.all([
      import('@fullcalendar/core'),
      import('@fullcalendar/timegrid'),
      import('@fullcalendar/daygrid'),
      import('@fullcalendar/interaction'),
    ]);

    const cal = new Calendar(calEl!, {
      plugins: [timeGridPlugin.default ?? timeGridPlugin, dayGridPlugin.default ?? dayGridPlugin, (interactionPlugin.default ?? interactionPlugin)],
      initialView: 'timeGridWeek',
      selectable: true,
      selectMirror: true,
      headerToolbar: { left: 'prev,next today', center: 'title', right: 'timeGridWeek,dayGridMonth' },
      select: (arg) => { selStart = arg.startStr; selEnd = arg.endStr; error = ''; },
      events: async (info, success, fail) => {
        try {
          const res = await fetch(`/api/${labId}/reservations/calendar?start=${info.startStr}&end=${info.endStr}`);
          if (!res.ok) { success([]); return; }
          const data = await res.json();
          success((data.events ?? []).map((ev: Record<string, unknown>) => ({ ...ev, backgroundColor: '#272727', borderColor: '#3a3a3a', textColor: '#aaa' })));
        } catch (e) { fail(e as Error); }
      },
      height: 500,
    });
    cal.render();
    return () => cal.destroy();
  });

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    if (!selStart || !selEnd) { error = 'Please select a date/time range on the calendar.'; return; }
    const validLines = lines.filter(l => l.itemId);
    if (validLines.length === 0) { error = 'Add at least one item.'; return; }
    submitting = true; error = '';
    const body: Record<string, unknown> = {
      user_id: userId, start_at: selStart, end_at: selEnd, purpose: purpose || undefined,
      course_code: courseCode || undefined,
      instructor_id: instructorId || undefined,
      lines: validLines.map(l=>({ item_id: l.itemId, quantity: l.qty })),
    };
    const res = await fetch(`/api/${labId}/reservations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    submitting = false;
    if (!res.ok) { error = data.error ?? 'Failed to create reservation'; return; }
    window.location.href = `/${labSlug}/reservations/${data.id}`;
  }
</script>

<div style="display:grid;grid-template-columns:1fr 380px;gap:1.5rem;align-items:start">
  <!-- Calendar col -->
  <div class="card" style="overflow:hidden;padding:0">
    <div class="card-head"><span class="card-title">Select Date &amp; Time</span></div>
    <div bind:this={calEl} style="padding:0.75rem"></div>
    {#if selStart && selEnd}
      <div style="padding:.75rem 1rem;background:var(--c-surface);border-top:1px solid var(--c-border);font-size:.875rem;color:var(--c-text-2)">
        Selected: <strong style="color:var(--c-text)">{fmtRange(selStart, selEnd)}</strong>
      </div>
    {/if}
  </div>

  <!-- Form col -->
  <form onsubmit={submit}>
    {#if error}<div class="notice notice-error" style="margin-bottom:1rem">{error}</div>{/if}

    <div class="card mb2">
      <div class="card-head"><span class="card-title">Details</span></div>
      <div class="card-body">
        <div class="form-group">
          <label class="form-label text-sm" for="purpose">Purpose / Project</label>
          <textarea id="purpose" class="input-field" rows="2" bind:value={purpose}></textarea>
        </div>
        <div class="form-group">
          <label class="form-label text-sm" for="course_code">Course Code</label>
          <input id="course_code" class="input-field" bind:value={courseCode} placeholder="e.g. FILM 301" />
        </div>
        {#if isStudent && instructors.length > 0}
          <div class="form-group">
            <label class="form-label text-sm" for="instructor_id">Instructor</label>
            <select id="instructor_id" class="input-field" bind:value={instructorId}>
              <option value="">— Select instructor —</option>
              {#each instructors as inst}<option value={inst.id}>{inst.name}</option>{/each}
            </select>
          </div>
        {/if}
      </div>
    </div>

    <div class="card mb2">
      <div class="card-head"><span class="card-title">Items</span></div>
      <div class="card-body">
        {#each lines as l}
          <div style="display:flex;gap:.5rem;margin-bottom:.5rem;align-items:center">
            <select class="input-field" style="flex:1" value={l.itemId} onchange={(e)=>updateLine(l.id,'itemId',(e.target as HTMLSelectElement).value)}>
              <option value="">— Select item —</option>
              {#each items as it}<option value={it.id}>{it.name}</option>{/each}
            </select>
            <input type="number" min="1" value={l.qty} style="width:60px" onchange={(e)=>updateLine(l.id,'qty',Number((e.target as HTMLInputElement).value))} />
            {#if lines.length > 1}
              <button type="button" class="btn btn-ghost btn-sm" onclick={()=>removeLine(l.id)}>✕</button>
            {/if}
          </div>
        {/each}
        <button type="button" class="btn btn-ghost btn-sm mt1" onclick={addLine}>+ Add Item</button>
      </div>
    </div>

    <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center" disabled={submitting}>
      {submitting ? 'Submitting…' : 'Submit Reservation'}
    </button>
  </form>
</div>
