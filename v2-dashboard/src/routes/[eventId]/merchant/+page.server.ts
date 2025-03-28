import { tickets, vouchers } from '$lib/stores/data';

export const load = async () => {
	return {
		tickets,
		vouchers
	};
};

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
	}
};
