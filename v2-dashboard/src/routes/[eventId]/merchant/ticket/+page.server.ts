import type { PageServerLoad, Actions } from './$types';
import type { SeatLayoutData } from '$lib/types/seat-generator';
import type { RequestEvent } from '@sveltejs/kit';
import { handleSvelteError } from '$lib/utils/errorHandler';
import { error, fail } from '@sveltejs/kit';
import { createApiClient } from '$lib/services/payload.server';
import { seatLayoutDataSchema, seatMapSchema } from '$lib/schema/seat-map';
import { ZodError } from 'zod';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { ticketSchema } from '$lib/schema/ticket';
import { voucherSchema } from '$lib/schema/voucher';
import { message } from 'sveltekit-superforms/server';
import type { TicketType, Promotion, SeatMap, Event } from '$lib/types/payload-types';
import type { PayloadPaginatedResponse } from '$lib/types/payloadResponse';
import { ticketTypeSchema } from '$lib/schema';

// Helper for API response type guard
function isApiResponseWithDoc(obj: unknown): obj is { doc: { id: number } } {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'doc' in obj &&
		typeof (obj as any).doc === 'object' &&
		(obj as any).doc !== null &&
		'id' in (obj as any).doc
	);
}

export const load: PageServerLoad = async (event: RequestEvent) => {
	const {
		params: { eventId }
	} = event;
	const apiClient = createApiClient(event);

	// Ensure eventId is always a string
	const eventIdStr = eventId ?? '';

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
		'where[event][equals]': eventIdStr,
		sort: 'date',
		depth: '0'
	});

	const paramsVoucher = new URLSearchParams({
		'where[event][contains]': eventIdStr,
		sort: 'date',
		depth: '0'
	});

	const ticketForm = await superValidate(zod(ticketSchema));
	const voucherForm = await superValidate(zod(voucherSchema));

	try {
		// Initialize the form with default values
		const form = await superValidate(event, zod(ticketSchema));

		// Set default values
		form.data = {
			event: eventId ? parseInt(eventId, 10) : 0,
			name: '',
			description: '',
			price: 0,
			currency: 'PHP',
			status: 'active',
			quantityAvailable: 0,
			minOrderQuantity: 1,
			maxOrderQuantity: 1,
			salesStart: new Date().toISOString().split('T')[0],
			salesEnd: new Date().toISOString().split('T')[0],
			color: '#0FBA81'
		};

		// Fetch existing tickets
		const ticketResponse = await apiClient.get<PayloadPaginatedResponse<TicketType>>('/ticket-types', paramsTicket);

		// Fetch existing vouchers
		const voucherResponse = await apiClient.get<PayloadPaginatedResponse<Promotion>>('/promotions', paramsVoucher);

		return {
			form,
			voucherForm,
			ticketData: ticketResponse?.docs || [],
			voucherData: voucherResponse?.docs || [],
			eventId
		};
	} catch (err) {
		console.error('Error loading data:', err);
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
		const {
			request,
			params: { eventId }
		} = event;

		if (!eventId || typeof eventId !== 'string') {
			return fail(400, { error: 'Event ID is required' });
		}

		const formData = await request.formData();
		const form = await superValidate(formData, zod(ticketSchema));

		if (!form.valid) {
			console.error('[DEBUG] Form validation failed:', form.errors);
			return fail(400, { form });
		}

		const apiClient = createApiClient(event);

		// Step 1: Create the seat map first if we have seat map data
		let seatMapId: number | null = null;
		let totalSeats: number = 0; // Declare totalSeats at this scope
		const seatMapStore = formData.get('seatMapStore');

		if (seatMapStore && typeof seatMapStore === 'string') {
			try {
				console.log('[DEBUG] Creating seat map...');
				const seatMapData = JSON.parse(seatMapStore);

				// Calculate total seats from the configuration
				totalSeats =
					(seatMapData.config?.seatConfig?.rows || 0) *
					(seatMapData.config?.seatConfig?.seatsPerRow || 0);

				// Ensure ticket quantity matches total seats
				const seatMapPayload = {
					...seatMapData,
					config: {
						...seatMapData.config,
						ticketQuantity: totalSeats // Use total seats as ticket quantity
					},
					event: parseInt(eventId, 10)
				};

				console.log('[DEBUG] Sending seat map payload:', seatMapPayload);

				// Create the seat map
				const seatMapResponse = await apiClient.post('/seat-maps', seatMapPayload);
				if (isApiResponseWithDoc(seatMapResponse as unknown)) {
					seatMapId = (seatMapResponse as any).doc.id;
					console.log('[DEBUG] Created seat map with ID:', seatMapId);
				} else {
					console.error('[DEBUG] Failed to create seat map: Invalid response', seatMapResponse);
					throw new Error('Failed to create seat map: Invalid response');
				}
			} catch (seatMapError) {
				console.error('[DEBUG] Error creating seat map:', seatMapError);
				return fail(400, {
					form,
					error:
						seatMapError instanceof Error ? seatMapError.message : 'Failed to create seat map'
				});
			}
		}

		// Step 2: Create the ticket with the seat map reference
		const ticketData = {
			event: parseInt(eventId, 10),
			name: form.data.name,
			description: form.data.description || '',
			price: form.data.price,
			currency: form.data.currency,
			status: form.data.status || 'active',
			quantityAvailable: form.data.quantityAvailable,
			minOrderQuantity: form.data.minOrderQuantity,
			maxOrderQuantity: form.data.maxOrderQuantity,
			salesStart: form.data.salesStart,
			salesEnd: form.data.salesEnd,
			color: form.data.color,
			seatMap: form.data.seatMap
		};

		console.log('[DEBUG] Creating ticket with data:', ticketData);
		const ticketResponse = await apiClient.post('/ticket-types', ticketData);
		if (isApiResponseWithDoc(ticketResponse as unknown)) {
			// Step 3: Update the seat map with the ticket reference if needed
			if (seatMapId) {
				try {
					await apiClient.patch(`/seat-maps/${seatMapId}`, {
						ticketType: (ticketResponse as any).doc.id
					});
					console.log('[DEBUG] Updated seat map with ticket reference');
				} catch (updateError) {
					console.error('[DEBUG] Failed to update seat map with ticket reference:', updateError);
					// Continue since this is not critical
				}
			}

			return {
				form,
				success: true,
				message: 'Ticket created successfully' + (seatMapId ? ' with seat map' : ''),
				ticketId: (ticketResponse as any).doc.id,
				seatMapId
			};
		} else {
			console.error('[DEBUG] Invalid ticket response:', ticketResponse);
			throw new Error('Failed to create ticket type: Invalid response format');
		}
	},

	updateTicket: async (event: RequestEvent) => {
		const { request } = event;
		const data = await request.formData();
		const ticketId = data.get('id');

		console.log('Updating ticket with ID:', ticketId);

		const form = await superValidate(data, zod(ticketSchema));

		if (!form.valid) {
			console.log('Form validation failed:', form.errors);
			return fail(400, { form });
		}

		try {
			// Parse and validate dates
			const validFrom = form.data.validfrom ? new Date(form.data.validfrom + 'T00:00:00Z') : null;
			const validTo = form.data.validto ? new Date(form.data.validto + 'T00:00:00Z') : null;

			// Validate dates
			if (!validFrom || isNaN(validFrom.getTime()) || !validTo || isNaN(validTo.getTime())) {
				console.error('Invalid date values:', { validFrom, validTo });
				return message(form, {
					success: false,
					message: 'Invalid date format'
				});
			}

			const formData = {
				name: form.data.name,
				price: form.data.price,
				quantityAvailable: form.data.quantityAvailable,
				minOrderQuantity: form.data.minOrderQuantity,
				maxOrderQuantity: form.data.maxOrderQuantity,
				salesStart: validFrom.toISOString(),
				salesEnd: validTo.toISOString(),
				color: form.data.color,
				status: form.data.status
			};

			console.log('Sending update with data:', formData);

			const apiClient = createApiClient(event);
			const response = await apiClient.patch(`/ticket-types/${ticketId}`, formData);
			console.log('Update response:', response);

			return message(form, {
				success: true,
				message: 'Ticket updated successfully'
			});
		} catch (err) {
			console.error('Error updating ticket:', err);
			if (err instanceof Error) {
				console.error('Error details:', {
					message: err.message,
					stack: err.stack
				});
			}
			return message(form, {
				success: false,
				message: 'Failed to update ticket'
			});
		}
	},

	createVoucher: async (event: RequestEvent) => {
		const {
			request,
			params: { eventId }
		} = event;

		const data = await request.formData();
		const form = await superValidate(data, zod(voucherSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = {
			event: parseInt(eventId),
			code: form.data.code,
			description: form.data.description,
			status: 'active', // init
			discountType: form.data.discountType,
			discountValue: form.data.discountValue,
			currency: form.data.currency || null,
			usageLimit: form.data.quantity,
			validFrom: new Date(`${form.data.validFrom}T00:00:00Z`).toISOString(),
			validUntil: new Date(`${form.data.validUntil}T00:00:00Z`).toISOString(),
			minimumOrderAmount: form.data.minOrderAmount,
			appliesToAllEvents: false
		};

		try {
			const apiClient = createApiClient(event);
			const response = await apiClient.post('collections/promotions', formData);
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

	saveLayout: async (event: RequestEvent) => {
		console.log('Starting saveLayout action');
		try {
			const { request, params } = event;
			const formData = await request.formData();
			const layoutDataJson = formData.get('layoutData');
			const eventId = params.eventId;

			if (!eventId) {
				return fail(400, { success: false, error: 'Event ID is required' });
			}

			if (!layoutDataJson || typeof layoutDataJson !== 'string') {
				console.error('Invalid layout data:', layoutDataJson);
				return fail(400, { success: false, error: 'Invalid layout data' });
			}

			// Parse and validate the layout data
			let layoutData;
			try {
				layoutData = JSON.parse(layoutDataJson);
				console.log('Layout data parsed successfully:', layoutData);
			} catch (error) {
				console.error('JSON parsing error:', error);
				return fail(400, {
					success: false,
					error: 'Invalid JSON format in layout data'
				});
			}

			try {
				layoutData = seatLayoutDataSchema.parse(layoutData);
				console.log('Layout data validated successfully');
			} catch (error) {
				console.error('Validation error:', error);
				if (error instanceof ZodError) {
					return fail(400, {
						success: false,
						error: `Validation error: ${error.errors.map((e) => e.message).join(', ')}`
					});
				}
				return fail(400, {
					success: false,
					error: error instanceof Error ? error.message : 'Invalid layout data format'
				});
			}

			// Format data for SeatMaps collection
			console.log('Formatting data for SeatMaps collection...');
			const seatMapData = {
				name: layoutData.name,
				config: layoutData.config,
				seats: layoutData.seats,
				customSeatNames: layoutData.customSeatNames || null,
				summary: layoutData.summary,
				event: eventId // Direct ID reference, not a relationship object
			};

			try {
				const apiClient = createApiClient(event);
				console.log('Making API request to save seat map...');

				// First get the event to check if it has a seat map
				type EventResponse = { seatMap?: string | { id: string } };
				const eventResponse = await apiClient.get<EventResponse>(`/events/${eventId}`);
				console.log('Event response:', eventResponse);

				// Remove the seat map creation logic from here since it should happen during ticket creation
				return {
					success: true,
					message: 'Layout configuration saved to store'
				};
			} catch (apiError) {
				console.error('API error:', apiError);
				return fail(500, {
					success: false,
					error: apiError instanceof Error ? apiError.message : String(apiError)
				});
			}
		} catch (err) {
			console.error('Error in saveLayout:', err);
			return fail(500, {
				success: false,
				error: err instanceof Error ? err.message : 'Unknown error'
			});
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
