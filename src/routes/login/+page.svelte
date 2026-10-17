<script lang="ts">
  import type { PageData } from './$types';
  import LoginForm from '$components/LoginForm.svelte';
  let { data } = $props<{ data: PageData }>();
</script>

<svelte:head><title>Sign In — Lab Manager</title></svelte:head>
<LoginForm next={data.next} />
