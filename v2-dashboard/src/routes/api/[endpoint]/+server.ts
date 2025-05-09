import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { handleSvelteError } from '$lib/utils/errorHandler';
import { createApiClient } from '$lib/services/payload.server';
import type { MediaUploadResponse } from '$lib/types/media';
import { checkSubdomainExists } from '$lib/utils/checkSubdomainExists';
import { eventSchema } from '$lib/schema';
import { env } from '$env/dynamic/public';
import crypto from 'crypto'

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
				for (const [key, value] of formData.entries()) {
					if (value instanceof File) {
						const newName = `${crypto.randomUUID()}.${value.name.split('.').pop()}`; // preserve original extension
						const renamedFile = new File([value], newName, {
							type: value.type,
						});
						const form = new FormData();
						form.append('file', renamedFile); // Send Base64
						form.append('_payload', JSON.stringify({ alt: value.name }));
						try {
							const res = await fetch(env.PUBLIC_PAYLOAD_API_URL+'/api/media', {
							method: 'POST',
							credentials: 'include',
							body: form,
							});
							uploads.push(res);
						} catch (uploadError: any) {
							console.error('Upload Error:', uploadError);
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
