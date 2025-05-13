<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import { fly, fade } from 'svelte/transition';

  export let eventId: string;
  export let maxSelections: number = 1;

  // Optional props
  export let loadOnMount = true;
  export let selectedTicketId: string | null = null;

  // Local state
  let loading = true;
  let error: string | null = null;
  let seatMap: any = null;
  let selectedSeats = writable<string[]>([]);
  let showLegend = false;
  let selectedSection = writable<string | null>(null);
  let zoom = writable(1);
  let isDragging = false;
  let startPanX = 0;
  let startPanY = 0;
  let panX = 0;
  let panY = 0;
  let lastPanX = 0;
  let lastPanY = 0;

  const dispatch = createEventDispatcher<{
    seatSelected: { seats: string[] };
    error: { message: string };
  }>();

  // Fetch seat map data from API
  async function fetchSeatMap() {
    try {
      loading = true;
      error = null;
      
      const response = await fetch(`/api/events/${eventId}/seatmap`);
      
      if (!response.ok) {
        // Try to parse error message
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || `Failed to load seat map (${response.status})`;
        } catch {
          errorMessage = `Error loading seat map (${response.status})`;
        }
        
        error = errorMessage;
        dispatch('error', { message: errorMessage });
        return;
      }
      
      seatMap = await response.json();
      
      // If there are sections, select the first one by default
      if (seatMap?.sections?.length) {
        selectedSection.set(seatMap.sections[0].name);
      }
      
    } catch (e) {
      error = e instanceof Error ? e.message : 'Unknown error loading seat map';
      dispatch('error', { message: error });
    } finally {
      loading = false;
    }
  }

  // Handle selecting a seat
  function toggleSeat(seatId: string, status: string) {
    // Prevent selecting unavailable seats
    if (status !== 'available') return;
    
    selectedSeats.update(seats => {
      const seatIndex = seats.indexOf(seatId);
      
      if (seatIndex >= 0) {
        // Remove seat if already selected
        return seats.filter(s => s !== seatId);
      } else {
        // Add seat if not at max selections
        if (seats.length < maxSelections) {
          return [...seats, seatId];
        }
        // Otherwise, replace the first seat with the new selection (FIFO)
        return [...seats.slice(1), seatId];
      }
    });
    
    // Dispatch event with updated selection
    selectedSeats.subscribe(seats => {
      dispatch('seatSelected', { seats });
    })();
  }

  // Handle section selection
  function selectSection(sectionName: string) {
    selectedSection.set(sectionName);
  }

  // Handle zoom controls
  function zoomIn() {
    zoom.update(z => Math.min(z + 0.1, 2));
  }

  function zoomOut() {
    zoom.update(z => Math.max(z - 0.1, 0.5));
  }

  function resetZoom() {
    zoom.set(1);
    panX = 0;
    panY = 0;
    lastPanX = 0;
    lastPanY = 0;
  }

  // Handle panning
  function handleMouseDown(event: MouseEvent) {
    isDragging = true;
    startPanX = event.clientX;
    startPanY = event.clientY;
  }

  function handleMouseMove(event: MouseEvent) {
    if (!isDragging) return;
    
    const deltaX = event.clientX - startPanX;
    const deltaY = event.clientY - startPanY;
    
    panX = lastPanX + deltaX / $zoom;
    panY = lastPanY + deltaY / $zoom;
  }

  function handleMouseUp() {
    isDragging = false;
    lastPanX = panX;
    lastPanY = panY;
  }

  // Get seat color based on status
  function getSeatColor(status: string, seatId: string): string {
    if ($selectedSeats.includes(seatId)) return 'bg-green-500 text-white';
    
    switch (status) {
      case 'available': return 'bg-white border-gray-300 hover:bg-gray-100 cursor-pointer';
      case 'unavailable': return 'bg-gray-200 text-gray-400 cursor-not-allowed';
      case 'sold': return 'bg-red-500 text-white cursor-not-allowed';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  onMount(() => {
    if (loadOnMount) {
      fetchSeatMap();
    }
    
    // Cleanup function to remove event listeners
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });
  
  // Add document event listeners for mouse events to handle pan outside the component
  $: if (isDragging) {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  } else {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  // Track selected seats to enable proper updates
  $: if ($selectedSeats && typeof dispatch === 'function') {
    dispatch('seatSelected', { seats: $selectedSeats });
  }
</script>

<div class="seat-selector w-full">
  {#if loading}
    <div class="flex h-60 items-center justify-center">
      <div class="flex flex-col items-center">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary"></div>
        <span class="mt-2 text-sm text-gray-600">Loading seat map...</span>
      </div>
    </div>
  {:else if error}
    <div class="rounded-md bg-red-50 p-4 text-red-800">
      <h3 class="text-base font-medium">Error loading seat map</h3>
      <p class="mt-1 text-sm">{error}</p>
      <button 
        class="mt-3 rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-800 hover:bg-red-200"
        on:click={fetchSeatMap}
      >
        Try Again
      </button>
    </div>
  {:else if seatMap}
    <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h3 class="text-lg font-semibold text-gray-800">Select Your Seats</h3>
      
      <!-- Controls -->
      <div class="flex items-center space-x-2">
        <button 
          on:click={() => showLegend = !showLegend}
          class="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
        >
          <span class="mr-1">Legend</span>
          <i class="fas fa-info-circle"></i>
        </button>
        
        <button 
          on:click={zoomOut}
          class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          aria-label="Zoom out"
        >
          <i class="fas fa-minus"></i>
        </button>
        
        <button 
          on:click={resetZoom}
          class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          aria-label="Reset view"
        >
          <i class="fas fa-sync-alt"></i>
        </button>
        
        <button 
          on:click={zoomIn}
          class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          aria-label="Zoom in"
        >
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>
    
    {#if showLegend}
      <div class="mb-4 grid grid-cols-2 gap-2 rounded-md border border-gray-200 bg-gray-50 p-3 md:grid-cols-4" transition:fade={{ duration: 150 }}>
        <div class="flex items-center">
          <div class="mr-2 h-4 w-4 rounded border border-gray-300 bg-white"></div>
          <span class="text-sm">Available</span>
        </div>
        <div class="flex items-center">
          <div class="mr-2 h-4 w-4 rounded bg-gray-200"></div>
          <span class="text-sm">Unavailable</span>
        </div>
        <div class="flex items-center">
          <div class="mr-2 h-4 w-4 rounded bg-red-500"></div>
          <span class="text-sm">Sold</span>
        </div>
        <div class="flex items-center">
          <div class="mr-2 h-4 w-4 rounded bg-green-500"></div>
          <span class="text-sm">Selected</span>
        </div>
      </div>
    {/if}
    
    <!-- Section selection -->
    {#if seatMap.sections && seatMap.sections.length > 1}
      <div class="mb-4">
        <label class="mb-1 block text-sm font-medium text-gray-700">Section</label>
        <div class="flex flex-wrap gap-2">
          {#each seatMap.sections as section}
            <button
              class="rounded-md border px-3 py-1 text-sm font-medium transition-colors"
              class:border-primary={$selectedSection === section.name}
              class:text-primary={$selectedSection === section.name}
              class:bg-primary-50={$selectedSection === section.name}
              class:border-gray-300={$selectedSection !== section.name}
              class:text-gray-700={$selectedSection !== section.name}
              class:hover:bg-gray-50={$selectedSection !== section.name}
              on:click={() => selectSection(section.name)}
            >
              {section.name}
            </button>
          {/each}
        </div>
      </div>
    {/if}
    
    <!-- Seats container -->
    <div 
      class="relative mb-4 overflow-hidden rounded-md border border-gray-200 bg-white"
      style="height: 400px;"
      on:mousedown={handleMouseDown}
    >
      <!-- Stage indicator -->
      <div class="absolute left-0 right-0 top-4 z-10 flex justify-center">
        <div class="rounded-md bg-gray-800 px-8 py-1 text-center text-sm font-medium text-white opacity-75">
          Stage
        </div>
      </div>
      
      <!-- Seating area -->
      <div 
        class="absolute inset-0 p-10 transition-transform duration-100 ease-out"
        style="transform: scale({$zoom}) translate({panX}px, {panY}px);"
      >
        {#if $selectedSection && seatMap.sections}
          {#each seatMap.sections.filter(s => s.name === $selectedSection) as section}
            <div class="flex flex-col items-center space-y-2">
              {#each section.rows as row}
                <div class="flex items-center">
                  <div class="mr-3 w-8 text-right text-sm font-medium text-gray-700">
                    {row.label}
                  </div>
                  <div class="flex space-x-1">
                    {#each row.seats as seat}
                      <button
                        class={`flex h-8 w-8 select-none items-center justify-center rounded-md border text-sm font-medium ${getSeatColor(seat.status, seat.id)}`}
                        disabled={seat.status !== 'available'}
                        on:click={() => toggleSeat(seat.id, seat.status)}
                        title={`${row.label}${seat.label} - ${seat.status}`}
                      >
                        {seat.label}
                      </button>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          {/each}
        {/if}
      </div>
    </div>
    
    <!-- Selected seats summary -->
    <div class="rounded-md border border-gray-200 bg-gray-50 p-3">
      <h4 class="text-sm font-medium text-gray-700">Selected Seats ({$selectedSeats.length}/{maxSelections})</h4>
      {#if $selectedSeats.length > 0}
        <div class="mt-2 flex flex-wrap gap-2">
          {#each $selectedSeats as seatId}
            <div class="flex items-center rounded-md bg-green-100 px-2 py-1 text-sm text-green-800">
              <span>{seatId}</span>
              <button 
                class="ml-1 text-green-600 hover:text-green-800"
                on:click={() => toggleSeat(seatId, 'available')}
                aria-label={`Remove seat ${seatId}`}
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          {/each}
        </div>
      {:else}
        <p class="mt-1 text-sm text-gray-500">No seats selected yet. Click on available seats to select them.</p>
      {/if}
    </div>
  {:else}
    <div class="rounded-md bg-yellow-50 p-4 text-yellow-800">
      <h3 class="text-base font-medium">Seat map not available</h3>
      <p class="mt-1 text-sm">There is no seat map configured for this event.</p>
    </div>
  {/if}
</div>

<style>
  .seat-selector {
    user-select: none;
  }
</style> 