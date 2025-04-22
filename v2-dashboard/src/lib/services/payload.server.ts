import { isStructuredApiError } from '$lib/utils/errorHandler';
import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import type { ApiClient, HttpMethod, RequestOptions, PayloadError, ClientOptions} from '$lib/types';
import { PUBLIC_PAYLOAD_API_URL } from '$env/static/public';

/**
 * (Helper function for internal use in this file only)
 * Sends a request to the Payload CMS API, making sure the user is logged in first.
 *
 * It uses SvelteKit's 'event' data to:
 * 1. Check the user's login status using Clerk (`event.locals.auth()`).
 * 2. Make the actual API call using SvelteKit's special `event.fetch`
 *    (which handles server requests correctly).
 *
 * @param T - This is where you specify what kind of data you expect back
 *            from the API (e.g., `User`, `Form[]`). If you don't specify,
 *            it defaults to `unknown` (meaning "any type, but check it first").
 * @param event - The current request details provided by SvelteKit.
 *                Needed for checking login and using `event.fetch`.
 * @param method - The type of request: 'GET', 'POST', 'PATCH', or 'DELETE'.
 * @param path - The specific API endpoint you want to talk to (like 'forms' or 'users/me').
 *               The function automatically adds '/api/' before this path.
 * @param options - Optional settings like data to send (`body`), search terms (`params`),
 *                  or extra request details (`headers`).
 * @returns - A Promise that, if successful, will give you the API data converted
 *            to the type `T` you specified.
 * @throws - If the user isn't logged in, or if the Payload API responds with an
 *           error (like 404 Not Found or 500 Server Error), this function will
 *           stop everything and trigger a SvelteKit error page.
 */
async function requestInternal<T = unknown>(
	event: RequestEvent,
	method: HttpMethod,
	path: string,
	options: Omit<RequestOptions, 'fetchInstance' | 'token'> = {} // Internal options don't need token/fetch
): Promise<T> {
	const { body, params, headers: customHeaders } = options;
	const url = new URL(`/api/${path}`, PUBLIC_PAYLOAD_API_URL); // Use /api/ prefix

	// Check if user is authenticated
	const authObject = await event.locals.auth();

	if (!authObject || !authObject.sessionId) {
		throw error(401, 'Not authenticated');
	}

	const token = await authObject.getToken(); // Get token for the current user
	console.log('token', token)
	if (!token) {
		throw error(401, 'Could not retrieve authentication token');
	}

	if (params) {
		url.search = new URLSearchParams(params).toString();
	}

	const headers = new Headers({
		'Content-Type': 'application/json',
		Accept: 'application/json',
		Authorization: `Bearer ${token}`, // Use the fetched token
		...customHeaders
	});

	let response;
	try {
		response = await event.fetch(url.toString(), { // Use event.fetch
			method: method.toUpperCase(),
			headers,
			body: body ? JSON.stringify(body) : undefined
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
			return undefined as T;
		}

		return await response.json(); // Success
	} catch (error) {
		console.error(`API Client Fetch Error (${method} ${path}):`, error);
		console.log(error.data.errors);
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

/**
 * Creates a ready-to-use tool for talking to the Payload API,
 * making sure the user is logged in for each request.
 *
 * You need to give it the current SvelteKit `event` data. This function uses
 * that `event` to automatically get the user's login token (from Clerk) and
 * uses SvelteKit's special `event.fetch` to send the request from the server
 * correctly (handling cookies, etc.).
 *
 * @param event - The current request details provided by SvelteKit.
 * @returns - The [ApiClient] tool, which has methods like `.get()`, `.post()`,
 *            `.patch()`, and `.del()` already set up for making authenticated
 *            API calls based on the provided `event`.
 */
export function createApiClient(event: RequestEvent): ApiClient {

	return {
		/**
		 * Fetches (gets) information from your API.
		 *
		 * Think of this like asking your API for specific data. For example, you could ask
		 * for a list of all events or the details of one specific user. This function makes
		 * sure the person asking is allowed to see the data before fetching it.
		 *
		 * @template T - What kind of data are you expecting back? Use this to tell the code
		 *               the shape of the data. For example, if you expect a single event object,
		 *               you might write `<Event>`. If you expect a list of events in a special
		 *               Payload structure, you might write `<PayloadPaginatedResponse<Event>>`.
		 *               If you're not sure, you can leave it as `<unknown>`, but it's better
		 *               to be specific if you can!
		 *
		 * @param {string} path - The specific address (endpoint) in your API you want to get
		 *                        data from. Examples: '/events', '/users/123'. This tells the
		 *                        function *where* to look for the data.
		 *
		 * @param {Record<string, string> | URLSearchParams} [params] - Optional: Any filters or
		 *                        search terms you want to add to your request. This helps you get
		 *                        only the specific data you need. For example, you could ask for
		 *                        events happening after a certain date or users from a specific city.
		 *                        It's like adding '?search=Tech&limit=10' to a web address.
		 *
		 * @param {ClientOptions} [options] - Optional: Extra settings for the request. You usually
		 *                        won't need this, but it's there for advanced cases like adding
		 *                        special instructions (headers) to your request.
		 *
		 * @returns {Promise<T>} - This function doesn't give you the data immediately. Instead,
		 *                       it gives you a "Promise" to get the data soon. Once the data
		 *                       arrives, it will be in the format you specified with `<T>`.
		 *
		 * @throws - If something goes wrong (like the person isn't logged in, the API address
		 *           doesn't exist, or there's a server error), this function will automatically
		 *           show a SvelteKit error page instead of returning data.
		 */
		get: <T = unknown>(path: string, params?: Record<string, string> | URLSearchParams, options: ClientOptions = {}) =>
			requestInternal<T>(event, 'GET', path, { ...options, params }),
		
		/**
		 * Sends new information to your API to create something.
		 *
		 * Use this when you want to add a new item, like creating a new event,
		 * adding a new user, or submitting a new form. This function makes sure
		 * the person is allowed to create things before sending the data.
		 *
		 * @template T - What kind of data do you expect the API to send back after
		 *               creating the item? Often, it's the details of the newly created
		 *               item, like `<NewEvent>` or `<User>`. Sometimes it might just be
		 *               a success message.
		 *
		 * @param {string} path - The specific API address (endpoint) where new items
		 *                        are created. Examples: '/events', '/users'.
		 *
		 * @param {unknown} body - The actual data you want to send to create the new item.
		 *                       This should be an object containing the details, like
		 *                       `{ title: 'My Event', date: '...' }`.
		 *
		 * @param {ClientOptions} [options] - Optional: Extra settings for the request, like
		 *                        custom headers. Usually not needed.
		 *
		 * @returns {Promise<T>} - A "Promise" to get the API's response soon. This response
		 *                       usually contains details about the item that was just created,
		 *                       in the format you specified with `<T>`.
		 *
		 * @throws - If something goes wrong (like the person isn't logged in, the data
		 *           is invalid, or there's a server error), it shows a SvelteKit error page.
		 */
		post: <T = unknown>(path: string, body: unknown, options: ClientOptions = {}) =>
			requestInternal<T>(event, 'POST', path, { ...options, body }),

		/**
		 * Sends updates to your API to change an existing item.
		 *
		 * Use this when you want to modify something that already exists, like changing
		 * an event's title, updating a user's email, or editing a form submission.
		 * You only need to send the fields you want to change. This function makes
		 * sure the person is allowed to make changes before sending the update.
		 *
		 * @template T - What kind of data do you expect the API to send back after
		 *               updating the item? Often, it's the full details of the item
		 *               *after* the update, like `<UpdatedEvent>` or `<User>`.
		 *
		 * @param {string} path - The specific API address (endpoint) for the item you
		 *                        want to update. You usually need the item's ID here.
		 *                        Examples: '/events/123', '/users/abc'.
		 *
		 * @param {unknown} body - The data you want to update. This should be an object
		 *                       containing only the fields you want to change, like
		 *                       `{ title: 'New Event Title' }` or `{ email: 'new@email.com' }`.
		 *
		 * @param {ClientOptions} [options] - Optional: Extra settings for the request, like
		 *                        custom headers. Usually not needed.
		 *
		 * @returns {Promise<T>} - A "Promise" to get the API's response soon. This response
		 *                       usually contains the updated details of the item, in the
		 *                       format you specified with `<T>`.
		 *
		 * @throws - If something goes wrong (like the person isn't logged in, the item
		 *           doesn't exist, the data is invalid, or there's a server error),
		 *           it shows a SvelteKit error page.
		 */
		patch: <T = unknown>(path: string, body: unknown, options: ClientOptions = {}) =>
			requestInternal<T>(event, 'PATCH', path, { ...options, body }),

		/**
		 * Tells your API to delete an existing item.
		 *
		 * Use this when you want to permanently remove something, like deleting an event
		 * or removing a user account. This function makes sure the person is allowed
		 * to delete the item before asking the API to remove it. Be careful, deletions
		 * are usually permanent!
		 *
		 * @template T - What kind of data do you expect the API to send back after
		 *               deleting the item? Often, delete actions don't send back much
		 *               data, maybe just a success message like `<{ success: true }>` or
		 *               nothing at all (in which case you can use `<void>`).
		 *
		 * @param {string} path - The specific API address (endpoint) for the item you
		 *                        want to delete. You usually need the item's ID here.
		 *                        Examples: '/events/123', '/users/abc'.
		 *
		 * @param {ClientOptions} [options] - Optional: Extra settings for the request, like
		 *                        custom headers. Usually not needed.
		 *
		 * @returns {Promise<T>} - A "Promise" to get the API's response soon (if any).
		 *                       The response format depends on what your API sends back
		 *                       after a deletion, matching the type `<T>` you specified.
		 *
		 * @throws - If something goes wrong (like the person isn't logged in, the item
		 *           doesn't exist, or there's a server error), it shows a SvelteKit error page.
		 */
		del: <T = unknown>(path: string, options: ClientOptions = {}) =>
			requestInternal<T>(event, 'DELETE', path, { ...options })
	};
}
