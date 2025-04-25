/**
 * Represents the details of a specific generated image size.
 */
interface MediaSizeDetails {
	url?: string; // URL for this specific size
	width?: number; // Width of this size
	height?: number; // Height of this size
	mimeType?: string; // MIME type of this size
	filesize?: number; // File size of this size
	filename?: string; // Filename for this size (might differ from original)
}

/**
 * Represents the structure of a document in Payload's standard Media collection.
 * NOTE: Add any custom fields you might have configured.
 */
interface MediaDocument {
	id: string;
	alt?: string; // The alt text provided during upload
	filename?: string; // Original filename
	mimeType?: string; // e.g., 'image/jpeg', 'application/pdf'
	filesize?: number; // Size in bytes
	width?: number; // Image width (if applicable)
	height?: number; // Image height (if applicable)
	url?: string; // Direct URL to the original uploaded file
	sizes?: {
		// The keys here (e.g., 'thumbnail', 'card', 'tablet') depend on
		// your Payload Media collection's 'imageSizes' configuration.
		// Using a generic index signature if specific sizes are unknown.
		[key: string]: MediaSizeDetails;
	};
	createdAt: string; // ISO date string
	updatedAt: string; // ISO date string
	// Add any other custom fields defined in your Payload Media collection
}

/**
 * Represents the standard response structure from Payload CMS
 * after successfully creating (POSTing) a new document.
 */
interface PayloadCreateResponse<T> {
	doc: T; // The newly created document object
	message: string; // Success message (e.g., "Media created successfully.")
}

// Combine them for the specific media upload response type
export type MediaUploadResponse = PayloadCreateResponse<MediaDocument>;
