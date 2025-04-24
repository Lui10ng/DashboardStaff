import { apiClient } from '$lib/services/payload.server.js';
import type { LayoutServerLoad } from './$types';
import { PORT } from '$env/static/private';

export const load: LayoutServerLoad = async ({ url, params, fetch: svelteKitFetch }) => {
	const paramsEvent = new URLSearchParams({
		'where[event][equals]': params.eventId,
		'select[title]': 'true',
		'select[slug]': 'true',
		'select[startTime]': 'true',
		'select[endTime]': 'true',
		'select[location]': 'true',
		'select[poster]': 'true'
	});
	try {
		const eventId = params.eventId;

		const response = await apiClient.get(`events/${eventId}`, paramsEvent, {
			fetchInstance: svelteKitFetch
		});

		let siteUrl = 'https://' + response.slug + '.veent.co/';
		if (url.origin.includes('localhost')) {
			siteUrl = 'http://' + response.slug + `.localhost:${PORT}`;
		}

		return {
			eventId,
			siteUrl,
			currentEvent: {
				id: response.id,
				slug: response.slug,
				title: response.title,
				startTime: response.startTime,
				endTime: response.endTime,
				date: new Date(response.startTime).toLocaleDateString('en-US', {
					month: 'long',
					day: 'numeric',
					year: 'numeric'
				}),
				time: `${new Date(response.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${new Date(response.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
				location: response.location,
				url: siteUrl,
				imageUrl:
					response.poster?.url ||
					'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3'
			}
		};
	} catch (error) {
		console.error('Error fetching event data:', error);
		throw error;
	}
};
