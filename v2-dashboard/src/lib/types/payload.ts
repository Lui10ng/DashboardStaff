/**
 * Represents the standard paginated response structure from Payload CMS.
 * @template T The type of the documents contained in the 'docs' array.
 */
export interface PayloadPaginatedResponse<T> {
	docs: T[];
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