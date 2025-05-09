import { writable } from 'svelte/store';

type SeatConfig = {
  rows: number;
  seatsPerRow: number;
  rowStartChar: string;
  seatStartNum: number;
  rowOrder: 'up' | 'down';
  seatOrder: 'left' | 'right';
  rowLabel: string;
};

type SeatStatus = 'available' | 'unavailable' | 'sold';

interface Seat {
  status: SeatStatus;
  displayName: string;
}

export interface SeatMap {
  name: string;
  config: {
    ticketQuantity: number;
    seatConfig: SeatConfig;
  };
  seats: Record<string, Seat>;
  customSeatNames: Record<string, string>;
  summary: {
    totalSeats: number;
    availableSeats: number;
    unavailableSeats: number;
    soldSeats: number;
  };
  venueImage?: string | null;
}

function createSeatMapStore() {
  const { subscribe, set, update } = writable<SeatMap | null>(null);

  return {
    subscribe,
    setSeatMap: (seatMap: SeatMap) => {
      set(seatMap);
      console.log('Seat map saved to store successfully:', seatMap);
    },
    reset: () => set(null),
    updateSeatMap: (updater: (seatMap: SeatMap) => SeatMap) => update(currentMap => {
      if (!currentMap) return null;
      return updater(currentMap);
    })
  };
}

export const seatMapStore = createSeatMapStore();