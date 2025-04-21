import type { RequestEvent } from '@sveltejs/kit';
import { getForm, updateForm, deleteForm } from '$lib/services/payload.server';
import type { FormData, FormResponse, FieldType } from './types';
import type { PageServerLoad } from './$types';

interface PayloadFormResponse {
	id: number;
	title: string;
	description: string;
	formBuilder: Array<{
		id: string;
		name: string;
		fieldType: FieldType;
		label: string;
		required: boolean;
		description?: string;
		options?: Array<string>;
	}>;
	createdAt: string;
	updatedAt: string;
}

export const load: PageServerLoad = async ({ params }) => {
	try {
		console.log('Fetching form data');
		const response = await getForm();
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
				options: field.options
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

	deleteField: async ({ request }: RequestEvent) => {
		try {
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
			const currentForm = await getForm();
			if (!currentForm) {
				return { success: false, error: 'Form not found' };
			}

			// Remove the field from formBuilder
			const updatedFormBuilder = currentForm.formBuilder.filter(field => field.id !== fieldId);

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
