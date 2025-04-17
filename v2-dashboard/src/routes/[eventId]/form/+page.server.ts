import type { RequestEvent } from '@sveltejs/kit';
import type { FormData, FieldType } from './types';
import type { PageServerLoad } from './$types';
import { apiClient } from '$lib/services/payload.server.js';
import type { PayloadResponse } from '$lib/types/formTypes';

async function getForm(eventId: string) {
	try {
		console.log('Attempting to fetch form for event:', eventId);
		const params = new URLSearchParams({
			'where[eventId][equals]': eventId
		});
		console.log('Request URL params:', params.toString());

		const response = (await apiClient.get('forms', params)) as PayloadResponse;
		console.log('Raw API Response:', JSON.stringify(response, null, 2));

		if (response?.docs && Array.isArray(response.docs) && response.docs.length > 0) {
			console.log('Found form:', response.docs[0]);
			return response.docs[0];
		}
		console.log('No form found for event:', eventId);
		return null;
	} catch (error) {
		console.error('Error details in getForm:', error);
		if (error instanceof Error) {
			console.error('Error message:', error.message);
			console.error('Error stack:', error.stack);
		}
		throw error;
	}
}

async function updateForm(id: number, data: any) {
	try {
		console.log(`Attempting to update form ${id} with data:`, data);
		const response = await apiClient.patch(`forms/${id}`, data);
		console.log('Update response:', response);
		return response;
	} catch (error) {
		console.error('Error updating form:', error);
		throw error;
	}
}

async function deleteForm(id: number) {
	try {
		console.log(`Attempting to delete form ${id}`);
		const response = await apiClient.del(`forms/${id}`);
		console.log('Delete response:', response);
		return response;
	} catch (error) {
		console.error('Error deleting form:', error);
		throw error;
	}
}

export const load: PageServerLoad = async ({ params }) => {
	try {
		console.log('Fetching form data');
		const response = await getForm(params.eventId);
		console.log('Raw response from Payload:', response);

		if (!response) {
			console.log('No response received from Payload');
			throw new Error('Form not found');
		}

		const formData: FormData = {
			id: response.id,
			title: response.title,
			description: response.description,
			formBuilder: response.formBuilder.map((field) => ({
				id: field.id,
				name: field.name,
				fieldType: field.fieldType as FieldType,
				label: field.label,
				required: field.required,
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
	} catch (error) {
		console.error('Error details in load function:', error);
		if (error && typeof error === 'object' && 'message' in error) {
			console.error('API Error:', error.message);
		}
		return {
			formData: null,
			error: error instanceof Error ? error.message : 'Failed to load form data'
		};
	}
};

export const actions = {
	saveForm: async ({ request }: RequestEvent) => {
		try {
			const formData = await request.formData();
			const formDataJson = formData.get('formData');

			if (!formDataJson || typeof formDataJson !== 'string') {
				return { success: false, error: 'Invalid form data' };
			}

			const parsedFormData = JSON.parse(formDataJson);
			console.log('Saving form data:', parsedFormData);

			// Update the form in Payload CMS
			const response = await updateForm(parsedFormData.id, parsedFormData);
			console.log('Update response:', response);

			return {
				success: true,
				message: 'Form saved successfully'
			};
		} catch (error) {
			console.error('Error saving form:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to save form'
			};
		}
	},

	deleteField: async ({ request, params }: RequestEvent) => {
		try {
			if (!params.eventId) {
				return { success: false, error: 'Event ID is required' };
			}

			const formData = await request.formData();
			const formId = formData.get('formId');
			const fieldId = formData.get('fieldId');

			if (!formId || !fieldId || typeof fieldId !== 'string') {
				return { success: false, error: 'Invalid form or field ID' };
			}

			// Convert formId to number
			const formIdNumber = parseInt(formId.toString(), 10);
			if (isNaN(formIdNumber)) {
				return { success: false, error: 'Invalid form ID format' };
			}

			// Get current form data
			const currentForm = await getForm(params.eventId);
			if (!currentForm) {
				return { success: false, error: 'Form not found' };
			}

			// Remove the field from formBuilder
			const updatedFormBuilder = currentForm.formBuilder.filter((field) => field.id !== fieldId);

			// Update the form with the new formBuilder
			const response = await updateForm(formIdNumber, {
				...currentForm,
				formBuilder: updatedFormBuilder
			});

			return {
				success: true,
				message: 'Field deleted successfully'
			};
		} catch (error) {
			console.error('Error deleting field:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to delete field'
			};
		}
	}
};
