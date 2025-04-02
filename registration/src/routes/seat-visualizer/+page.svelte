<script lang="ts">
	import panzoom from 'panzoom';
	import { onMount } from 'svelte';
	import '../../lib/styles/seatVisualizer/seat-visualizer.css';

	let seatContainer: HTMLElement;
	let selectedSeats: string[] = [];
	let ticketQuantity = 2;
	let showWarning = false;
	let seats: Seat[] = [];
	let isLoading = false;

	type Seat = {
		seatName: string;
		paid: boolean;
	};

	async function fetchSeats() {
		isLoading = true;
		try {
			const response = await fetch('http://localhost:3000/api/seats');
			const data = await response.json();
			
			const seatsObj = data.docs[0]?.seats || {};
			
			seats = Object.entries(seatsObj).map(([seatName, details]) => ({
				seatName,
				paid: (details as { paid?: boolean }).paid || false,
				...(typeof details === 'object' ? details : {})
			}));

			groupedSeats = seats.reduce(
				(acc, seat) => {
					let rowKey = getRowPrefix(seat.seatName);
					if (!acc[rowKey]) acc[rowKey] = [];
					acc[rowKey].push(seat);
					return acc;
				},
				{} as Record<string, Seat[]>
			);

			columnNumbers = getColumnNumbers(seats);
		} catch (error) {
			console.error('Failed to fetch seats:', error);
		} finally {
			isLoading = false;
		}
	}

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

	let groupedSeats: Record<string, Seat[]> = {};
	let columnNumbers: number[] = [];

	async function refreshSeatData() {
		try {
			await fetchSeats();
			console.log('Seat data refreshed successfully');
		} catch (error) {
			console.error('Failed to refresh seat data:', error);
		}
	}

	onMount(() => {
		(async () => {
			await fetchSeats();
		})();

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
</script>

<div class="min-h-screen bg-gray-50 p-4">
	<div class="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-md">
		<div
			class="venue-container mb-10 rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
		>
			<div class="venue-image relative flex aspect-video items-center justify-center bg-gray-200">
				<p class="text-center">
					<span class="text-lg font-medium text-gray-700">VENUE FLOOR PLAN IMAGE</span>
					<br />
					<span class="text-sm text-gray-500">Refer to the venue image to know your seat</span>
				</p>
			</div>
		</div>

		<h1 class="mb-10 text-center text-3xl font-bold tracking-tight text-gray-800">Select Seats</h1>

		<div class="quantity-selector mb-6 flex items-center gap-4 rounded-lg bg-gray-50 p-4">
			<label for="ticket-quantity" class="font-medium text-gray-800">Number of Tickets:</label>
			<div class="flex items-center">
				<button
					on:click={decrementQuantity}
					class="rounded-l bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800"
				>
					-
				</button>
				<span class="px-4 text-lg text-gray-800">{ticketQuantity}</span>
				<button
					on:click={incrementQuantity}
					class="rounded-r bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800"
				>
					+
				</button>
			</div>
		</div>

		{#if showWarning}
			<div
				class="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-center font-medium text-amber-800"
			>
				Please select exactly {ticketQuantity} seat{ticketQuantity > 1 ? 's' : ''}. Currently
				selected: {selectedSeats.length}
			</div>
		{/if}

		<button
			class="mb-6 flex w-full transform items-center justify-center gap-2 rounded-xl bg-blue-500
                       px-8 py-4 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-600"
			on:click={refreshSeatData}
		>
			Refresh Seat Availability
		</button>

		<div class="my-15 text-center">
			<span class="text-2xl font-bold text-gray-800">STAGE</span>
		</div>

		{#if isLoading}
			<div class="flex justify-center p-4">
				<div class="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
			</div>
		{/if}

		<div class="seat-layout">
			<div bind:this={seatContainer} class="grid">
				<div class="flex justify-center gap-2 text-sm font-semibold">
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
									<span class="text-gray-600">
										{seat.seatName}
									</span>
								</button>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="mt-8 flex flex-wrap justify-center gap-8 rounded-xl p-6">
			<div class="flex items-center gap-3 font-medium text-gray-800">
				<div class="h-4 w-4 rounded-full bg-[#28A745] shadow-sm"></div>
				<span>Available</span>
			</div>
			<div class="flex items-center gap-3 font-medium text-gray-800">
				<div class="h-4 w-4 rounded-full bg-[#9ca3af] shadow-sm"></div>
				<span>Unavailable</span>
			</div>
			<div class="flex items-center gap-3 font-medium text-gray-800">
				<div class="h-4 w-4 rounded-full bg-[#FFB92A] shadow-sm"></div>
				<span>Selected</span>
			</div>
		</div>

		<div
			class="mb-6 flex items-center justify-center rounded-xl border-1 bg-white p-6"
			style="border-color: {selectedSeats.length === ticketQuantity
				? '#28A745'
				: selectedSeats.length > 0
					? '#FFB92A'
					: '#ED1C26'}"
		>
			<h3 class=" text-lg font-semibold text-gray-800">
				Please select exactly {ticketQuantity} tickets. Currently selected: {selectedSeats.length}
			</h3>
		</div>
		{#if selectedSeats.length > 0}
			<ul class="flex flex-wrap justify-center gap-2">
				{#each selectedSeats as seatName}
					<li
						class="rounded-lg bg-gray-100 px-4 py-3 font-medium text-gray-800 transition-colors hover:bg-gray-200"
					>
						{seatName}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
