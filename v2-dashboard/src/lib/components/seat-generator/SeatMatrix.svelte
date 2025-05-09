<script lang="ts">
    import { generateRowLabel, generateSeatLabel } from '$lib/utils/seat-utils';
    import { seatGeneratorStore } from '$lib/stores/seat-generator.svelte';
    import type { SeatStatus } from '$lib/types/seat-generator';

    // Subscribe to the store
    const seatGeneratorState = $derived($seatGeneratorStore);
    
    // Derived values with safe access
    const rowLabels = $derived(seatGeneratorState?.section?.seatConfig?.rowLabel ?? 'Show All');
    const rowStartChar = $derived(seatGeneratorState?.section?.seatConfig?.rowStartChar ?? 'A');
    const rowOrder = $derived(seatGeneratorState?.section?.seatConfig?.rowOrder ?? 'down');
    const rows = $derived(seatGeneratorState?.section?.seatConfig?.rows ?? 0);
    const seats = $derived(seatGeneratorState?.section?.seats ?? []);
    
    // Check if a seat is selected
    const isSeatSelected = (rowIndex: number, seatIndex: number) => {
        if (seatGeneratorState?.multipleSeatSelection) {
            return seatGeneratorState.selectedSeats?.some(
                (seat) => seat && seat.rowIndex === rowIndex && seat.seatIndex === seatIndex
            ) ?? false;
        }
        const selectedSeat = seatGeneratorState?.selectedSeat;
        return selectedSeat?.rowIndex === rowIndex && selectedSeat?.seatIndex === seatIndex;
    };
    
    // Handle seat click events
    const handleSeatClick = (rowIndex: number, seatIndex: number) => {
        if (!seatGeneratorState) return;
        
        if (seatGeneratorState.multipleSeatSelection) {
            const existingIndex = seatGeneratorState.selectedSeats?.findIndex(
                (seat) => seat && seat.rowIndex === rowIndex && seat.seatIndex === seatIndex
            ) ?? -1;

            if (existingIndex !== -1) {
                // Remove the seat if it's already selected
                const newSelectedSeats = seatGeneratorState.selectedSeats?.filter((_, index) => index !== existingIndex) ?? [];
                seatGeneratorStore.setSelectedSeats(newSelectedSeats);
            } else {
                // Add the seat to selection
                const newSelectedSeats = [...(seatGeneratorState.selectedSeats ?? []), { rowIndex, seatIndex }];
                seatGeneratorStore.setSelectedSeats(newSelectedSeats);
            }
        } else {
            const selectedSeat = seatGeneratorState.selectedSeat;
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
    {#if seats && seats.length > 0}
        {#each seats as row, rowIndex}
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
                            on:click={() => handleSeatClick(rowIndex, seatIndex)}
                            on:keydown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleSeatClick(rowIndex, seatIndex);
                                }
                            }}
                            tabindex="0"
                            aria-label={`Seat ${generateSeatLabel(
                                seatGeneratorState?.section?.seatConfig ?? {
                                    rowStartChar: 'A',
                                    seatStartNum: 1,
                                    rowOrder: 'down',
                                    seatOrder: 'left'
                                }, 
                                rowIndex, 
                                seatIndex, 
                                seatGeneratorState?.section?.seatData ?? {}, 
                                seatGeneratorState?.customSeatNames ?? {}
                            )}, status: ${seatStatus}${isSelected ? ', selected' : ''}`}
                            aria-pressed={isSelected}
                        >
                            {generateSeatLabel(
                                seatGeneratorState?.section?.seatConfig ?? {
                                    rowStartChar: 'A',
                                    seatStartNum: 1,
                                    rowOrder: 'down',
                                    seatOrder: 'left'
                                }, 
                                rowIndex, 
                                seatIndex, 
                                seatGeneratorState?.section?.seatData ?? {}, 
                                seatGeneratorState?.customSeatNames ?? {}
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
    {:else}
        <div class="flex items-center justify-center p-8 text-gray-500">
            No seats configured. Please set the number of rows and seats per row.
        </div>
    {/if}
</div> 