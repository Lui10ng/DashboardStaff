import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { ticketTypeSchema } from '$lib/schema';
import { createApiClient } from '$lib/services/payload.server';
import { handleSvelteError } from '$lib/utils/errorHandler';

export const load: PageServerLoad = async (event) => {
  const form = await superValidate(zod(ticketTypeSchema));
  return { form };
};

export const actions: Actions = {
  createTicketType: async (event) => {
    const { request, locals } = event;
    const form = await superValidate(request, zod(ticketTypeSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const apiClient = createApiClient(event);
      
      // Create the ticket type
      const response = await apiClient.post('/ticket-types', {
        ...form.data,
        event: locals.eventId // Make sure you have the eventId in locals
      });

      if (!response) {
        return message(form, {
          type: 'error',
          message: 'Failed to create ticket type'
        });
      }

      return message(form, {
        type: 'success',
        message: 'Ticket type created successfully'
      });
    } catch (err) {
      const { statusCode, errorMessage } = handleSvelteError(
        err,
        'Creating Ticket Type',
        'Failed to Create Ticket Type'
      );

      return message(form, {
        type: 'error',
        message: errorMessage
      });
    }
  }
}; 