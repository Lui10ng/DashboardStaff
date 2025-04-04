import { tickets, vouchers } from '$lib/stores/data';
import type { SeatLayoutData } from '$lib/types/seat-generator';
import type { PageServerLoad, Actions } from './$types';

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
		tickets,
		vouchers,
		initialConfig
	};
}) satisfies PageServerLoad;

export const actions = {
	createTicket: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	disableTicket: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	updateTicket: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
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
