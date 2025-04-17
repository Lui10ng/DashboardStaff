export type FieldType =
	| 'text'
	| 'email'
	| 'phone'
	| 'number'
	| 'date'
	| 'time'
	| 'multipleChoice'
	| 'checkbox'
	| 'dropdown'
	| 'file'
	| 'shortText'
	| 'longText'
	| 'region'
	| 'city';

export interface FormField {
	id: string;
	name: string;
	fieldType: FieldType;
	label: string;
	required: boolean;
	description?: string;
	options?: { value: string }[];
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
