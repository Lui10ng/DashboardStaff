import { message, superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { eventSchema } from '$lib/schema/event';
import { fail } from 'sveltekit-superforms';
import { apiClient } from '$lib/services/payload.server.js';
import { error } from '@sveltejs/kit';
import { handleSvelteError } from '$lib/utils/errorHandler';

export async function load({ url, fetch: svelteKitFetch }) {
	const form = await superValidate(zod(eventSchema));
	const page = Number(url.searchParams.get('page') || '1');
	const limit = 1000000;
	const organizerID = '1';

	const params = new URLSearchParams({
		'where[organizer.id][equals]': organizerID,
		sort: 'date',
		limit: limit.toString(),
		page: page.toString(),
		depth: '2'
	});

	try {
		const eventsData = await apiClient.get('/events', params, { fetchInstance: svelteKitFetch });

		// console.log(eventsData);
		console.log(JSON.stringify(eventsData, null, 2));

		return {
			events: eventsData.docs,
			form
		};
	} catch (err: unknown) {
		const { statusCode, errorMessage } = handleSvelteError(
			err,
			'loading events',
			'Failed to load events'
		);

		throw error(statusCode, errorMessage);
	}
}

export const actions = {
	checkAvailableSubdomain: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	createEvent: async ({ request }) => {
		const data = await request.formData();

		console.log('data: ', data);

		const form = await superValidate(data, zod(eventSchema));

		if (!form.valid) {
			return fail(400, { form });
		}
		console.log(form);
	},

	updateEvent: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	uploadAwsLogo: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	uploadAwsBackgroundImage: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	uploadAwsPoster: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	}
};
