export interface SeatType {
  seatNumber: string;
  seatType: 'standard' | 'accessible' | 'vip' | 'unavailable';
  isPurchasable: boolean;
}

export interface RowType {
  rowLabel: string;
  seats: SeatType[];
}

export interface SectionType {
  sectionName: string;
  rows: RowType[];
}

export interface SeatMapType {
  id: string;
  name: string;
  description?: string;
  venue?: any; // Relationship to venue
  sections: SectionType[];
  event?: number; // Relationship to event
  createdAt: string;
  updatedAt: string;
} 