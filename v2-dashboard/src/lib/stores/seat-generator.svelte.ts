import { writable, derived } from 'svelte/store';
import type { Section, SeatConfig, SelectedSeat } from '$lib/types/seat-generator';

interface SeatGeneratorState {
	name: string;
	ticketQuantity: number;
	section: Section;
	selectedSeat: SelectedSeat | null;
	selectedSeats: SelectedSeat[];
	multipleSeatSelection: boolean;
	customSeatNames: Record<string, string>;
	activeTab: 'ticket' | 'reserve-seating';
	reserveSeatingEnabled: boolean;
	currentZoom: number;
}

function createSeatGeneratorStore() {
	const defaultState: SeatGeneratorState = {
		name: '',
		ticketQuantity: 0,
		section: {
			name: 'Default Section',
			seatConfig: {
				rows: 5,
				seatsPerRow: 5,
				rowStartChar: 'A',
				seatStartNum: 1,
				rowOrder: 'down',
				seatOrder: 'left',
				rowLabel: 'Show All'
			},
			seats: [],
			seatData: {},
			customSeatNames: {}
		},
		selectedSeat: null,
		selectedSeats: [],
		multipleSeatSelection: false,
		customSeatNames: {},
		activeTab: 'ticket',
		reserveSeatingEnabled: false,
		currentZoom: 1
	};

	const store = writable<SeatGeneratorState>(defaultState);

	const { subscribe, set, update } = store;

	const totalSeats = derived(
		store,
		$store => ($store.section.seatConfig.rows ?? 0) * ($store.section.seatConfig.seatsPerRow ?? 0)
	);

	return {
		subscribe,
		setName: (name: string) => update(store => ({ ...store, name })),
		setTicketQuantity: (quantity: number) => update(store => ({ ...store, ticketQuantity: quantity })),
		setSectionConfig: (config: Partial<SeatConfig>) => {
			update(store => {
				const updatedConfig = {
					...store.section.seatConfig,
					...config
				};
				return {
					...store,
					section: {
						...store.section,
						seatConfig: updatedConfig
					}
				};
			});
		},
		setSeats: (seats: string[][]) => 
			update(store => ({
				...store,
				section: { ...store.section, seats }
			})),
		setCustomSeatNames: (names: Record<string, string>) => 
			update(store => ({ ...store, customSeatNames: names })),
		setActiveTab: (tab: 'ticket' | 'reserve-seating') => 
			update(store => ({ ...store, activeTab: tab })),
		setReserveSeatingEnabled: (enabled: boolean) =>
			update(store => {
				console.log('Setting reserve seating enabled:', enabled);
				const newState = { ...store, reserveSeatingEnabled: enabled };
				
				if (enabled) {
					// Initialize with default config when enabling if not already set
					if (!store.section.seatConfig || store.section.seatConfig.rows === 0) {
						newState.section = {
							...store.section,
							seatConfig: defaultState.section.seatConfig,
							seats: [], // Ensure seats array exists but is empty
							seatData: {} // Initialize empty seat data
						};
					}
				}
				
				return newState;
			}),
		setSelectedSeat: (seat: SelectedSeat | null) =>
			update(store => ({ ...store, selectedSeat: seat })),
		setSelectedSeats: (seats: SelectedSeat[]) =>
			update(store => ({ ...store, selectedSeats: seats })),
		setMultipleSeatSelection: (enabled: boolean) =>
			update(store => ({ ...store, multipleSeatSelection: enabled })),
		setCurrentZoom: (zoom: number) =>
			update(store => ({ ...store, currentZoom: zoom })),
		regenerateSeats: () => {
			update(store => {
				const { rows = 0, seatsPerRow = 0 } = store.section.seatConfig || {};
				console.log('Regenerating seats:', rows, 'rows ×', seatsPerRow, 'seats per row');

				if (rows === 0 || seatsPerRow === 0) {
					console.log('Zero dimensions, creating empty arrays');
					return {
						...store,
						section: {
							...store.section,
							seats: [],
							seatData: {}
						}
					};
				}

				console.log('Creating seat arrays with dimensions:', rows, 'x', seatsPerRow);
				const newSeats = Array(rows)
					.fill(null)
					.map(() => Array(seatsPerRow).fill('available'));

				console.log('Generated seats array:', newSeats);
				return {
					...store,
					section: {
						...store.section,
						seats: newSeats,
						seatData: {} // Reset seat data when regenerating
					}
				};
			});
		},
		reset: () => set(defaultState)
	};
}

export const seatGeneratorStore = createSeatGeneratorStore();
