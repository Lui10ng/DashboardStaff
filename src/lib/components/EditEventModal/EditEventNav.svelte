<script lang="ts">
  import { writable } from 'svelte/store';

  // Define navigation items
  const navItems = [
    { name: 'Edit Details', key: 'edit' },
    { name: 'Visual', key: 'visual' },
    { name: 'Contacts', key: 'contacts' },
    { name: 'Registration Instructions', key: 'registration' }
  ];

  // Store for active tab
  export let activeTab = writable('edit');

  function setActiveTab(tab: string) {
    activeTab.set(tab);
  }
</script>

<div class="w-full overflow-x-auto">
  <div class="flex space-x-2 py-2 pt-0 mb-4 whitespace-nowrap overflow-x-auto scrollbar-hide">
    {#each navItems as item}
      <button
        class="px-4 py-2 text-sm font-medium transition rounded-md whitespace-nowrap 
          {($activeTab === item.key) ? 'bg-red-600 text-white' : 'text-gray-900 hover:bg-gray-100 border border-gray-300'}"
        on:click={() => setActiveTab(item.key)}
      >
        {item.name}
      </button>
    {/each}
  </div>
</div>

<style>
  /* Hide scrollbar for a cleaner look */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
</style>
