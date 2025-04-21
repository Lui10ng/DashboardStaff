import { apiClient } from '$lib/services/payload.server';

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
