<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import panzoom from 'panzoom';
    import SeatMatrix from './SeatMatrix.svelte';
    import { seatGeneratorStore } from '$lib/stores/seat-generator.svelte';
    
    // State runes
    let containerElement = $state<HTMLElement | null>(null);
    let seatContainer = $state<HTMLElement | null>(null);
    let panzoomInstance = $state<ReturnType<typeof panzoom> | null>(null);
    let isInitialized = $state(false);
    let currentZoom = $state(1);
    
    // Effect to sync with seatGeneratorStore
    $effect(() => {
        currentZoom = seatGeneratorStore.currentZoom;
    });

    // Initialize panzoom
    const initializePanzoom = () => {
        if (!seatContainer || !containerElement) return;

        // Dispose existing instance if any
        if (panzoomInstance) {
            panzoomInstance.dispose();
            panzoomInstance = null;
        }

        // Wait for the next frame to ensure DOM is ready
        requestAnimationFrame(() => {
            if (!seatContainer) return;
            
            // Create new panzoom instance
            panzoomInstance = panzoom(seatContainer, {
                maxZoom: 2,
                minZoom: 0.1,
                bounds: true,
                boundsPadding: 0.1,
                smoothScroll: true,
                zoomDoubleClickSpeed: 1,
                zoomSpeed: 0.1
            });

            // Listen to zoom events
            panzoomInstance.on('zoom', (e: any) => {
                currentZoom = Math.round(e.getTransform().scale * 100) / 100;
                seatGeneratorStore.setCurrentZoom(currentZoom);
            });

            // Initial fit to screen
            setTimeout(handleFitToScreen, 100);
            isInitialized = true;
        });
    };
    
    // Zoom control functions
    const handleZoomIn = () => {
        if (panzoomInstance) {
            panzoomInstance.smoothZoom(0, 0, 1.2);
        }
    };

    const handleZoomOut = () => {
        if (panzoomInstance) {
            panzoomInstance.smoothZoom(0, 0, 0.8);
        }
    };

    const handleFitToScreen = () => {
        if (!panzoomInstance || !seatContainer || !containerElement) return;

        const containerRect = containerElement.getBoundingClientRect();
        const contentRect = seatContainer.getBoundingClientRect();

        if (containerRect && contentRect) {
            const scaleX = (containerRect.width - 64) / contentRect.width;
            const scaleY = (containerRect.height - 64) / contentRect.height;
            const scale = Math.min(scaleX, scaleY, 1) * 0.9;

            // Reset transform first
            panzoomInstance.moveTo(0, 0);
            panzoomInstance.zoomAbs(0, 0, scale);

            // Center the content
            const scaledWidth = contentRect.width * scale;
            const scaledHeight = contentRect.height * scale;
            const centerX = (containerRect.width - scaledWidth) / 2;
            const centerY = (containerRect.height - scaledHeight) / 2;
            
            panzoomInstance.moveTo(centerX, centerY);
        }
    };
    
    // Effects
    $effect(() => {
        if (seatGeneratorStore.section && !isInitialized) {
            setTimeout(() => {
                initializePanzoom();
            }, 100);
        }
    });
    
    onMount(() => {
        setTimeout(() => {
            initializePanzoom();
        }, 100);
    });
    
    onDestroy(() => {
        if (panzoomInstance) {
            panzoomInstance.dispose();
            panzoomInstance = null;
        }
        isInitialized = false;
    });
</script>

<div class="relative h-[600px] overflow-hidden rounded" bind:this={containerElement}>
    <div class="absolute inset-0 overflow-hidden bg-gray-100">
        <div class="relative h-full w-full p-8">
            <div class="flex h-full items-center justify-center">
            
                <div class="relative rounded-lg border-2 border-gray-300 bg-white p-8">
                    <div class="relative" bind:this={seatContainer}>
                        <!-- Venue floor plan image as background if available -->
                        {#if seatGeneratorStore.venueImage}
                            <div class="absolute inset-0 z-0 flex items-center justify-center">
                                <img src={seatGeneratorStore.venueImage} alt="Venue floor plan" class="max-h-full max-w-full object-contain opacity-40" />
                            </div>
                        {/if}
                        
                       
                        
                        <!-- Seat matrix -->
                        <SeatMatrix />
                        
                    
                    </div>
                </div>
              
            </div>
        </div>
    </div>

    <!-- Legend and Zoom Controls -->
    <div class="absolute right-0 bottom-0 left-0 z-20 flex items-center justify-between bg-white p-4 shadow-[0_-2px_4px_rgba(0,0,0,0.1)]">
        <!-- Legend -->
        <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
                <div class="h-4 w-4 rounded-md bg-gray-300"></div>
                <span class="text-sm">Unavailable</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="h-4 w-4 rounded-md bg-green-500"></div>
                <span class="text-sm">Available</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="h-4 w-4 rounded-md bg-red-500"></div>
                <span class="text-sm">Sold</span>
            </div>
        </div>

        <!-- Zoom Controls -->
        <div class="flex items-center gap-2">
            <button
                aria-label="Zoom out"
                class="rounded bg-gray-50 px-2 py-1 text-sm shadow hover:bg-gray-100"
                onclick={handleZoomOut}
                tabindex="0"
                onkeydown={(e) => e.key === 'Enter' && handleZoomOut()}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fill-rule="evenodd"
                        d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                        clip-rule="evenodd"
                    />
                </svg>
            </button>
            <span class="min-w-[4rem] text-center text-sm">{(currentZoom * 100).toFixed(0)}%</span>
            <button
                aria-label="Zoom in"
                class="rounded bg-gray-50 px-2 py-1 text-sm shadow hover:bg-gray-100"
                onclick={handleZoomIn}
                tabindex="0"
                onkeydown={(e) => e.key === 'Enter' && handleZoomIn()}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fill-rule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clip-rule="evenodd"
                    />
                </svg>
            </button>
            <button
                class="rounded bg-gray-50 px-3 py-1 text-sm shadow hover:bg-gray-100"
                onclick={handleFitToScreen}
                tabindex="0"
                onkeydown={(e) => e.key === 'Enter' && handleFitToScreen()}
                aria-label="Fit to screen"
            >
                Fit to Screen
            </button>
        </div>
    </div>
</div>

<style>
    .transform-origin-center {
        transform-origin: center center;
    }

    .writing-vertical {
        writing-mode: vertical-rl;
        text-orientation: mixed;
    }
</style> 