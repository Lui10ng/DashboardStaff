<script>
    import { theme } from '$lib/stores/Theme';
  
    function toggleTheme() {
      $theme = $theme === 'dark' ? 'light' : 'dark';
    }
  </script>
  
  <button
    on:click={toggleTheme}
    class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
  >
    {#if $theme === 'dark'}
      🌙
    {:else}
      ☀️
    {/if}
  </button>