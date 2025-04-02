import { BASE_URL } from '$env/static/private';
import type { FormData, FormResponse } from '../../routes/[eventId]/form/types';

interface FormSubmission {
	formData: FormData;
	responses: FormResponse[];
}

export const updateForm = async (submission: FormSubmission) => {
	const response = await fetch(`${BASE_URL}/api/submit-form`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(submission)
	});

	if (!response.ok) {
		throw new Error('Failed to submit form');
	}

	return response.json();
};
