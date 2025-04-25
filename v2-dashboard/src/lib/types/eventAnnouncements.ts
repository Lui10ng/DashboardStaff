/**
 * Represents a single document from the 'EventAnnouncements' collection.
 * NOTE: Adjust the fields below to match your actual collection definition,
 * paying attention to field names and types.
 * Because depth=0 is used, relationship fields like 'event' and 'createdBy'
 * will only contain the ID string.
 */
export interface EventAnnouncementDocument {
	id: string;
	title?: string; // Example: Announcement title
	content?: any; // Example: Rich text content (adjust type if known, e.g., object[])
	event: string; // The ID of the related event (due to depth=0)
	order?: number; // Example: Order field used for sorting
	createdBy?: string; // The ID of the user who created it (due to depth=0)
	createdAt: string; // ISO date string
	updatedAt: string; // ISO date string
	// Add any other relevant fields from your EventAnnouncements collection
}

/**
 * Represents the paginated response structure from the Payload API
 * when querying the 'event-announcements' collection.
 */
export interface EventAnnouncementResponse {
	docs: EventAnnouncementDocument[]; // Array of announcement documents for the current page
	totalDocs: number; // Total number of announcements matching the query
	limit: number; // The limit used for pagination
	totalPages: number; // Total number of pages
	page: number; // Current page number
	pagingCounter: number; // The number of the first document on this page (usually (page-1)*limit + 1)
	hasPrevPage: boolean; // True if a previous page exists
	hasNextPage: boolean; // True if a next page exists
	prevPage: number | null; // Previous page number or null
	nextPage: number | null; // Next page number or null
}
