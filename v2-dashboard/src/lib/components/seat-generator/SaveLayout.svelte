<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { seatGeneratorStore } from '$lib/stores/seat-generator.svelte';
    import { enhance } from '$app/forms';
    import Button from '../ui/Button.svelte';
    import { toast } from '$lib/stores/toast';
    import type { SubmitFunction } from '@sveltejs/kit';
    import type { ActionResult } from '@sveltejs/kit';
    import { seatMapStore } from '$lib/stores/seat-map';
    
    const dispatch = createEventDispatcher<{
        seatMapCreated: { seatMapId: string };
        save: void;
    }>();
    const { eventName } = $props<{ eventName: string }>();
    
    // Subscribe to the store
    const seatGeneratorState = $derived($seatGeneratorStore);
    
    // Success/error message state
    let isSubmitting = $state(false);
    
    // Generate layout data for saving
    const generateLayoutData = () => {
        const section = seatGeneratorState?.section;
        const customSeatNames = seatGeneratorState?.customSeatNames ?? {};
        
        if (!section?.seatConfig) {
            console.error('Seat configuration is not properly initialized');
            return null;
        }
        
        // Calculate total seats
        const totalSeats = (section.seatConfig.rows ?? 0) * (section.seatConfig.seatsPerRow ?? 0);
        
        // Convert seats array to record format
        const seatsRecord: Record<string, any> = {};
        if (section.seats && Array.isArray(section.seats)) {
            section.seats.forEach((row, rowIndex) => {
                if (Array.isArray(row)) {
                    row.forEach((seatStatus, seatIndex) => {
                        const rowLabel = String.fromCharCode(65 + rowIndex); // A, B, C, etc.
                        const seatNumber = (seatIndex + 1).toString();
                        const seatId = `${rowLabel}${seatNumber}`;
                        seatsRecord[seatId] = {
                            status: seatStatus,
                            displayName: seatId
                        };
                    });
                }
            });
        }
        
        return {
            name: eventName? eventName : 'Default Layout',
            config: {
                ticketQuantity: totalSeats, // Always use total seats as ticket quantity
                seatConfig: {
                    rows: section.seatConfig.rows,
                    seatsPerRow: section.seatConfig.seatsPerRow,
                    rowStartChar: section.seatConfig.rowStartChar,
                    seatStartNum: section.seatConfig.seatStartNum,
                    rowOrder: section.seatConfig.rowOrder,
                    seatOrder: section.seatConfig.seatOrder,
                    rowLabel: section.seatConfig.rowLabel
                }
            },
            seats: seatsRecord,
            customSeatNames,
            summary: {
                totalSeats,
                availableSeats: totalSeats,
                unavailableSeats: 0,
                soldSeats: 0
            }
        };
    };

    const handleDownloadLayout = () => {
        const layoutData = generateLayoutData();
        if (!layoutData) {
            toast.show({
                message: 'Cannot download: Seat configuration is not properly initialized',
                type: 'error'
            });
            return;
        }

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
    
    const handleSubmit: SubmitFunction = async ({ formData }) => {
        isSubmitting = true;
        console.log('Starting SaveLayout handleSubmit...');
        
        const layoutData = generateLayoutData();
        if (!layoutData) {
            isSubmitting = false;
            toast.show({
                message: 'Cannot save: Seat configuration is not properly initialized',
                type: 'error'
            });
            return;
        }

        try {
            console.log('Saving layout data to store:', layoutData);
            // Save to store only
            seatMapStore.setSeatMap(layoutData);
            
            isSubmitting = false;
            toast.show({
                message: 'Layout configuration saved to store',
                type: 'success'
            });
            
            // Only dispatch save event
            dispatch('save');
            console.log('Layout saved successfully to store');
            alert('Layout saved successfully to store');
            return;
        } catch (error) {
            console.error('Error saving layout:', error);
            isSubmitting = false;
            toast.show({
                message: 'Failed to save layout',
                type: 'error'
            });
            return;
        }
    };

    function handleSave() {
        dispatch('save');
    }
</script>

<div class="space-y-3">
    <!-- Server Save Form -->
    <form
        action="?/saveLayout"
        method="POST"
        use:enhance={handleSubmit}
        class="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
        <Button
            type="submit"
            disabled={isSubmitting}
            label={isSubmitting ? 'Saving...' : 'Save Layout'}
            className="bg-primary text-white w-full py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
        />
    </form>
    
    <!-- Local download option -->
    <button
        type="button"
        class="w-full rounded bg-gray-200 py-2 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
        aria-label="Download seat layout as JSON file"
        onclick={handleDownloadLayout}
        disabled={isSubmitting}
    >
        Download JSON
    </button>
    
    <p class="text-xs text-gray-500 mt-2">
        Note: Saving creates a seat map that will be linked to this event and usable for ticket sales.
        The Download JSON option is for backup purposes only.
    </p>
</div> 