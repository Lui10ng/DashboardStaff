import { error, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/services/payload.server';
import type { EventDetailsResponse } from '$lib/types/eventData';
import { handleSvelteError } from '$lib/utils/errorHandler';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { themeSchema } from '$lib/schema/index.js';

export const load: PageServerLoad = async (event: RequestEvent) => {
	const {
		params: { eventId }
	} = event;

	const params = new URLSearchParams({
		'select[theme]': 'true',
		'select[light]': 'true'
	});

	try {
		const form = await superValidate(zod(themeSchema));

		const apiClient = createApiClient(event);
		const eventTheme = await apiClient.get<EventDetailsResponse>(`events/${eventId}`, params);

		return {
			form,
			eventTheme
		};
	} catch (err: unknown) {
		const { statusCode, errorMessage } = handleSvelteError(
			err,
			'Loading Event theme',
			'Failed to Load Event theme'
		);

		throw error(statusCode, errorMessage);
	}
};

export const actions = {
	saveTheme: async (event: RequestEvent) => {
		const {
			request,
			params: { eventId }
		} = event;

		const data = await request.formData();

		const form = await superValidate(data, zod(themeSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { theme, modeTheme } = form.data;

		const formData = {
			theme: theme,
			light: modeTheme
		};

		try {
			const apiClient = createApiClient(event);
			const response = await apiClient.patch(`events/${eventId}`, formData);
			return message(form, { success: true, message: 'Theme saved successfully' });
		} catch (err: unknown) {
			const { statusCode, errorMessage } = handleSvelteError(
				err,
				'Updating event theme',
				'Failed to update event theme'
			);

			throw error(statusCode, errorMessage);
		}
	}
};
