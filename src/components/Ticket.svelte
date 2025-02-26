<script lang="ts">
  import type { Ticket } from '../stores/tickets';
  import { updateTicket } from '../stores/tickets';

  export let ticket: Ticket;
  export let showTicketCount: boolean;
  
  async function handlePurchase() {
    if (!ticket.ticketLeft) return;
    
    const [current, total] = ticket.ticketLeft.split('/');
    const currentCount = parseInt(current);
    
    if (currentCount > 0) {
      // Decrease ticket count by 1
      const result = await updateTicket(ticket.id, currentCount - 1);
      if (result.success) {
        // The store will be updated automatically
        // You could show a success message here
      }
    }
  }
</script>

<div class="bg-white rounded-lg overflow-hidden flex h-full">
  <div class={ticket.color + " w-5"} />
  <div class="p-6 flex-1 relative">
    {#if ticket.status === 'SOLD OUT'}
      <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
        <span class="text-white text-2xl font-bold">SOLD OUT</span>
      </div>
    {/if}
    
    <div class="flex justify-between items-start">
      <div>
        <h3 class={"text-3xl font-bold " + ticket.textColor}>{ticket.type}</h3>
        <p class="text-4xl font-bold mt-4 text-black flex items-baseline">
          <span class="text-2xl mr-1">₱</span>
          {(ticket.price ?? '').replace('₱ ', '')}
        </p>
        {#if ticket.ticketLeft && showTicketCount}
          <p class="text-gray-600 mt-4 text-lg">
            Ticket left: {ticket.ticketLeft}
          </p>
        {/if}
      </div>
      
      {#if ticket.status === 'AVAILABLE IN'}
        <div class="text-right">
          <p class="font-bold text-gray-700">{ticket.status}</p>
          {#if ticket.timer}
            <p class="text-xl text-gray-600">{ticket.timer}</p>
          {/if}
        </div>
      {:else if ticket.status === 'ONLY AVAILABLE BETWEEN'}
        <div class="text-right">
          <p class="font-bold text-gray-700">ONLY AVAILABLE BETWEEN</p>
          <p class="text-sm text-gray-600">
            2/19/25 and 3/22/25
          </p>
        </div>
      {:else if !ticket.status && ticket.ticketLeft}
        <div class="text-right">
          <span class="text-green-500 text-2xl">✓</span>
        </div>
      {/if}
    </div>
    
    {#if ticket.ticketLeft && !ticket.status}
      <button 
        on:click={handlePurchase}
        class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full"
      >
        Purchase Ticket
      </button>
    {/if}
  </div>
</div>