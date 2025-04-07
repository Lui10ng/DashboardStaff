import { z } from 'zod';

export const registration = (fields: any): any => {
	const z_object_fields: any = {};
	for (const field of fields) {
		if (field.fieldType == 'email') {
			z_object_fields[field.name] = z.string().email();
			continue;
		}
		if (field.fieldType == 'checkbox') {
			z_object_fields[field.name] = z.boolean();
			continue;
		}

		z_object_fields[field.name] = z.string().min(1, `${field.label} should not be empty!`);
	}
	z_object_fields['payment'] = z.any();
	return z.object({
		tabs: z.object(z_object_fields).array()
	});
};
