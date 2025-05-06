import type { CollectionConfig } from 'payload'
import { formatSlug } from '@/utils/slugify'
import crypto from 'crypto'
import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEventRole } from '@/access/isAdminOrEventRole'
import { EVENT_ROLES } from '@/types/eventRoles'

const { MANAGER, EDITOR, VIEWER } = EVENT_ROLES

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
    read: isAdminOrEventRole([MANAGER, EDITOR, VIEWER]),
    create: () => true,
    update: isAdminOrEventRole([MANAGER, EDITOR]),
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Auto-generate slug from title
        if (data.title && (data.slug == null || data.slug === '')) {
          data.slug = formatSlug(data.title)
        }

        console.log('beforeChange hook - operation:', operation)

        return data
      },
    ],

    afterOperation: [
      async ({ args, operation, result, req }) => {
        const request = req || args?.req
        const doc = result

        // Assign manager role after a successful 'create' operation
        if (operation === 'create' && request?.user && doc?.id) {
          console.log('Assigning manager role via afterOperation:', {
            userId: request.user.id,
            eventId: doc.id,
          })
          const userId = request.user.id
          const eventId = doc.id

          try {
            // Use the payload instance from the request
            const payload = request.payload
            const newUserEventRole = await payload.create({
              collection: 'event-user-roles',
              data: {
                user: userId,
                event: eventId,
                role: MANAGER,
              },
              overrideAccess: true, // Still needed if event-user-roles has restrictive access
              req: request, // Pass the request object down if needed by deeper hooks/access controls
            })

            // console.log('Manager role assigned successfully via afterOperation:', { newUserEventRoleId: newUserEventRole.id });
          } catch (error) {
            const err = error as Error
            console.error(
              `Error assigning manager role (afterOperation) to user ${userId} for event ${eventId}:`,
              {
                message: err.message,
                // Optionally log stack in dev:
                // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
              },
            )
          }
        }

        if (operation === 'create' && request?.payload && doc?.id) {
          try {
            const eventId = doc.id
            const payload = request.payload
            const title = `${doc.title || 'Event'} Registration Form`

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

            try {
              const form = await payload.create({
                collection: 'forms',
                data: {
                  title: title,
                  description: 'Please fill out this registration form',
                  formBuilder: formBuilderFields,
                  eventId: eventId,
                },
                overrideAccess: true,
                req: request,
              })

              console.log('Form created successfully for event:', doc.id, 'Form ID:', form.id)
            } catch (delayedError) {
              console.error('Delayed form creation failed:', delayedError)
            }
          } catch (error) {
            const err = error as Error
            console.error('Error creating form in afterChange hook:', {
              message: err.message,
              stack: err.stack,
            })
          }
        }

        return result
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
      name: 'user',
      label: 'User',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    // {
    //   name: 'venue',
    //   label: 'Venue',
    //   type: 'relationship',
    //   relationTo: 'venues',
    //   required: false,
    //   hasMany: false,
    //   index: true,
    //   admin: {
    //     position: 'sidebar',
    //   },
    // },
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
      required: false,
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
      name: 'form',
      type: 'join',
      collection: 'forms',
      on: 'eventId',
    },
    {
      name: 'ticketType',
      type: 'join',
      collection: 'ticket-types',
      on: 'event',
    },
  ],
  timestamps: true,
}

export default Events
