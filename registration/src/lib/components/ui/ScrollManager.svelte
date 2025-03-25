<script lang="ts">
    import { onMount } from 'svelte';
    import { scrollTo } from '$lib/types/scroll';
  
    // Handle initial hash navigation
    onMount(() => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        // Small delay to ensure page is fully loaded
        setTimeout(() => scrollTo(hash), 100);
      }
    });
  </script>