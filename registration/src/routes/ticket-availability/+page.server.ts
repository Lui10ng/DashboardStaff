import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  // Fetch tickets from our API endpoint
  const response = await fetch('/api/tickets');
  const tickets = await response.json();
  
  return {
    tickets
  };
};