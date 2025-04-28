import { vouchers } from '$lib/stores/data';
import type { SeatLayoutData } from '$lib/types/seat-generator';
import { fail, message, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad, Actions } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { ticketSchema } from '$lib/schema/ticket';
import { apiClient } from '$lib/services/payload.server';

export const load = (async ({ depends, params, fetch: svelteKitFetch }) => {
	// for invalidation
	depends('dashboard:registrants');

	const form = await superValidate(zod(ticketSchema));

	const initialConfig = {
		ticketQuantity: 0,
		reserveSeatingEnabled: false,
		seatConfig: {
			rows: 0,
			seatsPerRow: 0,
			rowStartChar: 'A',
			seatStartNum: 1,
			rowOrder: 'down' as const,
			seatOrder: 'left' as const,
			rowLabel: 'Show All'
		}
	};

	const paramsTicket = new URLSearchParams({
		'where[event][equals]': params.eventId,
		'select[name]': 'true',
		'select[price]': 'true',
		'select[currency]': 'true',
		'select[quantityAvailable]': 'true',
		'select[minOrderQuantity]': 'true',
		'select[maxOrderQuantity]': 'true',
		'select[salesStart]': 'true',
		'select[salesEnd]': 'true',
		'select[color]': 'true',
		'select[status]': 'true',
		sort: 'date'
	});

	const response = await apiClient.get('/ticket-types', paramsTicket, {
		fetchInstance: svelteKitFetch
	});

	const ticketData = response.docs;

	return {
		form,
		ticketData,
		vouchers,
		initialConfig
	};
}) satisfies PageServerLoad;

export const actions = {
	createTicket: async ({ request, params }) => {
		const data = await request.formData();

		const eventId = parseInt(params.eventId);

		const form = await superValidate(data, zod(ticketSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = {
			event: { id: eventId },
			name: form.data.ticketName,
			price: form.data.price,
			currency: 'PHP',
			quantityAvailable: form.data.quantity,
			minOrderQuantity: form.data.minOrderQuantity,
			maxOrderQuantity: form.data.maxOrderQuantity,
			salesStart: new Date(`${form.data.validfrom}T00:00:00Z`).toISOString(),
			salesEnd: new Date(`${form.data.validto}T23:59:00Z`).toISOString(),
			color: form.data.color
		};

		try {
			const response = await apiClient.post('/ticket-types', formData);
			console.log('response: ', response);

			return message(form, { success: true, message: 'Ticket created successfully' });
		} catch (err) {
			return message(form, { success: false, message: 'Error creating ticket' });
		}
	},

	disableTicket: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	updateTicket: async ({ request }) => {
		const data = await request.formData();

		const form = await superValidate(data, zod(ticketSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		console.log(form.data);
	},

	createVoucher: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	updateVoucher: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	saveLayout: async ({ request }) => {
		try {
			const formData = await request.formData();
			const layoutDataJson = formData.get('layoutData');

			if (!layoutDataJson || typeof layoutDataJson !== 'string') {
				return { success: false, error: 'Invalid layout data' };
			}

			JSON.parse(layoutDataJson) as SeatLayoutData;

			return {
				success: true,
				message: 'Layout saved successfully'
			};
		} catch (err) {
			console.error('Error saving layout:', err);
			return {
				success: false,
				error: err instanceof Error ? err.message : 'Unknown error'
			};
		}
	},

	loadLayout: async ({ request }) => {
		try {
			const formData = await request.formData();
			const layoutId = formData.get('layoutId');

			if (!layoutId) {
				return { success: false, error: 'No layout ID provided' };
			}

			return {
				success: true,
				message: 'Layout loaded successfully'
			};
		} catch (err) {
			console.error('Error loading layout:', err);
			return {
				success: false,
				error: err instanceof Error ? err.message : 'Unknown error'
			};
		}
	}
} satisfies Actions;
