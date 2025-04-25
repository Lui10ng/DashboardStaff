import type { SeatLayoutData } from '$lib/types/seat-generator';
import { fail, message, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad, Actions } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { ticketSchema } from '$lib/schema/ticket';
import { voucherSchema } from '$lib/schema';
import { createApiClient } from '$lib/services/payload.server';
import type { RequestEvent } from './$types';
import { handleSvelteError } from '$lib/utils/errorHandler';
import { error } from '@sveltejs/kit';
import type { TicketTypesResponse } from '$lib/types/tickets';
import type { PromotionsResponse } from '$lib/types/merchant';

export const load: PageServerLoad = async (event: RequestEvent) => {
	const { params } = event;

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
		sort: 'date',
		depth: '0'
	});

	const paramsVoucher = new URLSearchParams({
		'where[applicableEvents][equals]': params.eventId,
		sort: 'date',
		depth: '0'
	});

	const ticketForm = await superValidate(zod(ticketSchema));
	const voucherForm = await superValidate(zod(voucherSchema));

	try {
		const apiClient = createApiClient(event);
		const response = await apiClient.get<TicketTypesResponse>('/ticket-types', paramsTicket);
		const ticketData = response.docs;

		const responseVoucher = await apiClient.get<PromotionsResponse>('/promotions', paramsVoucher);
		const voucherData = responseVoucher.docs;

		return {
			ticketForm,
			voucherForm,
			ticketData,
			voucherData,
			initialConfig
		};
	} catch (err: unknown) {
		const { statusCode, errorMessage } = handleSvelteError(
			err,
			'Loading Merchant',
			'Failed to Load Merchant'
		);

		throw error(statusCode, errorMessage);
	}
};

export const actions: Actions = {
	createTicket: async (event: RequestEvent) => {
		const { request, params } = event;
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
			const apiClient = createApiClient(event);
			const response = await apiClient.post('/ticket-types', formData);
			console.log('response: ', response);

			return message(form, { success: true, message: 'Ticket created successfully' });
		} catch (err: unknown) {
			const { statusCode, errorMessage } = handleSvelteError(
				err,
				'Creating Ticket',
				'Failed to Create Ticket'
			);

			throw error(statusCode, errorMessage);
		}
	},

	disableTicket: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	updateTicket: async ({ request }) => {
		const data = await request.formData();
		const ticketId = data.get('id');

		console.log('Updating ticket with ID:', ticketId); // Add this log

		const form = await superValidate(data, zod(ticketSchema));

		if (!form.valid) {
			console.log('Form validation failed:', form.errors); // Add this log
			return fail(400, { form });
		}

		try {
			const formData = {
				name: form.data.ticketName,
				price: form.data.price,
				quantityAvailable: form.data.quantity,
				minOrderQuantity: form.data.minOrderQuantity,
				maxOrderQuantity: form.data.maxOrderQuantity,
				salesStart: new Date(`${form.data.validfrom}T00:00:00Z`).toISOString(),
				salesEnd: new Date(`${form.data.validto}T23:59:00Z`).toISOString(),
				color: form.data.color
			};

			console.log('Sending update with data:', formData); // Add this log

			const response = await apiClient.patch(`/ticket-types/${ticketId}`, formData);
			console.log('Update response:', response); // Add this log

			return message(form, {
				success: true,
				message: 'Ticket updated successfully'
			});
		} catch (err) {
			console.error('Error updating ticket:', err);
			// Add more detailed error logging
			if (err instanceof Error) {
				console.error('Error details:', {
					message: err.message,
					stack: err.stack
				});
			}
			return message(form, {
				success: false,
				message: 'Error updating ticket'
			});
		}
	},

	createVoucher: async (event: RequestEvent) => {
		const { request, params } = event;
		const data = await request.formData();
		const eventId = parseInt(params.eventId);

		const form = await superValidate(data, zod(voucherSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = {
			code: form.data.code,
			description: form.data.description,
			status: 'active', // init
			discountType: form.data.discountType,
			discountValue: form.data.discountValue,
			currency: form.data.currency || null,
			usageLimit: form.data.quantity,
			validFrom: new Date(`${form.data.validFrom}T00:00:00Z`).toISOString(),
			validUntil: new Date(`${form.data.validUntil}T23:59:00Z`).toISOString(),
			minimumOrderAmount: form.data.minOrderAmount,
			appliesToAllEvents: false,
			applicableEvents: [eventId]
		};

		try {
			const apiClient = createApiClient(event);
			const response = await apiClient.post('/promotions', formData);
			console.log('response: ', response);

			return message(form, { success: true, message: 'Voucher created successfully' });
		} catch (err) {
			return message(form, { success: false, message: 'Error creating voucher' });
		}
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
};
