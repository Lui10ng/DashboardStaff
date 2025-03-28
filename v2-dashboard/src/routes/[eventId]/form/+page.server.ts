export const load = async () => {
	return {};
};

export const actions = {
	createForm: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	updateForm: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	}
};
