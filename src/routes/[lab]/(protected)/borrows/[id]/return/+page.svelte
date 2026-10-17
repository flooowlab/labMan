<script lang="ts">
  import type { PageData } from './$types';
  import ReturnForm from '$components/ReturnForm.svelte';
  let { data } = $props<{ data: PageData }>();
</script>

<svelte:head><title>Return Items — Lab Manager</title></svelte:head>

<div class="ph">
  <div><h1 class="ph-title">Return Items</h1></div>
  <a href=".." class="btn btn-ghost btn-sm">← Borrow Detail</a>
</div>
<div class="card">
  <div class="card-body">
    <ReturnForm labId={data.labId} labSlug={data.labSlug} borrowId={data.borrowId} />
  </div>
</div>
