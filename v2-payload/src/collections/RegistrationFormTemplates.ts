import type { CollectionConfig } from 'payload';
import { isAdminOrEventRole } from '@/access/isAdminOrEventRole';
import { EVENT_ROLES } from '@/types/eventRoles';

const { MANAGER, EDITOR, VIEWER } = EVENT_ROLES;

// Define a TypeScript interface for your expected form field structure (optional but helpful)
// This helps ensure consistency in the JSON data and can be shared with the frontend.
interface FormFieldDef {
  name: string; // e.g., 'tShirtSize', 'dietaryNeeds'
  label: string; // e.g., 'T-Shirt Size', 'Dietary Needs'
  fieldType: 'text' | 'textarea' | 'select' | 'checkbox' | 'email' | 'number'; // Allowed field types
  required?: boolean;
  options?: Array<{ label: string; value: string }>; // For select fields
  placeholder?: string;
  helpText?: string;
}

const RegistrationFormTemplates: CollectionConfig = {
  slug: 'registration-form-templates',
  admin: {
    useAsTitle: 'name',
    description: 'Define reusable structures for mandatory event registration forms.',
    defaultColumns: ['name', 'description', 'updatedAt'],
    listSearchableFields: ['name', 'description'],
    group: 'Configuration',
  },
  // Access Control Notes:
  // Creating/modifying form structures should be highly restricted (e.g., Admins only).
  // Reading might be allowed for Organizers when selecting a template for an event.
  access: {
    // read: ({ req: { user } }) => Boolean(user), // Allow logged-in users (e.g., Organizers) to see/select templates
    // create: isAdmin,
    // update: isAdmin,
    // delete: isAdmin,
    read: isAdminOrEventRole([MANAGER, EDITOR, VIEWER]),
    create: isAdminOrEventRole([MANAGER, EDITOR]),
    update: isAdminOrEventRole([MANAGER, EDITOR]),
    delete: isAdminOrEventRole([MANAGER, EDITOR]),
  },
  fields: [
    {
      name: 'name',
      label: 'Template Name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Internal name for this form template (e.g., "Standard Attendee Info", "Workshop Detailed Info").',
      },
    },
    {
      name: 'description',
      label: 'Template Description',
      type: 'textarea',
      admin: {
        description: 'Optional internal notes about when/where to use this template.',
      },
    },
    {
      name: 'formDefinition',
      label: 'Form Definition (JSON)',
      type: 'json', // Payload's JSON field type
      required: true,
      // You can optionally provide a TypeScript interface for better validation/intellisense
      // jsonSchema: FormFieldDef[], // If you want basic editor validation against an interface
      admin: {
        description: `Define the form structure using JSON. It MUST be an array of field definition objects. Each object requires 'name', 'label', 'fieldType'. Optional fields: 'required' (boolean), 'options' (array of {label, value} for select), 'placeholder', 'helpText'. Example: [{"name": "tShirtSize", "label": "T-Shirt Size", "fieldType": "select", "options": [{"label": "Small", "value": "s"}, {"label": "Medium", "value": "m"}], "required": true}]`,
        // Consider using Monaco editor component for a better JSON editing experience in Admin UI
        // components: { Field: MonacoJSONEditor }, // Needs setup
      },
      // Optional: Add validation to ensure the JSON adheres to your specific structure
      validate: async (value /* : FormFieldDef[] | any */, { operation }) => {
        if (operation === 'create' || operation === 'update') {
          if (!Array.isArray(value)) return 'Form Definition must be a JSON array.';

          for (const field of value) {
            if (!field || typeof field !== 'object') return 'Each item in the array must be an object.';
            if (!field.name || typeof field.name !== 'string') return 'Each field object must have a non-empty string "name".';
            if (!field.label || typeof field.label !== 'string') return `Field "${field.name || '?'}" must have a non-empty string "label".`;
            if (!field.fieldType || typeof field.fieldType !== 'string') return `Field "${field.name}" must have a non-empty string "fieldType".`;
            // Add more checks: valid field types, options structure for selects, etc.
            // Consider using a validation library like Zod here for robust checking:
            // try {
            //   const FormDefinitionSchema = z.array(z.object({ ... })); // Define Zod schema
            //   FormDefinitionSchema.parse(value);
            // } catch (err) {
            //   return `Invalid form definition JSON structure: ${err.message}`;
            // }
          }
        }
        return true; // Passes validation
      },
    },
  ],
  timestamps: true,
};

export default RegistrationFormTemplates;