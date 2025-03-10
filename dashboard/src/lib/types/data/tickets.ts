
export interface Ticket {
    id: string;
    name: string;
    price: number;
    available: number;
    sold: number;
  }

export const tickets: Ticket[] = [
  {
    id: '1',
    name: 'Regular Ticket',
    price: 500,
    available: 100,
    sold: 50
  },
  {
    id: '2',
    name: 'VIP Ticket',
    price: 1000,
    available: 50,
    sold: 25
  },
  {
    id: '3',
    name: 'VVIP Ticket',
    price: 2000,
    available: 25,
    sold: 10
  }
];
