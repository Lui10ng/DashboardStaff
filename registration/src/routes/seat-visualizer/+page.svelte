<script lang="ts">
    import panzoom from 'panzoom';
    import { onMount } from 'svelte';
    import '../../lib/styles/seatVisualizer/seat-visualizer.css';
    // @ts-ignore
    import seatsObj from '$lib/data/seats.json';

    let seatContainer: HTMLElement;
    let selectedSeats: string[] = [];
    let ticketQuantity = 2;
    let showWarning = false;

    type Seat = {
        seatName: string;
        paid: boolean;
    };

    let seats: Seat[] = Object.entries(seatsObj).map(([seatName, details]) => ({
        seatName,
        paid: (details as { paid?: boolean }).paid || false,
        ...(typeof details === 'object' ? details : {})
    }));

    function getRowPrefix(seatName: string): string {
        let match = seatName.match(/^[a-zA-Z]+/);
        return match ? match[0] : seatName;
    }

    function getColumnNumbers(seats: Array<Seat>) {
        let numbers = new Set<number>();
        seats.forEach((seat) => {
            let num = parseInt(seat.seatName.replace(/[^0-9]/g, ''), 10);
            if (!isNaN(num)) numbers.add(num);
        });
        return Array.from(numbers).sort((a, b) => a - b);
    }

    let groupedSeats = seats.reduce(
        (acc, seat) => {
            let rowKey = getRowPrefix(seat.seatName);
            if (!acc[rowKey]) acc[rowKey] = [];
            acc[rowKey].push(seat);
            return acc;
        },
        {} as Record<string, Seat[]>
    );

    let columnNumbers = getColumnNumbers(seats);

    function handleSeatClick(seat: Seat) {
        if (seat.paid) return;

        const seatIndex = selectedSeats.indexOf(seat.seatName);
        if (seatIndex > -1) {
            selectedSeats = selectedSeats.filter((s) => s !== seat.seatName);
        } else if (selectedSeats.length < ticketQuantity) {
            selectedSeats = [...selectedSeats, seat.seatName];
        }

        showWarning = selectedSeats.length !== ticketQuantity;
    }

    function handleQuantityChange(newQuantity: number) {
        ticketQuantity = newQuantity;
        if (selectedSeats.length > ticketQuantity) {
            selectedSeats = selectedSeats.slice(0, ticketQuantity);
        }
        showWarning = selectedSeats.length !== ticketQuantity;
    }

    function incrementQuantity() {
        if (ticketQuantity < 10) {
            handleQuantityChange(ticketQuantity + 1);
        }
    }

    function decrementQuantity() {
        if (ticketQuantity > 1) {
            handleQuantityChange(ticketQuantity - 1);
        }
    }

    async function refreshSeatData() {
        try {
            console.log('Refreshing seat data...');
        } catch (error) {
            console.error('Failed to refresh seat data:', error);
        }
    }

    onMount(() => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        const panZoomInstance = panzoom(seatContainer, {
            maxZoom: 5,
            minZoom: 1,
            bounds: true,
            boundsPadding: 0.4,
            zoomDoubleClickSpeed: 1,
            beforeMouseDown: (e) => {
                const target = e.target as HTMLElement;
                // Allow panning when clicking on layout elements
                const isPanningElement = 
                    target.classList.contains('seat-button') || 
                    target.parentElement?.classList.contains('seat-button') ||
                    target.classList.contains('seat-layout') ||
                    target.classList.contains('grid') ||
                    target.classList.contains('seats') ||
                    target.classList.contains('row');

                if (isPanningElement) {
                    e.stopPropagation();
                    return false;
                }
                return true;
            },
            smoothScroll: false
        });

        panZoomInstance.on('transform', () => {
            const transform = panZoomInstance.getTransform();
            if (transform.scale <= 1) {
                panZoomInstance.moveTo(transform.x, transform.y);
            }
        });

        if (isMobile) {
            let touchStartTime: number;
            let hasMoved = false;
            let lastTouchEnd = 0;

            const touchStart = (e: TouchEvent) => {
                touchStartTime = Date.now();
                hasMoved = false;
            };

            const touchMove = () => {
                hasMoved = true;
            };

            const touchEnd = (e: TouchEvent) => {
                const touchDuration = Date.now() - touchStartTime;
                const target = e.target as HTMLElement;

                const now = Date.now();
                if (now - lastTouchEnd <= 300) {
                    e.preventDefault();
                }
                lastTouchEnd = now;

                const isSeatButton =
                    target.classList.contains('seat-button') ||
                    target.parentElement?.classList.contains('seat-button');

                if (!hasMoved && touchDuration < 200 && isSeatButton) {
                    e.preventDefault();
                    e.stopPropagation();
                    const button = target.classList.contains('seat-button') ? target : target.parentElement;
                    const seatData = seats.find((s) => s.seatName === button?.textContent?.trim());
                    if (seatData) {
                        handleSeatClick(seatData);
                    }
                }
            };

            seatContainer.addEventListener('touchstart', touchStart, { passive: true });
            seatContainer.addEventListener('touchmove', touchMove, { passive: true });
            seatContainer.addEventListener('touchend', touchEnd);

            return () => {
                seatContainer.removeEventListener('touchstart', touchStart);
                seatContainer.removeEventListener('touchmove', touchMove);
                seatContainer.removeEventListener('touchend', touchEnd);
                panZoomInstance.dispose();
            };
        }

        return () => {
            panZoomInstance.dispose();
        };
    });
</script>

<div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-md">
        <div class="venue-container mb-10 rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div class="venue-image aspect-video relative bg-gray-200 flex items-center justify-center">
                <p class="text-center">
                    <span class="text-lg font-medium text-gray-700">VENUE FLOOR PLAN IMAGE</span>
                    <br />
                    <span class="text-sm text-gray-500">Refer to the venue image to know your seat</span>
                </p>
            </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Selected Seats ({selectedSeats.length}/{ticketQuantity})</h3>
            {#if selectedSeats.length > 0}
                <ul class="flex flex-wrap gap-2">
                    {#each selectedSeats as seatName}
                        <li class="px-4 py-3 bg-gray-100 rounded-lg text-gray-800 font-medium hover:bg-gray-200 transition-colors">
                            {seatName}
                        </li>
                    {/each}
                </ul>
            {:else}
                <p class="text-gray-600">No seats selected</p>
            {/if}
        </div>

        <h1 class="text-3xl font-bold text-gray-800 text-center mb-10 tracking-tight">Select Seats</h1>

        <div class="quantity-selector mb-6 flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <label for="ticket-quantity" class="font-medium text-gray-800">Number of Tickets:</label>
            <div class="flex items-center">
                <button on:click={decrementQuantity} 
                        class="bg-black text-white px-4 py-2 rounded-l hover:bg-gray-800 transition-colors">
                    -
                </button>
                <span class="px-4 text-lg text-gray-800">{ticketQuantity}</span>
                <button on:click={incrementQuantity} 
                        class="bg-black text-white px-4 py-2 rounded-r hover:bg-gray-800 transition-colors">
                    +
                </button>
            </div>
        </div>

        {#if showWarning}
            <div class="bg-amber-50 text-amber-800 p-4 rounded-xl mb-6 text-center font-medium border border-amber-200">
                Please select exactly {ticketQuantity} seat{ticketQuantity > 1 ? 's' : ''}. Currently selected: {selectedSeats.length}
            </div>
        {/if}

        <button class="w-full bg-blue-500 text-white py-4 px-8 rounded-xl mb-6 font-semibold text-base 
                       hover:bg-blue-600 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                on:click={refreshSeatData}>
            Refresh Seat Availability
        </button>

        <div class="mb-12 text-center">
            <div class="bg-gradient-to-b from-gray-600 to-gray-800 text-white py-8 px-8 rounded-2xl 
                        inline-block min-w-[80%] max-w-3xl text-center font-semibold tracking-wide shadow-md mx-8 text-xl">
                STAGE / SCREEN
            </div>
        </div>

        <div class="seat-layout">
            <div bind:this={seatContainer} class="grid">
                <div class="column-numbers">
                    {#each columnNumbers as colNum}
                        <div class="column-number">
                            {colNum}
                        </div>
                    {/each}
                </div>

                {#each Object.entries(groupedSeats) as [row, seats]}
                    <div class="row">
                        <div class="row-label">
                            {row.toUpperCase()}
                        </div>
                        <div class="seats">
                            {#each seats as seat}
                                <button
                                    class="seat-button {seat.paid
                                        ? 'taken'
                                        : selectedSeats.includes(seat.seatName)
                                            ? 'selected'
                                            : 'available'}"
                                    disabled={seat.paid}
                                    on:click={() => handleSeatClick(seat)}
                                >
                                    <span>
                                        {seat.seatName}
                                    </span>
                                </button>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <div class="mt-8 p-6 flex justify-center flex-wrap gap-8 bg-gray-50 rounded-xl">
            <div class="flex items-center gap-3 font-medium text-gray-800">
                <div class="h-4 w-4 rounded bg-emerald-500 shadow-sm"></div>
                <span>Available</span>
            </div>
            <div class="flex items-center gap-3 font-medium text-gray-800">
                <div class="h-4 w-4 rounded bg-gray-300 shadow-sm"></div>
                <span>Sold</span>
            </div>
            <div class="flex items-center gap-3 font-medium text-gray-800">
                <div class="h-4 w-4 rounded bg-indigo-500 shadow-sm"></div>
                <span>Selected</span>
            </div>
        </div>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        background-color: 'white';
        color: #fff;
        min-height: 100vh;
    }

    .quantity-controls {
        display: flex;
        align-items: center;
    }

    .quantity-button {
        background-color: #000;
        color: #fff;
        border: none;
        padding: 0.5rem;
        cursor: pointer;
    }

    .quantity-button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .quantity-controls span {
        margin: 0 1rem;
        font-size: 1.2rem;
    }
</style>
