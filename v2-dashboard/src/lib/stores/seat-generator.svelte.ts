import type { Section, CustomSeatNames, SelectedSeat, TabType } from '$lib/types/seat-generator';

// Initial seat configuration
const createInitialSection = (): Section => ({
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
});

/**
 * state variables:
 *
 * We use let for all state variables since their properties might change or they might be directly reassigned
 */
const sectionStore = $state(createInitialSection());
const customSeatNamesStore = $state<CustomSeatNames>({});
let venueImageStore = $state<string | null>(null);
let currentZoomStore = $state(1);
let isDraggingOverStore = $state(false);

let ticketQuantityStore = $state(1000);
let activeTabStore = $state<TabType>('ticket');
let reserveSeatingEnabledStore = $state(false);
let showWarningStore = $state(false);
let selectedSeatStore = $state<SelectedSeat>(null);
let selectedSeatsStore = $state<SelectedSeat[]>([]);
let multipleSeatSelectionStore = $state(false);

// Functions to update state
const setTicketQuantity = (value: number) => {
	ticketQuantityStore = value;
	checkQuantityExceeded();
};

const setReserveSeatingEnabled = (value: boolean) => {
	reserveSeatingEnabledStore = value;
};

const setActiveTab = (value: TabType) => {
	activeTabStore = value;
};

const setSelectedSeat = (seat: SelectedSeat) => {
	selectedSeatStore = seat;
};

const setMultipleSeatSelection = (value: boolean) => {
	multipleSeatSelectionStore = value;
};

const setSelectedSeats = (seats: SelectedSeat[]) => {
	selectedSeatsStore = seats;
};

const setSectionConfig = (config: Partial<Section['seatConfig']>) => {
	sectionStore.seatConfig = { ...sectionStore.seatConfig, ...config };
};

const setVenueImage = (url: string | null) => {
	venueImageStore = url;
};

const setCurrentZoom = (zoom: number) => {
	currentZoomStore = zoom;
};

const setIsDraggingOver = (isDragging: boolean) => {
	isDraggingOverStore = isDragging;
};

const regenerateSeats = () => {
	const rows = Math.max(0, sectionStore.seatConfig.rows || 0);
	const seatsPerRow = Math.max(0, sectionStore.seatConfig.seatsPerRow || 0);

	console.log(`Regenerating seats: ${rows} rows × ${seatsPerRow} seats per row`);

	if (rows === 0 || seatsPerRow === 0) {
		console.log('Zero dimensions, creating empty arrays');
		sectionStore.seats = [];
		sectionStore.seatData = [];
	} else {
		// Direct property modification with $state
		console.log('Creating seat arrays with dimensions:', rows, 'x', seatsPerRow);

		try {
			sectionStore.seats = Array(rows)
				.fill(null)
				.map(() => Array(seatsPerRow).fill('available'));

			sectionStore.seatData = Array(rows)
				.fill(null)
				.map(() =>
					Array(seatsPerRow)
						.fill(null)
						.map(() => ({ customName: null }))
				);

			console.log(
				'Seats array created successfully:',
				sectionStore.seats.length,
				'rows,',
				sectionStore.seats.length > 0 ? sectionStore.seats[0].length : 0,
				'seats per row'
			);
		} catch (error) {
			console.error('Error creating seat arrays:', error);
		}
	}

	// Check if total seats exceed ticket quantity
	checkQuantityExceeded();

	// Log seat array size for debugging
	console.log('Total seats:', rows * seatsPerRow);
	console.log(
		'Actual seats array size:',
		sectionStore.seats.length > 0 ? sectionStore.seats.length * sectionStore.seats[0].length : 0
	);

	// Return the total number of seats for convenience
	return rows * seatsPerRow;
};

const checkQuantityExceeded = () => {
	const totalSeats = sectionStore.seatConfig.rows * sectionStore.seatConfig.seatsPerRow;
	const showWarning = totalSeats > ticketQuantityStore;

	showWarningStore = showWarning;
	return showWarning;
};

// Export store object with values and methods
export const seatGeneratorStore = {
	// State values
	get section() {
		return sectionStore;
	},
	get selectedSeat() {
		return selectedSeatStore;
	},
	get selectedSeats() {
		return selectedSeatsStore;
	},
	get multipleSeatSelection() {
		return multipleSeatSelectionStore;
	},
	get customSeatNames() {
		return customSeatNamesStore;
	},
	get ticketQuantity() {
		return ticketQuantityStore;
	},
	get activeTab() {
		return activeTabStore;
	},
	get reserveSeatingEnabled() {
		return reserveSeatingEnabledStore;
	},
	get showWarning() {
		return showWarningStore;
	},
	get currentZoom() {
		return currentZoomStore;
	},
	get venueImage() {
		return venueImageStore;
	},
	get isDraggingOver() {
		return isDraggingOverStore;
	},

	// Functions to update state
	setTicketQuantity,
	setReserveSeatingEnabled,
	setActiveTab,
	setSectionConfig,
	setSelectedSeat,
	setMultipleSeatSelection,
	setSelectedSeats,
	setVenueImage,
	setCurrentZoom,
	setIsDraggingOver,
	regenerateSeats,
	checkQuantityExceeded
};
