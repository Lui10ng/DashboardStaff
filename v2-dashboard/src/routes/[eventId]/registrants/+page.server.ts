import { createApiClient } from '$lib/services/payload.server';
import { handleSvelteError } from '$lib/utils/errorHandler';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { RequestEvent } from '@sveltejs/kit';
import type { RegistrantsResponse } from '$lib/types/registrants';

export const load: PageServerLoad = async (event: RequestEvent) => {
	const { url, params } = event;
	const page = Number(url.searchParams.get('page') || '1');

	try {
		const paramRegistrant = new URLSearchParams({
			'where[event][equals]': params.eventId!,
			'select[submittedAnswers]': 'true',
			'select[createdAt]': 'true',
			page: page.toString()
		});

		console.log('paramRegistrant', paramRegistrant);

		const apiClient = createApiClient(event);
		const response = await apiClient.get<RegistrantsResponse>('/registrants', paramRegistrant);

		return {
			registrants: response.docs,
			pagination: {
				totalDocs: response.totalDocs,
				limit: response.limit,
				totalPages: response.totalPages,
				page: response.page,
				pagingCounter: response.pagingCounter,
				hasPrevPage: response.hasPrevPage,
				hasNextPage: response.hasNextPage,
				prevPage: response.prevPage,
				nextPage: response.nextPage
			}
		};
	} catch (err) {
		const { statusCode, errorMessage } = handleSvelteError(
			err,
			'Loading Registrants',
			'Failed to Load Registrants'
		);

		throw error(statusCode, errorMessage);
	}
};
