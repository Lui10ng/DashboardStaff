<script lang="ts">
    import { seatGeneratorStore } from '$lib/stores/seat-generator.svelte';
    
    // Toggle reserve seating
    const handleReserveSeatingToggle = () => {
        seatGeneratorStore.setReserveSeatingEnabled(!seatGeneratorStore.reserveSeatingEnabled);
    };
</script>

<div class="rounded-lg border border-gray-200 bg-white p-6 mt-10">
    <div class="flex items-center justify-between">
        <div>
            <h3 class="text-xl font-bold text-gray-800">Reserve Seat</h3>
            <p class="mt-1 text-sm text-gray-600">
                Enable or disable the reserve seating feature for this event
            </p>
        </div>
        <div class="flex items-center">
            <button
                aria-label="Toggle reserve seating"
                type="button"
                class="toggle-button relative h-6 w-12 rounded-full bg-gray-300 p-0.5 transition-colors"
                class:bg-green-500={seatGeneratorStore.reserveSeatingEnabled}
                on:click={handleReserveSeatingToggle}
                on:keydown={(e) => e.key === 'Enter' && handleReserveSeatingToggle()}
                aria-pressed={seatGeneratorStore.reserveSeatingEnabled}
                tabindex="0"
            >
                <span
                    class="block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
                    class:translate-x-6={seatGeneratorStore.reserveSeatingEnabled}
                ></span>
            </button>
            <span class="ml-2 font-medium">
                {seatGeneratorStore.reserveSeatingEnabled ? 'Enabled' : 'Disabled'}
            </span>
        </div>
    </div>
</div>

<style>
    /* Toggle button styling */
    .toggle-button {
        outline: none;
        border: none;
    }

    .toggle-button:focus {
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
    }
</style> 