export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestOptions {
	body?: unknown;
	params?: Record<string, string> | URLSearchParams;
	fetchInstance?: typeof fetch;
	token?: string;
	headers?: Record<string, string>;
}

export interface ApiClientOptions extends Omit<RequestOptions, 'params' | 'body'> {}

export interface ApiClient {
	get: <T = unknown>(
		path: string,
		params?: Record<string, string> | URLSearchParams | undefined,
		options?: ApiClientOptions
	) => Promise<T>;

	post: <T = unknown>(path: string, body: unknown, options?: ApiClientOptions) => Promise<T>;

	patch: <T = unknown>(path: string, body: unknown, options?: ApiClientOptions) => Promise<T>;

	del: <T = unknown>(path: string, options?: ApiClientOptions) => Promise<T>;
}

export interface PayloadError {
	message?: string;
	errors?: { field: string; message: string }[];
	// Add other potential properties if known
	[key: string]: any; // Allow other properties
}

export type ClientOptions = Omit<RequestOptions, 'fetchInstance' | 'token'>;

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

export type TicketDetail = {
	name: string;
	price: number;
	color: string;
};

export interface TicketTypeResponse {
	quantityAvailable: number;
}
