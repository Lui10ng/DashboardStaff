import type { RequestEvent } from '@sveltejs/kit';
import type { FormData, FieldType } from './types';
import type { PageServerLoad, Actions } from './$types';
import { createApiClient } from '$lib/services/payload.server.js';
import type { PayloadForm, PayloadResponse } from '$lib/types/formTypes';
import { handleSvelteError } from '$lib/utils/errorHandler';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event: RequestEvent) => {
	try {
		const {
			params: { eventId }
		} = event;

		console.log('Fetching form data for event:', eventId);

		const params = new URLSearchParams({
			'where[eventId][equals]': eventId as string
		});

		console.log('Request URL params:', params);

		const apiClient = createApiClient(event);
		const response = await apiClient.get<PayloadResponse>('forms', params);

		console.log('Raw API Response:', JSON.stringify(response, null, 2));

		const formData: FormData = {
			id: response.docs[0].id,
			title: response.docs[0].title || 'Untitled Form',
			description: response.docs[0].description || '',
			buttonText: response.docs[0].buttonText || '',
			formBuilder: response.docs[0].formBuilder.map((field) => ({
				id: field.id || crypto.randomUUID(),
				name: field.name || '',
				fieldType: field.fieldType as FieldType,
				label: field.label || 'Untitled Field',
				required: !!field.required,
				description: field.description || undefined,
				options:
					field.options?.map((option: string | { value: string }) =>
						typeof option === 'string' ? { value: option } : option
					) || []
			}))
		};

		console.log('Transformed formData:', formData);

		return {
			formData,
			error: null
		};
	} catch (err: unknown) {
		const { statusCode, errorMessage } = handleSvelteError(
			err,
			'Loading Form Template',
			'Failed to Load Form Template'
		);

		throw error(statusCode, errorMessage);
	}
};

export const actions: Actions = {
	saveForm: async (event: RequestEvent) => {
		try {
			const { request } = event;
			const formData = await request.formData();
			const formDataJson = formData.get('formData');

			if (!formDataJson || typeof formDataJson !== 'string') {
				return { success: false, error: 'Invalid form data' };
			}

			const parsedFormData = JSON.parse(formDataJson);
			console.log('Saving form data:', parsedFormData);

			// Update the form in Payload CMS
			const apiClient = createApiClient(event);
			const response = await apiClient.patch(`forms/${parsedFormData.id}`, parsedFormData);
			console.log('Update response:', response);

			return {
				success: true,
				message: 'Form Saved Successfully'
			};
		} catch (err: unknown) {
			const { statusCode, errorMessage } = handleSvelteError(
				err,
				'Saving Form Template',
				'Failed to Save Form Template'
			);

			throw error(statusCode, errorMessage);
		}
	},

	deleteField: async (event: RequestEvent) => {
		try {
			const { request, params } = event;
			const eventId = params.eventId;
			if (!eventId) {
				return { success: false, error: 'Event ID is required' };
			}

			const formData = await request.formData();
			// const formId = formData.get('formId'); // We'll get the ID from the fetched form
			const fieldIdToDelete = formData.get('fieldId');

			if (!fieldIdToDelete || typeof fieldIdToDelete !== 'string') {
				return { success: false, error: 'Invalid field ID' };
			}

			const apiClient = createApiClient(event);

			// Fetch the specific form using the eventId
			const queryParams = new URLSearchParams({
				'where[eventId][equals]': eventId
			});
			const response = await apiClient.get<PayloadForm>('forms', queryParams);

			if (!response) {
				return { success: false, error: 'Form not found for this event' };
			}

			const formDocument = response; // Assuming one form per event
			const currentFormId = formDocument.id;
			const currentFormBuilder = formDocument.formBuilder || [];

			// Remove the field from formBuilder
			const updatedFormBuilder = currentFormBuilder.filter(
				(field: any) => field.id !== fieldIdToDelete
			);

			// Patch only the formBuilder field
			await apiClient.patch(`forms/${currentFormId}`, {
				formBuilder: updatedFormBuilder
			});

			console.log(`Field ${fieldIdToDelete} deleted successfully from form ${currentFormId}`);
			return { success: true, message: 'Field deleted successfully' };
		} catch (err: unknown) {
			const { statusCode, errorMessage } = handleSvelteError(
				err,
				'Deleting Form Field',
				'Failed to Delete Form Field'
			);

			throw error(statusCode, errorMessage);
		}
	}
};
