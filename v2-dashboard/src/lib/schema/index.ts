import { z } from 'zod';

export const voucherSchema = z.object({
	code: z.string().min(1, 'Code is required'),
	description: z.string().min(1, 'Description is required'),
	status: z.string(),
	discountType: z.string().min(1, 'Discount type is required'),
	discountValue: z.number().min(1, 'Discount value is required'),
	currency: z.string(),
	validFrom: z.string().min(1, 'Valid from is required'),
	quantity: z.string().min(1, 'Quantity is required'),
	validUntil: z.string().min(1, 'Valid until is required'),
	minOrderAmount: z.number().min(1, 'Minimum order amount is required'),
	appliesToAllEvents: z.boolean()
});

export const contactSchema = z.object({
	contactName: z.string().min(1, 'Name is required'),
	contactEmail: z.string().email(),
	contactRole: z.string().min(1, 'Role is required'),
	contactPhone: z.string().min(1, 'Mobile number is required')
});

export const ticketSchema = z.object({
	ticketName: z.string().min(1, 'Ticket name is required'),
	price: z.number().min(1, 'Price is required'),
	quantity: z.number().min(1, 'Quantity is required'),
	minOrderQuantity: z.number().min(1, 'Minimum order quantity is required'),
	maxOrderQuantity: z.number().min(1, 'Maximum order quantity is required'),
	validfrom: z.string().min(1, 'Valid from is required'),
	validto: z.string().min(1, 'Valid to is required'),
	color: z.string().min(1, 'Color is required')
});

export const eventSchema = z.object({
	title: z.string().min(1, 'Event name is required'),
	subdomain: z
		.string()
		.min(3, 'Subdomain must be at least 3 characters')
		.max(60, 'Subdomain must be less than 60 characters')
		.regex(/^[a-z0-9]+$/, 'Subdomain can only contain lowercase letters and numbers')
		.transform((val) => val.toLowerCase()),
	location: z.string().min(1, 'Location is required'),
	description: z.string().min(1, 'Description is required'),
	startDate: z.string().min(1, 'Start date is required'),
	startTime: z.string().min(1, 'Start time is required'),
	endDate: z.string().min(1, 'End date is required'),
	endTime: z.string().min(1, 'End time is required'),
	logo: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((image) => image.size < 10 * 1024 * 1024, 'Max 10MB upload size.')
		.optional(),
	poster: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((image) => image.size < 10 * 1024 * 1024, 'Max 10MB upload size.')
		.optional(),
	background: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((image) => image.size < 10 * 1024 * 1024, 'Max 10MB upload size.')
		.optional()
});

export const themeSchema = z.object({
	theme: z.string().min(1, 'Theme is required'),
	modeTheme: z.string().min(1, 'Mode theme is required')
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
