<script lang="ts">
  import { onMount } from 'svelte';
  let { labId, labSlug } = $props<{ labId: string; labSlug: string }>();

  let el = $state<HTMLDivElement | undefined>(undefined);
  let error = $state('');

  const STATUS_COLORS: Record<string, string> = {
    pending_instructor: '#f1c21b',
    pending_manager: '#ff832b',
    approved: '#42be65',
    active: '#0f62fe',
    completed: '#8d8d8d',
    draft: '#c6c6c6',
  };

  onMount(async () => {
    const [{ Calendar }, resourceTimelinePlugin] = await Promise.all([
      import('@fullcalendar/core'),
      import('@fullcalendar/resource-timeline'),
    ]);

    // Fetch resources (items)
    let resources: { id: string; title: string }[] = [];
    try {
      const r = await fetch(`/api/${labId}/items`);
      const data = await r.json();
      resources = (data ?? []).map((i: { id: string; name: string }) => ({ id: i.id, title: i.name }));
    } catch (e) {
      error = String(e);
      return;
    }

    const calendar = new Calendar(el, {
      plugins: [resourceTimelinePlugin.default ?? resourceTimelinePlugin],
      initialView: 'resourceTimelineWeek',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth',
      },
      resources,
      events: async (info, success, failure) => {
        try {
          const res = await fetch(`/api/${labId}/reservations/calendar?start=${encodeURIComponent(info.startStr)}&end=${encodeURIComponent(info.endStr)}`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const expanded: object[] = [];
          for (const ev of data.events ?? []) {
            const lines: { item_id: string; quantity: number }[] = ev.extendedProps?.lines ?? [];
            const color = STATUS_COLORS[ev.extendedProps?.status] ?? '#a8a8a8';
            if (lines.length === 0) { expanded.push({ ...ev, color }); }
            else {
              for (const line of lines) {
                expanded.push({ id: `${ev.id}-${line.item_id}`, resourceId: line.item_id, start: ev.start, end: ev.end, title: ev.title, color, extendedProps: { ...ev.extendedProps, quantity: line.quantity, reservation_id: ev.id } });
              }
            }
          }
          success(expanded);
        } catch (e) {
          error = String(e);
          failure(e as Error);
        }
      },
      eventClick: (info) => {
        const rid = (info.event.extendedProps.reservation_id as string | undefined) ?? info.event.id.split('-')[0];
        window.location.href = `/${labSlug}/reservations/${rid}`;
      },
      height: 'auto',
    });

    calendar.render();
    return () => calendar.destroy();
  });
</script>

{#if error}
  <div class="notice notice-error" style="padding:1rem;border-radius:4px">Failed to load calendar: {error}</div>
{:else}
  <div bind:this={el}></div>
{/if}
