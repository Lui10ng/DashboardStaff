import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { differenceInSeconds, parseISO, format } from 'date-fns';

export type Ticket = {
  id: number;
  type: string;
  price: string;
  status?: string;
  color: string;
  textColor: string;
  ticketLeft?: string;
  timer?: string;
  date?: string;
  remainingTime?: number;
};

// Create an empty store initially
export const tickets = writable([]);

// Function to load tickets from server
export async function loadTickets() {
  if (browser) {
    try {
      const response = await fetch('/api/tickets');
      const data = await response.json();
      tickets.set(data);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    }
  }
}

// Function to update a ticket
export async function updateTicket(ticketId: number, newCount: number) {
  if (browser) {
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ticketId, newCount })
      });
      
      const result = await response.json();
      if (result.success) {
        tickets.update(allTickets => {
          const index = allTickets.findIndex(t => t.id === ticketId);
          if (index !== -1) {
            allTickets[index] = result.ticket;
          }
          return allTickets;
        });
      }
      
      return result;
    } catch (error) {
      console.error('Failed to update ticket:', error);
      return { success: false, message: 'Network error' };
    }
  }
}

export const showTicketCount = writable(false);

export function toggleShowTicketCount() {
  showTicketCount.update(value => !value);
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

export function updateTicketStatus(ticket: any) {
  if (ticket.date) {
    const eventDate = parseISO(ticket.date);
    const now = new Date();
    const remainingSeconds = differenceInSeconds(eventDate, now);

    if (remainingSeconds <= 86400 && ticket.status === 'ONLY AVAILABLE BETWEEN') {
      ticket.status = 'AVAILABLE IN';
      ticket.remainingTime = remainingSeconds;
    }

    if (ticket.remainingTime !== undefined && ticket.remainingTime > 0 && remainingSeconds <= 86400) {
      ticket.timer = formatTime(ticket.remainingTime);
    }
  }
}