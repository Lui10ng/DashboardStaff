<script lang="ts">
  import { onMount } from 'svelte';
  import Header from '../components/Header.svelte';
  import TicketList from '../components/TicketList.svelte';
  import { tickets, showTicketCount, toggleShowTicketCount } from '../stores/tickets';
  import { get } from 'svelte/store';

  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  onMount(() => {
    const interval = setInterval(() => {
      tickets.update(tickets => {
        tickets.forEach(ticket => {
          if (ticket.remainingTime !== undefined && ticket.remainingTime > 0) {
            ticket.remainingTime -= 1;
            if (ticket.remainingTime <= 86400 && ticket.status === 'ONLY AVAILABLE BETWEEN') {
              ticket.status = 'AVAILABLE IN';
            }
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