<script lang="ts">
    import { seatGeneratorStore } from '$lib/stores/seat-generator.svelte';
    import { generateSeatLabel } from '$lib/utils/seat-utils';
    
    let seatName = '';
    let originalSeatName = '';
    
    // Update names when selected seat changes
    $: if (seatGeneratorStore.selectedSeat) {
        originalSeatName = generateSeatLabel(
            seatGeneratorStore.section.seatConfig,
            seatGeneratorStore.selectedSeat.rowIndex,
            seatGeneratorStore.selectedSeat.seatIndex,
            seatGeneratorStore.section.seatData,
            seatGeneratorStore.customSeatNames
        );
        seatName = originalSeatName;
    }
    
    // Handle rename save
    const handleRenameSave = () => {
        if (!seatGeneratorStore.selectedSeat) return;
        
        // Update seat data in the section store
        const selectedSeat = seatGeneratorStore.selectedSeat;
        seatGeneratorStore.section.seatData[selectedSeat.rowIndex][selectedSeat.seatIndex].customName = seatName;
        
        // Clear selection after saving
        seatGeneratorStore.setSelectedSeat(null);
    };
    
    // Handle rename cancel
    const handleRenameCancel = () => {
        seatGeneratorStore.setSelectedSeat(null);
    };
</script>

{#if seatGeneratorStore.selectedSeat && !seatGeneratorStore.multipleSeatSelection}
    <div class="space-y-4 rounded-lg bg-white p-4">
        <h2 class="text-lg font-semibold">Rename Seat: {originalSeatName}</h2>
        <div class="space-y-2">
            <label for="seat-name" class="block font-medium">New Seat Name</label>
            <input
                type="text"
                bind:value={seatName}
                class="w-full rounded border p-2"
                placeholder="Enter new seat name (e.g., GD3)"
                aria-label="New seat name"
                tabindex="0"
            />
            <p class="text-xs text-gray-500">
                Original seat: {originalSeatName} → New: {seatName}
            </p>
        </div>
        <div class="flex justify-end gap-2">
            <button
                class="rounded bg-[#DF4D60] px-4 py-2 text-white hover:bg-red-400"
                on:click={handleRenameSave}
                on:keydown={(e) => e.key === 'Enter' && handleRenameSave()}
                aria-label="Save seat rename"
                tabindex="0"
            >
                Save
            </button>
            <button
                class="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                on:click={handleRenameCancel}
                on:keydown={(e) => e.key === 'Enter' && handleRenameCancel()}
                aria-label="Cancel seat rename"
                tabindex="0"
            >
                Cancel
            </button>
        </div>
    </div>
{/if} 