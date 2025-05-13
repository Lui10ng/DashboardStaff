import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { handleSvelteError } from '$lib/utils/errorHandler';
import { checkSubdomainExists } from '$lib/utils/checkSubdomainExists';
import { eventSchema } from '$lib/schema';
import crypto from 'crypto';
import { createApiClient } from '$lib/services/payload.server';

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
				console.log('Received uploadImage request');
				const formData = await request.formData();

				const file = formData.get('file');

				console.log('Sending to Payload CMS...');
				console.log('File:', file);

				try {
					// Create a new FormData to send to Payload CMS
					const payloadFormData = new FormData();

					if (file instanceof File) {
						console.log('File is a valid File object:', file);
						/**
						 File is a valid File object: File {
							size: 32471,
							type: 'image/jpeg',
							name: 'TJD3EventPoster.jpg',
							lastModified: 1747024251173,		
							}					 
						 */

						// Generate a unique filename using crypto
						const fileExtension = file.name.split('.').pop();
						const uniqueFilename = `${crypto.randomUUID()}.${fileExtension}`;

						// Create a new File with the unique filename
						const uniqueFile = new File([file], uniqueFilename, {
							type: file.type
						});

						payloadFormData.append('file', uniqueFile, uniqueFilename);
					} else {
						console.error('File is not a valid File object:', file);
						return json({ error: 'Invalid file format' }, { status: 400 });
					}
					// Make direct fetch request to Payload CMS

					// const response = await fetch(`${PUBLIC_PAYLOAD_API_URL}api/media`, {
					// 	method: 'POST',
					// 	body: payloadFormData
					// });

					// use the api client to upload the image
					const apiClient = createApiClient(event);
					const response = await apiClient.post('media', payloadFormData, {
						headers: {
							'Content-Type': undefined
						}
					});

					if (!response) {
						const errorText = await response;
						console.error(`Payload CMS error (${response.status}):`, errorText);
						return json(
							{ error: `Payload CMS error: ${response.statusText}` },
							{ status: response.status }
						);
					}

					const data = await response;
					console.log('Payload CMS wgrerdfredgf', data);

					const mediaData = data.doc || data;

					return json({
						url: mediaData.url,
						id: mediaData.id,
						filename: mediaData.filename
					});
				} catch (uploadError) {
					console.error('Upload Error:', uploadError);
					return json({ error: 'Failed to upload to Payload CMS' }, { status: 500 });
				}
			} catch (err) {
				console.error('Image upload handler error:', err);
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
