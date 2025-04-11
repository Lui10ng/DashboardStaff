import type { Event } from '$lib/types';

const defaultEventValues: Event = {
	id: 0,
	title: '',
	location: '',
	date: '',
	status: '',
	tickets: {
		sold: 0,
		total: 0
	},
	image: ''
};

let eventsStore = $state<Event[]>([]);
let error = $state<string | null>(null);

/**
 * Creates a memoized function that caches the result of the function based on the input
 * @param fn - The function to memoize
 * @returns A memoized function
 */

function createMemoized<T, U>(fn: (input: T) => U) {
	let lastInput: T | undefined;
	let lastOutput: U | undefined;

	return (input: T): U => {
		if (input !== lastInput) {
			lastInput = input;
			lastOutput = fn(input);
		}
		return lastOutput as U;
	};
}

/**
 * Filters the events store by status
 * @param status - The status to filter by
 * @returns The filtered events
 */

const filterByStatus = createMemoized((status: string) => {
	eventsStore = eventsStore.filter((event) => event.status === status);
});

/**
 * Sets the events store
 * @param newEvent - The new events to set
 */
function setEvents(newEvent: Event[]) {
	try {
		error = null;
		eventsStore = newEvent.map((event) => ({
			...defaultEventValues,
			...event
		}));
	} catch (e) {
		error = e instanceof Error ? e.message : 'An unknown error occurred';
		console.log('set events', error);
	}
}

// derived state
const hasEvents = $derived(eventsStore.length > 0);
const liveEvents = $derived(filterByStatus('Live'));
const upcomingEvents = $derived(filterByStatus('Upcoming'));
const pastEvents = $derived(filterByStatus('Past'));

export const eventListStore = {
	eventsStore,
	hasEvents,
	liveEvents,
	upcomingEvents,
	pastEvents,
	setEvents,
	error,
	get events() {
		return eventsStore;
	}
};
