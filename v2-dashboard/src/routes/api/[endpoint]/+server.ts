import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { handleSvelteError } from '$lib/utils/errorHandler';
import { createApiClient } from '$lib/services/payload.server';
import type { MediaUploadResponse } from '$lib/types/media';
import { checkSubdomainExists } from '$lib/utils/checkSubdomainExists';
import { eventSchema } from '$lib/schema';

/**
 * Error Guidelines:
 *
 * HTTP Status Codes Used:
 * 200 - OK: Request succeeded
 * 400 - Bad Request: Invalid input (validation failed)
 * 404 - Not Found: Endpoint doesn't exist
 * 413 - Payload Too Large: File size exceeds limit
 * 415 - Unsupported Media Type: Invalid file type
 * 500 - Internal Server Error: Unexpected server error
 *
 */

export const POST: RequestHandler = async (event: RequestEvent) => {
	const { params, request } = event;
	const endpoint = params.endpoint;

	switch (endpoint) {
		case 'uploadImage': {
			try {
				const formData = await request.formData();
				const uploads: any[] = [];
				const apiClient = createApiClient(event);

				for (const [key, value] of formData.entries()) {
					if (value instanceof File && value.size > 0) {
						console.log('Uploading:', key, value.name);

						// Create a new FormData for each file
						const form = new FormData();
						// const compressedBuffer = await value.arrayBuffer();
						// const compressedBlob = new Blob([compressedBuffer], { type: value.type });
						form.append('file', value);
						form.append('alt', value.name);
						form.append('_payload', JSON.stringify({ alt: value.name }));

						// Use the apiClient to post the FormData
						try {
							const temp = await apiClient.post<MediaUploadResponse>('/media', form);

							uploads.push(temp);
						} catch (uploadError: any) {
							// Use handleSvelteError to format the error message for logging
							const { errorMessage } = handleSvelteError(
								uploadError,
								`Uploading ${value instanceof File ? value.name : 'file'}`, // Context
								`Failed to upload ${value instanceof File ? value.name : 'file'}` // User-facing message (though not thrown here)
							);
							// Log the standardized error message
							console.error(`Upload Error: ${errorMessage}`);

							continue; // Skip this file and continue with the next
						}
					}
				}

				return json({ uploads });
			} catch (err) {
				const { statusCode, errorMessage } = handleSvelteError(
					err,
					'Uploading Image',
					'Failed to Upload Image'
				);

				throw error(statusCode, errorMessage);
			}
		}

		case 'uploadPoster': {
			// Handle poster upload
			return json({ message: 'Poster uploaded successfully' });
		}

		case 'checkSubdomain': {
			const data = await request.json();
			const subdomain = data.subdomain;

			try {
				/**
				 * shape to access specific field in the schema
				 * safeParse to validate the subdomain
				 *
				 * gipasa ang subdomain sa shape.subdomain.safeParse
				 */

				const result = eventSchema.shape.subdomain.safeParse(subdomain);

				if (!result.success) {
					return json(
						{
							valid: false,
							error: result.error.errors[0].message
						},
						{ status: 400 }
					);
				}
				// Then check if it exists
				const exists = await checkSubdomainExists(subdomain);

				if (exists) {
					return json(
						{
							valid: false,
							error: 'This subdomain is already taken'
						},
						{ status: 400 }
					);
				}

				return json({
					valid: true,
					message: 'Subdomain is available'
				});
			} catch (error) {
				return json(
					{
						valid: false,
						error
					},
					{ status: 400 }
				);
			}
		}

		default:
			return json({ error: 'Unknown endpoint' }, { status: 404 });
	}
};
