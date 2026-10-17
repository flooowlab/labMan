<script lang="ts">
  import type { PageData } from './$types';
  import BorrowForm from '$components/BorrowForm.svelte';
  let { data } = $props<{ data: PageData }>();
</script>

<svelte:head><title>New Borrow — Lab Manager</title></svelte:head>

<div class="ph">
  <div>
    <h1 class="ph-title">New Borrow{data.kitName ? ` — ${data.kitName}` : ''}</h1>
  </div>
  <a href="../borrows" class="btn btn-ghost btn-sm">← Back</a>
</div>
<div class="card">
  <div class="card-body">
    <BorrowForm
      labId={data.labId}
      labSlug={data.labSlug}
      usersData={data.usersData}
      itemsData={data.itemsData}
      instructors={data.instructors}
      initialLines={data.initialLines}
      kitId={data.kitId ?? undefined}
    />
  </div>
</div>
