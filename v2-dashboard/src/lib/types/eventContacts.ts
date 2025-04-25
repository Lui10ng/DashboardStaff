interface Contact {
	id: string; // Or number, depending on your Payload config
	name?: string;
	email?: string;
	phoneNumber?: string;
	role?: string; // Example field
	// Add other fields defined in your contactSchema
}

// Define the type for the API response containing only eventContacts
export interface EventContactsResponse {
	eventContacts: Contact[];
	// Potentially other minimal fields Payload might include by default like 'id',
	// but 'select' usually restricts it heavily.
	// You might need to check the actual API response to confirm.
}
