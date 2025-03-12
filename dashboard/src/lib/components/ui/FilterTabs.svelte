<script lang="ts">
    import { selectedFilter } from '../../stores/attendees';
    import type { FilterType } from '../../types/attendee';
  
    const filters: FilterType[] = [ 'IN', 'OUT'];
  </script>
  
  <div class="flex border-b border-gray-200 mb-4">
    {#each filters as filter}
      <button 
        class="px-4 py-2 text-sm font-medium relative {$selectedFilter === filter ? 'text-red-500' : 'text-gray-600'}"
        on:click={() => selectedFilter.set(filter)}
      >
        {filter}
        {#if $selectedFilter === filter}
          <div class="absolute bottom-0 left-0 w-full h-0.5 bg-red-500"></div>
        {/if}
      </button>
    {/each}
  </div>