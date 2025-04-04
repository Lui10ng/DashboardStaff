import type { PageServerLoad, Actions } from './$types';
import type { SeatLayoutData } from '$lib/types/seat-generator';

export const load = (async ({ depends }) => {
	// for invalidation
	depends('dashboard:registrants');

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
}) satisfies PageServerLoad;

export const actions = {
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
