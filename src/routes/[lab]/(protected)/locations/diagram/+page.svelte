<script lang="ts">
  import type { PageData } from './$types';
  import LocationDiagram from '$components/LocationDiagram.svelte';
  let { data } = $props<{ data: PageData }>();
</script>

<svelte:head><title>Floor Plan — Lab Manager</title></svelte:head>

<div class="ph">
  <h1 class="ph-title">Floor Plan</h1>
  <a href="../locations" class="btn btn-ghost btn-sm">← Locations</a>
</div>
<LocationDiagram labId={data.labId} />
