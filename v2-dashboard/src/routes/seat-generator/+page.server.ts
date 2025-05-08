import type { PageServerLoad, Actions } from './$types';
import type { SeatLayoutData } from '$lib/types/seat-generator';
import type { RequestEvent } from '@sveltejs/kit';
import { handleSvelteError } from '$lib/utils/errorHandler';
import { error, fail } from '@sveltejs/kit';
import { createApiClient } from '$lib/services/payload.server';

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
				return { success: false, error: 'Invalid layout data' };
			}

			JSON.parse(layoutDataJson) as SeatLayoutData;

			// TODO: Save seat generator layout
			// await apiClient.post('/seat-generator', { layoutData: layoutDataJson });

			return {
				success: true,
				message: 'Layout saved successfully'
			};
		} catch (err) {
			const { statusCode, errorMessage } = handleSvelteError(
				err,
				'Saving Seat Layout',
				'Failed to save seat layout'
			);

			return fail(statusCode, { error: errorMessage });
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
