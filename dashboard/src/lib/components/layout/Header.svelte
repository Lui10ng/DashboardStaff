<script lang="ts">
    import { page } from '$app/stores';
    export let containerClass = ""; 

    $: isAttendeesPage = $page.url.pathname === '/templates/qrscanner';
  </script>
  
  <div class="flex justify-between items-center w-full px-4 py-2 {containerClass}">
    <div class="text-lg md:text-xl font-semibold text-red-500">
      LOGO
    </div>
    {#if isAttendeesPage}
        <div class="text-lg md:text-xl font-semibold text-gray-800">
            RUNFUN
        </div>
    {/if}
  </div>
  
