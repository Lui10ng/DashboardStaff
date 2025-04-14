// FILE: src/routes/booking/+page.server.ts
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  // Helper functions for time-based ticket availability
  function isTicketInTimeWindow(availableFrom, availableUntil) {
    const now = new Date();
    const startDate = new Date(availableFrom);
    const endDate = new Date(availableUntil);
    
    return now >= startDate && now <= endDate;
  }

  function getTimeUntilAvailable(availableFrom) {
    const now = new Date();
    const startDate = new Date(availableFrom);
    
    if (now >= startDate) {
      return null; // Already available
    }
    
    const diffMs = startDate - now;
    
    // Format as days, hours, minutes
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  // Calculate time-restricted availabilities
  const lowerBoxAvailable = isTicketInTimeWindow('2025-04-10T10:00:00', '2025-04-15T23:59:59');
  const upperBoxAvailable = isTicketInTimeWindow('2025-04-10T10:00:00', '2025-04-15T23:59:59');
  
  // Format availableIn time for display
  const lowerBoxAvailableIn = getTimeUntilAvailable('2025-04-10T10:00:00');
  const upperBoxAvailableIn = getTimeUntilAvailable('2025-04-10T10:00:00');

  const ticketTypes = [
    { id: 'vvip', name: 'VVIP', price: 5500, available: false, soldOut: true, color: 'bg-orange-600', textColor: 'text-orange-500' },
    { id: 'vip', name: 'VIP', price: 3500, available: true, remainingTickets: 8, totalTickets: 25, color: 'bg-yellow-400', textColor: 'text-yellow-500' },
    { id: 'patronA', name: 'PATRON A', price: 2000, available: true, remainingTickets: 198, totalTickets: 200, color: 'bg-yellow-400', textColor: 'text-yellow-500' },
    { id: 'patronB', name: 'PATRON B', price: 1500, available: true, remainingTickets: 198, totalTickets: 200, color: 'bg-green-400', textColor: 'text-green-500' },
    { id: 'lowerBox', name: 'LOWER BOX', price: 1000, available: lowerBoxAvailable, availableFrom: '2025-04-10T10:00:00', availableUntil: '2025-04-15T23:59:59', availableIn: lowerBoxAvailableIn, remainingTickets: 150, totalTickets: 150, color: 'bg-pink-600', textColor: 'text-pink-500' },
    { id: 'upperBox', name: 'UPPER BOX', price: 700, available: upperBoxAvailable, availableFrom: '2025-04-10T10:00:00', availableUntil: '2025-04-15T23:59:59', availableIn: upperBoxAvailableIn, remainingTickets: 200, totalTickets: 200, color: 'bg-teal-500', textColor: 'text-teal-500' },
    { id: 'standingA', name: 'STANDING A', price: 800, available: true, remainingTickets: 198, totalTickets: 200, color: 'bg-red-600', textColor: 'text-red-600' },
    { id: 'standingB', name: 'STANDING B', price: 800, available: true, remainingTickets: 198, totalTickets: 200, color: 'bg-red-600', textColor: 'text-red-600' }
  ];

  const restrictedDates = {
    start: '2/19/25',
    end: '3/22/25'
  };

  // Valid voucher codes that could be loaded from a database
  const validVouchers = [
    { code: 'DISCOUNT40', discount: 0.4, description: '40% off any ticket' },
    { code: 'EARLYBIRD', discount: 0.15, description: '15% off for early bookings' },
    { code: 'VIP20', discount: 0.2, description: '20% off VIP tickets', validTickets: ['vip'] }
  ];

  return {
    ticketTypes,
    restrictedDates,
    // We don't send valid vouchers to the client for security reasons
  };
}

// Helper function to format dates nicely
function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
}

/** @type {import('./$types').Actions} */
export const actions = {
  // Handle form submission for booking
  bookTickets: async ({ request, locals }) => {
    const formData = await request.formData();
    const ticketId = formData.get('ticketId')?.toString();
    const quantity = parseInt(formData.get('quantity')?.toString() || '1');
    const voucherCode = formData.get('voucher')?.toString() || '';
    
    // Validate the request
    if (!ticketId) {
      return fail(400, { error: 'Please select a ticket type' });
    }
    
    if (quantity < 1) {
      return fail(400, { error: 'Quantity must be at least 1' });
    }
    
    try {
      // In a real app, this would check ticket availability in the database
      const ticket = await getTicketFromDatabase(ticketId);
      
      if (!ticket) {
        return fail(400, { error: 'Invalid ticket selection' });
      }
      
      // Check if ticket is sold out
      if (ticket.soldOut) {
        return fail(400, { error: 'Selected ticket is sold out' });
      }
      
      // Check if ticket is time-restricted
      if (ticket.availableFrom && ticket.availableUntil) {
        const now = new Date();
        const availableFrom = new Date(ticket.availableFrom);
        const availableUntil = new Date(ticket.availableUntil);
        
        if (now < availableFrom) {
          return fail(400, { 
            error: `This ticket type will be available starting ${formatDateTime(availableFrom)}` 
          });
        }
        
        if (now > availableUntil) {
          return fail(400, { 
            error: `This ticket type was available until ${formatDateTime(availableUntil)}` 
          });
        }
        
        // If we're within the valid time range, treat as available
        ticket.available = true;
      }
      
      // Now check general availability
      if (!ticket.available) {
        return fail(400, { error: 'Selected ticket is not available' });
      }
      
      if (quantity > ticket.remainingTickets) {
        return fail(400, { 
          error: `Only ${ticket.remainingTickets} tickets remaining` 
        });
      }
      
      // Calculate subtotal first
      const subtotal = ticket.price * quantity;
      
      // Process voucher if provided
      let discount = 0;
      if (voucherCode) {
        try {
          // Pass quantity to validateVoucher
          const voucherResult = await validateVoucher(voucherCode, ticketId, quantity);
          discount = voucherResult.discount;
        } catch (error) {
          // If voucher is invalid, continue without discount
          console.error('Voucher validation error:', error);
        }
      }
      
      // Calculate total with discount
      const total = subtotal - discount;
      
      // Create reservation (in a real app)
      const reservationId = await createReservation({
        ticketId,
        quantity,
        voucherCode,
        discount,
        subtotal,
        total
      });
      
      // Return reservation ID to redirect to payment page
      return {
        success: true,
        reservationId,
        subtotal,
        discount,
        total
      };
    } catch (error) {
      return fail(500, { 
        error: 'Failed to process your booking request' 
      });
    }
  },
  
  // Handle voucher validation
  validateVoucher: async ({ request }) => {
    const formData = await request.formData();
    const voucherCode = formData.get('voucher')?.toString();
    const ticketId = formData.get('ticketId')?.toString();
    const quantity = parseInt(formData.get('quantity')?.toString() || '1');
    
    if (!voucherCode) {
      return fail(400, { voucherError: 'No voucher provided' });
    }
    
    if (!ticketId) {
      return fail(400, { voucherError: 'Please select a ticket first' });
    }
    
    try {
      // Check if voucher is valid, pass quantity
      const result = await validateVoucher(voucherCode, ticketId, quantity);
      
      return {
        voucherValid: true,
        discount: result.discount,
        message: result.message
      };
    } catch (error) {
      return fail(400, { 
        voucherError: error instanceof Error ? error.message : 'Invalid voucher' 
      });
    }
  }
};

// Mock database functions (in a real app these would connect to your database)
async function getTicketFromDatabase(ticketId) {
  // Simulate database query
  const tickets = [
    { id: 'vip', name: 'VIP', price: 3500, available: true, remainingTickets: 8, totalTickets: 25 },
    { id: 'patronA', name: 'PATRON A', price: 2000, available: true, remainingTickets: 198, totalTickets: 200 },
    { id: 'patronB', name: 'PATRON B', price: 1500, available: true, remainingTickets: 198, totalTickets: 200 },
    { id: 'lowerBox', name: 'LOWER BOX', price: 1000, available: false, availableFrom: '2025-04-10T10:00:00', availableUntil: '2025-04-15T23:59:59', remainingTickets: 150, totalTickets: 150 },
    { id: 'upperBox', name: 'UPPER BOX', price: 700, available: false, availableFrom: '2025-04-10T10:00:00', availableUntil: '2025-04-15T23:59:59', remainingTickets: 200, totalTickets: 200 },
    { id: 'standingA', name: 'STANDING A', price: 800, available: true, remainingTickets: 198, totalTickets: 200 },
    { id: 'standingB', name: 'STANDING B', price: 800, available: true, remainingTickets: 198, totalTickets: 200 }
  ];
  
  return tickets.find(t => t.id === ticketId);
}

async function validateVoucher(code, ticketId, quantity = 1) {
  // In a real app, check database for valid vouchers
  const validVouchers = {
    'DISCOUNT40': { 
      discountRate: 0.4, // 40% discount
      validForTickets: ['vip', 'patronA', 'patronB', 'lowerBox', 'upperBox', 'standingA', 'standingB'],
      message: '40% discount applied!'
    },
    'EARLYBIRD': { 
      discountRate: 0.15, // 15% discount
      validForTickets: ['patronA', 'patronB', 'lowerBox', 'upperBox', 'standingA', 'standingB'],
      message: '15% Early Bird discount applied!'
    },
    'VIP20': { 
      discountRate: 0.2, // 20% discount
      validForTickets: ['vip'],
      message: '20% VIP discount applied!'
    }
  };
  
  const voucher = validVouchers[code];
  
  if (!voucher) {
    throw new Error('Invalid voucher code');
  }
  
  if (!voucher.validForTickets.includes(ticketId)) {
    throw new Error('Voucher not valid for selected ticket type');
  }
  
  // Get ticket price
  const ticket = await getTicketFromDatabase(ticketId);
  if (!ticket) {
    throw new Error('Invalid ticket selection');
  }
  
  // Calculate subtotal (price × quantity)
  const subtotal = ticket.price * quantity;
  
  // Calculate discount amount based on subtotal
  const discountAmount = Math.round(subtotal * voucher.discountRate);
  
  return {
    discount: discountAmount,
    message: voucher.message
  };
}

async function createReservation(data) {
  // In a real app, save to database
  // For demo purposes, just return a random ID
  return 'RES-' + Math.floor(Math.random() * 1000000);
}