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

export interface ContactData {
	contactName: string;
	contactEmail: string | null;
	contactPhone: string | null;
	contactRole: string | null;
}
