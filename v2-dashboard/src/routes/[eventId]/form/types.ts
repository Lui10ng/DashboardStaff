export interface FormFieldTypes {
    id: string;
    type: FieldType;
    label: string;
    required: boolean;
    options?: string[];
    description?: string;
    placeholder?: string;
}

export type FieldType =
    | 'shortText'
    | 'longText'
    | 'email'
    | 'phone'
    | 'number'
    | 'date'
    | 'time'
    | 'multipleChoice'
    | 'checkbox'
    | 'dropdown'
    | 'file'
    | 'name'
    | 'price'
    | 'region'
    | 'city'
    | 'street';

export interface FormData {
    title: string;
    description: string;
    fields: FormFieldTypes[];
}