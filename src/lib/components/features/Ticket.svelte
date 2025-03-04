<script lang="ts">
  import type { Ticket } from '$lib/stores/tickets';
  import { updateTicket } from '$lib/stores/tickets';

  export let ticket: Ticket;
  export let showTicketCount: boolean;
  
  // Initialize isSelected to false (no check mark shown initially)
  let isSelected = false;
  
  async function handlePurchase(event: Event) {
    event.stopPropagation();
    
    if (!ticket.ticketLeft) return;
    
    const [current, total] = ticket.ticketLeft.split('/');
    const currentCount = parseInt(current);
    
    if (currentCount > 0) {
      const result = await updateTicket(ticket.id, currentCount - 1);
      if (result.success) {
        // Handle successful ticket update
      }
    }
  }
  
  function toggleSelection() {
    if (!ticket.status && ticket.ticketLeft) {
      isSelected = !isSelected;
    }
  }
</script>



<div class="bg-white rounded-lg overflow-hidden flex h-full cursor-pointer" on:click={toggleSelection}>
  <div class={ticket.color + " w-5"} />
  <div class="p-6 flex-1 relative">
    {#if ticket.status === 'SOLD OUT'}
      <div 
        class="absolute inset-0 flex items-center justify-center z-10"
        style="background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);"
      >
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
        <div 
          class="absolute inset-0 flex flex-col items-center justify-center z-10"
          style="background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);"
        >
          <span class="text-white text-2xl font-bold">{ticket.status}</span>
          {#if ticket.timer}
            <span class="text-white text-xl mt-2">{ticket.timer}</span>
          {/if}
        </div>
      {:else if ticket.status === 'ONLY AVAILABLE BETWEEN'}
        <div class="absolute inset-0 flex flex-col items-center justify-center z-10 text-center"
          style="background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);"
        >
          <span class="text-white text-xl font-bold poppin">{ticket.status}</span>
          <span class="text-white text-xl poppin">{ticket.date}</span>
        </div>
      {:else if !ticket.status && ticket.ticketLeft}
        <div class="text-right">
          {#if isSelected}
            <span class="text-green-500 text-2xl">✓</span>
          {/if}
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