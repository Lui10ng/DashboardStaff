// src/collections/Registrants.ts
import type { CollectionConfig } from 'payload';
// import { isAdmin } from '../access/isAdmin';
// import { isOwnerOrAdmin_Complex } from '../access/isOwnerOrAdmin_Complex'; // Needs careful implementation for guests/related data
import type { User } from '../payload-types';

const Registrants: CollectionConfig = {
  slug: 'registrants',
  admin: {
    // Might need a way to display identifying info like related user/guest email or ticket code
    useAsTitle: 'id', // Defaulting to ID, could customize with hooks/virtual fields
    description: 'Stores submitted answers from mandatory registration forms per ticket.',
    defaultColumns: ['id', 'ticket', 'registeredUser', 'guestEmail', 'event', 'createdAt'],
    listSearchableFields: ['guestEmail', /* Add User email? Ticket code? */],
    group: 'Orders & Tickets',
    // Like Orders/Tickets, generally created programmatically, not via Admin UI
    // disableCreation: true,
    // Editing submitted answers might be disallowed or highly restricted
    // disableUpdate: true,
  },
  // Access Control Notes:
  // This contains potentially sensitive PII submitted via forms.
  // - Admins can see all.
  // - Organizers should see registrants for their events.
  // - The registered user (if applicable) should see their own submission.
  // - Guests need a secure way (unique link?) to view/manage their submission if allowed.
  access: {
    // read: ({ req: { user } }) => true, // Placeholder - Needs refinement (e.g., isAdminOrEventOrganiserOrOwner)
    // create: isAdmin, // Only system/admin creates this programmatically
    // update: isAdmin, // Restrict updates
    // delete: isAdmin, // Restrict deletion
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    // --- Links to Context ---
    {
      name: 'ticket',
      label: 'Associated Ticket',
      type: 'relationship',
      relationTo: 'tickets', // ** Direct link to the specific ticket **
      required: true,
      hasMany: false,
      unique: true, // Each ticket should only have one registration data entry
      index: true,
      admin: {
        readOnly: true,
        description: 'The unique ticket this registration data belongs to.',
      },
    },
    // Store Event link for easier querying/filtering, though derivable from Ticket
    {
      name: 'event',
      label: 'Event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
      hasMany: false,
      index: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    // --- Registrant Identification (User or Guest) ---
    {
      name: 'registeredUser',
      label: 'Registered User (if applicable)',
      type: 'relationship',
      relationTo: 'users',
      required: false, // ** Not required, allowing for guests **
      index: true,
      admin: {
        readOnly: true,
        condition: (data) => Boolean(data.registeredUser), // Show only if linked
        description: 'The logged-in user account associated with this registration.',
      },
    },
    // Store guest details captured from the registration form IF user is not logged in
    {
      name: 'guestDetails',
      label: 'Guest Details (if not logged in)',
      type: 'group',
      // Hide this group entirely if registeredUser has a value
      admin: {
        condition: (data) => !data.registeredUser,
      },
      fields: [
         {
            name: 'guestEmail',
            label: 'Guest Email',
            type: 'email',
            index: true,
            // Required only if registeredUser is null/empty
            // validate: (value, { siblingData, siblingValue, data }) => {
            //     // Accessing top-level data is tricky in field validate, might need collection hook
            //     // Basic check:
            //     if (!data?.registeredUser && !value) {
            //         return 'Guest Email is required for guest registrations.';
            //     }
            //      if (value && typeof value === 'string' && !value.includes('@')) {
            //         return 'Please enter a valid email address.';
            //     }
            //     return true;
            // },
          },
          // Assuming your form template *requires* first/last name if not logged in
          { name: 'guestFirstName', label: 'Guest First Name', type: 'text', required: true },
          { name: 'guestLastName', label: 'Guest Last Name', type: 'text', required: true },
          // Add other essential guest contact info captured *from the form* here if needed,
          // redundant if it's captured in submittedAnswers JSON anyway.
      ]
    },
    // --- Submitted Form Answers ---
    {
      name: 'submittedAnswers',
      label: 'Submitted Form Answers',
      type: 'json', // Stores the key-value pairs from the custom form
      required: true,
      admin: {
        readOnly: true, // Answers shouldn't be edited after submission
        description: 'The actual data submitted by the attendee via the event\'s registration form.',
      },
    },
    // Optional: Link back to the template used (for reference)
    // { name: 'formTemplateUsed', type: 'relationship', relationTo: 'registration-form-templates', admin: { readOnly: true } }
  ],
  timestamps: true, // Includes createdAt, updatedAt
  hooks: {
      // Potential Hooks:
      // - beforeValidate/beforeChange: Could potentially validate 'submittedAnswers' JSON
      //   against the schema defined in the linked 'event.registrationForm.formDefinition',
      //   although this can be complex and might be better handled during form submission logic.
      // - afterChange: Trigger confirmation emails or other actions based on registration.
  }
};

export default Registrants;