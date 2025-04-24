import { apiClient } from '$lib/services/payload.server';
import { guestList } from '$lib/stores/data';
import { handleSvelteError } from '$lib/utils/errorHandler';
import { error } from '@sveltejs/kit';

export async function load({ url, params, fetch: svelteKitFetch }) {
	const page = Number(url.searchParams.get('page') || '1');

	try {
		const paramRegistrant = new URLSearchParams({
			'where[event][equals]': params.eventId,
			'select[submittedAnswers]': 'true',
			'select[createdAt]': 'true',
			page: page.toString()
		});

		const response = await apiClient.get('/registrants', paramRegistrant, {
			fetchInstance: svelteKitFetch
		});

		const registrantList = response.docs;

		return {
			registrantList,
			guestList
		};
	} catch (err) {
		const { statusCode, errorMessage } = handleSvelteError(
			err,
			'loading events',
			'Failed to load events'
		);

		throw error(statusCode, errorMessage);
	}
}
