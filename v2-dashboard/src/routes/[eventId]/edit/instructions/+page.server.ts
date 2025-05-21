import { error, type RequestEvent } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { instructionSchema } from '$lib/schema';
import { createApiClient } from '$lib/services/payload.server';
import { handleSvelteError } from '$lib/utils/errorHandler';
import type { PayloadPaginatedResponse } from '$lib/types/payloadResponse';
import type { EventInstruction, InstructionData } from '$lib/types';

let instructionId = 0;
let instructionData: InstructionData[] = [];

export const load: PageServerLoad = async (event: RequestEvent) => {
	const {
		params: { eventId }
	} = event;

	const form = await superValidate(zod(instructionSchema));

	const params = new URLSearchParams({
		'where[event][equals]': eventId!,
		sort: 'order,createdBy',
		limit: '1',
		depth: '0'
	});

	try {
		const apiClient = createApiClient(event);
		const instructions = await apiClient.get<PayloadPaginatedResponse<EventInstruction>>(
			'/event-instructions',
			params
		);

		if (instructions.docs.length > 0) {
			instructionId = instructions.docs[0].id;
			instructionData = instructions.docs[0].eventInstructions || [];
		}

		return {
			form,
			instructions
		};
	} catch (err: unknown) {
		const { statusCode, errorMessage } = handleSvelteError(
			err,
			'Loading Event Announcements',
			'Failed to Load Event Announcements'
		);

		throw error(statusCode, errorMessage);
	}
};

export const actions: Actions = {
	createInstruction: async (instruction: RequestEvent) => {
		const {
			request,
			params: { eventId }
		} = instruction;

		const getEventId = parseInt(eventId!);

		const data = await request.formData();
		const form = await superValidate(data, zod(instructionSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = {
			event: getEventId,
			status: 'published',
			eventInstructions: [form.data]
		};

		try {
			const apiClient = createApiClient(instruction);
			const response = await apiClient.post('/event-instructions', formData);
			console.log(response);
			return message(form, { success: true, message: 'Instruction created successfully!' });
		} catch (err) {
			const { statusCode, errorMessage } = handleSvelteError(
				err,
				'Creating Instruction',
				'Failed to Create Instruction'
			);
			throw error(statusCode, errorMessage);
		}
	},
	updateInstruction: async (instruction: RequestEvent) => {
		const {
			request,
			params: { eventId }
		} = instruction;

		const getEventId = parseInt(eventId!);

		const data = await request.formData();
		const form = await superValidate(data, zod(instructionSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		instructionData.push({
			title: form.data.title,
			content: form.data.content
		});

		const formData = {
			event: getEventId,
			status: 'published',
			eventInstructions: instructionData
		};

		try {
			const apiClient = createApiClient(instruction);
			const response = await apiClient.patch(`event-instructions/${instructionId}`, formData);
			console.log(response);
			return message(form, { success: true, message: 'Instruction updated successfully!' });
		} catch (err) {
			const { statusCode, errorMessage } = handleSvelteError(
				err,
				'Update Instruction',
				'Failed to Update Instruction'
			);
			throw error(statusCode, errorMessage);
		}
	}
};
