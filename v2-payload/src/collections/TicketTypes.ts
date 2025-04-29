import { isAdminOrEventRole } from '@/access/isAdminOrEventRole'
import { isAdmin } from '@/access/isAdmin'
import type { CollectionConfig } from 'payload'
import { EVENT_ROLES } from '@/types/eventRoles'

const { MANAGER, EDITOR, VIEWER } = EVENT_ROLES

const TicketTypes: CollectionConfig = {
  slug: 'ticket-types',
  admin: {
    useAsTitle: 'name',
    description:
      'Define specific ticket tiers for events (e.g., GA, VIP) and their available quantity.',
    defaultColumns: ['name', 'event', 'price', 'currency', 'quantityAvailable', 'status'],
    listSearchableFields: ['name'],
    group: 'Organizers & Events',
    // Consider adding filters for Event in the list view
  },
  access: {
    read: () => true,
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
      index: true, // Essential for finding ticket types for an event
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'name',
      label: 'Ticket Type Name',
      type: 'text',
      required: true,
      admin: { description: 'e.g., General Admission, VIP Pass, Early Bird' },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
    },
    {
      type: 'row',
      fields: [
        // Price & Currency
        {
          name: 'price',
          label: 'Price',
          type: 'number',
          required: true,
          min: 0,
          admin: { width: '50%', step: 0.01 },
        },
        {
          name: 'currency',
          label: 'Currency',
          type: 'select',
          enumName: 'CurrencyType',
          required: true,
          options: [
            { label: 'USD', value: 'USD' },
            { label: 'PHP', value: 'PHP' },
            { label: 'EUR', value: 'EUR' },
          ],
          defaultValue: 'USD',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'quantityAvailable',
      label: 'Quantity Available For Sale',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Total inventory count FOR THIS SPECIFIC ticket type.',
        step: 1,
      },
      // VALIDATION NOTE: Hooks or validation should likely ensure the SUM of quantityAvailable
      // across all TicketTypes for an Event does not exceed Event.totalCapacity (if set)
      // OR the number of purchasable seats in the linked Event.seatMap.
    },
    {
      type: 'row',
      fields: [
        // Sales Dates
        {
          name: 'salesStart',
          label: 'Sales Start',
          type: 'date',
          admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'salesEnd',
          label: 'Sales End',
          type: 'date',
          admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
          //   validate: (value, { siblingData }) => { /* Ensure end > start */ return (siblingData.salesStart && value && new Date(value) <= new Date(siblingData.salesStart)) ? 'Sales End must be after Sales Start.' : true; },
        },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      enumName: 'TicketStatus',
      options: [
        { label: 'Active / On Sale', value: 'active' },
        { label: 'Inactive / Off Sale', value: 'inactive' },
      ], // As defined before
      defaultValue: 'active',
      required: true,
      admin: { position: 'sidebar' },
    },
    // Optional: Min/Max per order for this specific type
    { name: 'minOrderQuantity', type: 'number', defaultValue: 1, min: 1 },
    { name: 'maxOrderQuantity', type: 'number', min: 1 },
    { name: 'color', type: 'text', required: true },
    {
      name: 'promotion',
      type: 'join',
      collection: 'promotions',
      on: 'applicableTicketTypes',
    },
  ],
  timestamps: true,
}

export default TicketTypes
