import type { Event } from '$lib/types';

// Default event values
const defaultEventValues: Event = {
	id: 0,
	title: '',
	slug: '',
	location: '',
	date: '',
	startTime: '',
	endTime: '',
	status: '',
	tickets: {
		sold: 0,
		total: 0
	},
	image: '',
	eventImages: [{ url: '' }]
};

// Current event being edited
let currentEvent = $state<Event>({ ...defaultEventValues });
let isLoading = $state(false);
let error = $state<string | null>(null);

/**
 * Initialize the edit store with event data
 */
function initializeEdit(eventData: Event) {
	currentEvent = { ...defaultEventValues, ...eventData };
	error = null;
}

/**
 * Update a specific field in the current event
 */
function updateField<K extends keyof Event>(field: K, value: Event[K]) {
	currentEvent = { ...currentEvent, [field]: value };
}

/**
 * Update the location field specifically
 */
function updateLocation(location: string) {
	updateField('location', location);
}

/**
 * Save the current event to the server
 */
async function saveEvent() {
	isLoading = true;
	error = null;

	try {
		// API call would go here
		console.log('Saving event:', currentEvent);

		// Return the updated event
		return currentEvent;
	} catch (e) {
		error = e instanceof Error ? e.message : 'Failed to save event';
		console.error('Save event error:', error);
		return null;
	} finally {
		isLoading = false;
	}
}

// Export the store
export const editEventStore = {
	get event() {
		return currentEvent;
	},
	isLoading,
	error,
	initializeEdit,
	updateField,
	updateLocation,
	saveEvent
};
