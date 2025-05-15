import { error, fail } from '@sveltejs/kit';
import type { ServerLoadEvent, RequestEvent } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { eventSchema } from '$lib/schema/index';
import { createApiClient } from '$lib/services/payload.server';
import { handleSvelteError } from '$lib/utils/errorHandler';
import type { PayloadPaginatedResponse } from '$lib/types/payloadResponse';
import type { Event } from '$lib/types/eventData';
import type { Actions } from './$types';

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

export const actions: Actions = {
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

		// Get the date and time values
		const startDate = form.data.startDate;
		const startTime = form.data.startTime;
		const endDate = form.data.endDate;
		const endTime = form.data.endTime;

		const formData = {
			user: userId,
			title: form.data.title,
			slug: form.data.subdomain.toLowerCase(),
			location: form.data.location,
			status: 'Published',
			startTime: new Date(`${startDate}T${startTime}:00+08:00`).toISOString(),
			endTime: new Date(`${endDate}T${endTime}:00+08:00`).toISOString(),
			description: form.data.description,
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
	},

	saveSeatMap: async ({ request, locals }) => {
		try {
			const formData = await request.formData();

			// Basic info
			const name = formData.get('name') as string;

			// Config
			const ticketQuantity = parseInt(formData.get('ticketQuantity') as string);
			const rows = parseInt(formData.get('rows') as string);
			const seatsPerRow = parseInt(formData.get('seatsPerRow') as string);
			const rowStartChar = formData.get('rowStartChar') as string;
			const seatStartNum = parseInt(formData.get('seatStartNum') as string);
			const rowOrder = formData.get('rowOrder') as 'down' | 'up';
			const seatOrder = formData.get('seatOrder') as 'left' | 'right';
			const rowLabel = formData.get('rowLabel') as string;

			// Seats and custom names
			const seats = JSON.parse(formData.get('seats') as string);
			const customSeatNames = formData.get('customSeatNames')
				? JSON.parse(formData.get('customSeatNames') as string)
				: null;

			// Venue image
			const venueImage = formData.get('venueImage') as string | null;

			// Summary
			const totalSeats = parseInt(formData.get('totalSeats') as string);
			const availableSeats = parseInt(formData.get('availableSeats') as string);
			const unavailableSeats = parseInt(formData.get('unavailableSeats') as string);
			const soldSeats = parseInt(formData.get('soldSeats') as string);

			// Validate required fields
			if (
				!name ||
				!ticketQuantity ||
				!rows ||
				!seatsPerRow ||
				!rowStartChar ||
				!seatStartNum ||
				!rowOrder ||
				!seatOrder ||
				!rowLabel ||
				!seats ||
				!totalSeats ||
				typeof availableSeats !== 'number' ||
				typeof unavailableSeats !== 'number' ||
				typeof soldSeats !== 'number'
			) {
				return fail(400, {
					error: 'Missing required fields',
					success: false
				});
			}

			// Create the seat map payload
			const seatMapData = {
				name,
				config: {
					ticketQuantity,
					seatConfig: {
						rows,
						seatsPerRow,
						rowStartChar,
						seatStartNum,
						rowOrder,
						seatOrder,
						rowLabel
					}
				},
				seats,
				...(customSeatNames && { customSeatNames }),
				...(venueImage && { venueImage }),
				summary: {
					totalSeats,
					availableSeats,
					unavailableSeats,
					soldSeats
				}
			};

			const apiClient = createApiClient({ locals } as any);
			const response = await apiClient.post('/seat-maps', seatMapData);

			if (!response) {
				return fail(500, {
					error: 'Failed to save seat map',
					success: false
				});
			}

			return {
				success: true,
				seatMapId: response.id
			};
		} catch (error) {
			console.error('Error saving seat map:', error);
			return fail(500, {
				error: 'Internal server error',
				success: false
			});
		}
	}
};
