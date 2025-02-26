import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../../db.json');

// Initialize database if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
  const initialData = {
    tickets: [
      { id: 1, type: 'VVIP', price: '₱ 5,500', status: 'SOLD OUT', color: 'bg-black', textColor: 'text-black' },
      { id: 2, type: 'VIP', price: '₱ 3,500', ticketLeft: '8/25', color: 'bg-yellow-500', textColor: 'text-yellow-500' },
      { id: 3, type: 'VIP', price: '₱ 3,500', ticketLeft: '8/25', color: 'bg-yellow-500', textColor: 'text-yellow-500' },
      { id: 4, type: 'VIP', price: '₱ 3,500', ticketLeft: '8/25', color: 'bg-yellow-500', textColor: 'text-yellow-500' },
      { id: 5, type: 'VIP', price: '₱ 3,500', ticketLeft: '8/25', color: 'bg-yellow-500', textColor: 'text-yellow-500' },
      // Add all your tickets here
    ]
  };
  
  fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
}

export function getTickets() {
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  return data.tickets;
}

export function updateTicketCount(id: number, newCount: number) {
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  const ticketIndex = data.tickets.findIndex(ticket => ticket.id === id);
  
  if (ticketIndex === -1) {
    return null;
  }
  
  if (data.tickets[ticketIndex].ticketLeft) {
    const [_, total] = data.tickets[ticketIndex].ticketLeft.split('/');
    data.tickets[ticketIndex].ticketLeft = `${newCount}/${total}`;
    
    if (newCount === 0) {
      data.tickets[ticketIndex].status = 'SOLD OUT';
      delete data.tickets[ticketIndex].ticketLeft;
    }
  }
  
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  return data.tickets[ticketIndex];
}