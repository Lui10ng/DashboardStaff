<script lang="ts">
  export let navigateTo: (path: string) => void;
</script>

<div class=" flex flex-wrap gap-2 mb-6 ml-0 md:ml-6">
  {#each ['Registrants', 'Posts', 'Form', 'Merchant', 'Emails', 'Staff'] as tab}
    <button
      on:click={() => navigateTo('')}
      class="flex-grow md:flex-grow-0 px-4 md:px-6 py-4  rounded-lg font-medium transition-colors text-sm md:text-base {tab === 'Staff' ? 'bg-red-500 text-white' : 'border border-gray-300 text-gray-700 hover:bg-red-500 hover:text-white'}"
    >
      {tab}
    </button>
  {/each}
  
</div>
