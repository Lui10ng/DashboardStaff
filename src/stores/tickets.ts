import { writable } from 'svelte/store';
import { differenceInSeconds, parseISO, format } from 'date-fns';

export type Ticket = {
  id: number;
  type: string;
  price: string;
  status?: string;
  color: string;
  ticketLeft?: string;
  timer?: string;
  date?: string;
  remainingTime?: number;
};

export const tickets = writable<Ticket[]>([
  { id: 1, type: 'VVIP', price: '₱ 5,500', status: 'SOLD OUT', color: 'bg-black' },
  { id: 2, type: 'VIP', price: '₱ 3,500', ticketLeft: '8/25', color: 'bg-yellow-500' },
  { id: 3, type: 'PATRON A', price: '₱ 2,000', ticketLeft: '198/200', color: 'bg-yellow-400' },
  { id: 4, type: 'PATRON B', price: '₱ 1,500', ticketLeft: '198/200', color: 'bg-green-500' },
  { id: 5, type: 'LOWER BOX', price: '₱ 1,000', status: 'AVAILABLE IN', timer: '23:59:50', color: 'bg-pink-500', remainingTime: 86400 }, // 1 day in seconds
  { id: 6, type: 'UPPER BOX', price: '₱ 750', status: 'AVAILABLE IN', timer: '23:59:50', color: 'bg-cyan-500', remainingTime: 86400 }, // 1 day in seconds
  { id: 7, type: 'STANDING A', price: '₱ 800', ticketLeft: '198/200', color: 'bg-red-500' },
  { id: 8, type: 'STANDING B', price: '₱ 800', ticketLeft: '198/200', color: 'bg-red-500' },
  { id: 9, type: 'STANDING C', price: '₱ 800', status: 'ONLY AVAILABLE BETWEEN', date: '2025-02-25', color: 'bg-red-700', remainingTime: 172800 }, // 2 days in seconds
  { id: 10, type: 'STANDING D', price: '₱ 800', status: 'ONLY AVAILABLE BETWEEN', date: '2025-02-19', color: 'bg-red-700', remainingTime: 172800 }, // 2 days in seconds
]);

export const showTicketCount = writable(true);

export function toggleShowTicketCount() {
  showTicketCount.update(value => !value);
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function updateTicketStatus(ticket: Ticket) {
  if (ticket.date) {
    const eventDate = parseISO(ticket.date);
    const now = new Date();
    const remainingSeconds = differenceInSeconds(eventDate, now);

    if (remainingSeconds <= 86400 && ticket.status === 'ONLY AVAILABLE BETWEEN') {
      ticket.status = 'AVAILABLE IN';
      ticket.remainingTime = remainingSeconds;
    }

    if (ticket.remainingTime !== undefined && ticket.remainingTime > 0) {
      ticket.timer = formatTime(ticket.remainingTime);
    }
  }
}