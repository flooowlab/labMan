<script lang="ts">
  import type { PageData } from './$types';
  import CalendarView from '$components/CalendarView.svelte';
  let { data } = $props<{ data: PageData }>();
</script>

<svelte:head><title>Calendar — Lab Manager</title></svelte:head>

<div class="ph"><h1 class="ph-title">Reservations Calendar</h1></div>
<div class="card" style="padding:0">
  <CalendarView labId={data.labId} labSlug={data.labSlug} />
</div>
