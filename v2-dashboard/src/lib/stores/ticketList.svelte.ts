import type { TicketProps } from '$lib/types';

const defaultTicketValues: TicketProps = {
	id: 1,
	name: '',
	price: 0,
	currency: 'PHP',
	quantityAvailable: 0,
	minOrderQuantity: 0,
	maxOrderQuantity: 0,
	salesStart: '',
	salesEnd: '',
	color: '#0FBA81',
	status: 'inactive'
};

let ticketsStore = $state<TicketProps[]>([]);
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
 * Filters the tickets store by status
 * @param status - The status to filter by
 * @returns The filtered tickets
 */
const filterByStatus = createMemoized((status: string) => {
	return ticketsStore.filter((ticket) => ticket.status === status);
});

/**
 * Sets the tickets store
 * @param newTickets - The new tickets to set
 */
function setTickets(newTickets: TicketProps[]) {
	try {
		error = null;
		ticketsStore = newTickets.map((ticket) => ({
			...defaultTicketValues,
			...ticket,
			salesStart: ticket.salesStart ?? '', // Convert null/undefined to empty string
			salesEnd: ticket.salesEnd ?? '',
			minOrderQuantity: ticket.minOrderQuantity ?? null,
			maxOrderQuantity: ticket.maxOrderQuantity ?? null
		}));
	} catch (e) {
		error = e instanceof Error ? e.message : 'An unknown error occurred';
		console.log('set tickets', error);
	}
}

/**
 * Updates a ticket in the store
 * @param ticketId - The ID of the ticket to update
 * @param updatedTicket - The updated ticket data
 */
function updateTicket(ticketId: number, updatedTicket: Partial<TicketProps>) {
	try {
		ticketsStore = ticketsStore.map((ticket) =>
			ticket.id === ticketId ? { ...ticket, ...updatedTicket } : ticket
		);
	} catch (e) {
		error = e instanceof Error ? e.message : 'An unknown error occurred';
		console.log('update ticket', error);
	}
}

// derived state
const hasTickets = $derived(ticketsStore.length > 0);
const activeTickets = $derived(filterByStatus('active'));
const inactiveTickets = $derived(filterByStatus('inactive'));

export const ticketListStore = {
	ticketsStore,
	hasTickets,
	activeTickets,
	inactiveTickets,
	setTickets,
	updateTicket,
	error,
	get tickets() {
		return ticketsStore;
	}
};
