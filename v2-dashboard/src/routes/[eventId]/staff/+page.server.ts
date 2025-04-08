export const load = async () => {
	return {};
};

export const actions = {
	inviteStaff: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	disableStaff: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	}
};
