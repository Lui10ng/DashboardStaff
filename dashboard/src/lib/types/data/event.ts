export interface Event {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    url: string;
    imageUrl: string;
  }
  
  export const currentEvent: Event = {
    id: '1',
    title: 'Tech Talks 2024',
    date: 'April 16-18, 2024',
    time: '8:00 AM - 6:00 PM',
    location: 'USTP Gymnasium, Cagayan de Oro City',
    url: 'https://techtalks2024.event.co',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3'
  };
  