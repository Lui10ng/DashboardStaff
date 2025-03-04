<script lang="ts">
  import { writable } from 'svelte/store';
  import { fade, scale } from 'svelte/transition';
  import EditEventNav from './EditEventNav.svelte';
  import EditDetails from './edit-event.svelte';
  import Visual from './visuals.svelte';
  import Contacts from './contactUs.svelte';
  import RegistrationInstructions from './registration-instructions.svelte';

  export let isOpen = writable(false);
  let activeTab = writable('edit');
</script>

{#if $isOpen}
  <div 
    class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[1px] z-50 p-4 overflow-y-auto "
    on:click={() => isOpen.set(false)}
    transition:fade={{ duration: 300 }}
  >
    <div 
      class="relative bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-5xl p-4 sm:p-8 my-auto"
      transition:scale={{ duration: 200, start: 0.8 }}
      on:click|stopPropagation
    >
      <!-- Close Button -->
      <button 
  class="absolute top-3 right-3 p-2 text-gray-500 hover:text-red-600 hidden sm:block"
  on:click={() => isOpen.set(false)}
>
  ✕
</button>
     
      <!-- Navigation -->
      <EditEventNav bind:activeTab />

      <!-- Dynamic Content -->
      <div class="">
        {#if $activeTab === 'edit'}
          <EditDetails />
        {:else if $activeTab === 'visual'}
          <Visual />
        {:else if $activeTab === 'contacts'}
          <Contacts />
        {:else if $activeTab === 'registration'}
          <RegistrationInstructions />
        {/if}
      </div>

      <!-- Footer (Responsive Buttons) -->
      <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 ">
        <button
          class="w-full sm:w-auto rounded-md border border-gray-300 bg-white px-4 py-2 text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50"
          on:click={() => isOpen.set(false)}
        >
          Cancel
        </button>
        <button
          class="w-full sm:w-auto rounded-md bg-red-600 px-5 py-2 text-sm sm:text-base font-medium text-white hover:bg-red-700"
        >
          Save changes
        </button>
      </div>
    </div>
  </div>
{/if}
