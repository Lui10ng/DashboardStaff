// Define the structure for a single ticket type document in the response
// Contains only the fields selected in paramsTicket + id
export interface TicketTypePartial {
	id: string; // Payload IDs are typically strings, adjust if needed
	name?: string;
	price?: number; // Assuming price is stored as a number
	currency?: string; // e.g., 'USD', 'PHP'
	quantityAvailable?: number;
	minOrderQuantity?: number;
	maxOrderQuantity?: number;
	salesStart?: string; // Dates are often strings in ISO format from JSON
	salesEnd?: string; // Dates are often strings in ISO format from JSON
	color?: string; // Assuming a hex code or color name string
	status?: string; // e.g., 'active', 'inactive', 'sold_out'
	// Add any other fields that might be implicitly included by Payload
}

// Define the structure for the overall API response object
export interface TicketTypesResponse {
	docs: TicketTypePartial[]; // Array of the partial ticket type objects
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
	pagingCounter: number;
	hasPrevPage: boolean;
	hasNextPage: boolean;
	prevPage: number | null;
	nextPage: number | null;
}
