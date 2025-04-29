import { z } from 'zod';

export const ticketSchema = z.object({
	id: z.string().optional(),
	ticketName: z.string().min(1, 'Ticket name is required'),
	price: z.number().min(1, 'Price is required'),
	quantity: z.number().min(1, 'Quantity is required'),
	minOrderQuantity: z.number().min(1, 'Minimum order quantity is required'),
	maxOrderQuantity: z.number().min(1, 'Maximum order quantity is required'),
	validfrom: z.string().min(1, 'Valid from is required'),
	validto: z.string().min(1, 'Valid to is required'),
	color: z.string().min(1, 'Color is required')
});
