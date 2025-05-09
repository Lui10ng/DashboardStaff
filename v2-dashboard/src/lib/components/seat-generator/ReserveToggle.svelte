<script lang="ts">
    import { seatGeneratorStore } from '$lib/stores/seat-generator.svelte';
    
    const seatGeneratorState = $derived($seatGeneratorStore);
    const isEnabled = $derived(seatGeneratorState.reserveSeatingEnabled);
    
    // Function to reset seat configuration to defaults
    const resetSeatConfig = () => {
        if (confirm('Are you sure you want to reset the seat configuration? This will delete any existing seat layout.')) {
            seatGeneratorStore.setSectionConfig({
                rows: 5,
                seatsPerRow: 5,
                rowStartChar: 'A',
                seatStartNum: 1,
                rowOrder: 'down',
                seatOrder: 'left',
                rowLabel: 'Show All'
            });
            seatGeneratorStore.regenerateSeats();
        }
    };

    function toggleReserveSeating() {
        const newValue = !isEnabled;
        console.log('Toggling reserve seating:', newValue);
        
        if (newValue) {
            // First set the default configuration
            seatGeneratorStore.setSectionConfig({
                rows: 5,
                seatsPerRow: 5,
                rowStartChar: 'A',
                seatStartNum: 1,
                rowOrder: 'down',
                seatOrder: 'left',
                rowLabel: 'Row'
            });
            
            // Then enable reserve seating
            seatGeneratorStore.setReserveSeatingEnabled(true);
            
            // Finally regenerate seats
            seatGeneratorStore.regenerateSeats();
        } else {
            // Simply disable reserve seating
            seatGeneratorStore.setReserveSeatingEnabled(false);
        }
    }
</script>

<div class="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
    <div>
        <h3 class="text-base font-medium">Reserve Seating</h3>
        <p class="text-sm text-gray-500">Enable to create a seat map for this ticket</p>
    </div>
    
    <div class="flex items-center gap-4">
        {#if isEnabled}
            <button
                type="button"
                class="text-sm text-gray-500 hover:text-gray-700"
                on:click={resetSeatConfig}
            >
                Reset Configuration
            </button>
        {/if}
        
        <button
            type="button"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            class:bg-primary={isEnabled}
            class:bg-gray-200={!isEnabled}
            on:click={toggleReserveSeating}
            aria-pressed={isEnabled}
            aria-label="Toggle reserve seating"
        >
            <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                class:translate-x-6={isEnabled}
                class:translate-x-1={!isEnabled}
            />
        </button>
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