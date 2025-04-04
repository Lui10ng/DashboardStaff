export type SeatConfig = {
	rows: number;
	seatsPerRow: number;
	rowStartChar: string;
	seatStartNum: number;
	rowOrder: 'up' | 'down';
	seatOrder: 'left' | 'right';
	rowLabel: 'Left Side' | 'Right Side' | 'No Label' | 'Show All';
};

export type SeatData = {
	customName: string | null;
};

export type Section = {
	seatConfig: SeatConfig;
	seats: SeatStatus[][];
	seatData: SeatData[][];
};

export type SeatStatus = 'available' | 'unavailable' | 'sold';
export type TabType = 'ticket' | 'reserve-seating';

export type CustomSeatNames = {
	[key: string]: string;
};

export type SelectedSeat = {
	rowIndex: number;
	seatIndex: number;
} | null;

export type SeatLayoutData = {
	config: {
		frontLabel: string;
		ticketQuantity: number;
		seatConfig: SeatConfig;
	};
	venueImage: string | null;
	customSeatNames: CustomSeatNames;

	seats: Record<string, { displayName: string; status: SeatStatus }>;
	summary: {
		totalSeats: number;
		availableSeats: number;
		unavailableSeats: number;
		soldSeats: number;
	};
};
