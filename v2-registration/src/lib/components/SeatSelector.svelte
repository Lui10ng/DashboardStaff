<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import { fly, fade } from 'svelte/transition';

	export let seatMapData: any;
	export let maxSelections: number = 1;

	// Local state
	let selectedSeats = writable<string[]>([]);
	let showLegend = false;
	let zoom = writable(1);
	let isDragging = false;
	let startPanX = 0;
	let startPanY = 0;
	let panX = 0;
	let panY = 0;
	let lastPanX = 0;
	let lastPanY = 0;

	const dispatch = createEventDispatcher<{
		seatSelected: { seats: string[] };
	}>();

	$: seatRows = transformSeatsToRows(seatMapData?.seats || {}, seatMapData?.config?.seatConfig);

	function transformSeatsToRows(seats: any, config: any) {
		if (!seats || !config) return [];

		const { rowStartChar, seatsPerRow, rows } = config;
		const seatRows = [];

		for (let i = 0; i < rows; i++) {
			const rowLabel = String.fromCharCode(rowStartChar.charCodeAt(0) + i);
			const rowSeats = [];

			for (let j = 1; j <= seatsPerRow; j++) {
				const seatId = `${rowLabel}${j}`;
				const seat = seats[seatId] || { status: 'unavailable', displayName: seatId };
				rowSeats.push({
					id: seatId,
					label: seat.displayName,
					status: seat.status
				});
			}

			seatRows.push({
				label: rowLabel,
				seats: rowSeats
			});
		}

		return seatRows;
	}

	function toggleSeat(seatId: string, status: string) {
		if (status !== 'available') return;

		selectedSeats.update((seats) => {
			const seatIndex = seats.indexOf(seatId);

			if (seatIndex >= 0) {
				return seats.filter((s) => s !== seatId);
			} else {
				if (seats.length < maxSelections) {
					return [...seats, seatId];
				}
				return [...seats.slice(1), seatId];
			}
		});

		selectedSeats.subscribe((seats) => {
			dispatch('seatSelected', { seats });
		})();
	}

	function getSeatColor(status: string, seatId: string): string {
		if ($selectedSeats.includes(seatId)) return 'bg-green-500 text-white';

		switch (status) {
			case 'available':
				return 'bg-gray-600 border-gray-300 hover:bg-gray-700 cursor-pointer';
			case 'unavailable':
				return 'bg-gray-200 text-gray-400 cursor-not-allowed';
			case 'sold':
				return 'bg-red-500 text-white cursor-not-allowed';
			default:
				return 'bg-gray-100 text-gray-600';
		}
	}

	function handleMouseDown(event: MouseEvent) {
		isDragging = true;
		startPanX = event.clientX;
		startPanY = event.clientY;
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isDragging) return;

		const deltaX = event.clientX - startPanX;
		const deltaY = event.clientY - startPanY;

		panX = lastPanX + deltaX / $zoom;
		panY = lastPanY + deltaY / $zoom;
	}

	function handleMouseUp() {
		isDragging = false;
		lastPanX = panX;
		lastPanY = panY;
	}

	function zoomIn() {
		zoom.update((z) => Math.min(z * 1.2, 3));
	}

	function zoomOut() {
		zoom.update((z) => Math.max(z / 1.2, 0.5));
	}

	function resetZoom() {
		zoom.set(1);
		panX = 0;
		panY = 0;
		lastPanX = 0;
		lastPanY = 0;
	}

	onMount(() => {
		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	});

	$: if (isDragging) {
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	} else {
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	}

	$: if ($selectedSeats && typeof dispatch === 'function') {
		dispatch('seatSelected', { seats: $selectedSeats });
	}
</script>

<div class="seat-selector w-full">
	{#if !seatMapData}
		<div class="rounded-md bg-yellow-50 p-4 text-yellow-800">
			<h3 class="text-base font-medium">Seat map not available</h3>
			<p class="mt-1 text-sm">There is no seat map configured for this ticket.</p>
		</div>
	{:else}
		<div class="mb-4 flex flex-wrap items-center justify-between gap-2">
			<h3 class="text-white text-lg font-semibold text-gray-800">Select Your Seats</h3>

			<!-- Controls -->
			<div class="flex items-center space-x-2">
				<button
					type="button"
					on:click={() => (showLegend = !showLegend)}
					class="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
				>
					<span class="mr-1">Legend</span>
					<i class="fas fa-info-circle"></i>
				</button>

				<button
					type="button"
					on:click={zoomOut}
					class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-gray-500 text-gray-700 hover:bg-gray-50"
					aria-label="Zoom out"
				>
					<span class="text-white">−</span>
				</button>

				<button
					type="button"
					on:click={zoomIn}
					class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-gray-500 text-gray-700 hover:bg-gray-50"
					aria-label="Zoom in"
				>
					<span class="text-white">+</span>
				</button>
			</div>
		</div>

		{#if showLegend}
			<div
				class="mb-4 flex justify-between rounded-md border border-gray-200 bg-gray-700 p-3 md:grid-cols-4"
				transition:fade={{ duration: 150 }}
			>
				<div class="flex items-center">
					<div class="mr-2 h-4 w-4 rounded border border-gray-300 bg-gray-600"></div>
					<span class="text-sm">Available</span>
				</div>
				<div class="flex items-center">
					<div class="mr-2 h-4 w-4 rounded border-gray-300 bg-gray-300"></div>
					<span class="text-sm">Disabled</span>
				</div>
				<div class="flex items-center">
					<div class="mr-2 h-4 w-4 rounded bg-red-500"></div>
					<span class="text-sm">Sold</span>
				</div>
				<div class="flex items-center">
					<div class="mr-2 h-4 w-4 rounded bg-green-500"></div>
					<span class="text-sm">Selected</span>
				</div>
			</div>
		{/if}

		<!-- Seating area -->
		<div
			class="relative mb-4 overflow-hidden rounded-md border border-gray-200 bg-gray-200"
			style="height: 400px;"
			on:mousedown={handleMouseDown}
		>
			<!-- Seating area -->
			<div
				class="absolute inset-0 p-10 transition-transform duration-100 ease-out"
				style="transform: scale({$zoom}) translate({panX}px, {panY}px);"
			>
				<div class="flex flex-col items-center space-y-2">
					{#each seatRows as row}
						<div class="flex items-center">
							<div class="mr-3 w-8 text-right text-sm font-medium text-gray-700">
								{row.label}
							</div>
							<div class="flex space-x-1">
								{#each row.seats as seat}
									<button
										type="button"
										class={`flex h-8 w-8 items-center justify-center rounded-md border text-sm font-medium select-none ${getSeatColor(seat.status, seat.id)}`}
										disabled={seat.status !== 'available'}
										on:click={() => toggleSeat(seat.id, seat.status)}
										title={`${seat.label} - ${seat.status}`}
									>
										{seat.label.split('')[1]}
									</button>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Selected seats summary -->
		<div class="rounded-md border border-gray-200 bg-gray-50 p-3">
			<h4 class="text-sm font-medium text-gray-700">
				Selected Seats ({$selectedSeats.length}/{maxSelections})
			</h4>
			{#if $selectedSeats.length > 0}
				<div class="mt-2 flex flex-wrap gap-2">
					{#each $selectedSeats as seatId}
						<div class="flex items-center rounded-md bg-green-100 px-2 py-1 text-sm text-green-800">
							<span>{seatId}</span>
							<button
								type="button"
								class="ml-1 text-green-600 hover:text-green-800"
								on:click={() => toggleSeat(seatId, 'available')}
								aria-label={`Remove seat ${seatId}`}
							>
								<i class="fas fa-times"></i>
							</button>
						</div>
					{/each}
				</div>
			{:else}
				<p class="mt-1 text-sm text-gray-500">
					No seats selected yet. Click on available seats to select them.
				</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.seat-selector {
		user-select: none;
	}
</style>
