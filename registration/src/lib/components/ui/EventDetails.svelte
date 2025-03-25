<script lang="ts">
    import type { EventData } from '$lib/types/event';
    import { formatEventDate } from '$lib/types/date-formatter';
    
    export let event: EventData;
    
    $: formattedStartDate = formatEventDate(event.startDate, event.startTime);
    $: formattedEndDate = formatEventDate(event.endDate, event.endTime);
  </script>
  
  <div class="space-y-6">
    
  <h1 class="text-3xl md:text-5xl font-bold text-center md:text-left">{event.eventName}</h1>    
    <p class="text-white/80 text-base md:text-lg">
      {event.description}
    </p>
    <button class="w-full md:w-auto border-2 border-white/50 hover:bg-red-700 text-white px-8 py-3 rounded-md transition-colors text-lg font-semibold">
      Register Now
    </button>
    
    <div class="space-y-4 text-gray-300 bg-[#000000]/50 backdrop-blur-[5px] p-4 md:p-6 rounded-lg">
      <div class="flex items-start space-x-3">
        <!-- <svg class="w-6 h-6 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg> -->
        <div>
          <p class="font-semibold">Start</p>
          <p>{formattedStartDate}</p>
          <p class="font-semibold mt-2">End</p>
          <p>{formattedEndDate}</p>
        </div>
      </div>
      
      <div class="flex items-start space-x-3">
        <!-- <svg class="w-6 h-6 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg> -->
        <div>
          <p class="font-semibold">Location</p>
          <p>{event.location}</p>
        </div>
      </div>
    </div>
  

  </div>