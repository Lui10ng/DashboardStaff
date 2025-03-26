import { eventList } from '$lib/stores/data';

export const load = async () => {
	return {
		eventList
	};
};

export const actions = {
	createEvent: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	}
};
