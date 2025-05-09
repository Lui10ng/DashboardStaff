import { z } from 'zod';

export const ticketSchema = z.object({
	id: z.number().optional(),
	event: z.number(),
	name: z.string().min(1, 'Ticket name is required'),
	description: z.string().optional(),
	price: z.number().min(1, 'Price is required'),
	currency: z.enum(['USD', 'PHP', 'EUR']).default('PHP'),
	status: z.enum(['active', 'inactive']).default('active'),
	quantityAvailable: z.number().min(1, 'Quantity is required'),
	minOrderQuantity: z.number().min(1, 'Minimum order quantity is required'),
	maxOrderQuantity: z.number().min(1, 'Maximum order quantity is required'),
	salesStart: z.string().min(1, 'Sales start date is required'),
	salesEnd: z.string().min(1, 'Sales end date is required'),
	color: z.string().min(1, 'Color is required'),
	seatMap: z.number().nullable().optional()
});
