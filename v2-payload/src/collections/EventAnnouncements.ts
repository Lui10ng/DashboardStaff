import type { CollectionConfig } from 'payload'
import { isAdminOrEventRole } from '@/access/isAdminOrEventRole'
import { EVENT_ROLES } from '@/types/eventRoles'

const { MANAGER, EDITOR, VIEWER } = EVENT_ROLES

const EventAnnouncements: CollectionConfig = {
  slug: 'event-announcements',
  admin: {
    useAsTitle: 'event',
    description: 'Post updates or announcements related to specific events.',
    defaultColumns: ['event', 'status', 'eventAnnouncement', 'updatedAt'],
    listSearchableFields: ['event'],
    group: 'Organizers & Events',
  },
  // FUTURE Access Control Notes:
  // - Public might read 'published' announcements.
  // - Admins and the organizer of the linked event should be able to create/update/delete.
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
      enumName: 'AnnouncementStatus',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishDate',
      label: 'Publish Date/Time',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description:
          'Optional: Set a specific time for when this announcement is considered published (can be used for sorting/filtering). Defaults to creation time if published immediately.',
        position: 'sidebar',
      },
    },
    {
      name: 'eventAnnouncement',
      type: 'array',
      label: 'Event Announcement',
      admin: {
        description: 'List specific Announcement for this event.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'announcementImage',
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
          label: 'Announcement Content',
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

export default EventAnnouncements
