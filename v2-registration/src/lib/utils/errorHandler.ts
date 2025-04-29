/**
 * Processes an unknown error caught in a SvelteKit load or action function,
 * determining an appropriate HTTP status code and user-friendly error message.
 * Logs the original error for debugging purposes.
 *
 * @param caughtError The error object caught (typed as unknown).
 * @param context An optional string providing context for the error log (e.g., 'Loading events', 'Submitting form').
 * @param defaultMessage The default message to use if a specific message cannot be extracted. Defaults to 'An unexpected error occurred'.
 * @returns An object containing the determined statusCode and errorMessage.
 */
export function handleSvelteError(
	caughtError: unknown,
	context: string = 'processing request',
	defaultMessage = 'An unexpected error occurred'
): { statusCode: number; errorMessage: string } {
	let statusCode = 500; // Default status code
	let errorMessage = defaultMessage; // Default message

	console.error(`Error during ${context}:`, caughtError); // Log the raw error first with context

	// 1. Check for the structured error potentially from apiClient or similar fetches
	//    (Assumes an object with numeric status and string message)
	if (
		typeof caughtError === 'object' &&
		caughtError !== null &&
		'status' in caughtError && typeof caughtError.status === 'number' &&
		'message' in caughtError && typeof caughtError.message === 'string'
	) {
		statusCode = caughtError.status !== 0 ? caughtError.status : 500; // Use specific status, fallback if 0
		errorMessage = caughtError.message || defaultMessage;
		// Optionally log more details specific to this type
		console.error(`Structured Error (${statusCode}) during ${context}: ${errorMessage}`, 'errors' in caughtError ? (caughtError as any).errors : '');
	}
	// 2. Check for standard JS Error
	else if (caughtError instanceof Error) {
		// Keep default statusCode 500 for generic Errors unless otherwise specified
		errorMessage = caughtError.message || defaultMessage;
		// TODO: Add more sophisticated logging (e.g., Otel)
		console.error(`Standard Error during ${context}:`, caughtError.message, caughtError.stack);
	}
	// 3. Check if a string was thrown
	else if (typeof caughtError === 'string') {
		// Keep default statusCode 500, use the string as message
		errorMessage = caughtError || defaultMessage;
		console.error(`String Error during ${context}:`, caughtError);
	}
	// 4. Handle other unknown types
	else {
		console.error(`Unknown error type during ${context}:`, caughtError);
		// Keep defaults for statusCode and errorMessage
	}

	return { statusCode, errorMessage };
}

/**
 * Determines if an error is a structured API error
 * @param error The error object to be evaluated
 * @returns True if the error is a structured API error, false otherwise
 */
export function isStructuredApiError(error: unknown): error is { status: number; message: string; errors: any[]; data: any } {
    return (
        typeof error === 'object' && // Is it an object?
        error !== null &&           // Is it not null?
        'status' in error &&        // Does it have a 'status' property?
        typeof (error as any).status === 'number' // Is the status a number?
    );
}