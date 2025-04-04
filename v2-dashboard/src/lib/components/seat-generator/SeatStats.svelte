<script lang="ts">
    import { seatGeneratorStore } from '$lib/stores/seat-generator.svelte';
    import type { SeatStatus } from '$lib/types/seat-generator';
    
    // Create local reactive variables that track the store
    const rows = $derived(seatGeneratorStore.section.seatConfig.rows);
    const seatsPerRow = $derived(seatGeneratorStore.section.seatConfig.seatsPerRow);
    const seatMatrix = $derived(seatGeneratorStore.section.seats);
    
    // Computed values for different seat statuses
    const totalSeats = $derived(rows * seatsPerRow);
    
    // Safely handle flat() on empty arrays
    const unavailableSeats = $derived(seatMatrix.length > 0 
        ? seatMatrix.flat().filter((status: SeatStatus) => status === 'unavailable').length 
        : 0);
    
    const soldSeats = $derived(seatMatrix.length > 0 
        ? seatMatrix.flat().filter((status: SeatStatus) => status === 'sold').length 
        : 0);
    
    const availableSeats = $derived(totalSeats - unavailableSeats - soldSeats);
    
    // Debug logging
    $effect(() => {
        console.log('SeatStats: Rows =', rows, 'Seats Per Row =', seatsPerRow, 'Total =', totalSeats);
        console.log('SeatStats: Seat Matrix Size =', seatMatrix.length > 0 ? seatMatrix.flat().length : 0);
    });
</script>

<div class="rounded-lg border border-[#B4B4B4] bg-white p-6">
    <div class="flex items-center justify-between">
        <div>
            <h3 class="text-xl font-bold text-gray-800">Seat Count</h3>
            <div class="mt-3 flex space-x-8">
                <div>
                    <span class="font-medium">Total Seats: </span>
                    <span class="font-bold">{totalSeats}</span>
                </div>

                <div>
                    <span class="font-medium">Unavailable Seats: </span>
                    <span class="font-bold">{unavailableSeats}</span>
                </div>

                <div>
                    <span class="font-medium">Sold Seats: </span>
                    <span class="font-bold">{soldSeats}</span>
                </div>
            </div>
        </div>

        <div class="text-right">
            <span class="text-5xl font-bold text-gray-800">{availableSeats}</span>
            <p class="text-sm text-gray-600">Current Seats Available</p>
        </div>
    </div>
</div> 