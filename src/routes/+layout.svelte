<script lang="ts">
  import '../styles/app.css';
  import type { Snippet } from 'svelte';
  interface Props { children: Snippet }
  let { children } = $props();
</script>

{@render children()}
