export interface SeatConfig {
  ticketQuantity: number;
  seatConfig: {
    rows: number;
    seatsPerRow: number;
    rowStartChar: string;
    seatStartNum: number;
    rowOrder: 'up' | 'down';
    seatOrder: 'left' | 'right';
    rowLabel: 'Show All' | 'Left Side' | 'Right Side' | 'No Label';
  };
}

export interface Seat {
  status: 'available' | 'unavailable' | 'sold';
  displayName: string;
  isPurchasable?: boolean;
  seatNumber?: string;
}

export interface SeatMap {
  id?: string;
  name: string;
  config: SeatConfig;
  seats: Record<string, Seat>;
  customSeatNames: Record<string, string>;
  summary: {
    totalSeats: number;
    availableSeats: number;
    unavailableSeats: number;
    soldSeats: number;
  };
  venueImage?: string | null;
  event?: {
    relationTo: 'events';
    value: string;
  };
} 