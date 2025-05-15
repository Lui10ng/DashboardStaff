import type { PayloadPaginatedResponse } from './payloadResponse';

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
	endTime: string; // Assumes ISO string
	location: string; // Or a more complex object?
	eventContacts: any; // Replace 'any' with a specific type if known
	poster?: {
		url?: string;
	};
}

export type EventResponse = PayloadPaginatedResponse<EventType>;
