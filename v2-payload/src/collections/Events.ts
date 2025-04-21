import type { CollectionConfig } from 'payload';
// import { isAdmin } from '../access/isAdmin';
// import { isAdminOrPublished } from '../access/isAdminOrPublished'; // Requires refinement for non-admin draft visibility
import { formatSlug } from '../utils/slugify';
import type { User } from '../payload-types';

const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    description: 'Core collection for managing individual events.',
    defaultColumns: ['title', 'status', 'seatingType', 'startTime', 'venue', 'category'],
    listSearchableFields: ['title', 'description'],
    group: 'Organizers & Events',
  },
  // Access Control Notes:
  // Public reads likely limited to 'published' events.
  // Creation/Update/Deletion should be limited to Admins or managing users of the linked Organizer.
  access: {
    // read: isAdminOrPublished, // Example: Public sees published, admin sees all
    // create: ({ req: { user } }) => Boolean(user), // Needs refinement - check roles/organizer link
    // update: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')), // Needs refinement
    // delete: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')), // Needs refinement
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  hooks: {
    // Auto-generate slug from name
    beforeChange: [
      ({ data }) => {
        if (data.name && (data.slug == null || data.slug === '')) { // Generate only if name exists and slug is empty
          data.slug = formatSlug(data.name);
        }
        return data;
      },
    ],
  },
  fields: [
    // --- Core Details ---
    { 
      name: 'title', 
      label: 'Event Title', 
      type: 'text', 
      required: true, 
      index: true
     },
    { 
      name: 'slug', 
      label: 'Slug', 
      type: 'text', 
      required: true, 
      unique: true, 
      index: true, 
      admin: { 
        position: 'sidebar', 
        // readOnly: true
       } 
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      required: true,
      defaultValue: '',
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'status', 
      label: 'Status', 
      type: 'select', 
      required: true, 
      index: true,
      options: [
         'Draft', 
         'Published', 
         'Cancelled', 
         'Archived'
      ],
      defaultValue: 'Published',
      enumName: 'EventStatus',
      admin: { position: 'sidebar' },
    },
   
    { type: 'row', fields: [ /* startTime, endTime with validation as before */
        { 
          name: 'startTime', 
          label: 'Start Time', 
          type: 'date', 
          required: true, 
          admin: {
            date: {
              pickerAppearance: 'dayAndTime'
            },
            width: '50%'
          }
        },
        { 
          name: 'endTime', 
          label: 'End Time', 
          type: 'date', 
          required: true, 
          admin: { 
            date: { 
              pickerAppearance: 'dayAndTime' 
            }, 
            width: '50%' 
          },
        //   validate: (value, { siblingData }) => { return (siblingData.startTime && value && new Date(value) <= new Date(siblingData.startTime)) ? 'End Time must be after Start Time.' : true; }
        },
    ]},
    { 
      name: 'description', 
      label: 'Event Description', 
      type: 'richText' 
    },

    // --- Relationships ---
    { 
      name: 'organizer', 
      label: 'Organizer', 
      type: 'relationship', 
      relationTo: 'organizers', 
      required: true, 
      hasMany: false, 
      index: true, 
      admin: { 
        position: 'sidebar'
       } 
      },
    { 
      name: 'venue', 
      label: 'Venue', 
      type: 'relationship', 
      relationTo: 'venues', 
      required: true, 
      hasMany: false, 
      index: true, 
      admin: { 
        position: 'sidebar' 
      } 
    },
    { 
      name: 'category', 
      label: 'Category', 
      type: 'relationship', 
      relationTo: 'event-categories', 
      hasMany: false, 
      index: true, 
      admin: { 
        position: 'sidebar' 
      } 
    },
    { 
      name: 'eventImages',
      label: 'Event Images', 
      type: 'relationship', 
      relationTo: 'media', 
      hasMany: true
    }, // Link to general 'media'

    // --- Seating Configuration ---
    {
      name: 'seatingType', 
      label: 'Seating Type', 
      type: 'select', 
      required: true,
      options: [ 
         'general_admission', 
         'reserved_seating'
       ],
      defaultValue: 'general_admission',
      enumName: 'SeatingType',
      admin: { 
        description: 'Select the seating arrangement type.' 
      }
    },
    {
      name: 'seatMap', 
      label: 'Seat Map Layout', 
      type: 'relationship', 
      relationTo: 'seat-maps', 
      hasMany: false,
      admin: {
        condition: (data) => data.seatingType === 'reserved_seating', // Show only if reserved seating
        description: 'Select the seat map layout for this event.',
      },
      // Make required only if reserved seating
    //   validate: (value, { siblingData }) => (siblingData.seatingType === 'reserved_seating' && !value) ? 'A Seat Map is required for Reserved Seating events.' : true,
    },
    { 
      name: 'totalCapacity', 
      label: 'Overall Event Capacity (Optional)', 
      type: 'number', 
      min: 0, 
      admin: {
        description: 'Optional overall venue limit for this event.'
      }
    },

    // --- Registration Configuration ---
    {
      name: 'registrationForm',
      label: 'Registration Form Template',
      type: 'relationship',
      relationTo: 'registration-form-templates',
      required: true, // Mandatory as per latest requirement
      hasMany: false,
      admin: {
        description: 'Select the MANDATORY registration form attendees must complete.',
      }
    },
    {
      name: 'registrationNotes',
      label: 'Registration Notes / Instructions',
      type: 'richText', // Allow formatted instructions
      admin: {
        description: 'Optional notes or instructions to display alongside the registration form.',
      }
    },

    // --- Event Specific Details ---
    {
      name: 'eventContacts',
      label: 'Event Specific Contacts',
      type: 'array',
      admin: {
        description: 'List specific contact persons for this event (if different from Organizer/Venue).',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row', fields: [
            { 
              name: 'contactName', 
              label: 'Name', 
              type: 'text', 
              required: true, 
              admin: { 
                width: '40%'
               } 
              },
            { 
              name: 'contactRole', 
              label: 'Role (Optional)', 
              type: 'text', 
              admin: { 
                width: '60%' 
              } 
            },
          ]
        },
        {
          type: 'row', fields: [
            { 
              name: 'contactEmail', 
              label: 'Email', 
              type: 'email', 
              admin: { 
                width: '50%' 
              } 
            },
            { 
              name: 'contactPhone', 
              label: 'Phone', 
              type: 'text', 
              admin: { 
                width: '50%' 
              } 
            },
          ]
        },
      ]
    }
  ],
  timestamps: true,
  
};

export default Events;