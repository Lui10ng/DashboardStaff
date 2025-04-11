import type { HttpMethod, RequestOptions, ApiClient, PayloadError } from '$lib/types';
import { isStructuredApiError } from '$lib/utils/errorHandler';
import { PUBLIC_PAYLOAD_API_URL } from '$env/static/public';

/**
 * Sends a request to the specified path
 * @param method The HTTP method (GET, POST, PATCH, DELETE)
 * @param path The path of the request
 * @param options Optional options to customize the request
 * @returns The response data
 */

async function request(method: HttpMethod, path: string, options: RequestOptions = {}) {
	const { body, params, fetchInstance = fetch, token } = options;
	const url = new URL(`api/${path}`, PUBLIC_PAYLOAD_API_URL);

	if (params) {
		url.search =
			params instanceof URLSearchParams
				? params.toString()
				: new URLSearchParams(params).toString();
	}

	const headers = new Headers({
		'Content-Type': 'application/json',
		Accept: 'application/json',
		...options.headers
	});

	// const authToken = token ?? getAuthToken(fetchInstance);
	// if (authToken) {
	//   headers.set('Authorization', `Bearer ${authToken}`);
	// }

	// --- Centralized Request ---
	let response;
	try {
		response = await fetchInstance(url.toString(), {
			method: method.toUpperCase(),
			headers,
			body: body ? JSON.stringify(body) : null
		});

		// --- Centralized Response Checking ---
		if (!response.ok) {
			let errorData: PayloadError = {};
			let errorMessage = response.statusText;

			try {
				// Attempt to parse Payload's structured error response
				errorData = await response.json();

				// Prioritize Payload's validation error messages if available
				if (Array.isArray(errorData?.errors) && errorData.errors.length > 0) {
					errorMessage = errorData.errors[0].message || errorMessage; // Use first validation error message
				} else if (errorData?.message) {
					errorMessage = errorData.message; // Use generic message if present
				}
			} catch (e) {
				// Ignore JSON parsing errors if response body is not valid JSON
				console.warn(`Could not parse error response body for ${method} ${path}`);
			}

			// Throw a standardized error object
			throw {
				status: response.status,
				message: errorMessage, // Best guess at a relevant message
				errors: errorData?.errors || [], // Payload validation errors [{ field, message }]
				data: errorData // Full parsed error data (if any) for context
			};
		}
		// --- End Response Checking ---

		if (response.status === 204 || response.headers.get('content-length') === '0') {
			return undefined; // Handle No Content
		}

		return await response.json(); // Success
	} catch (error) {
		console.error(`API Client Fetch Error (${method} ${path}):`, error);

		// Handle Network errors or errors thrown from (!response.ok) block
		if (isStructuredApiError(error)) {
			// If it's our structured error, re-throw it
			throw error;
		} else {
			// Likely a network error (fetch itself failed) or other unexpected throw

			// Type guard to safely access error properties
			let errorMessage = 'An unknown error occurred';

			if (error instanceof Error) {
				errorMessage = error.message;
			} else if (typeof error === 'string') {
				errorMessage = error;
			}

			// Optionally, log the original error for more context if it wasn't an Error instance
			if (!(error instanceof Error)) {
				console.error('Caught non-Error throwable:', error);
			}
			throw { status: 0, message: errorMessage, errors: [], data: {} };
		}
	}
}

// Export helper methods
export const apiClient: ApiClient = {
	/**
	 * Sends a GET request to the specified path
	 * @param path The path of the request
	 * @param params Optional parameters to include in the URL
	 * @param options Optional options to customize the request
	 * @returns The response data
	 */
	get: (path, params = undefined, options = {}) => request('GET', path, { ...options, params }),

	/**
	 * Sends a POST request to the specified path
	 * @param path The path of the request
	 * @param body The body of the request
	 * @param options Optional options to customize the request
	 * @returns The response data
	 */
	post: (path, body, options = {}) => request('POST', path, { ...options, body }),

	/**
	 * Sends a PATCH request to the specified path
	 * @param path The path of the request
	 * @param body The body of the request
	 * @param options Optional options to customize the request
	 * @returns The response data
	 */
	patch: (path, body, options = {}) => request('PATCH', path, { ...options, body }),

	/**
	 * Sends a DELETE request to the specified path
	 * @param path The path of the request
	 * @param options Optional options to customize the request
	 * @returns The response data
	 */
	del: (path, options = {}) => request('DELETE', path, { ...options })
};
