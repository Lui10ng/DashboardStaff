import type { CollectionConfig } from 'payload'
import { isAdminOrEventRole } from '@/access/isAdminOrEventRole'
import { EVENT_ROLES } from '@/types/eventRoles'

const { MANAGER, EDITOR, VIEWER } = EVENT_ROLES

const EventInstructions: CollectionConfig = {
  slug: 'event-instructions',
  admin: {
    useAsTitle: 'title',
    description: 'Instructions related to specific events.',
    defaultColumns: ['title', 'event', 'status', 'publishDate', 'updatedAt'],
    listSearchableFields: ['title', 'content'], // Assuming 'content' is richText searchable
    group: 'Organizers & Events',
  },

  access: {
    read: isAdminOrEventRole([MANAGER, EDITOR, VIEWER]),
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
      name: 'title',
      label: 'Instruction Title',
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
  ],
  timestamps: true, // Adds createdAt, updatedAt
}

export default EventInstructions
