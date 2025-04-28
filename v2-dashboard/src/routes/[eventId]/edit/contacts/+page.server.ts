import { apiClient } from '$lib/services/payload.server';
import { superValidate } from 'sveltekit-superforms';

import { zod } from 'sveltekit-superforms/adapters';
import { contactSchema } from '$lib/schema/contact.js';

export const load = async ({ url, params, fetch: svelteKitFetch }) => {
	const paramContacts = new URLSearchParams({
		'where[event][equals]': params.eventId,
		'select[eventContacts]': 'true'
	});

	try {
		const eventId = params.eventId;
		const form = await superValidate(zod(contactSchema));

		const respContact = await apiClient.get(`events/${eventId}`, paramContacts, {
			fetchInstance: svelteKitFetch
		});

		const contacts = respContact.eventContacts;

		return {
			contacts,
			form
		};
	} catch (err) {}
};

export const actions = {
	updateContacts: async ({ request, params }) => {
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

		const response = await apiClient.patch(`events/${params.eventId}`, formDataSantized);
		console.log('response: ', response);
	}
};
