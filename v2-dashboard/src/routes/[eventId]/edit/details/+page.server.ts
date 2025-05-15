import { createApiClient } from '$lib/services/payload.server';
import type { PageServerLoad } from './$types';
import type { RequestEvent } from '@sveltejs/kit';
import { handleSvelteError } from '$lib/utils/errorHandler';
import { error, fail } from '@sveltejs/kit';
import type { EventDetailsResponse } from '$lib/types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { eventSchema } from '$lib/schema/index';

export const load: PageServerLoad = async (event: RequestEvent) => {
	const {
		params: { eventId }
	} = event;

	const params = new URLSearchParams({
		'select[title]': 'true',
		'select[slug]': 'true',
		'select[location]': 'true',
		'select[startTime]': 'true',
		'select[endTime]': 'true',
		'select[description]': 'true'
	});

	try {
		const apiClient = createApiClient(event);
		const form = await superValidate(zod(eventSchema));

		const eventDetails = await apiClient.get<EventDetailsResponse>(`events/${eventId}`, params);

		return {
			eventDetails,
			form
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

export const actions = {
	updateEventDetails: async (event: RequestEvent) => {
		const {
			request,
			params: { eventId }
		} = event;

		// 1. receive form data
		const formData = await request.formData();

		// 2. Validate the form data against schema
		const form = await superValidate(formData, zod(eventSchema));

		// 3. Check if validation passed
		if (!form.valid) {
			// Return the form with validation errors
			return fail(400, { form });
		}

		const { startDate, endDate, startTime, endTime, location, title, subdomain, description } =
			form.data;

		console.log('Form values:', {
			startTime: new Date(`${startDate}T${startTime}:00+08:00`).toISOString(),
			endTime: new Date(`${endDate}T${endTime}:00+08:00`).toISOString()
		});

		// Prepare data for Payload CMS
		const updateData = {
			title,
			subdomain,
			location,
			description,
			startTime: new Date(`${startDate}T${startTime}:00+08:00`).toISOString(),
			endTime: new Date(`${endDate}T${endTime}:00+08:00`).toISOString()
		};

		try {
			const apiClient = createApiClient(event);
			await apiClient.patch(`events/${eventId}`, updateData);

			return message(form, { success: true, message: 'Event updated successfully!' });
		} catch (err: unknown) {
			// Handle errors
			const { statusCode, errorMessage } = handleSvelteError(
				err,
				'Updating Event Details',
				'Failed to update event details'
			);

			// Return a fail response with the form and error message
			return fail(statusCode, {
				form,
				success: false,
				message: errorMessage
			});
		}
	}
};
