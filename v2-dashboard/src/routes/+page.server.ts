import { error, fail, redirect } from '@sveltejs/kit';
import type { ServerLoadEvent, RequestEvent } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { eventSchema } from '$lib/schema';
import { createApiClient } from '$lib/services/payload.server';
import { handleSvelteError } from '$lib/utils/errorHandler';
import type { PayloadPaginatedResponse } from '$lib/types/payloadResponse';
import type { Event } from '$lib/types/eventData';

export async function load(event: ServerLoadEvent) {
	const authObject = await event.locals.auth();
	const userId = event.locals?.payloadUser?.id;
	
	if (!authObject || !authObject.sessionId) {
		return { requiresRedirect: true, redirectTo: '/sign-in' };
	}

	const apiClient = createApiClient(event);

	const form = await superValidate(zod(eventSchema));
	const page = Number(event.url.searchParams.get('page') || '1');
	const limit = 1000000;

	const params = new URLSearchParams({
		'where[user][equals]': `${userId}`,
		sort: 'date',
		limit: limit.toString(),
		page: page.toString(),
		depth: '2'
	});

	try {
		const eventsData = await apiClient.get<PayloadPaginatedResponse<Event>>('/events', params);

		return {
			events: eventsData.docs,
			form
		};
	} catch (err: unknown) {
		const { statusCode, errorMessage } = handleSvelteError(
			err,
			'Loading Events List',
			'Failed to Load Events List'
		);

		throw error(statusCode, errorMessage);
	}
}

export const actions = {
	checkAvailableSubdomain: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	createEvent: async (event: RequestEvent) => {
		const { request } = event;
		const data = await request.formData();
		const userId = event.locals?.payloadUser?.id;

		const form = await superValidate(data, zod(eventSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = {
			user: userId,
			title: form.data.event,
			slug: form.data.subdomain.toLowerCase(),
			location: form.data.location,
			status: 'Published',
			startTime: new Date(`${form.data.startDate}T${form.data.startTime}:00Z`).toISOString(),
			endTime: new Date(`${form.data.endDate}T${form.data.endTime}:00Z`).toISOString(),
			// description: form.data.richText, // use lexical richtext
			venue: { id: 1 },
			seatingType: 'general_admission'
		};

		try {
			const apiClient = createApiClient(event);
			const response = await apiClient.post('/events', formData);
			console.log('response: ', response);

			return message(form, { success: true, message: 'Event created successfully' });
		} catch (err: unknown) {
			const { statusCode, errorMessage } = handleSvelteError(
				err,
				'Creating Event',
				'Failed to Create Event'
			);
			console.log('errorMessage: ', errorMessage);
			console.log('statusCode: ', statusCode);
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
