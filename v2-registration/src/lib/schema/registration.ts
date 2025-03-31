import { z } from 'zod';

export const registration = (fields: any): any => {
	const z_object_fields: any = {};
	for (const field of fields) {
		if (field.fieldType == 'email') {
			z_object_fields[field.name] = z.string().email();
			continue;
		}
		z_object_fields[field.name] = z.string().min(1);
	}
	z_object_fields['payment'] = z.any();
	return z.object({
		tabs: z.object(z_object_fields).array()
	});
};
