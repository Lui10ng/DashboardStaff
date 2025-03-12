<script lang="ts">
  import { attendees, currentPage, itemsPerPage, selectedFilter, searchQuery } from '../../stores/attendees';
  import AttendeeModal from '$lib/components/ui/AttendeeModel.svelte';

  $: filteredAttendees = $attendees.filter(attendee => {
    const matchesFilter = attendee.status === $selectedFilter;
    const matchesSearch = attendee.name.toLowerCase().includes($searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  $: totalPages = Math.ceil(filteredAttendees.length / $itemsPerPage);
  $: paginatedAttendees = filteredAttendees.slice(
    ($currentPage - 1) * $itemsPerPage,
    $currentPage * $itemsPerPage
  );


  $: {
    if ($selectedFilter || $searchQuery) {
      currentPage.set(1);
    }
  }

  
  let selectedAttendee: any = null;

  function handleCheckIn(attendee: any) {
    console.log('Checking in:', attendee);
  }
</script>


<div class="hidden md:block" >
  <div class="space-y-4">
    {#each paginatedAttendees as attendee}
      <div 
        class="flex items-center justify-between py-2 px-4 hover:bg-gray-50 cursor-pointer transition-colors rounded-lg"
        on:click={() => selectedAttendee = attendee}
        on:keydown={(event) => event.key === 'Enter' && (selectedAttendee = attendee)}
        role="button"
        tabindex="0"
      >
      <span class="text-sm text-gray-800">{attendee.name}</span>
      <div class="flex flex-col items-end">
        <span 
          class={`px-3 py-1 rounded-full text-sm font-medium 
            ${attendee.status === 'IN' ? 'bg-green-100 text-green-800' : 
              'bg-red-100 text-red-800'}`}
        >
          {attendee.status}
        </span>
        <p class="text-sm text-gray-500">
          {attendee.date} at {attendee.time}
        </p>
      </div>
    </div>
  {/each}

    {#if paginatedAttendees.length === 0}
      <div class="flex justify-center py-4 text-gray-500">
        <p>No guests found</p>
      </div>
    {/if}
  </div>
</div>


<div class="md:hidden h-[calc(100vh-180px)] overflow-y-auto px-4">
  <div class="space-y-4">
    {#each paginatedAttendees as attendee}
    <div 
      class="flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer"
      on:click={() => selectedAttendee = attendee}
      on:keydown={(e) => e.key === 'Enter' && (selectedAttendee = attendee)}
      role="button"
      tabindex="0"
    >
      <div class="flex flex-col">
        <span class="text-sm font-medium text-gray-800">{attendee.name}</span>
        <span class="text-xs text-gray-500">{attendee.date} at {attendee.time}</span>
      </div>
      <span 
        class={`px-3 py-1 rounded-full text-xs font-medium
          ${attendee.status === 'IN' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'}`}
      >
        {attendee.status}
      </span>
    </div>
  {/each}


    {#if filteredAttendees.length === 0}
      <div class="flex flex-col items-center justify-center py-8 text-gray-500">
        <span class="text-sm">No guests found</span>
      </div>
    {/if}
  </div>
</div>


{#if selectedAttendee}
  <AttendeeModal
    attendee={selectedAttendee}
    on:close={() => selectedAttendee = null}
    on:checkIn={() => handleCheckIn(selectedAttendee)}
  />
{/if}

<style>
 
  @media (max-width: 768px) {
    :global(.overflow-y-auto) {
      scrollbar-width: thin;
      scrollbar-color: #CBD5E0 #EDF2F7;
    }

    :global(.overflow-y-auto::-webkit-scrollbar) {
      width: 4px;
    }

    :global(.overflow-y-auto::-webkit-scrollbar-track) {
      background: #EDF2F7;
    }

    :global(.overflow-y-auto::-webkit-scrollbar-thumb) {
      background-color: #CBD5E0;
      border-radius: 2px;
    }
  }
</style>