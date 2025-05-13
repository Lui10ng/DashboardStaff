import { z } from 'zod';

export const voucherSchema = z.object({
  code: z.string().min(1, 'Voucher code is required'),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().min(0, 'Discount value must be 0 or greater'),
  currency: z.string().optional(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  validFrom: z.string().min(1, 'Valid from date is required'),
  validUntil: z.string().min(1, 'Valid until date is required'),
  minOrderAmount: z.number().min(0, 'Minimum order amount must be 0 or greater').optional(),
  status: z.enum(['active', 'inactive', 'expired']).default('active'),
  appliesToAllEvents: z.boolean().default(false),
  applicableEvents: z.array(z.number()).optional()
}); 