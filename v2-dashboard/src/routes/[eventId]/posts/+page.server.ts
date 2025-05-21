import { createApiClient } from '$lib/services/payload.server';
import { handleSvelteError } from '$lib/utils/errorHandler';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { RequestEvent } from '@sveltejs/kit';
import type { PayloadPaginatedResponse } from '$lib/types/payloadResponse';
import type { EventAnnouncement } from '$lib/types/payload-types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { postSchema } from '$lib/schema';
import type { postsData } from '$lib/types';

let postId = 0;
let postData: postsData[] = [];

export const load: PageServerLoad = async (event: RequestEvent) => {
	const {
		url,
		params: { eventId }
	} = event;
	const page = Number(url.searchParams.get('page') || '1');

	const form = await superValidate(zod(postSchema));

	const params = new URLSearchParams({
		'where[event][equals]': eventId!,
		sort: 'order,createdBy',
		limit: '1',
		page: page.toString(),
		depth: '0'
	});

	try {
		const apiClient = createApiClient(event);
		const posts = await apiClient.get<PayloadPaginatedResponse<EventAnnouncement>>(
			'/event-announcements',
			params
		);

		if (posts.docs.length > 0) {
			postId = posts.docs[0].id;
			postData = posts.docs[0].eventAnnouncement;
		}

		return {
			form,
			posts
		};
	} catch (err: unknown) {
		const { statusCode, errorMessage } = handleSvelteError(
			err,
			'Loading Event Announcements',
			'Failed to Load Event Announcements'
		);

		throw error(statusCode, errorMessage);
	}
};

export const actions: Actions = {
	createPost: async (post: RequestEvent) => {
		const {
			request,
			params: { eventId }
		} = post;

		const getEventId = parseInt(eventId!);

		const data = await request.formData();
		const form = await superValidate(data, zod(postSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		//Todo: add image
		const formData = {
			event: getEventId,
			status: 'published',
			eventAnnouncement: [form.data]
		};

		try {
			const apiClient = createApiClient(post);
			const response = await apiClient.post('/event-announcements', formData);
			console.log(response);
			return message(form, { success: true, message: 'Post created successfully!' });
		} catch (err) {
			const { statusCode, errorMessage } = handleSvelteError(
				err,
				'Creating Post',
				'Failed to Create Post'
			);
			console.log('errorMessage: ', errorMessage);
			console.log('statusCode: ', statusCode);
		}
	},

	updatePost: async (post: RequestEvent) => {
		const {
			request,
			params: { eventId }
		} = post;

		const getEventId = parseInt(eventId!);

		const data = await request.formData();
		const form = await superValidate(data, zod(postSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		//Todo: add image
		postData.push({
			title: form.data.title,
			content: form.data.content
		});

		const formData = {
			event: getEventId,
			status: 'published',
			eventAnnouncement: postData
		};

		try {
			const apiClient = createApiClient(post);
			const response = await apiClient.patch(`event-announcements/${postId}`, formData);
			console.log(response);
			return message(form, { success: true, message: 'Post updated successfully' });
		} catch (err) {
			const { statusCode, errorMessage } = handleSvelteError(
				err,
				'Update Post',
				'Failed to Update Post'
			);
			console.log('errorMessage: ', errorMessage);
			console.log('statusCode: ', statusCode);
		}
	},

	uploadPostImage: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	getAwsUploadImage: async () => {}
};
