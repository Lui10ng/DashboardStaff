import { createApiClient } from '$lib/services/payload.server';
import { fail, message, superValidate } from 'sveltekit-superforms';
import type { RequestEvent } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { contactSchema } from '$lib/schema/index.js';
import { handleSvelteError } from '$lib/utils/errorHandler.js';
import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';
import type { ContactData, EventContactsResponse } from '$lib/types/eventContacts';

let contactData: ContactData[] = [];
export const load: PageServerLoad = async (event: RequestEvent) => {
	const {
		params: { eventId }
	} = event;

	const paramContacts = new URLSearchParams({
		'where[event][equals]': eventId!,
		'select[eventContacts]': 'true'
	});

	try {
		const form = await superValidate(zod(contactSchema));

		const apiClient = createApiClient(event);
		const respContact = await apiClient.get<EventContactsResponse>(
			`events/${eventId}`,
			paramContacts
		);

		const contacts = respContact.eventContacts;
		contactData = contacts as ContactData[];

		return {
			contacts,
			form
		};
	} catch (err: unknown) {
		const { statusCode, errorMessage } = handleSvelteError(
			err,
			'Loading Event Contact',
			'Failed to Load Event Contacts'
		);

		throw error(statusCode, errorMessage);
	}
};

export const actions: Actions = {
	updateContact: async (event: RequestEvent) => {
		const {
			request,
			params: { eventId }
		} = event;

		const formData = await request.formData();

		const form = await superValidate(formData, zod(contactSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		//concatenate contact data
		contactData.push(form.data);

		const formDataSantized = {
			eventContacts: contactData
		};

		try {
			const apiClient = createApiClient(event);
			const response = await apiClient.patch(`events/${eventId}`, formDataSantized);
			console.log('response: ', response);
			return message(form, { success: true, message: 'Contact created successfully!' });
		} catch (err: unknown) {
			const { statusCode, errorMessage } = handleSvelteError(
				err,
				'Updating Event Contact',
				'Failed to Update Event Contacts'
			);
			throw error(statusCode, errorMessage);
		}
	}
};
