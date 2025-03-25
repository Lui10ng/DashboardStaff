<script lang="ts">
    import type { EventData } from '$lib/types/event';
    
    export let poster: EventData['poster'];
    export let altText = 'Event Poster';
    export let className = '';
  </script>
  
  {#if poster}
    <div class="relative w-full max-w-md mx-auto overflow-hidden rounded-lg shadow-lg {className}">
      <div class="aspect-[3/4]">
        <img
          src={poster}
          alt={altText}
          class="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-102"
          loading="lazy"
        />
      </div>
    </div>
  {/if}