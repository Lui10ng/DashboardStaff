export const load = async () => {
	return {};
};

export const actions = {
	createPost: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	updatePost: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	uploadPostImage: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	getAwsUploadImage: async () => {}
};
