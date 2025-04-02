import type { RequestEvent } from '@sveltejs/kit';
import { updateForm } from '$lib/services/payload.server';
import type { FormData, FormResponse } from './types';

export const load = async () => {
	return {};
};

export const actions = {
	createForm: async ({ request }: RequestEvent) => {
		try {
			const formData = await request.formData();
			const formDataJson = formData.get('formData') as string;
			const responsesJson = formData.get('responses') as string;

			if (!formDataJson || !responsesJson) {
				return {
					status: 400,
					error: 'Missing form data or responses'
				};
			}

			const parsedFormData: FormData = JSON.parse(formDataJson);
			const parsedResponses: Record<string, any> = JSON.parse(responsesJson);
			const formattedResponses: FormResponse[] = Object.entries(parsedResponses).map(
				([fieldId, value]) => ({
					fieldId,
					value
				})
			);

			await updateForm({
				formData: parsedFormData,
				responses: formattedResponses
			});

			return {
				status: 200,
				success: true
			};
		} catch (error) {
			console.error('Error processing form submission:', error);
			return {
				status: 500,
				error: 'Failed to process form submission'
			};
		}
	}
};
