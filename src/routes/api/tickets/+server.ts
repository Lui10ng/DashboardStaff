import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTickets, updateTicketCount } from '$lib/server/db';

export const GET: RequestHandler = async () => {
  const tickets = getTickets();
  return json(tickets);
};

export const POST: RequestHandler = async ({ request }) => {
  const { ticketId, newCount } = await request.json();
  const updatedTicket = updateTicketCount(ticketId, newCount);
  
  if (!updatedTicket) {
    return json({ success: false, message: 'Ticket not found' }, { status: 404 });
  }
  
  return json({ success: true, ticket: updatedTicket });
};