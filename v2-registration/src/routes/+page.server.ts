import { registration } from '$lib/schema/registration';
import { fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { RequestEvent, PageServerLoad } from './$types';
import { createApiClient } from '$lib/services/payload.server';
import type { Actions } from './$types';
import { handleSvelteError } from '$lib/utils/errorHandler';
import { error } from '@sveltejs/kit';

let schema: any = null;
let eventId = '';

export const load: PageServerLoad = async (event: RequestEvent) => {
	const { url } = event;
	const hostName = url.hostname;
	const subdomain = hostName.split('.')[0];

	const params = new URLSearchParams({
		'where[slug][equals]': subdomain
	});

	try {
		const apiClient = createApiClient(event);
		const formData = await apiClient.get('/events', params);

		if (formData && formData.docs[0].formId.formBuilder) {
			const formBuilder = formData.docs[0].formId.formBuilder;

			schema = registration(formBuilder);
			const form = await superValidate(zod(schema));

			const serverTime = new Date();

			const eventDetails = formData.docs[0];
			const buttonText = eventDetails.formId.buttonText;
			eventId = formData.docs[0].id;

			return {
				form,
				buttonText,
				eventDetails,
				serverTime,
				formBuilder
			};
		}
	} catch (err: unknown) {
		const { statusCode, errorMessage } = handleSvelteError(
			err,
			'Loading Event Details for Registration',
			'Failed to Load Event Details for Registration'
		);

		throw error(statusCode, errorMessage);
	}
};

export const actions: Actions = {
	register: async (event: RequestEvent) => {
		const { url, request } = event;
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
			const apiClient = createApiClient(event);
			const eventId = await apiClient.get('/events', params);

			const registrantData = {
				event: eventId,
				submittedAnswers: form.data.tabs
			};

			const response = await apiClient.post('/registrants', registrantData);
			console.log('response: ', response);

			return message(form, { success: true, message: 'Registration successful!' });
		}  catch (err: unknown) {
			const { statusCode, errorMessage } = handleSvelteError(
				err,
				'Registering for Event',
				'Failed to Register for Event'
			);
	
			throw error(statusCode, errorMessage);
		}
	}
};
