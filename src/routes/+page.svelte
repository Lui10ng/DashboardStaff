<script lang="ts">
  import { onMount } from 'svelte';
  import Header from '$lib/components/layout/Header.svelte';
  import TicketList from '$lib/components/features/TicketList.svelte';
  import { tickets, showTicketCount, toggleShowTicketCount, formatTime, updateTicketStatus, loadTickets } from '$lib/stores/tickets';
  import { get } from 'svelte/store';


  export let data;
  
  onMount(() => {
    tickets.set(data.tickets);
    
    const interval = setInterval(() => {
      tickets.update(tickets => {
        tickets.forEach(ticket => {
          updateTicketStatus(ticket);
          if (ticket.remainingTime !== undefined && ticket.remainingTime > 0) {
            ticket.remainingTime -= 1;
            ticket.timer = formatTime(ticket.remainingTime);
          }
        });
        return tickets;
      });
    }, 1000);

    return () => clearInterval(interval);
  });
</script>

<Header showTicketCount={$showTicketCount} toggleShowTicketCount={toggleShowTicketCount} />
<main class="container mx-auto px-4 md:px-20 lg:px-40 py-8">
  <TicketList {toggleShowTicketCount} />
</main>