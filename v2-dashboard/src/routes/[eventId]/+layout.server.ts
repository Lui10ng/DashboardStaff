import { apiClient } from '$lib/services/payload.server.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, fetch: svelteKitFetch }) => {
	try {
		const eventId = params.eventId;
		console.log('Fetching event data for:', eventId);

		const response = await apiClient.get(`events/${eventId}`, undefined, { fetchInstance: svelteKitFetch });
		console.log('Event data response:', response);

		return {
			currentEvent: {
				id: response.id,
				title: response.title,
				date: new Date(response.startTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
				time: `${new Date(response.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${new Date(response.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
				location: response.location,
				url: `https://${response.slug}.veent.co`,
				imageUrl: response.poster?.url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3'
			}
		};
	} catch (error) {
		console.error('Error fetching event data:', error);
		throw error;
	}
};
