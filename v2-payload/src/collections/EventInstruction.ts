import type { CollectionConfig } from 'payload'
import { isAdminOrEventRole } from '@/access/isAdminOrEventRole'
import { EVENT_ROLES } from '@/types/eventRoles'

const { MANAGER, EDITOR, VIEWER } = EVENT_ROLES

const EventInstructions: CollectionConfig = {
  slug: 'event-instructions',
  admin: {
    useAsTitle: 'event',
    description: 'Instructions related to specific events.',
    defaultColumns: ['event', 'status', 'updatedAt'],
    listSearchableFields: ['event'],
    group: 'Organizers & Events',
  },

  access: {
    read: () => true,
    // create: isAdminOrEventRole([MANAGER, EDITOR]),
    create: () => true,
    update: isAdminOrEventRole([MANAGER, EDITOR]),
    delete: isAdminOrEventRole([MANAGER, EDITOR]),
  },
  fields: [
    {
      name: 'event',
      label: 'Associated Event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
      hasMany: false,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      enumName: 'InstructionStatus',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'eventInstructions',
      type: 'array',
      label: 'Event Instruction',
      admin: {
        description: 'List specific Instruction for this event.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'instructionImage',
          type: 'text',
          required: false,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          label: 'Instruction Content',
          type: 'code',
          required: true,
          admin: {
            language: 'html',
          },
        },
      ],
    },
  ],

  timestamps: true, // Adds createdAt, updatedAt
}

export default EventInstructions
