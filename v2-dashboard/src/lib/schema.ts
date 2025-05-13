import { z } from 'zod';

// ... other schemas ...

export const eventSchema = z.object({
  event: z.string().min(1, 'Event name is required'),
  subdomain: z.string().min(1, 'Subdomain is required'),
  location: z.string().optional(),
  richText: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endDate: z.string().min(1, 'End date is required'),
  endTime: z.string().min(1, 'End time is required'),
  logo: z.any().optional(),
  poster: z.any().optional(),
  background: z.any().optional()
});

export const ticketTypeSchema = z.object({
  name: z.string().min(1, 'Ticket name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be 0 or greater'),
  currency: z.enum(['USD', 'PHP', 'EUR']),
  quantityAvailable: z.number().int().min(1, 'Quantity must be at least 1'),
  minOrderQuantity: z.number().int().min(1, 'Minimum order must be at least 1').default(1),
  maxOrderQuantity: z.number().int().min(1, 'Maximum order must be at least 1').optional(),
  color: z.string().default('#000000'),
  status: z.enum(['active', 'inactive']).default('active'),
  salesStart: z.string().optional(),
  salesEnd: z.string().optional(),
  event: z.number(),
  seatMap: z.number().optional(),
  paymentActive: z.boolean().default(true)
}); 