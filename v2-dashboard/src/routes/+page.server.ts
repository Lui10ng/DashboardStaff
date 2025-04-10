import { events } from '$lib/stores/data';
import { message, superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { eventSchema } from '$lib/schema/event';
import { fail } from 'sveltekit-superforms';

export const load = async () => {
	const form = await superValidate(zod(eventSchema));

	return {
		form,
		events
	};
};

export const actions = {
	checkAvailableSubdomain: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	createEvent: async ({ request }) => {
		const data = await request.formData();

		const form = await superValidate(data, zod(eventSchema));

		if (!form.valid) {
			return fail(400, { form });
		}
		console.log(form);
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
