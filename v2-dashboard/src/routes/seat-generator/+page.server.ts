import type { PageServerLoad, Actions } from './$types';
import type { SeatLayoutData } from '$lib/types/seat-generator';
import type { RequestEvent } from '@sveltejs/kit';
import { handleSvelteError } from '$lib/utils/errorHandler';
import { error, fail } from '@sveltejs/kit';
import { createApiClient } from '$lib/services/payload.server';

interface SeatMapResponse {
	id: string;
	name: string;
	config: {
		ticketQuantity: number;
		seatConfig: {
			rows: number;
			seatsPerRow: number;
			rowStartChar: string;
			seatStartNum: number;
			rowOrder: 'down' | 'up';
			seatOrder: 'left' | 'right';
			rowLabel: string;
		};
	};
	seats: Record<string, any>;
	customSeatNames?: Record<string, string>;
	summary: {
		totalSeats: number;
		availableSeats: number;
		unavailableSeats: number;
		soldSeats: number;
	};
}

export const load: PageServerLoad = async (event: RequestEvent) => {
	const { params: { eventId } } = event;

	try {
		const apiClient = createApiClient(event);
		// TODO: Fetch seat generator data from API
		// const params = new URLSearchParams({
		// 	'where[event][equals]': event.params.eventId!,
		// });
		// const response = await apiClient.get('/seat-generator', params);
		// const seatGeneratorData = response.data;
		// return { seatGeneratorData };

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

		return {
			initialConfig
		};
	} catch (err) {
		const { statusCode, errorMessage } = handleSvelteError(
			err,
			'Loading Seat Generator',
			'Failed to Load Seat Generator'
		);

		throw error(statusCode, errorMessage);
	}
};

export const actions: Actions = {
	saveLayout: async (event: RequestEvent) => {
		const { request } = event;
		try {
			const apiClient = createApiClient(event);

			const formData = await request.formData();
			const layoutDataJson = formData.get('layoutData');

			if (!layoutDataJson || typeof layoutDataJson !== 'string') {
				return fail(400, { 
					success: false, 
					error: 'Invalid layout data' 
				});
			}

			const layoutData = JSON.parse(layoutDataJson);

			// Validate the layout data
			if (!layoutData.config?.ticketQuantity || !layoutData.config?.seatConfig || !layoutData.seats) {
				return fail(400, { 
					success: false, 
					error: 'Missing required layout data' 
				});
			}

			// Create the seat map in Payload CMS
			const response = await apiClient.post<SeatMapResponse>('/seat-maps', {
				name: layoutData.name,
				config: layoutData.config,
				seats: layoutData.seats,
				customSeatNames: layoutData.customSeatNames || null,
				summary: layoutData.summary
			});

			if (!response || !response.id) {
				return fail(500, { 
					success: false, 
					error: 'Failed to save seat map' 
				});
			}

			return {
				success: true,
				message: 'Layout saved successfully',
				seatMapId: response.id
			};
		} catch (err) {
			console.error('Error saving layout:', err);
			const { statusCode, errorMessage } = handleSvelteError(
				err,
				'Saving Seat Layout',
				'Failed to save seat layout'
			);

			return fail(statusCode, { 
				success: false, 
				error: errorMessage 
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
