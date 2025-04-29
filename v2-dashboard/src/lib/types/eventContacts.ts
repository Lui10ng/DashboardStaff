interface Contact {
	contactName: string;
	contactRole?: string | null;
	contactEmail?: string | null;
	contactPhone?: string | null;
	id?: string | null;
}

// Define the type for the API response containing only eventContacts
export interface EventContactsResponse {
	eventContacts: Contact[];
}