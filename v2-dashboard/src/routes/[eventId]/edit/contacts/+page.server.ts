import { createApiClient } from '$lib/services/payload.server';
import { superValidate } from 'sveltekit-superforms';
import type { RequestEvent } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { contactSchema } from '$lib/schema';
import { handleSvelteError } from '$lib/utils/errorHandler.js';
import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';
import type { EventContactsResponse } from '$lib/types/eventContacts';

export const load: PageServerLoad = async (event: RequestEvent) => {
	const { params: { eventId } } = event;

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
	updateContacts: async (event: RequestEvent) => {
		const { request, params: { eventId } } = event;

		const formData = await request.formData();

		const contactData = formData.get('formData') as string;

		const parsed = JSON.parse(contactData);

		const validContacts = parsed.eventContacts
			.filter(
				(contact: any) =>
					contact.contactName && contact.contactEmail && contact.contactRole && contact.contactPhone
			)
			.map((contact: any) => ({
				...contact,
				id: contact.id || crypto.randomUUID()
			}));

		const formDataSantized = {
			eventContacts: validContacts
		};

		try {
			const apiClient = createApiClient(event);
			const response = await apiClient.patch(`events/${eventId}`, formDataSantized);
			console.log('response: ', response);
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
