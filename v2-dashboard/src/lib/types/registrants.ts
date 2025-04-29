import type { PayloadPaginatedResponse } from "./payloadResponse";

/**
 * Represents the structure for a single field's answer.
 */
interface FieldAnswer {
	id: string;
	value: string; // Or potentially 'any' if values can be non-strings
}

/**
 * Represents the structure of the submittedAnswers array.
 * It's an array containing one object where keys are field names (e.g., 'email', 'firstName')
 * and values follow the FieldAnswer structure.
 */
type SubmittedAnswers = [
	{
		[fieldName: string]: FieldAnswer;
	}
];

/**
 * Represents a single registrant document based on the selected fields.
 * Payload usually includes 'id' and 'updatedAt' even if not explicitly selected.
 */
export interface Registrant {
	id: string;
	submittedAnswers: SubmittedAnswers;
	createdAt: string; // ISO date string
	updatedAt?: string; // Often included by default
}

/**
 * Specific type for the paginated response from the /registrants endpoint.
 */
export type RegistrantsResponse = PayloadPaginatedResponse<Registrant>;
