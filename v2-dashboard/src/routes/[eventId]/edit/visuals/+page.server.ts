import { error, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/services/payload.server';
import type { EventDetailsResponse } from '$lib/types';
import { handleSvelteError } from '$lib/utils/errorHandler';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { themeSchema } from '$lib/schema/index.js';
import { PORT } from '$env/static/private';

export const load: PageServerLoad = async (event: RequestEvent) => {
	const {
		url: eventUrl,
		params: { eventId }
	} = event;

	const params = new URLSearchParams({
		'select[theme]': 'true',
		'select[themeMode]': 'true',
		'select[slug]': 'true'
	});

	try {
		const form = await superValidate(zod(themeSchema));

		const apiClient = createApiClient(event);
		const eventTheme = await apiClient.get<EventDetailsResponse>(`events/${eventId}`, params);

		const { slug } = eventTheme;

		// Determine siteUrl based on environment (local vs production)
		const isLocal = eventUrl.origin.includes('localhost');
		const isStaging = eventUrl.origin.includes('vercel.app');
		const siteUrl = isLocal
			? `http://${slug}.localhost:${PORT}/?`
			: isStaging
				? `https://v2-veent-registration-veent-team.vercel.app/?event=${slug}&`
				: `https://${slug}.veent.co/`;

		return {
			form,
			eventTheme,
			siteUrl
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
			themeMode: modeTheme
		};

		try {
			const apiClient = createApiClient(event);
			const response = await apiClient.patch(`events/${eventId}`, formData);
			return message(form, { success: true, message: 'Theme saved successfully!' });
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
