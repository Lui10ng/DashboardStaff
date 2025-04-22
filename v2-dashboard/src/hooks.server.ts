// src/hooks.server.ts
import { sequence } from '@sveltejs/kit/hooks';
import { withClerkHandler } from 'svelte-clerk/server';
import { createApiClient } from '$lib/services/payload.server'; // Adjust import path
import type { Handle } from '@sveltejs/kit';
// import type { User } from '$lib/types/payload-types'; // Import your Payload User type if available

// Define a type for the expected user object, including the organizer
// Adjust based on your actual User type and whether depth=1 fetches object or ID
// interface PayloadUserWithOrganizer extends User {
    // organizer?: User['organizer'] | string; // Allows for ID string (depth 0) or object (depth 1+)
    // Add other fields fetched by your depth setting if needed
// }

// Define a type for the expected API response structure from Payload find operations
interface PayloadFindResponse<T> {
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

// Handler 1: Clerk Authentication
const handleClerkAuth = withClerkHandler();

// Handler 2: Fetch Payload User Data using createApiClient
const handlePayloadUser: Handle = async ({ event, resolve }) => {
    const clerkAuth = await event.locals.auth(); // Get Clerk auth state

    if (clerkAuth?.userId) {
        try {
            const apiClient = createApiClient(event); // Use your API client

            console.log('Clerk User:', JSON.stringify(clerkAuth, null, 2));

            // Construct query parameters for the REST API call
            const params = new URLSearchParams({
                // Assumes 'clerkId' field exists on Payload User collection
                'where[clerkId][equals]': clerkAuth.userId,
                limit: '1',
                // *** Crucial: Set depth to fetch related data like organizer ***
                // depth=0 - Will fetch only the organizer ID string
                // depth=1 - Will fetch the full organizer object { id, name, ... }
                depth: '2', // Send depth as a string query param
            });

            console.log('Params:', params.toString());

            // Make the API call using your client's GET method
            // Adjust the expected response type based on your User type definition
            const response = await apiClient.get(
                `/users?${params.toString()}` // Target /api/users endpoint
            );

            console.log('Payload User Response:', JSON.stringify(response, null, 2));
            // Check if the response format is as expected and user found
            // if (response?.docs && response.docs.length > 0) {
            //     event.locals.payloadUser = response.docs[0];
            //     console.log('Payload User attached to locals via API Client:', event.locals.payloadUser);
            // } else {
            //     console.warn(`Payload user not found via API for Clerk ID: ${clerkAuth.userId}`);
            //     event.locals.payloadUser = null;
            // }
        } catch (error) {
            console.error('Error fetching Payload user via API client in hook:', error);
            // event.locals.payloadUser = null;
        }
    } else {
        // event.locals.payloadUser = null;
    }

    return resolve(event);
};

// Combine handlers using sequence
export const handle = sequence(handleClerkAuth, handlePayloadUser);