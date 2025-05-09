import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ params, fetch }) => {
  try {
    const eventId = params.eventId;
    
    if (!eventId) {
      return json({ error: 'Event ID is required' }, { status: 400 });
    }
    
    // First, get the event to check if it has a seat map
    const eventResponse = await fetch(`${env.PAYLOAD_API_URL}/api/events/${eventId}`);
    
    if (!eventResponse.ok) {
      const errorText = await eventResponse.text();
      console.error(`Error fetching event ${eventId}:`, errorText);
      return json({ error: 'Failed to fetch event details' }, { status: eventResponse.status });
    }
    
    const event = await eventResponse.json();
    
    // Check if event has reserved seating
    if (event.seatingType !== 'reserved_seating' || !event.seatMap) {
      return json({ 
        error: 'This event does not use reserved seating',
        seatingType: event.seatingType
      }, { status: 404 });
    }
    
    // Get the seat map details
    const seatMapId = typeof event.seatMap === 'object' ? event.seatMap.id : event.seatMap;
    const seatMapResponse = await fetch(`${env.PAYLOAD_API_URL}/api/seat-maps/${seatMapId}`);
    
    if (!seatMapResponse.ok) {
      const errorText = await seatMapResponse.text();
      console.error(`Error fetching seat map ${seatMapId}:`, errorText);
      return json({ error: 'Failed to fetch seat map details' }, { status: seatMapResponse.status });
    }
    
    const seatMap = await seatMapResponse.json();
    
    // Get ticket types for this event to determine pricing per section/row
    const ticketsResponse = await fetch(
      `${env.PAYLOAD_API_URL}/api/ticket-types?where[event][equals]=${eventId}&limit=100`
    );
    
    if (!ticketsResponse.ok) {
      console.error(`Error fetching tickets for event ${eventId}`);
    }
    
    const ticketsData = await ticketsResponse.json();
    const tickets = ticketsData.docs || [];
    
    // Transform seat map data into a format suitable for the seat selector component
    const seatMapData = {
      id: seatMap.id,
      name: seatMap.name,
      eventId: eventId,
      sections: seatMap.sections.map(section => ({
        name: section.sectionName,
        rows: section.rows.map(row => ({
          label: row.rowLabel,
          seats: row.seats.map(seat => ({
            id: `${row.rowLabel}${seat.seatNumber}`,
            label: seat.seatNumber,
            status: seat.isPurchasable ? 'available' : 'unavailable',
            type: seat.seatType
          }))
        }))
      })),
      tickets: tickets,
      // Include additional metadata about the event that might be useful
      event: {
        title: event.title,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location
      }
    };
    
    return json(seatMapData);
  } catch (error) {
    console.error('Error handling seat map request:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}; 