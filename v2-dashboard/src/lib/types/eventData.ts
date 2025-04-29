import type { PayloadPaginatedResponse } from "./payloadResponse";

export const event = {
  title: 'Tech Talks 2024',
  date: 'April 16-18, 2024 | 8:00 AM - 6:00 PM',
  location: 'USTP Gymnasium, Cagayan de Oro City',
  url: 'https://techtalks2024.veent.co',
  stats: {
  }
};

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  url: string;
  imageUrl: string;
  eventImages: string[];
}

export interface EventType {
  id: string | number; // Adjust type as needed (string/number)
  slug: string;
  title: string;
  startTime: string; // Assumes ISO string
  endTime: string;   // Assumes ISO string
  location: string;  // Or a more complex object?
  eventContacts: any; // Replace 'any' with a specific type if known
  poster?: {
    url?: string;
  };
}

export type EventResponse = PayloadPaginatedResponse<EventType>;

export const currentEvent: Event = {
  id: '1',
  title: 'Tech Talks 2024',
  date: 'April 16-18, 2024',
  time: '8:00 AM - 6:00 PM',
  location: 'USTP Gymnasium, Cagayan de Oro City',
  url: 'https://techtalks2024.event.co/',
  imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3',
  eventImages: []
};

export interface EventDetailsResponse {
  id: string;       // The ID of the Event document fetched
  title?: string;    // The selected title field (optional as it might not exist)
  slug?: string;     // The selected slug field (optional)
  location?: string; // The selected location field (optional, adjust type if it's structured)
                     // If 'location' is an object with subfields (e.g., address, city),
                     // define a specific Location type for it.
  // Note: Depending on Payload's exact behavior with 'select', other default fields
  // might be included. If you discover others, add them here.
}