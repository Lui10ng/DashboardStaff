<script lang="ts">
  import 'remixicon/fonts/remixicon.css'
  import type { Event } from '$lib/types'
  import Tooltip from '$lib/components/ui/Tooltip.svelte'
import { eventListStore } from '$lib/stores/eventList.svelte.js';
	import Pagination from '$lib/components/ui/Pagination.svelte';

  const { data } = $props();

  let events = $derived(eventListStore.events);
  let currentPage = $state(1);
  let eventsPerPage = $state(5);

  $effect(() => {
    eventListStore.setEvents(data.events)
  });

  // Create a derived value for paginated events
  let paginatedEvents = $derived(events.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage));

  const handlePageChange = (event: CustomEvent<{page: number}>) => {
    currentPage = event.detail.page;
  };

  const handlePageSizeChange = (event: CustomEvent<{size: number}>) => {
    eventsPerPage = event.detail.size;
    // Reset to first page when changing page size
    currentPage = 1;
  };

  const handleScanQR = (id: string) => {
    console.log(`Scan QR for event ${id}`);
  };

  const handleTickets = (id: string) => {
    console.log(`View tickets for event ${id}`);
  };

  const handleCopyLink = (id: string) => {
    console.log(`Copy link for event ${id}`);
  };

  const handleShare = (id: string) => {
    console.log(`Share event ${id}`);
  };

  const handleMoreOptions = (id: string) => {
    console.log(`More options for event ${id}`);
  };
</script>

<!-- Common status badge snippet -->
{#snippet statusBadge(status: string)}
  <span
    class={`inline-flex rounded-full px-4 py-1 text-sm ${
      status === 'Live'
        ? 'bg-red-100 text-red-800'
        : status === 'Upcoming'
          ? 'bg-blue-100 text-blue-800'
          : status === 'Past'
            ? 'bg-gray-100 text-gray-800'
            : 'bg-yellow-100 text-yellow-800'
    }`}
  >
    {status}
  </span>
{/snippet}

<!-- Action buttons snippet -->
{#snippet actionButtons(event: Event)}
  <div class="inline-flex items-center gap-2">
		<button 
		class="cursor-pointer p-2 text-gray-500 transition-colors hover:text-gray-600"
		aria-label="QR Scanner"
		tabindex="0"
    onclick={(e) => { e.preventDefault(); handleScanQR(event.id); }}
    onkeydown={(e) => e.key === 'Enter' && handleScanQR(event.id)}
	>
    <Tooltip 
    icon="ri-qr-scan-2-line text-xl" 
    text="" 
    content="QR Scanner" 
    classTrigger="" 
    classContent="bg-gray-800 text-white text-xs rounded px-2 py-1"
    />	
    </button>
    <button
      class="cursor-pointer p-2 text-gray-500 transition-colors hover:text-gray-600"
      aria-label="Tickets"
      tabindex="0"
      onclick={() => handleTickets(event.id)}
      onkeydown={(e) => e.key === 'Enter' && handleTickets(event.id)}
    >
      <Tooltip 
    icon="ri-coupon-2-line text-xl" 
    text="" 
    content="Tickets" 
    classTrigger="" 
    classContent="bg-gray-800 text-white text-xs rounded px-2 py-1"
    />	
    </button>
    <button
      class="cursor-pointer p-2 text-gray-500 transition-colors hover:text-gray-600"
      aria-label="Copy link"
      tabindex="0"
      onclick={() => handleCopyLink(event.id)}
      onkeydown={(e) => e.key === 'Enter' && handleCopyLink(event.id)}
    >
      <Tooltip 
    icon="ri-links-line text-xl" 
    text="" 
    content="Copy link" 
    classTrigger="" 
    classContent="bg-gray-800 text-white text-xs rounded px-2 py-1"
    />	
    </button>
    <button
      class="cursor-pointer p-2 text-gray-500 transition-colors hover:text-gray-600"
      aria-label="Share"
      tabindex="0"
      onclick={() => handleShare(event.id)}
      onkeydown={(e) => e.key === 'Enter' && handleShare(event.id)}
    >
      <Tooltip 
    icon="ri-share-line text-xl" 
    text="" 
    content="Share" 
    classTrigger="" 
    classContent="bg-gray-800 text-white text-xs rounded px-2 py-1"
    />	
    </button>
    <button
      class="cursor-pointer p-2 text-gray-500 transition-colors hover:text-gray-600"
      aria-label="More options"
      tabindex="0"
      onclick={() => handleMoreOptions(event.id)}
      onkeydown={(e) => e.key === 'Enter' && handleMoreOptions(event.id)}
    >
      <Tooltip 
    icon="ri-more-2-fill text-xl" 
    text="" 
    content="More options" 
    classTrigger="" 
    classContent="bg-gray-800 text-white text-xs rounded px-2 py-1"
    />	
    </button>
  </div>
{/snippet}

<!-- Desktop table row snippet -->
{#snippet desktopTableRow(event: Event)}
  <tr class="border-b border-gray-200 last:border-0">
    <td class="px-6 py-4">
      <div class="flex items-center gap-4">
        <img
          src={event.image}
          alt={event.title}
          class="h-12 w-12 rounded-lg object-cover"
        />
        <div>
          <a
            href="/registrants"
            class="transition-colors duration-200 hover:text-red-500"
            tabindex="0"
            aria-label={`View registrants for ${event.title}`}
          >
            <h3 class="font-medium text-gray-900">
              {event.title}
            </h3>
          </a>
          <p class="flex items-center gap-1 text-sm text-gray-600">
            <i class="ri-map-pin-line"></i>
            {event.location}
          </p>
        </div>
      </div>
    </td>
    <td class="px-6 py-4">
      <div class="flex items-center gap-2 text-gray-600">
        <i class="ri-calendar-event-line"></i>
        {event.date}
      </div>
    </td>
    <td class="px-6 py-4">
      {@render statusBadge(event.status)}
    </td>
    <td class="px-6 py-4">
      <span class="text-gray-900">{event.tickets.sold}/{event.tickets.total}</span>
    </td>
    <td class="px-6 py-4 text-right">
      {@render actionButtons(event)}
    </td>
  </tr>
{/snippet}

<!-- Mobile card snippet -->
{#snippet mobileCard(event: Event)}
  <a
    href="/registrants"
    class="block rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-red-200 hover:shadow-md"
    tabindex="0"
    aria-label={`View registrants for ${event.title}`}
  >
    <div class="flex gap-4">
      <img
        src={event.image}
        alt={event.title}
        class="h-16 w-16 rounded-lg object-cover"
      />
      <div class="flex-1">
        <h3 class="font-medium text-gray-900">{event.title}</h3>
        <p class="flex items-center gap-1 text-sm text-gray-600">
          <i class="ri-map-pin-line"></i>
          {event.location}
        </p>
      </div>
    </div>

    <div class="mt-4 space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-gray-600">
          <i class="ri-calendar-event-line"></i>
          {event.date}
        </div>
        {@render statusBadge(event.status)}
      </div>

      <div class="flex items-center justify-between">
        <div class="text-gray-600">
          <span class="text-sm">Tickets</span>
          <div>{event.tickets.sold}/{event.tickets.total}</div>
        </div>
        <div 
          class="flex items-center" 
          onclick={(e) => { e.stopPropagation(); }}
          onkeydown={(e) => { if (e.key === 'Enter') e.stopPropagation(); }}
          tabindex="0"
          role="button"
          aria-label="Action buttons">
          {@render actionButtons(event)}
        </div>
      </div>
    </div>
  </a>
{/snippet}

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <a
      href="/create"
      class="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      tabindex="0"
    >
      <i class="ri-add-line"></i>
      Create Event
    </a>
  </div>

  <div class="space-y-4">
    <!-- Desktop Table View -->
    <div class="hidden overflow-hidden rounded-lg border border-gray-200 bg-white md:block">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600">Event</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600">Tickets</th>
            <th class="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each paginatedEvents as event (event.id)}
            {@render desktopTableRow(event)}
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div class="space-y-4 md:hidden">
      {#each paginatedEvents as event (event.id)}
        {@render mobileCard(event)}
      {/each}
    </div>

     <!-- Pagination Component -->
     <Pagination
     totalItems={events.length} 
     itemsPerPage={eventsPerPage} 
     currentPage={currentPage}
     on:pageChange={handlePageChange} 
     on:pageSizeChange={handlePageSizeChange} 
   />
  </div>
</div> 