<script lang="ts">
    import { seatGeneratorStore } from '$lib/stores/seat-generator.svelte';
    import type { SeatStatus } from '$lib/types/seat-generator';
    
    // Toggle multiple seat selection
    const handleToggleChange = () => {
        const newValue = !seatGeneratorStore.multipleSeatSelection;
        seatGeneratorStore.setMultipleSeatSelection(newValue);
        
        if (newValue) {
            // If enabling multiple selection, clear the single selection
            seatGeneratorStore.setSelectedSeat(null);
        } else {
            // If disabling multiple selection, clear the multiple selections
            seatGeneratorStore.setSelectedSeats([]);
        }
    };
    
    // Change seat status
    const handleStatusChange = (status: SeatStatus) => {
        const multipleSeatSelection = seatGeneratorStore.multipleSeatSelection;
        const selectedSeat = seatGeneratorStore.selectedSeat;
        const selectedSeats = seatGeneratorStore.selectedSeats;
        
        if (!multipleSeatSelection && selectedSeat) {
            // Update single seat status
            seatGeneratorStore.section.seats[selectedSeat.rowIndex][selectedSeat.seatIndex] = status;
            seatGeneratorStore.setSelectedSeat(null);
        } else if (multipleSeatSelection && selectedSeats.length > 0) {
            // Update multiple seats status
            selectedSeats.forEach((seat) => {
                if (seat) {
                    seatGeneratorStore.section.seats[seat.rowIndex][seat.seatIndex] = status;
                }
            });
            seatGeneratorStore.setSelectedSeats([]);
        }
    };
</script>

<div class="flex items-center justify-between rounded-lg border border-[#B4B4B4] bg-white p-4">
    <div class="flex items-center gap-4">
        <label class="flex cursor-pointer items-center">
            <span class="mr-2 font-medium">Multiple Seat Selection</span>
            <button
                aria-label="Toggle multiple seat selection"
                type="button"
                class="toggle-button relative h-6 w-12 rounded-full bg-gray-300 p-0.5 transition-colors"
                class:bg-green-500={seatGeneratorStore.multipleSeatSelection}
                on:click={handleToggleChange}
                on:keydown={(e) => e.key === 'Enter' && handleToggleChange()}
                aria-pressed={seatGeneratorStore.multipleSeatSelection}
                tabindex="0"
            >
                <span
                    class="block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
                    class:translate-x-6={seatGeneratorStore.multipleSeatSelection}
                ></span>
            </button>
        </label>

        <!-- Show selection count in multiple selection mode -->
        {#if seatGeneratorStore.multipleSeatSelection && seatGeneratorStore.selectedSeats.length > 0}
            <span
                class="ml-2 rounded-md bg-blue-100 px-2 py-1 text-sm font-medium text-blue-700"
            >
                {seatGeneratorStore.selectedSeats.length} seats selected
            </span>
        {/if}
    </div>

    <div class="flex gap-2">
        <button
            class="rounded bg-gray-500 px-4 py-2 text-gray-300 transition hover:bg-gray-400"
            on:click={() => handleStatusChange('unavailable')}
            on:keydown={(e) => e.key === 'Enter' && handleStatusChange('unavailable')}
            disabled={(!seatGeneratorStore.multipleSeatSelection && !seatGeneratorStore.selectedSeat) ||
                (seatGeneratorStore.multipleSeatSelection && seatGeneratorStore.selectedSeats.length === 0)}
            aria-label="Mark seats as unavailable"
            tabindex="0"
        >
            Unavailable
        </button>
        <button
            class="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
            on:click={() => handleStatusChange('available')}
            on:keydown={(e) => e.key === 'Enter' && handleStatusChange('available')}
            disabled={(!seatGeneratorStore.multipleSeatSelection && !seatGeneratorStore.selectedSeat) ||
                (seatGeneratorStore.multipleSeatSelection && seatGeneratorStore.selectedSeats.length === 0)}
            aria-label="Mark seats as available"
            tabindex="0"
        >
            Available
        </button>
        <button
            class="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
            on:click={() => handleStatusChange('sold')}
            on:keydown={(e) => e.key === 'Enter' && handleStatusChange('sold')}
            disabled={(!seatGeneratorStore.multipleSeatSelection && !seatGeneratorStore.selectedSeat) ||
                (seatGeneratorStore.multipleSeatSelection && seatGeneratorStore.selectedSeats.length === 0)}
            aria-label="Mark seats as sold"
            tabindex="0"
        >
            Sold
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

    /* Add disabled button styling */
    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style> 