import { createApiClient } from '$lib/services/payload.server.js';
import type { LayoutServerLoad } from './$types';
import { PORT } from '$env/static/private';
import type { EventType } from '$lib/types/eventData';
import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { handleSvelteError } from '$lib/utils/errorHandler';

export const load: LayoutServerLoad = async (event: RequestEvent) => {
	try {
		const { url: eventUrl, params } = event;
		const eventId = params.eventId;
		const pathname = eventUrl.pathname;

		const paramsEvent = new URLSearchParams({
			'where[event][equals]': eventId!.toString(),
			'select[title]': 'true',
			'select[slug]': 'true',
			'select[startTime]': 'true',
			'select[endTime]': 'true',
			'select[location]': 'true',
			'select[poster]': 'true'
		});

		const apiClient = createApiClient(event);
		const response = await apiClient.get<EventType>(`events/${eventId}`, paramsEvent);

		const { eventContacts, poster, slug, title, location, startTime, endTime, id } = response;

		const contactDetails = eventContacts;

		// Determine siteUrl based on environment (local vs production)
		const isLocal = eventUrl.origin.includes('localhost');
		const siteUrl = isLocal ? `http://${slug}.localhost:${PORT}` : `https://${slug}.veent.co/`;

		const dateFormatter = new Intl.DateTimeFormat('en-US', {
			weekday: 'short',
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
		const date = dateFormatter.format(new Date(startTime));
		const timeFormatter = new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: '2-digit'
		});
		const formattedStartTime = timeFormatter.format(new Date(startTime));
		const formattedEndTime = timeFormatter.format(new Date(endTime));
		const time = `${formattedStartTime} - ${formattedEndTime}`;

		const url = `https://${slug}.veent.co`;
		const imageUrl =
			poster?.url ||
			'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3';

		return {
			eventId,
			siteUrl,
			pathname,
			currentEvent: {
				id,
				slug,
				title,
				startTime,
				endTime,
				date,
				time,
				location,
				url,
				imageUrl
			}
		};
	} catch (err: unknown) {
		const { statusCode, errorMessage } = handleSvelteError(
			err,
			'Loading Event Details',
			'Failed to Load Event Details'
		);

		throw error(statusCode, errorMessage);
	}
};
