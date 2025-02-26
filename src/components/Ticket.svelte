<script lang="ts">
  import type { Ticket } from '../stores/tickets';
  export let ticket: Ticket;
  export let showTicketCount: boolean;
</script>

<div class="bg-white rounded-lg overflow-hidden flex">
  <div class={`${ticket.color} w-5`} />
  <div class="p-6 flex-1">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-3xl font-bold text-gray-800">{ticket.type}</h3>
        <p class="text-4xl font-bold mt-4 text-black flex items-baseline">
          <span class="text-2xl mr-1">₱</span>
          {(ticket.price ?? '').replace('₱ ', '')}
        </p>
        {#if ticket.ticketLeft && showTicketCount}
          <p class="text-gray-600 mt-4 text-lg">
            Ticket left : {ticket.ticketLeft}
          </p>
        {/if}
      </div>
      {#if ticket.status}
        <div class="text-right">
          <p class="font-bold text-gray-700">{ticket.status}</p>
          {#if ticket.timer}
            <p class="text-xl text-gray-600">{ticket.timer}</p>
          {/if}
          {#if ticket.date}
            <p class="text-sm text-gray-600">{ticket.date}</p>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>
