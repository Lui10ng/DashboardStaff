<script lang="ts">
    import Ticket from './Ticket.svelte';
    import { tickets } from '../stores/tickets';
    import { showTicketCount } from '../stores/tickets';
  
    export let toggleShowTicketCount: () => void;
  </script>
  
  <div class="mb-4">
    <h1 class="text-2xl text-white mb-2">Select Tickets</h1>
    <div class="flex items-center gap-4 mb-2">
      <button
        on:click={toggleShowTicketCount}
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        {$showTicketCount ? 'Hide Ticket Count' : 'Show Ticket Count'}
      </button>
    </div>
  </div>
  
  <div class="grid grid-cols-2 gap-2 max-w-2xl mx-auto">
    {#each $tickets as ticket}
      <Ticket {ticket} showTicketCount={$showTicketCount} />
    {/each}
  </div>