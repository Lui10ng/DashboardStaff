import type { CollectionConfig } from 'payload'
// import { isAdmin } from '../access/isAdmin';
// import { isAdminOrPublished } from '../access/isAdminOrPublished'; // Requires refinement for non-admin draft visibility
import { formatSlug } from '../utils/slugify'
import type { User } from '../payload-types'
import crypto from 'crypto'

interface EventData {
  title?: string
  slug?: string
  id?: string
  formId?: string | number
  [key: string]: any
}

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
    beforeChange: [
      async ({ data, req, operation }) => {
        // Auto-generate slug from title
        if (data.title && (data.slug == null || data.slug === '')) {
          data.slug = formatSlug(data.title)
        }

        console.log('beforeChange hook - operation:', operation)

        // Only create a form if this is a create operation and we don't have a form yet
        if (operation === 'create' && !data.formId) {
          try {
            console.log('Creating form for new event with title:', data.title)
            console.log('crypto.randomUUID exists:', typeof crypto.randomUUID === 'function')

            const formBuilderFields = [
              {
                name: 'firstName',
                label: 'First Name',
                required: true,
                fieldType: 'text' as const,
                id: crypto.randomUUID(),
              },
              {
                name: 'lastName',
                label: 'Last Name',
                required: true,
                fieldType: 'text' as const,
                id: crypto.randomUUID(),
              },
              {
                name: 'contactNumber',
                label: 'Contact Number',
                required: true,
                fieldType: 'text' as const,
                id: crypto.randomUUID(),
              },
              {
                name: 'email',
                label: 'Email',
                required: true,
                fieldType: 'email' as const,
                id: crypto.randomUUID(),
              },
            ]

            console.log('Form fields prepared:', formBuilderFields.length)

            // Create a new form with default fields
            console.log('Attempting to create form...')
            const form = await req.payload.create({
              collection: 'forms',
              data: {
                title: `${data.title || 'Event'} Registration Form`,
                description: 'Please fill out this registration form',
                formBuilder: formBuilderFields,
              },
            })

            console.log('Form created successfully with ID:', form.id)
            data.formId = form.id

            console.log('Form ID set in event data:', data.formId)
            return data
          } catch (error) {
            const err = error as Error
            console.error('Error creating form for event:', {
              error: err,
              errorMessage: err.message,
              errorStack: err.stack,
            })
            console.error('Error details:', JSON.stringify(error))
            throw new Error(`Failed to create form: ${err.message}`)
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        console.log('afterChange hook - operation:', operation)
        console.log('afterChange doc received:', {
          id: doc.id,
          title: doc.title,
          formId: typeof doc.formId === 'object' ? doc.formId.id : doc.formId,
        })

        if (operation === 'create' && doc.formId) {
          try {
            const formId = typeof doc.formId === 'object' ? doc.formId.id : doc.formId
            const eventId = doc.id

            console.log('Starting form update process:', {
              formId,
              eventId,
              operation,
            })

            // Delay the form update slightly to ensure event is fully committed
            // This helps avoid potential circular reference issues
            setTimeout(async () => {
              try {
                console.log('Delayed form update starting now for:', formId)

                const updatedForm = await req.payload.update({
                  collection: 'forms',
                  id: formId,
                  data: {
                    eventId,
                  },
                })

                console.log('Delayed form update completed:', Boolean(updatedForm))
              } catch (delayedError) {
                console.error('Delayed form update failed:', delayedError)
              }
            }, 500)

            // Return immediately while the delayed update happens in background
            return doc
          } catch (error) {
            const err = error as Error
            console.error('Error in afterChange hook:', {
              message: err.message,
              stack: err.stack,
            })
            return doc
          }
        }
        console.log('Form update skipped - conditions not met:', {
          operation,
          hasFormId: Boolean(doc.formId),
        })
        return doc
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
      index: true,
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
      },
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      required: true,
      defaultValue: '',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      index: true,
      options: ['Draft', 'Published', 'Cancelled', 'Archived'],
      defaultValue: 'Published',
      enumName: 'EventStatus',
      admin: { position: 'sidebar' },
    },

    {
      type: 'row',
      fields: [
        /* startTime, endTime with validation as before */
        {
          name: 'startTime',
          label: 'Start Time',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            width: '50%',
          },
        },
        {
          name: 'endTime',
          label: 'End Time',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            width: '50%',
          },
          //   validate: (value, { siblingData }) => { return (siblingData.startTime && value && new Date(value) <= new Date(siblingData.startTime)) ? 'End Time must be after Start Time.' : true; }
        },
      ],
    },
    {
      name: 'description',
      label: 'Event Description',
      type: 'richText',
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
        position: 'sidebar',
      },
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
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      label: 'Category',
      type: 'relationship',
      relationTo: 'event-categories',
      hasMany: false,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'eventImages',
      label: 'Event Images',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    }, // Link to general 'media'

    // --- Seating Configuration ---
    {
      name: 'seatingType',
      label: 'Seating Type',
      type: 'select',
      required: true,
      options: ['general_admission', 'reserved_seating'],
      defaultValue: 'general_admission',
      enumName: 'SeatingType',
      admin: {
        description: 'Select the seating arrangement type.',
      },
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
        description: 'Optional overall venue limit for this event.',
      },
    },

    // --- Registration Configuration ---
    {
      name: 'registrationForm',
      label: 'Registration Form Template',
      type: 'relationship',
      relationTo: 'registration-form-templates',
      required: false,
      hasMany: false,
      admin: {
        description: 'Select the registration form attendees must complete.',
      },
    },
    {
      name: 'registrationNotes',
      label: 'Registration Notes / Instructions',
      type: 'richText', // Allow formatted instructions
      admin: {
        description: 'Optional notes or instructions to display alongside the registration form.',
      },
    },

    // --- Event Specific Details ---
    {
      name: 'eventContacts',
      label: 'Event Specific Contacts',
      type: 'array',
      admin: {
        description:
          'List specific contact persons for this event (if different from Organizer/Venue).',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'contactName',
              label: 'Name',
              type: 'text',
              required: true,
              admin: {
                width: '40%',
              },
            },
            {
              name: 'contactRole',
              label: 'Role (Optional)',
              type: 'text',
              admin: {
                width: '60%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'contactEmail',
              label: 'Email',
              type: 'email',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'contactPhone',
              label: 'Phone',
              type: 'text',
              admin: {
                width: '50%',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'formId',
      type: 'relationship',
      relationTo: 'forms',
      hasMany: false,
      admin: {
        position: 'sidebar',
        description: 'The registration form for this event',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}

export default Events
