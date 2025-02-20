<script lang="ts">
    export let navigateTo: (path: string) => void;
  </script>
  
  <div class="flex space-x-4 mb-6 ml-6">
    {#each ['Registrants', 'Posts', 'Form', 'Merchant', 'Emails', 'Staff'] as tab}
      <button
        on:click={() => navigateTo('')}
        class="px-6 py-2 rounded-lg font-medium transition-colors {tab === 'Staff' ? 'bg-red-500 text-white' : 'border border-gray-300 text-gray-700 hover:bg-red-500 hover:text-white'}"
      >
        {tab}
      </button>
    {/each}
  </div>