<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  let { data } = $props<{ data: PageData }>();
  let mounted = $state(false);
  // Defer import to avoid SSR — FullCalendar requires browser DOM
  let NewReservationForm = $state<any>(null);
  onMount(async () => {
    const mod = await import('$components/NewReservationForm.svelte');
    NewReservationForm = mod.default;
    mounted = true;
  });
</script>

<svelte:head><title>New Reservation — Lab Manager</title></svelte:head>

<div class="ph">
  <div>
    <a href="../reservations" class="back-link">← Reservations</a>
    <h1 class="ph-title">New Reservation</h1>
  </div>
</div>

{#if mounted && NewReservationForm}
  <NewReservationForm
    labId={data.labId}
    labSlug={data.labSlug}
    userId={data.userId}
    isStudent={data.isStudent}
    items={data.items}
    instructors={data.instructors}
  />
{:else}
  <div style="padding:2rem;text-align:center;color:var(--c-text-2)">Loading calendar…</div>
{/if}
