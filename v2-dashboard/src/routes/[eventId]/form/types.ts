export type FieldType =
	| 'text'
	| 'email'
	| 'phone'
	| 'date'
	| 'time'
	| 'multipleChoice'
	| 'checkbox'
	| 'dropdown'
	| 'file'
	| 'firstName'
	| 'lastName'
	| 'region'
	| 'city'
	| 'shortText'
	| 'longText';

export interface FormField {
	id: string;
	name: string;
	label: string;
	required: boolean;
	fieldType: FieldType;
	options?: string[];
	description?: string | null;
}

export interface FormData {
	id: number;
	title: string;
	description: string;
	formBuilder: FormField[];
}

export interface FormResponse {
	form: FormData;
}

export interface FormValidationError {
	fieldId: string;
	message: string;
}