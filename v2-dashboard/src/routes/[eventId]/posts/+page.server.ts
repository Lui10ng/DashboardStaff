import { createApiClient } from '$lib/services/payload.server';
import { handleSvelteError } from '$lib/utils/errorHandler';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { RequestEvent } from '@sveltejs/kit';
import type { PayloadPaginatedResponse } from '$lib/types/payloadResponse';
import type { EventAnnouncement } from '$lib/types/payload-types';

export const load: PageServerLoad = async (event: RequestEvent) => {
	const { url } = event;
	const page = Number(url.searchParams.get('page') || '1');
	const limit = 1000000;
	const organizerID = '1';

	const params = new URLSearchParams({
		'where[event.id][equals]': organizerID,
		sort: 'order,createdBy',
		limit: limit.toString(),
		page: page.toString(),
		depth: '0'
	});

	try {
		const apiClient = createApiClient(event);
		const posts = await apiClient.get<PayloadPaginatedResponse<EventAnnouncement>>('/event-announcements', params);

		return {
			posts
		};
	} catch (err: unknown) {
		const { statusCode, errorMessage } = handleSvelteError(
			err,
			'Loading Event Announcements',
			'Failed to Load Event Announcements'
		);

		throw error(statusCode, errorMessage);
	}
};

export const actions: Actions = {
	createPost: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	updatePost: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	uploadPostImage: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	getAwsUploadImage: async () => {}
};
