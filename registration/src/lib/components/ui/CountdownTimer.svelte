<script lang="ts">
    import { onMount } from 'svelte';
    import type { CountdownData } from '$lib/types/event';
    import TimeBlock from '$lib/components/ui/TimeBlock.svelte';
    
    export let countdown: CountdownData = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };
  export let isEventStarted: boolean = false;
  export let isEventEnded: boolean = false;


  let interval: ReturnType<typeof setInterval>;

    // Function to calculate the countdown
    function calculateCountdown(targetDate: Date) {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;

        if (distance < 0) {
            isEventEnded = true;
            if (interval) {
                clearInterval(interval);
            }
            return;
        }

        isEventStarted = true;

        // Calculate time components
        countdown.days = Math.floor(distance / (1000 * 60 * 60 * 24));
        countdown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        countdown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        countdown.seconds = Math.floor((distance % (1000 * 60)) / 1000);
    }

    onMount(() => {
        const eventDate = new Date('2023-12-31T23:59:59'); // Replace with your event date
        calculateCountdown(eventDate);

        // Update the countdown every second
        interval = setInterval(() => {
            calculateCountdown(eventDate);
        }, 1000);

        // Clear the interval on component destroy
        return () => clearInterval(interval);
    });
</script>
  
<div class="bg-transparent py-8">
  <div class="max-w-3xl mx-auto px-8 bg-transparent p-6">
    <div class="flex gap-6 items-start justify-center">
      <div class="text-white  text-xl hidden md:block mr-[100px] mt-[50px] ">
        {#if isEventEnded}
          Event ended
        {:else if isEventStarted}
          Event ends in
        {:else}
          Events starts in
        {/if}
      </div>

      <div class="flex space-x-8">
        <div class="flex flex-col items-center">
          <span class="text-gray-400 text-sm mb-2">DAYS</span>
          <div class="bg-red-600 text-white text-3xl font-bold rounded-md w-16 h-16 flex items-center justify-center">
            {countdown.days}
          </div>
        </div>

        <div class="flex flex-col items-center">
          <span class="text-gray-400 text-sm mb-2">HOURS</span>
          <div class="bg-red-600 text-white text-3xl font-bold rounded-md w-16 h-16 flex items-center justify-center">
            {countdown.hours}
          </div>
        </div>

        <div class="flex flex-col items-center">
          <span class="text-gray-400 text-sm mb-2">MINUTES</span>
          <div class="bg-red-600 text-white text-3xl font-bold rounded-md w-16 h-16 flex items-center justify-center">
            {countdown.minutes}
          </div>
        </div>

        <div class="flex flex-col items-center">
          <span class="text-gray-400 text-sm mb-2">SECONDS</span>
          <div class="bg-red-600 text-white text-3xl font-bold rounded-md w-16 h-16 flex items-center justify-center">
            {countdown.seconds}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>