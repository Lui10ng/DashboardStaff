<script lang="ts">
	import panzoom from 'panzoom';
	import { onMount } from 'svelte';

	type SeatConfig = {
		rows: number;
		seatsPerRow: number;
		rowStartChar: string;
		seatStartNum: number;
		rowOrder: 'up' | 'down';
		seatOrder: 'left' | 'right';
		rowLabel: 'Left Side' | 'Right Side' | 'No Label' | 'Show All';
	};

	type SeatData = {
		customName: string | null;
	};

	type Section = {
		seatConfig: SeatConfig;
		seats: SeatStatus[][];
		seatData: SeatData[][];
	};

	type LabelPosition = 'top' | 'bottom' | 'left' | 'right';
	type SeatStatus = 'available' | 'unavailable' | 'sold';

	type CustomSeatNames = {
		[key: string]: string;
	};

	type SelectedSeat = { rowIndex: number; seatIndex: number };

	let seatContainer: HTMLElement;
	let ticketQuantity = 1000;
	let showWarning = false;
	let frontLabel = 'STAGE';
	let labelPosition: LabelPosition = 'top';
	let section: Section = {
		seatConfig: {
			rows: 0,
			seatsPerRow: 0,
			rowStartChar: 'A',
			seatStartNum: 1,
			rowOrder: 'down',
			seatOrder: 'left',
			rowLabel: 'Show All'
		},
		seats: [],
		seatData: []
	};

	let selectedSeat: { rowIndex: number; seatIndex: number } | null = null;
	let originalSeatName = '';
	let seatName = '';

	let multipleSeatSelection = false;
	let selectedSeats: { rowIndex: number; seatIndex: number }[] = [];

	let customSeatNames: CustomSeatNames = {};

	let panzoomInstance: any;
	let currentZoom = 1;

	let venueImage: string | null = null;
	let isDraggingOver = false;

	type TabType = 'ticket' | 'reserve-seating';
	let activeTab: TabType = 'ticket';

	let reserveSeatingEnabled = true;
	let reserveSeatingStart = '';
	let reserveSeatingEnd = '';
	let reserveSeatingInstructions = '';

	let ticketName = '';
	let ticketPrice = '';
	let validFrom = '';
	let validTo = '';
	let activePayment = false;
	let labelColor = '#0FBA81';

	const handleTabChange = (tab: TabType) => {
		activeTab = tab;
	};

	const handleReserveSeatingToggle = () => {
		reserveSeatingEnabled = !reserveSeatingEnabled;
	};

	const handleToggleChange = () => {
		multipleSeatSelection = !multipleSeatSelection;

		if (multipleSeatSelection) {
			selectedSeat = null;
		} else {
			selectedSeats = [];
		}
	};

	const handleStatusChange = (status: SeatStatus) => {
		if (!multipleSeatSelection && selectedSeat) {
			section.seats[selectedSeat.rowIndex][selectedSeat.seatIndex] = status;
			selectedSeat = null;
		} else if (multipleSeatSelection && selectedSeats.length > 0) {
			selectedSeats.forEach((seat) => {
				section.seats[seat.rowIndex][seat.seatIndex] = status;
			});
			selectedSeats = [];
		}
	};

	const handleRenameSave = () => {
		if (!selectedSeat) return;

		section.seatData[selectedSeat.rowIndex][selectedSeat.seatIndex].customName = seatName;

		section.seats = [...section.seats];

		selectedSeat = null;
	};

	const handleRenameCancel = () => {
		selectedSeat = null;
	};

	const isSeatSelected = (rowIndex: number, seatIndex: number) => {
		return selectedSeats.some((seat) => seat.rowIndex === rowIndex && seat.seatIndex === seatIndex);
	};

	const generateRowLabel = (startChar: string, rowIndex: number) => {
		const alphabetLength = 26;
		const startCharCode = startChar.toUpperCase().charCodeAt(0);
		const totalOffset = rowIndex;

		const cycleNumber = Math.floor(totalOffset / alphabetLength);

		const letterOffset = totalOffset % alphabetLength;
		const letterCode = ((startCharCode - 65 + letterOffset) % alphabetLength) + 65;
		const letter = String.fromCharCode(letterCode);

		return cycleNumber === 0 ? letter : `${letter}${cycleNumber}`;
	};

	const generateSeatLabel = (seatConfig: SeatConfig, rowIndex: number, seatIndex: number) => {
		const rowLabel = generateRowLabel(
			seatConfig.rowStartChar,
			seatConfig.rowOrder === 'down' ? rowIndex : seatConfig.rows - 1 - rowIndex
		);

		const seatNum =
			seatConfig.seatOrder === 'left'
				? seatConfig.seatStartNum + seatIndex
				: seatConfig.seatStartNum + (seatConfig.seatsPerRow - 1 - seatIndex);

		const formattedSeatNum = seatNum < 10 ? `0${seatNum}` : `${seatNum}`;

		const standardLabel = `${rowLabel}${formattedSeatNum}`;

		if (
			section.seatData[rowIndex] &&
			section.seatData[rowIndex][seatIndex] &&
			section.seatData[rowIndex][seatIndex].customName
		) {
			return section.seatData[rowIndex][seatIndex].customName;
		}

		return customSeatNames[standardLabel] || standardLabel;
	};

	const generateStandardSeatLabel = (
		seatConfig: SeatConfig,
		rowIndex: number,
		seatIndex: number
	) => {
		const rowLabel = generateRowLabel(
			seatConfig.rowStartChar,
			seatConfig.rowOrder === 'down' ? rowIndex : seatConfig.rows - 1 - rowIndex
		);

		const seatNum =
			seatConfig.seatOrder === 'left'
				? seatConfig.seatStartNum + seatIndex
				: seatConfig.seatStartNum + (seatConfig.seatsPerRow - 1 - seatIndex);

		const formattedSeatNum = seatNum < 10 ? `0${seatNum}` : `${seatNum}`;

		return `${rowLabel}${formattedSeatNum}`;
	};

	const handleSeatClick = (rowIndex: number, seatIndex: number) => {
		if (multipleSeatSelection) {
			const index = selectedSeats.findIndex(
				(seat) => seat.rowIndex === rowIndex && seat.seatIndex === seatIndex
			);

			if (index !== -1) {
				selectedSeats = [...selectedSeats.slice(0, index), ...selectedSeats.slice(index + 1)];
			} else {
				selectedSeats = [...selectedSeats, { rowIndex, seatIndex }];
			}
		} else {
			if (
				selectedSeat &&
				selectedSeat.rowIndex === rowIndex &&
				selectedSeat.seatIndex === seatIndex
			) {
				selectedSeat = null;
				return;
			}

			selectedSeat = { rowIndex, seatIndex };

			originalSeatName = generateSeatLabel(section.seatConfig, rowIndex, seatIndex);

			seatName = originalSeatName;
		}
	};

	const checkQuantityExceeded = () => {
		const totalSeats = section.seatConfig.rows * section.seatConfig.seatsPerRow;
		showWarning = totalSeats > ticketQuantity;
		return showWarning;
	};

	const handleQuantityChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		const newValue = Math.max(1, parseInt(input.value) || 1);
		ticketQuantity = newValue;
		checkQuantityExceeded();
	};

	const handleDimensionChange = (dimension: 'rows' | 'seatsPerRow', event: Event) => {
		const input = event.target as HTMLInputElement;
		const newValue = Math.max(1, parseInt(input.value) || 1);

		if (dimension === 'rows') {
			section.seatConfig.rows = newValue;
		} else {
			section.seatConfig.seatsPerRow = newValue;
		}

		checkQuantityExceeded();
		regenerateSeats();
	};

	const regenerateSeats = () => {
		section.seats = Array(section.seatConfig.rows)
			.fill(null)
			.map(() => Array(section.seatConfig.seatsPerRow).fill('available'));

		section.seatData = Array(section.seatConfig.rows)
			.fill(null)
			.map(() =>
				Array(section.seatConfig.seatsPerRow)
					.fill(null)
					.map(() => ({ customName: null }))
			);

		checkQuantityExceeded();

		if (activeTab === 'reserve-seating' && reserveSeatingEnabled) {
			if (panzoomInstance) {
				panzoomInstance.dispose();
				panzoomInstance = null;
			}

			setTimeout(() => {
				initializePanzoom();
			}, 100);
		}
	};

	const handleSaveLayout = () => {
		const layoutData = {
			config: {
				frontLabel,
				labelPosition,
				ticketQuantity,
				seatConfig: { ...section.seatConfig }
			},
			venueImage,
			customSeatNames,
			ticket: {
				name: ticketName,
				price: ticketPrice,
				validFrom,
				validTo,
				quantity: ticketQuantity,
				activePayment,
				labelColor
			},
			reserveSeating: {
				enabled: reserveSeatingEnabled,
				startTime: reserveSeatingStart,
				endTime: reserveSeatingEnd,
				instructions: reserveSeatingInstructions
			},
			seats: {} as Record<string, { displayName: string; status: SeatStatus }>,
			summary: {
				totalSeats: section.seatConfig.rows * section.seatConfig.seatsPerRow,
				availableSeats: section.seats.flat().filter((status) => status === 'available').length,
				unavailableSeats: section.seats.flat().filter((status) => status === 'unavailable').length,
				soldSeats: section.seats.flat().filter((status) => status === 'sold').length
			}
		};

		section.seats.forEach((row, rowIndex) => {
			row.forEach((seatStatus, seatIndex) => {
				const standardLabel = generateStandardSeatLabel(section.seatConfig, rowIndex, seatIndex);

				let displayName = standardLabel;
				if (
					section.seatData[rowIndex] &&
					section.seatData[rowIndex][seatIndex] &&
					section.seatData[rowIndex][seatIndex].customName
				) {
					displayName = section.seatData[rowIndex][seatIndex].customName || standardLabel;
				} else if (customSeatNames[standardLabel]) {
					displayName = customSeatNames[standardLabel];
				}

				layoutData.seats[standardLabel] = {
					displayName,
					status: seatStatus
				};
			});
		});

		console.log('Saving layout:', layoutData);

		const jsonString = JSON.stringify(layoutData, null, 2);

		const blob = new Blob([jsonString], { type: 'application/json' });

		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = `seat-layout-${new Date().toISOString().split('T')[0]}.json`;

		document.body.appendChild(a);
		a.click();

		setTimeout(() => {
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}, 0);
	};

	onMount(() => {
		section.seatConfig.rows = 5;
		section.seatConfig.seatsPerRow = 10;
		regenerateSeats();

		// Initialize panzoom after DOM is ready
		if (activeTab === 'reserve-seating' && reserveSeatingEnabled) {
			setTimeout(() => {
				initializePanzoom();
			}, 100);
		}

		return () => {
			if (panzoomInstance) {
				panzoomInstance.dispose();
			}
		};
	});

	const initializePanzoom = () => {
		if (!seatContainer) return;

		// Dispose existing instance if any
		if (panzoomInstance) {
			panzoomInstance.dispose();
		}

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
		});
	};

	// Watch for tab changes
	$: if (activeTab === 'reserve-seating' && reserveSeatingEnabled) {
		setTimeout(() => {
			initializePanzoom();
		}, 100);
	}

	// Watch for seat configuration changes
	$: if (activeTab === 'reserve-seating' && reserveSeatingEnabled && section.seats.length > 0) {
		setTimeout(() => {
			initializePanzoom();
		}, 100);
	}

	// Cleanup when switching to ticket tab
	$: if (activeTab === 'ticket' && panzoomInstance) {
		panzoomInstance.dispose();
		panzoomInstance = null;
	}

	const handleZoomIn = () => {
		if (panzoomInstance) {
			panzoomInstance.zoomIn();
		}
	};

	const handleZoomOut = () => {
		if (panzoomInstance) {
			panzoomInstance.zoomOut();
		}
	};

	const handleFitToScreen = () => {
		if (!panzoomInstance || !seatContainer) return;

		const containerRect = seatContainer.parentElement?.getBoundingClientRect();
		const contentRect = seatContainer.getBoundingClientRect();

		if (containerRect) {
			const scaleX = containerRect.width / contentRect.width;
			const scaleY = containerRect.height / contentRect.height;
			const scale = Math.min(scaleX, scaleY, 1) * 0.9;

			panzoomInstance.zoomAbs(0, 0, scale);
			panzoomInstance.moveTo(0, 0);
		}
	};

	const handleImageUpload = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const reader = new FileReader();
			reader.onload = (e) => {
				venueImage = e.target?.result as string;
			};
			reader.readAsDataURL(input.files[0]);
		}
	};

	const handleRemoveImage = () => {
		venueImage = null;
		const fileInput = document.getElementById('venue-image-upload') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
	};

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		isDraggingOver = true;
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'copy';
		}
	};

	const handleDragLeave = () => {
		isDraggingOver = false;
	};

	const handleDrop = (event: DragEvent) => {
		event.preventDefault();
		isDraggingOver = false;
		if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
			const file = event.dataTransfer.files[0];
			if (file.type.startsWith('image/')) {
				const reader = new FileReader();
				reader.onload = (e) => {
					venueImage = e.target?.result as string;
				};
				reader.readAsDataURL(file);
			}
		}
	};

	const handleColorSelect = (color: string) => {
		labelColor = color;
	};

	const handleActivePaymentToggle = () => {
		activePayment = !activePayment;
	};

	const handleSaveTickets = () => {
		const ticketData = {
			name: ticketName,
			price: ticketPrice,
			validFrom,
			validTo,
			quantity: ticketQuantity,
			activePayment,
			labelColor
		};

		console.log('Saving ticket:', ticketData);
		alert('Ticket saved successfully!');
	};
</script>

<div class="mx-auto mt-20 max-w-7xl p-6">
	<h1 class="mb-6 text-2xl font-bold">Event Title</h1>

	<!-- Tab Navigation -->
	<div class="mb-8 border-b border-gray-200">
		<div class="flex space-x-4">
			<button
				class="border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none"
				class:border-[#DF4D60]={activeTab === 'ticket'}
				class:text-[#DF4D60]={activeTab === 'ticket'}
				class:border-transparent={activeTab !== 'ticket'}
				class:text-gray-500={activeTab !== 'ticket'}
				class:hover:text-gray-700={activeTab !== 'ticket'}
				class:hover:border-gray-300={activeTab !== 'ticket'}
				on:click={() => handleTabChange('ticket')}
				aria-label="Switch to Ticket tab"
				tabindex="0"
				on:keydown={(e) => e.key === 'Enter' && handleTabChange('ticket')}
			>
				<div class="flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-2 h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
						/>
					</svg>
					Ticket
				</div>
			</button>
			<button
				class="border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none"
				class:border-[#DF4D60]={activeTab === 'reserve-seating'}
				class:text-[#DF4D60]={activeTab === 'reserve-seating'}
				class:border-transparent={activeTab !== 'reserve-seating'}
				class:text-gray-500={activeTab !== 'reserve-seating'}
				class:hover:text-gray-700={activeTab !== 'reserve-seating'}
				class:hover:border-gray-300={activeTab !== 'reserve-seating'}
				on:click={() => handleTabChange('reserve-seating')}
				aria-label="Switch to Reserve Seating tab"
				tabindex="0"
				on:keydown={(e) => e.key === 'Enter' && handleTabChange('reserve-seating')}
			>
				<div class="flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-2 h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
						/>
					</svg>
					Reserve Seating
				</div>
			</button>
		</div>
	</div>

	<!-- Tab Content -->
	{#if activeTab === 'ticket'}
		<!-- Ticket Tab Content -->
		<div class="mx-auto flex max-w-3xl flex-col space-y-6">
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Ticket Name -->
				<div class="space-y-2">
					<label for="ticket-name" class="block font-medium">Ticket Name</label>
					<input
						type="text"
						id="ticket-name"
						bind:value={ticketName}
						class="w-full rounded bg-gray-100 p-2"
						placeholder="Enter ticket name"
					/>
				</div>

				<!-- Valid From -->
				<div class="space-y-2">
					<label for="valid-from" class="block font-medium">Valid from (DD/MM/YYYY)</label>
					<input
						type="date"
						id="valid-from"
						bind:value={validFrom}
						class="w-full rounded bg-gray-100 p-2"
						placeholder="Enter date of expiration"
					/>
				</div>

				<!-- Ticket Price -->
				<div class="space-y-2">
					<label for="ticket-price" class="block font-medium">Price</label>
					<input
						type="text"
						id="ticket-price"
						bind:value={ticketPrice}
						class="w-full rounded bg-gray-100 p-2"
						placeholder="Enter ticket price"
					/>
				</div>

				<!-- Valid To -->
				<div class="space-y-2">
					<label for="valid-to" class="block font-medium">Valid in (DD/MM/YYYY)</label>
					<input
						type="date"
						id="valid-to"
						bind:value={validTo}
						class="w-full rounded bg-gray-100 p-2"
						placeholder="Enter date of expiration"
					/>
				</div>

				<!-- Quantity -->
				<div class="space-y-2">
					<label for="ticket-quantity" class="block font-medium">Quantity</label>
					<input
						type="number"
						id="ticket-quantity"
						bind:value={ticketQuantity}
						class="w-full rounded bg-gray-100 p-2"
						min="1"
						placeholder="Enter quantity"
					/>
				</div>

				<!-- Active Payment -->
				<div class="flex items-center space-y-2">
					<div class="flex-1">
						<label class="block font-medium">Active payment</label>
					</div>
					<div class="flex items-center">
						<button
							aria-label="Toggle active payment"
							type="button"
							class="toggle-button relative h-6 w-12 rounded-full bg-gray-300 p-0.5 transition-colors"
							class:bg-green-500={activePayment}
							on:click={handleActivePaymentToggle}
							aria-pressed={activePayment}
						>
							<span
								class="block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
								class:translate-x-6={activePayment}
							></span>
						</button>
					</div>
				</div>
			</div>

			<!-- Label Color -->
			<div class="space-y-2">
				<label class="block font-medium">Label Color</label>
				<div class="flex flex-col space-y-4">
					<div class="rounded p-3 text-center text-white" style="background-color: {labelColor}">
						{labelColor}
					</div>
					<div class="flex space-x-4">
						<button
							class="h-12 w-12 rounded-full bg-blue-500 shadow-md hover:ring-2 hover:ring-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
							on:click={() => handleColorSelect('#2563EB')}
							aria-label="Select blue color"
							tabindex="0"
							on:keydown={(e) => e.key === 'Enter' && handleColorSelect('#2563EB')}
						></button>
						<button
							class="h-12 w-12 rounded-full bg-yellow-400 shadow-md hover:ring-2 hover:ring-yellow-300 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
							on:click={() => handleColorSelect('#FACC15')}
							aria-label="Select yellow color"
							tabindex="0"
							on:keydown={(e) => e.key === 'Enter' && handleColorSelect('#FACC15')}
						></button>
						<button
							class="h-12 w-12 rounded-full bg-green-500 shadow-md hover:ring-2 hover:ring-green-300 focus:ring-2 focus:ring-green-300 focus:outline-none"
							on:click={() => handleColorSelect('#0FBA81')}
							aria-label="Select green color"
							tabindex="0"
							on:keydown={(e) => e.key === 'Enter' && handleColorSelect('#0FBA81')}
						></button>
						<button
							class="bg-olive-500 hover:ring-olive-300 focus:ring-olive-300 h-12 w-12 rounded-full shadow-md hover:ring-2 focus:ring-2 focus:outline-none"
							on:click={() => handleColorSelect('#6B7A59')}
							aria-label="Select olive color"
							tabindex="0"
							on:keydown={(e) => e.key === 'Enter' && handleColorSelect('#6B7A59')}
						></button>
						<button
							class="h-12 w-12 rounded-full bg-red-400 shadow-md hover:ring-2 hover:ring-red-300 focus:ring-2 focus:ring-red-300 focus:outline-none"
							on:click={() => handleColorSelect('#E05D65')}
							aria-label="Select red color"
							tabindex="0"
							on:keydown={(e) => e.key === 'Enter' && handleColorSelect('#E05D65')}
						></button>
						<button
							class="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md hover:ring-2 hover:ring-gray-300 focus:ring-2 focus:ring-gray-300 focus:outline-none"
							aria-label="Add custom color"
							tabindex="0"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 4v16m8-8H4"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex space-x-4 pt-6">
				<button
					class="flex-1 rounded bg-[#DF4D60] py-3 text-white hover:bg-red-400 focus:ring-2 focus:ring-red-300 focus:outline-none"
					on:click={handleSaveTickets}
				>
					Save Tickets
				</button>
				<button
					class="flex-1 rounded border border-gray-300 py-3 text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:outline-none"
				>
					Cancel
				</button>
			</div>
		</div>
	{:else if activeTab === 'reserve-seating'}
		<!-- Reserve Seating Tab Content -->
		<div class="flex flex-col space-y-6">
			<!-- Reserve Seating Toggle -->
			<div class="rounded-lg border bg-white p-6">
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-xl font-bold text-gray-800">Reserve Seat</h3>
						<p class="mt-1 text-sm text-gray-600">
							Enable or disable the reserve seating feature for this event
						</p>
					</div>
					<div class="flex items-center">
						<button
							aria-label="Toggle reserve seating"
							type="button"
							class="toggle-button relative h-6 w-12 rounded-full bg-gray-300 p-0.5 transition-colors"
							class:bg-green-500={reserveSeatingEnabled}
							on:click={handleReserveSeatingToggle}
							aria-pressed={reserveSeatingEnabled}
						>
							<span
								class="block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
								class:translate-x-6={reserveSeatingEnabled}
							></span>
						</button>
						<span class="ml-2 font-medium">
							{reserveSeatingEnabled ? 'Enabled' : 'Disabled'}
						</span>
					</div>
				</div>
			</div>

			<!-- Reserve Seating Configuration (only shown when enabled) -->
			{#if reserveSeatingEnabled}
				<div class="flex gap-8">
					<!-- Left Column -->
					<div class="w-[400px] flex-shrink-0 space-y-6">
						<div class="space-y-2">
							<label for="ticket-quantity" class="block font-medium">Ticket Quantity</label>

							<input
								type="number"
								bind:value={ticketQuantity}
								on:change={handleQuantityChange}
								class="w-full rounded bg-gray-100 p-2"
								min="1"
								required
							/>
						</div>

						<div class="space-y-3 rounded-lg bg-white p-4">
							<div class="col-span-2 space-y-2">
								<label for="front-label" class="block font-medium">Front Label</label>

								<div class="flex gap-4">
									<input
										type="text"
										bind:value={frontLabel}
										class="flex-1 rounded bg-gray-100 p-2"
										placeholder="STAGE"
									/>

									<select bind:value={labelPosition} class="flex-1 rounded border p-2">
										<option value="top">Top</option>
										<option value="bottom">Bottom</option>
										<option value="left">Left Side</option>
										<option value="right">Right Side</option>
									</select>
								</div>
							</div>
							<div class="grid grid-cols-2 gap-4">
								<div>
									<label for="number-of-rows" class="block font-medium">Number of rows</label>

									<input
										type="number"
										bind:value={section.seatConfig.rows}
										on:change={(e) => handleDimensionChange('rows', e)}
										class="w-full rounded border p-2"
										min="1"
										required
									/>
								</div>

								<div>
									<label for="seats-per-row" class="block font-medium">Seats per row</label>

									<input
										type="number"
										bind:value={section.seatConfig.seatsPerRow}
										on:change={(e) => handleDimensionChange('seatsPerRow', e)}
										class="w-full rounded border p-2"
										min="1"
										required
									/>
								</div>
							</div>

							<div class="mt-4 grid grid-cols-2 gap-4">
								<div>
									<label for="rows-starts-with" class="block font-medium">Rows starts with</label>

									<input
										type="text"
										bind:value={section.seatConfig.rowStartChar}
										class="w-full rounded border p-2"
										maxlength="1"
										on:input={(e) => {
											const value = e.currentTarget.value;
											const validValue = value.replace(/[^A-Za-z]/g, '').toUpperCase();
											if (validValue !== value) {
												e.currentTarget.value = validValue;
												section.seatConfig.rowStartChar = validValue;
											}
										}}
									/>
								</div>

								<div>
									<label for="row-level-orders" class="block font-medium">Row level order</label>

									<div class="flex rounded border">
										<button
											class="flex-1 p-2 text-center"
											class:bg-[#DF4D60]={section.seatConfig.rowOrder === 'down'}
											class:text-white={section.seatConfig.rowOrder === 'down'}
											on:click={() => (section.seatConfig.rowOrder = 'down')}
										>
											Down
										</button>

										<button
											class="flex-1 p-2 text-center"
											class:bg-[#DF4D60]={section.seatConfig.rowOrder === 'up'}
											class:text-white={section.seatConfig.rowOrder === 'up'}
											on:click={() => (section.seatConfig.rowOrder = 'up')}
										>
											Up
										</button>
									</div>
								</div>
							</div>

							<div class="mt-4 grid grid-cols-2 gap-4">
								<div>
									<label for="seats-starts-with" class="block font-medium">Seats starts with</label>

									<input
										type="number"
										bind:value={section.seatConfig.seatStartNum}
										class="w-full rounded border p-2"
										min="1"
										on:input={(e) => {
											const value = e.currentTarget.value;
											if (parseInt(value) < 1) {
												e.currentTarget.value = '1';
												section.seatConfig.seatStartNum = 1;
											}
										}}
									/>
								</div>

								<div>
									<label for="seat-level-order" class="block font-medium">Seat level order</label>

									<div class="flex rounded border">
										<button
											class="flex-1 p-2 text-center"
											class:bg-[#DF4D60]={section.seatConfig.seatOrder === 'left'}
											class:text-white={section.seatConfig.seatOrder === 'left'}
											on:click={() => (section.seatConfig.seatOrder = 'left')}
										>
											Left
										</button>

										<button
											class="flex-1 p-2 text-center"
											class:bg-[#DF4D60]={section.seatConfig.seatOrder === 'right'}
											class:text-white={section.seatConfig.seatOrder === 'right'}
											on:click={() => (section.seatConfig.seatOrder = 'right')}
										>
											Right
										</button>
									</div>
								</div>
							</div>
							<div class="mt-4">
								<label for="row-label" class="block font-medium">Row label</label>

								<select bind:value={section.seatConfig.rowLabel} class="w-full rounded border p-2">
									<option value="Show All">Show All</option>
									<option value="Left Side">Left Side</option>
									<option value="Right Side">Right Side</option>
									<option value="No Label">No Label</option>
								</select>
							</div>
						</div>

						<!-- Rename Seat UI - Only show when a seat is selected in single selection mode -->
						{#if selectedSeat && !multipleSeatSelection}
							<div class="space-y-4 rounded-lg bg-white p-4">
								<h2 class="text-lg font-semibold">Rename Seat: {originalSeatName}</h2>
								<div class="space-y-2">
									<label for="seat-name" class="block font-medium">New Seat Name</label>
									<input
										type="text"
										bind:value={seatName}
										class="w-full rounded border p-2"
										placeholder="Enter new seat name (e.g., GD3)"
									/>
									<p class="text-xs text-gray-500">
										Original seat: {originalSeatName} → New: {seatName}
									</p>
								</div>
								<div class="flex justify-end gap-2">
									<button
										class="rounded bg-[#DF4D60] px-4 py-2 text-white hover:bg-red-400"
										on:click={handleRenameSave}
									>
										Save
									</button>
									<button
										class="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
										on:click={handleRenameCancel}
									>
										Cancel
									</button>
								</div>
							</div>
						{/if}

						<button
							class="w-full rounded bg-[#DF4D60] py-2 text-white hover:bg-red-400"
							on:click={handleSaveLayout}
						>
							Save Changes
						</button>
					</div>

					<!-- Venue Floor Plan Image Upload -->
					<div class="min-w-0 flex-1 space-y-6">
						<!-- Image Upload Component -->
						<div class="rounded-lg border bg-white p-6">
							<h3 class="mb-4 text-lg font-semibold">Venue Floor Plan</h3>

							{#if venueImage}
								<div class="relative mb-4">
									<img
										src={venueImage}
										alt="Venue floor plan"
										class="max-h-[300px] w-full rounded object-contain"
									/>
									<button
										class="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
										on:click={handleRemoveImage}
										aria-label="Remove image"
										tabindex="0"
										on:keydown={(e) => e.key === 'Enter' && handleRemoveImage()}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
												clip-rule="evenodd"
											/>
										</svg>
									</button>
								</div>
							{:else}
								<div
									class="mb-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6"
									class:border-gray-300={!isDraggingOver}
									class:border-[#DF4D60]={isDraggingOver}
									class:bg-gray-50={!isDraggingOver}
									class:bg-red-50={isDraggingOver}
									on:dragover={handleDragOver}
									on:dragleave={handleDragLeave}
									on:drop={handleDrop}
								>
									<div class="mb-3 text-center">
										<svg
											class="mx-auto h-12 w-12 text-gray-400"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
										<p class="mt-1 text-sm text-gray-600">
											Upload an image of your venue floor plan
										</p>
										<p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
									</div>
									<label
										for="venue-image-upload"
										class="cursor-pointer rounded-md bg-[#DF4D60] px-4 py-2 text-sm font-medium text-white hover:bg-red-400"
										tabindex="0"
										on:keydown={(e) =>
											e.key === 'Enter' && document.getElementById('venue-image-upload')?.click()}
									>
										Upload a file
									</label>
									<input
										id="venue-image-upload"
										type="file"
										accept="image/*"
										class="hidden"
										on:change={handleImageUpload}
									/>
									<p class="mt-2 text-xs text-gray-500">or drag and drop</p>
								</div>
							{/if}
							<p class="text-sm text-gray-600">Upload your venue floor plan image.</p>
						</div>

						{#if showWarning}
							<div class="rounded-md bg-yellow-50 p-4">
								<div class="flex">
									<div class="flex-shrink-0">
										<svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
											<path
												fill-rule="evenodd"
												d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
												clip-rule="evenodd"
											/>
										</svg>
									</div>

									<div class="ml-3">
										<h3 class="text-sm font-medium text-yellow-800">
											Configuration exceeds ticket quantity
										</h3>

										<div class="mt-2 text-sm text-yellow-700">
											<p>
												Current configuration creates {section.seatConfig.rows *
													section.seatConfig.seatsPerRow} seats, but ticket quantity is {ticketQuantity}.
												This may cause issues with ticket allocation.
											</p>
										</div>
									</div>
								</div>
							</div>
						{/if}

						<div class="relative h-[600px] overflow-hidden rounded">
							<div class="absolute inset-0 overflow-auto bg-gray-100 p-8">
								{#if labelPosition === 'top'}
									<div
										class="sticky top-0 z-10 mb-4 border-b bg-rose-400 p-4 text-center text-white"
									>
										{frontLabel}
									</div>
								{/if}

								<div class="mb-6 text-center text-sm text-gray-500">
									(Rows: {section.seatConfig.rows} x Seats per Row: {section.seatConfig
										.seatsPerRow}, Maximum allowed Seats: {ticketQuantity})
								</div>

								<div class="flex h-full">
									{#if labelPosition === 'left'}
										<div
											class="writing-vertical sticky left-0 z-10 flex w-24 items-center justify-center border-r bg-rose-400 p-4 text-white"
										>
											{frontLabel}
										</div>
									{/if}

									<div class="relative flex-1 rounded-lg border-2 border-gray-300 bg-white p-8">
										<div bind:this={seatContainer} class="max-w-full">
											<table class="border-separate border-spacing-2">
												<tbody>
													{#each section.seats as row, rowIndex}
														<tr class="h-10">
															{#if section.seatConfig.rowLabel === 'Left Side' || section.seatConfig.rowLabel === 'Show All'}
																<td
																	class="sticky left-0 z-10 w-10 bg-white pr-2 text-right font-medium"
																>
																	{generateRowLabel(
																		section.seatConfig.rowStartChar,
																		section.seatConfig.rowOrder === 'down'
																			? rowIndex
																			: section.seatConfig.rows - 1 - rowIndex
																	)}
																</td>
															{/if}

															<td class="px-2">
																<div class="flex gap-2">
																	{#each row as seatStatus, seatIndex}
																		<button
																			class="flex h-10 w-10 items-center justify-center rounded-md border text-xs transition-colors hover:bg-gray-100"
																			class:bg-green-500={seatStatus === 'available'}
																			class:bg-gray-300={seatStatus === 'unavailable'}
																			class:bg-red-500={seatStatus === 'sold'}
																			class:text-white={true}
																			class:ring-2={multipleSeatSelection
																				? isSeatSelected(rowIndex, seatIndex)
																				: selectedSeat &&
																					selectedSeat.rowIndex === rowIndex &&
																					selectedSeat.seatIndex === seatIndex}
																			class:ring-red-500={true}
																			on:click={() => handleSeatClick(rowIndex, seatIndex)}
																		>
																			{generateSeatLabel(section.seatConfig, rowIndex, seatIndex)}
																		</button>
																	{/each}
																</div>
															</td>

															{#if section.seatConfig.rowLabel === 'Right Side' || section.seatConfig.rowLabel === 'Show All'}
																<td
																	class="sticky right-0 z-10 w-10 bg-white pl-2 text-left font-medium"
																>
																	{generateRowLabel(
																		section.seatConfig.rowStartChar,
																		section.seatConfig.rowOrder === 'down'
																			? rowIndex
																			: section.seatConfig.rows - 1 - rowIndex
																	)}
																</td>
															{/if}
														</tr>
													{/each}
												</tbody>
											</table>
										</div>
									</div>

									{#if labelPosition === 'right'}
										<div
											class="writing-vertical sticky right-0 z-10 flex w-24 items-center justify-center border-l bg-rose-400 p-4 text-white"
										>
											{frontLabel}
										</div>
									{/if}
								</div>

								{#if labelPosition === 'bottom'}
									<div
										class="sticky bottom-0 z-10 mt-4 border-t bg-rose-400 p-4 text-center text-white"
									>
										{frontLabel}
									</div>
								{/if}
							</div>

							<!-- Legend and Zoom Controls - Fixed at bottom -->
							<div
								class="absolute right-0 bottom-0 left-0 z-20 flex items-center justify-between bg-white p-4 shadow-[0_-2px_4px_rgba(0,0,0,0.1)]"
							>
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
										class="rounded bg-gray-50 px-2 py-1 text-sm shadow hover:bg-gray-100"
										on:click={handleZoomOut}
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
									<span class="min-w-[4rem] text-center text-sm"
										>{(currentZoom * 100).toFixed(0)}%</span
									>
									<button
										aria-label="Zoom in"
										class="rounded bg-gray-50 px-2 py-1 text-sm shadow hover:bg-gray-100"
										on:click={handleZoomIn}
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
										on:click={handleFitToScreen}
									>
										Fit to Screen
									</button>
								</div>
							</div>
						</div>

						<!-- Multiple Seat Selection and Status Controls -->
						<div class="flex items-center justify-between rounded-lg border bg-white p-4">
							<div class="flex items-center gap-4">
								<label class="flex cursor-pointer items-center">
									<span class="mr-2 font-medium">Multiple Seat Selection</span>
									<button
										aria-label="Toggle multiple seat selection"
										type="button"
										class="toggle-button relative h-6 w-12 rounded-full bg-gray-300 p-0.5 transition-colors"
										class:bg-green-500={multipleSeatSelection}
										on:click={handleToggleChange}
										aria-pressed={multipleSeatSelection}
									>
										<span
											class="block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
											class:translate-x-6={multipleSeatSelection}
										></span>
									</button>
								</label>

								<!-- Show selection count in multiple selection mode -->
								{#if multipleSeatSelection && selectedSeats.length > 0}
									<span
										class="ml-2 rounded-md bg-blue-100 px-2 py-1 text-sm font-medium text-blue-700"
									>
										{selectedSeats.length} seats selected
									</span>
								{/if}
							</div>

							<div class="flex gap-2">
								<button
									class="rounded bg-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-400"
									on:click={() => handleStatusChange('unavailable')}
									disabled={(!multipleSeatSelection && !selectedSeat) ||
										(multipleSeatSelection && selectedSeats.length === 0)}
								>
									Unavailable
								</button>
								<button
									class="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
									on:click={() => handleStatusChange('available')}
									disabled={(!multipleSeatSelection && !selectedSeat) ||
										(multipleSeatSelection && selectedSeats.length === 0)}
								>
									Available
								</button>
								<button
									class="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
									on:click={() => handleStatusChange('sold')}
									disabled={(!multipleSeatSelection && !selectedSeat) ||
										(multipleSeatSelection && selectedSeats.length === 0)}
								>
									Sold
								</button>
							</div>
						</div>

						<div class="rounded-lg border bg-white p-6">
							<div class="flex items-center justify-between">
								<div>
									<h3 class="text-xl font-bold text-gray-800">Seat Count</h3>
									<div class="mt-3 flex space-x-8">
										<div>
											<span class="font-medium">Total Seats: </span>
											<span class="font-bold">
												{section.seatConfig.rows * section.seatConfig.seatsPerRow}
											</span>
										</div>

										<div>
											<span class="font-medium">Unavailable Seats: </span>
											<span class="font-bold">
												{section.seats.flat().filter((status) => status === 'unavailable').length}
											</span>
										</div>

										<div>
											<span class="font-medium">Sold Seats: </span>
											<span class="font-bold">
												{section.seats.flat().filter((status) => status === 'sold').length}
											</span>
										</div>
									</div>
								</div>

								<div class="text-right">
									<span class="text-5xl font-bold text-gray-800">
										{section.seats.flat().filter((status) => status === 'available').length}
									</span>
									<p class="text-sm text-gray-600">Current Seats Available</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.writing-vertical {
		writing-mode: vertical-rl;
		text-orientation: mixed;
	}

	/* Add disabled button styling */
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Toggle button styling */
	.toggle-button {
		outline: none;
		border: none;
	}

	.toggle-button:focus {
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
	}
</style>
