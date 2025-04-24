// Proposed file: c:\Users\VEENT-Yuri\Projects\OJT Main\v2-payload\src\collections\EventUserRoles.ts
import type { CollectionConfig } from 'payload'
import { isAdminOrEventRole } from '@/access/isAdminOrEventRole' // Assuming you create this helper
import { EVENT_ROLES } from '@/types/eventRoles'

const { MANAGER, EDITOR, VIEWER } = EVENT_ROLES;

export const EventUserRoles: CollectionConfig = {
  slug: 'event-user-roles',
  admin: {
    useAsTitle: 'user', // Might need refinement if user relationship doesn't show name well
    description: 'Assigns roles to users for specific events.',
    defaultColumns: ['event', 'user', 'role', 'updatedAt'],
    listSearchableFields: ['role'], // Search by role
  },
  // indexes: [ // Compound index to prevent duplicate user+event assignments
  //   {
  //     fields: { event: 1, user: 1 },
  //     unique: true,
  //   }
  // ],
  // ^^ Note: Unique compound indexes on relationships might require specific adapter support or adjustments.
  // Start without it and add if duplicates become an issue and your DB supports it well via Payload.
  access: {
    // Who can create role assignments?
    // - Admins
    // - Users who are 'manager' for the specific event being linked
    create: isAdminOrEventRole([MANAGER]), // Check role against the event field

    // Who can read role assignments?
    // - Admins
    // - Any user who is part of the event team (manager, editor, viewer) for the specific event
    read: isAdminOrEventRole([MANAGER, EDITOR, VIEWER]),

    // Who can update role assignments?
    // - Admins
    // - Users who are 'manager' for the specific event
    update: isAdminOrEventRole([MANAGER]),

    // Who can delete role assignments?
    // - Admins
    // - Users who are 'manager' for the specific event
    delete: isAdminOrEventRole([MANAGER]),
  },
  fields: [
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events', // Link to your Events collection
      required: true,
      index: true, // Index for faster lookups based on event
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users', // Link to your Users collection
      required: true,
      index: true, // Index for faster lookups based on user
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'role',
      type: 'select',
      options: Object.values(EVENT_ROLES).map((role) => ({ label: role.charAt(0).toUpperCase() + role.slice(1), value: role })),
      required: true,
      defaultValue: 'viewer',
      admin: {
        position: 'sidebar',
        isClearable: false,
      },
    },
  ],
}

export default EventUserRoles