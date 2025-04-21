import { z } from 'zod';

export const contactSchema = z.object({
	contactName: z.string().min(1, 'Name is required'),
	contactEmail: z.string().email(),
	contactRole: z.string().min(1, 'Role is required'),
	contactPhone: z.string().min(1, 'Mobile number is required')
});
