import { sequence } from '@sveltejs/kit/hooks';
import { withClerkHandler } from 'svelte-clerk/server';
import { createApiClient } from '$lib/services/payload.server';
import type { Handle } from '@sveltejs/kit';
import type { User } from '$lib/types/payload-types';
import { redirect } from '@sveltejs/kit';

// Handler 1: Clerk Authentication
const handleClerkAuth = withClerkHandler();

// Define public routes that DON'T require login
const publicPaths = ['/sign-in', '/sign-up'];

// Handler 2: Fetch Payload User Data & Protect Routes
const handlePayloadUser: Handle = async ({ event, resolve }) => {
	const clerkAuth = await event.locals.auth(); // Get Clerk auth state
	const currentPath = event.url.pathname;

	// Determine if the current route is protected
	const isProtectedRoute = !publicPaths.some((path) => currentPath.startsWith(path));

	// If it's a protected route...
	if (isProtectedRoute) {
		// ...and the user is NOT authenticated with Clerk...
		if (!clerkAuth?.userId) {
			// ...redirect them to the sign-in page.
			console.log(`Redirecting unauthenticated access from ${currentPath} to /sign-in`);
			throw redirect(307, '/sign-in'); // Use 303 for GET, 307 for preserving method
		}

		// If authenticated with Clerk, proceed to fetch Payload user for protected routes
		try {
			const apiClient = createApiClient(event);
			const response = await apiClient.get<User>(`/users/user-clerk/${clerkAuth.userId}`);

			if (response) {
				event.locals.payloadUser = response;
			} else {
				// Handle case where Clerk user exists but Payload user doesn't (e.g., sync issue)
				// Option 1: Log and proceed (user is authenticated but lacks specific app data)
				console.warn(`Payload user not found via API for Clerk ID: ${clerkAuth.userId}. User may need setup.`);
				
				event.locals.payloadUser = null;
				// Option 2: Redirect to an error or setup page (if Payload user is essential)
				throw redirect(307, '/sign-in');
			}
		} catch (error) {
			console.error('Error fetching Payload user via API client in hook:', error);
			event.locals.payloadUser = null;
			// Optional: Redirect on error?
			throw redirect(307, '/sign-in');
		}
	} else {
		// For public routes, still try to load Payload user if Clerk user exists
		// This allows showing user info even on public pages if they are logged in
		if (clerkAuth?.userId) {
			try {
				const apiClient = createApiClient(event);
				const response = await apiClient.get<User>(`/users/user-clerk/${clerkAuth.userId}`);
				event.locals.payloadUser = response || null;
			} catch (error) {
				// Don't block public access on error, just log it
				console.error('Non-critical error fetching Payload user for public route:', error);
				event.locals.payloadUser = null;
			}
		} else {
			// Ensure payloadUser is null if no Clerk user on public route
			event.locals.payloadUser = null;
		}
	}

	// Proceed with the request
	return resolve(event);
};

// Combine handlers using sequence
export const handle = sequence(handleClerkAuth, handlePayloadUser);
