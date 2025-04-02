import type { RequestEvent } from '@sveltejs/kit';
import { updateForm } from '$lib/services/payload.server';
import type { FormData, FormResponse } from './types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const formData: FormData = {
			title: 'Registration Form',
			description: 'Please fill out this registration form',
			formBuilder: [
				{
					id: crypto.randomUUID(),
					name: 'firstName',
					fieldType: 'firstName',
					label: 'First Name',
					required: true
				},
				{
					id: crypto.randomUUID(),
					name: 'lastName',
					fieldType: 'lastName',
					label: 'Last Name',
					required: true
				},
				{
					id: crypto.randomUUID(),
					name: 'email',
					fieldType: 'email',
					label: 'Email Address',
					required: true
				},
				{
					id: crypto.randomUUID(),
					name: 'phone',
					fieldType: 'phone',
					label: 'Contact Number',
					required: true
				}
			]
		};

		return {
			formData
		};
	} catch (error) {
		console.error('Error loading form data:', error);
		return {
			formData: null,
			error: 'Failed to load form data'
		};
	}
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
					form: parsedFormData
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
