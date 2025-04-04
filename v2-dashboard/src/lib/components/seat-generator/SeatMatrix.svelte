<script lang="ts">
    import { generateRowLabel, generateSeatLabel } from '$lib/utils/seat-utils';
    import { seatGeneratorStore } from '$lib/stores/seat-generator.svelte';
    import type { SeatStatus } from '$lib/types/seat-generator';

    // SvelteKit 5 $derived
    let rowLabels = $derived(seatGeneratorStore.section.seatConfig.rowLabel);
    let rowStartChar = $derived(seatGeneratorStore.section.seatConfig.rowStartChar);
    let rowOrder = $derived(seatGeneratorStore.section.seatConfig.rowOrder);
    let rows = $derived(seatGeneratorStore.section.seatConfig.rows);
    
    // Check if a seat is selected
    const isSeatSelected = (rowIndex: number, seatIndex: number) => {
        if (seatGeneratorStore.multipleSeatSelection) {
            return seatGeneratorStore.selectedSeats.some(
                (seat) => seat && seat.rowIndex === rowIndex && seat.seatIndex === seatIndex
            );
        }
        const selectedSeat = seatGeneratorStore.selectedSeat;
        return selectedSeat?.rowIndex === rowIndex && selectedSeat?.seatIndex === seatIndex;
    };
    
    // Handle seat click events
    const handleSeatClick = (rowIndex: number, seatIndex: number) => {
        if (seatGeneratorStore.multipleSeatSelection) {
            const existingIndex = seatGeneratorStore.selectedSeats.findIndex(
                (seat) => seat && seat.rowIndex === rowIndex && seat.seatIndex === seatIndex
            );

            if (existingIndex !== -1) {
                // Remove the seat if it's already selected
                const newSelectedSeats = seatGeneratorStore.selectedSeats.filter((_, index) => index !== existingIndex);
                seatGeneratorStore.setSelectedSeats(newSelectedSeats);
            } else {
                // Add the seat to selection
                const newSelectedSeats = [...seatGeneratorStore.selectedSeats, { rowIndex, seatIndex }];
                seatGeneratorStore.setSelectedSeats(newSelectedSeats);
            }
        } else {
            const selectedSeat = seatGeneratorStore.selectedSeat;
            if (selectedSeat?.rowIndex === rowIndex && selectedSeat?.seatIndex === seatIndex) {
                seatGeneratorStore.setSelectedSeat(null);
            } else {
                seatGeneratorStore.setSelectedSeat({ rowIndex, seatIndex });
            }
        }
    };

    // Get seat status class
    const getSeatStatusClass = (status: SeatStatus, isSelected: boolean) => {
        const baseClasses = "flex h-10 w-10 items-center justify-center rounded-md border text-xs transition-all duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#DF4D60] focus-visible:outline-offset-2";
        const statusClasses: Record<SeatStatus, string> = {
            available: "bg-green-500 hover:bg-green-600",
            unavailable: "bg-gray-500 hover:bg-gray-400",
            sold: "bg-red-500 hover:bg-red-600"
        };
        const selectedClass = isSelected ? "ring-2 ring-offset-2 ring-[#DF4D60] scale-110 z-10" : "";
        
        return `${baseClasses} ${statusClasses[status]} text-white ${selectedClass}`;
    };
</script>

<div class="flex flex-col space-y-4">
    {#each seatGeneratorStore.section.seats as row, rowIndex}
        <div class="flex items-center">
            {#if rowLabels === 'Left Side' || rowLabels === 'Show All'}
                <div class="mr-4 min-w-8 w-auto flex-shrink-0 text-right font-medium">
                    {generateRowLabel(
                        rowStartChar,
                        rowOrder === 'down'
                            ? rowIndex
                            : rows - 1 - rowIndex
                    )}
                </div>
            {/if}

            <div class="flex flex-1 gap-2">
                {#each row as seatStatus, seatIndex}
                    {@const isSelected = isSeatSelected(rowIndex, seatIndex)}
                    <button
                        class={getSeatStatusClass(seatStatus as SeatStatus, isSelected)}
                        onclick={() => handleSeatClick(rowIndex, seatIndex)}
                        onkeydown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleSeatClick(rowIndex, seatIndex);
                            }
                        }}
                        tabindex="0"
                        aria-label={`Seat ${generateSeatLabel(
                            seatGeneratorStore.section.seatConfig, 
                            rowIndex, 
                            seatIndex, 
                            seatGeneratorStore.section.seatData, 
                            seatGeneratorStore.customSeatNames
                        )}, status: ${seatStatus}${isSelected ? ', selected' : ''}`}
                        aria-pressed={isSelected}
                    >
                        {generateSeatLabel(
                            seatGeneratorStore.section.seatConfig, 
                            rowIndex, 
                            seatIndex, 
                            seatGeneratorStore.section.seatData, 
                            seatGeneratorStore.customSeatNames
                        )}
                    </button>
                {/each}
            </div>

            {#if rowLabels === 'Right Side' || rowLabels === 'Show All'}
                <div class="min-w-8 w-auto flex-shrink-0 text-left font-medium ps-3">
                    {generateRowLabel(
                        rowStartChar,
                        rowOrder === 'down'
                            ? rowIndex
                            : rows - 1 - rowIndex
                    )}
                </div>
            {/if}
        </div>
    {/each}
</div> 