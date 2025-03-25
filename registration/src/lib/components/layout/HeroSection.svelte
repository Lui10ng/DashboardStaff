// ... existing code ...
<script lang="ts">
    import type { EventData } from '$lib/types/event';
    import EventDetails from '../ui/EventDetails.svelte';
    import EventPoster from '../ui/EventPoster.svelte';
    import CountdownTimer from '$lib/components/ui/CountdownTimer.svelte';
    import type { CountdownData } from '$lib/types/event';
	  import { dummyEventData } from '$lib/types/dummy';
    
    let countdownData: CountdownData = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    };
    let isEventStarted = false;
    let isEventEnded = false;

  

    const eventStartDate = new Date(`${dummyEventData.startDate}T${dummyEventData.startTime}`);

    
    
    export let event: EventData;
</script>

<section class="relative min-h-screen pt-20">
    {#if event.backgroundImage}
      <div 
        class="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[2px]"
        style="background-image: url({event.backgroundImage});"
      >
        <div class="absolute inset-0 bg-[#000000]/80"></div>
      </div>
    {/if}
  
    <div class="relative z-10">
      <div class="max-w-6xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <EventDetails {event} />
          <div class="order-first md:order-last">
            <EventPoster poster={event.poster} />
          </div>
        </div>
        
        <!-- Add CountdownTimer below the grid -->
        <div class="mt-8 flex justify-center">
          <CountdownTimer 
                countdown={countdownData} 
                isEventStarted={isEventStarted} 
                isEventEnded={isEventEnded} 
            />
        </div>
      </div>
    </div>
  </section>