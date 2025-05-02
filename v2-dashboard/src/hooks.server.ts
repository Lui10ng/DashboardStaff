import { sequence } from '@sveltejs/kit/hooks';
import { withClerkHandler } from 'svelte-clerk/server';
import { createApiClient } from '$lib/services/payload.server';
import type { Handle } from '@sveltejs/kit';
import type { User } from '$lib/types/payload-types';

// Handler 1: Clerk Authentication
const handleClerkAuth = withClerkHandler();

// Handler 2: Fetch Payload User Data using createApiClient
const handlePayloadUser: Handle = async ({ event, resolve }) => {
    const clerkAuth = await event.locals.auth(); // Get Clerk auth state

    if (clerkAuth?.userId) {
        try {
            const apiClient = createApiClient(event);

            console.log('Clerk User:', JSON.stringify(clerkAuth, null, 2));

            // Fetch user data from Payload API using a custom Endpoint
            const response = await apiClient.get<User>(
                `/users/user-clerk/${clerkAuth.userId}`
            );

            console.log('Payload User Response:', JSON.stringify(response, null, 2));

            if (response) {
                event.locals.payloadUser = response;
                console.log('Payload User attached to locals via API Client:', event.locals.payloadUser);
            } else {
                console.warn(`Payload user not found via API for Clerk ID: ${clerkAuth.userId}`);
                event.locals.payloadUser = null;
            }
        } catch (error) {
            console.error('Error fetching Payload user via API client in hook:', error);
            event.locals.payloadUser = null;
        }
    } else {
        console.warn(`Clerk user not found via API for Clerk ID: ${clerkAuth?.userId}`);
        event.locals.payloadUser = null;
    }

    return resolve(event);
};

// Combine handlers using sequence
export const handle = sequence(handleClerkAuth, handlePayloadUser);