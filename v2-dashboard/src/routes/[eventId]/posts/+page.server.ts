import { apiClient } from "$lib/services/payload.server";

export async function load({ url, fetch: svelteKitFetch }) {
	const page = Number(url.searchParams.get('page') || '1');
	const limit = 1000000;
	const organizerID = '1';

	const params = new URLSearchParams({
		'where[event.id][equals]': organizerID,
		sort: 'order,createdBy',
		limit: limit.toString(),
		page: page.toString(),
		depth: '0',
	});
	const posts = await apiClient.get('/event-announcements', params, { fetchInstance: svelteKitFetch });
	
	// console.log("posts",posts);
	
	return {posts};
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
