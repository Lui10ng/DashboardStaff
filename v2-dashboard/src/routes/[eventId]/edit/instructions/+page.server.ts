import type { RequestEvent } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { instructionSchema } from '$lib/schema';
import { createApiClient } from '$lib/services/payload.server';
import { handleSvelteError } from '$lib/utils/errorHandler';

export const load: PageServerLoad = async (event: RequestEvent) => {
	const {
		params: { eventId }
	} = event;

	const form = await superValidate(zod(instructionSchema));

	return {
		form
	};
};

export const actions: Actions = {
	createInstruction: async (instruction: RequestEvent) => {
		const {
			request,
			params: { eventId }
		} = instruction;

		const data = await request.formData();
		const form = await superValidate(data, zod(instructionSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = {
			event: parseInt(eventId!),
			title: form.data.title,
			content: form.data.content,
			status: 'published'
		};

		try {
			const apiClient = createApiClient(instruction);
			const response = await apiClient.post('/event-instructions', formData);
			console.log(response);
			return message(form, { success: true, message: 'Instruction created successfully' });
		} catch (err) {
			const { statusCode, errorMessage } = handleSvelteError(
				err,
				'Creating Instruction',
				'Failed to Create Instruction'
			);
			console.log('errorMessage: ', errorMessage);
			console.log('statusCode: ', statusCode);
		}
	}
};
