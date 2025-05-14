import { createApiClient } from '$lib/services/payload.server';
import type { PageServerLoad } from './$types';
import type { RequestEvent } from '@sveltejs/kit';
import { handleSvelteError } from '$lib/utils/errorHandler';
import { error } from '@sveltejs/kit';
import type { EventDetailsResponse } from '$lib/types/eventData';

export const load: PageServerLoad = async (event: RequestEvent) => {
	const {
		params: { eventId }
	} = event;

	const params = new URLSearchParams({
		'select[title]': 'true',
		'select[slug]': 'true',
		'select[location]': 'true'
	});

	try {
		const apiClient = createApiClient(event);
		const eventDetails = await apiClient.get<EventDetailsResponse>(`events/${eventId}`, params);

		return {
			eventDetails
		};
	} catch (err: unknown) {
		const { statusCode, errorMessage } = handleSvelteError(
			err,
			'Loading Event Details (Edit Event)',
			'Failed to Load Event Details (Edit Event)'
		);

		throw error(statusCode, errorMessage);
	}
};
