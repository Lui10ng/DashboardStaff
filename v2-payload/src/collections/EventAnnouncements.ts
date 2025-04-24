import type { CollectionConfig } from 'payload';
import { isAdminOrEventRole } from '@/access/isAdminOrEventRole';
import { EVENT_ROLES } from '@/types/eventRoles'

const { MANAGER, EDITOR, VIEWER } = EVENT_ROLES;

const EventAnnouncements: CollectionConfig = {
  slug: 'event-announcements',
  admin: {
    useAsTitle: 'title',
    description: 'Post updates or announcements related to specific events.',
    defaultColumns: ['title', 'event', 'status', 'publishDate', 'updatedAt'],
    listSearchableFields: ['title', 'content'], // Assuming 'content' is richText searchable
    group: 'Organizers & Events',
  },
  // FUTURE Access Control Notes:
  // - Public might read 'published' announcements.
  // - Admins and the organizer of the linked event should be able to create/update/delete.
  access: {
    read: isAdminOrEventRole([MANAGER, EDITOR, VIEWER]),
    create: isAdminOrEventRole([MANAGER, EDITOR]),
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
      index: true, // Useful for fetching all announcements for an event
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'title',
      label: 'Announcement Title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      label: 'Announcement Content',
      type: 'richText', // Allows formatted text, images, links etc.
      required: true,
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
        description: 'Optional: Set a specific time for when this announcement is considered published (can be used for sorting/filtering). Defaults to creation time if published immediately.',
        position: 'sidebar',
      },
       // Optionally set default value using hooks if status is published
       // hooks: { beforeChange: [...] }
    },
  ],
  timestamps: true, // Adds createdAt, updatedAt
};

export default EventAnnouncements;