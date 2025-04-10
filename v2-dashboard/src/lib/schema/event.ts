import { z } from 'zod';

export const eventSchema = z.object({
	event: z.string().min(1, 'Event name is required'),
	subdomain: z.string().min(1, 'Subdomain is required'),
	location: z.string().min(1, 'Location is required'),
	richText: z.string().min(1, 'Description is required'),
	startDate: z.string().min(1, 'Start date is required'),
	endDate: z.string().min(1, 'End date is required'),
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
