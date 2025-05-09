import { registration } from '$lib/schema/registration';
import { fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { RequestEvent, PageServerLoad } from './$types';
import { apiClient } from '$lib/services/payload.server';
import type { Actions } from './$types';
import { handleSvelteError } from '$lib/utils/errorHandler';
import { error } from '@sveltejs/kit';
import type { PayloadPaginatedResponse, TicketTypeResponse } from '$lib/types';

let schema: any = null;
let eventId = '';

export const load: PageServerLoad = async (event: RequestEvent) => {
	const { url, fetch: svelteKitFetch } = event;
	const hostName = url.hostname;
	const subdomain = hostName.split('.')[0];

	const params = new URLSearchParams({
		'where[slug][equals]': subdomain,
		limit: '1',
		depth: '2'
	});

	try {
		const formData = await apiClient.get<PayloadPaginatedResponse<Event>>('/events', params, {
			fetchInstance: svelteKitFetch
		});

		if (formData && formData.docs[0].form.docs[0].formBuilder) {
			const formBuilder = formData.docs[0].form.docs[0].formBuilder;

			if (formData.docs[0].ticketType.docs.length > 0) {
				formBuilder.push({
					id: 'ticketType',
					name: 'ticketType',
					fieldType: 'json',
					label: 'Tickets',
					required: true,
					ticketData: formData.docs[0].ticketType.docs
				});
			}

			schema = registration(formBuilder);
			const form = await superValidate(zod(schema));

			const serverTime = new Date();
			const eventDetails = formData.docs[0];
			const buttonText = 'Submit'; // init
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
		const { request } = event;
		const formData = await request.formData();
		const form = await superValidate(formData, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const registrantData = {
				event: eventId,
				submittedAnswers: form.data.tabs
			};

			const ticketId = form.data.tabs[0].ticketType?.value;

			if (ticketId) {
				updateTicketQuantity(ticketId);
			}

			const response = await apiClient.post('/registrants', registrantData);
			console.log('response', response);

			return message(form, { success: true, message: 'Registration successful!' });
		} catch (err: unknown) {
			const { statusCode, errorMessage } = handleSvelteError(
				err,
				'Registering for Event',
				'Failed to Register for Event'
			);

			throw error(statusCode, errorMessage);
		}
	}
};

async function updateTicketQuantity(ticketId: number) {
	try {
		const params = new URLSearchParams({
			'where[id][equals]': `${ticketId}`,
			'select[quantityAvailable]': 'true'
		});

		const { quantityAvailable } = await apiClient.get<TicketTypeResponse>(
			`/ticket-types/${ticketId}`,
			params
		);

		if (!quantityAvailable || quantityAvailable <= 0) {
			return;
		}

		const formData = {
			quantityAvailable: quantityAvailable - 1
		};

		await apiClient.patch(`/ticket-types/${ticketId}`, formData);
	} catch (err: unknown) {
		const { statusCode, errorMessage } = handleSvelteError(
			err,
			'Registering for Event',
			'Failed to Register for Event'
		);

		throw error(statusCode, errorMessage);
	}
}
