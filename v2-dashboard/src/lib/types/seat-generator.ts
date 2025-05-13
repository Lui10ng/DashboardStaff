export interface SeatConfig {
	rows: number;
	seatsPerRow: number;
	rowStartChar: string;
	seatStartNum: number;
	rowOrder: 'down' | 'up';
	seatOrder: 'left' | 'right';
	rowLabel: string;
}

export interface SeatInfo {
	displayName: string;
	status: 'available' | 'unavailable' | 'sold';
}

export interface SeatLayoutData {
	name: string;
	config: {
		ticketQuantity: number;
		seatConfig: SeatConfig;
	};
	seats: string[][];
	customSeatNames?: Record<string, string>;
	summary: {
		totalSeats: number;
		availableSeats: number;
		unavailableSeats: number;
		soldSeats: number;
	};
}

export type SeatData = {
	customName: string | null;
};

export type Section = {
	name: string;
	seatConfig: SeatConfig;
	seats: string[][];
	seatData: Record<string, SeatData>;
	customSeatNames?: Record<string, string>;
};

export type SeatStatus = 'available' | 'unavailable' | 'sold';
export type TabType = 'ticket' | 'reserve-seating';

export type CustomSeatNames = {
	[key: string]: string;
};

export type SelectedSeat = {
	rowIndex: number;
	seatIndex: number;
};
