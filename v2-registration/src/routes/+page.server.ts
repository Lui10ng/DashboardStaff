import { registration } from '$lib/schema/registration';
import { apiClient } from '$lib/services/payload.server.js';
import { fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms/server';

let schema: any = null;

export const load = async ({ url, fetch: svelteKitFetch }) => {
	const hostName = url.hostname;
	const subdomain = hostName.split('.')[0];

	const params = new URLSearchParams({
		'where[slug][equals]': subdomain,
		depth: '1'
	});

	try {
		const formData = await apiClient.get('/events', params, { fetchInstance: svelteKitFetch });
		if (formData && formData.docs[0].formId.formBuilder) {
			const formBuilder = formData.docs[0].formId.formBuilder;

			schema = registration(formBuilder);
			const form = await superValidate(zod(schema));

			const serverTime = new Date();

			const eventDetails = formData.docs[0];
			const buttonText = eventDetails.formId.buttonText;

			return {
				form,
				buttonText,
				eventDetails,
				serverTime,
				formBuilder
			};
		}
	} catch (err) {}
};

export const actions = {
	register: async ({ url, request, fetch: svelteKitFetch }) => {
		const hostName = url.hostname;
		const subdomain = hostName.split('.')[0];

		const formData = await request.formData();

		const form = await superValidate(formData, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const params = new URLSearchParams({
			'where[slug][equals]': subdomain,
			select: 'id'
		});

		try {

			const eventId = await apiClient.get('/events', params, { fetchInstance: svelteKitFetch });

			const registrantData = {				
				event: eventId.docs[0].id,
				submittedAnswers: form.data.tabs
			};

			const response = await apiClient.post('/registrants', registrantData);
			console.log("response: ", response);

			return message(form, { success: true, message: 'Registration successful!' });
		} catch (error: any) {
			return message(form, { success: false, message: error.message });
		}
	}
};
