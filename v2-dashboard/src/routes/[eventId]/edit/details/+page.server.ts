import { apiClient } from '$lib/services/payload.server';

export const load = async ({ url, params, fetch: svelteKitFetch }) => {
	const paramContacts = new URLSearchParams({
		'where[event][equals]': params.eventId,
		'select[title]': 'true',
		'select[slug]': 'true',
		'select[location]': 'true'
	});

	try {
		const eventId = params.eventId;

		const eventDetails = await apiClient.get(`events/${eventId}`, paramContacts, {
			fetchInstance: svelteKitFetch
		});

		return {
			eventDetails
		};
	} catch (err) {}
};
