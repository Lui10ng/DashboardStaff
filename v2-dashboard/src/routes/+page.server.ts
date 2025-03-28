import { eventList } from '$lib/stores/data';

export const load = async () => {
	return {
		eventList
	};
};

export const actions = {
	checkAvailableSubdomain: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	createEvent: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
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
	}
};
