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
