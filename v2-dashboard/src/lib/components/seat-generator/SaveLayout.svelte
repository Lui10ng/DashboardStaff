<script lang="ts">
    import { seatGeneratorStore } from '$lib/stores/seat-generator.svelte';
    import { prepareSeatsData } from '$lib/utils/seat-utils';
    import { enhance } from '$app/forms';
    
    // Success/error message state
    let message = $state<{ type: 'success' | 'error', text: string } | null>(null);
    let showMessage = $state(false);
    
    // Generate layout data for saving
    const generateLayoutData = () => {
        const section = seatGeneratorStore.section;
        const customSeatNames = seatGeneratorStore.customSeatNames;
        
        return {
            config: {
                ticketQuantity: seatGeneratorStore.ticketQuantity,
                seatConfig: { ...section.seatConfig }
            },
            venueImage: seatGeneratorStore.venueImage,
            customSeatNames,
            seats: prepareSeatsData(section, customSeatNames),
            summary: {
                totalSeats: section.seatConfig.rows * section.seatConfig.seatsPerRow,
                availableSeats: section.seats.flat().filter(status => status === 'available').length,
                unavailableSeats: section.seats.flat().filter(status => status === 'unavailable').length,
                soldSeats: section.seats.flat().filter(status => status === 'sold').length
            }
        };
    };

    const handleDownloadLayout = () => {
        const layoutData = generateLayoutData();

        // Convert to JSON and create download
        const jsonString = JSON.stringify(layoutData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `seat-layout-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();

        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    };
    
    // Handle form submit result
    const handleSubmit = () => {
        return async ({ result }: { result: { type: string; data?: any } }) => {
            if (result.type === 'success') {
                const data = result.data;
                if (data?.success) {
                    message = { type: 'success', text: data.message || 'Layout saved successfully' };
                } else {
                    message = { type: 'error', text: data?.error || 'Failed to save layout' };
                }
            } else {
                message = { type: 'error', text: 'Failed to save layout' };
            }
            
            showMessage = true;
            setTimeout(() => {
                showMessage = false;
            }, 3000);
        };
    };
</script>

<div class="space-y-3">
    <!-- Server Save Form -->
    <form method="POST" action="?/saveLayout" use:enhance={handleSubmit}>
        <input type="hidden" name="layoutData" value={JSON.stringify(generateLayoutData())} />
        <button
            type="submit"
            class="w-full rounded bg-[#DF4D60] py-2 text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Save seat layout to server"
            tabindex="0"
            onclick={handleDownloadLayout}
        >
            Save Changes
        </button>
    </form>
    
    <!-- Status message -->
    {#if showMessage && message}
        <div class="mt-2 rounded-md p-2 text-sm {message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
            {message.text}
        </div>
    {/if}
</div> 