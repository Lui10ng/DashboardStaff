<script lang="ts">
    import type { EventData } from '$lib/types/event';
    
    export let formData: EventData;
  </script>
  
  <div class="border border-gray-300 rounded-lg p-4">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
      <h3 class="text-lg font-medium">Preview</h3>
      <div class="flex space-x-4 text-sm">
        <button type="button" class="text-gray-600">Posts</button>
        <button type="button" class="text-gray-600">Contact</button>
        <button type="button" class="bg-red-600 text-white px-3 py-1 rounded">REGISTER</button>
      </div>
    </div>
    
    <div class="space-y-4">
      <h4 class="font-medium">{formData.eventName || 'Event Name'}</h4>
      <p class="text-sm text-gray-600">{formData.description || 'Add description here.'}</p>
      
      <div class="border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center overflow-hidden">
        {#if formData.poster}
          <img src={formData.poster} alt="Event Poster" class="w-full h-full object-contain" />
        {:else}
          <p class="text-gray-500">YOUR POSTER GOES HERE</p>
        {/if}
      </div>
    </div>
  </div>