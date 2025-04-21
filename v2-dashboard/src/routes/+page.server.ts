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

		const form = await superValidate(data, zod(eventSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = {
			title: form.data.event,
			slug: form.data.subdomain,
			location: form.data.location,
			status: 'Published',
			startTime: new Date(`${form.data.startDate}T${form.data.startTime}:00Z`).toISOString(),
			endTime: new Date(`${form.data.endDate}T${form.data.endTime}:00Z`).toISOString(),
			// description: form.data.richText, // use lexical richtext
			organizer: { id: 1 },
			venue: { id: 1 },
			seatingType: 'general_admission'
		};

		try {
			const response = await apiClient.post('/events', formData);
			console.log('response: ', response);

			return message(form, { success: true, message: 'Event created successfully' });
		} catch (err: unknown) {
			const { statusCode, errorMessage } = handleSvelteError(
				err,
				'creating event',
				'Failed to create event'
			);
		}
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
	},
	updateEventDetails: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},
	updateVisuals: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	updateRegistrationInstruction: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	}
};
