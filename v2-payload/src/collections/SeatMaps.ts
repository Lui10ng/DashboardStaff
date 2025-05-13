// src/collections/SeatMaps.ts
import type { CollectionConfig } from 'payload'
import { isAdminOrEventRole } from '@/access/isAdminOrEventRole'
import { EVENT_ROLES } from '@/types/eventRoles'

const { MANAGER, EDITOR, VIEWER } = EVENT_ROLES

const SeatMaps: CollectionConfig = {
  slug: 'seat-maps',
  admin: {
    useAsTitle: 'name',
    description: 'Define seating layouts for events with reserved seating.',
    defaultColumns: ['name', 'totalSeats', 'updatedAt'],
    listSearchableFields: ['name'],
    group: 'Configuration',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,

    // read: isAdminOrEventRole([MANAGER, EDITOR, VIEWER]),
    // create: isAdminOrEventRole([MANAGER, EDITOR]),
    // update: isAdminOrEventRole([MANAGER, EDITOR]),
    // delete: isAdminOrEventRole([MANAGER, EDITOR]),
  },
  fields: [
    {
      name: 'name',
      label: 'Seat Map Name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name for this seating layout',
      },
    },
    {
      name: 'config',
      type: 'group',
      fields: [
        {
          name: 'ticketQuantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'seatConfig',
          type: 'group',
          fields: [
            {
              name: 'rows',
              type: 'number',
              required: true,
              min: 1,
            },
            {
              name: 'seatsPerRow',
              type: 'number',
              required: true,
              min: 1,
            },
            {
              name: 'rowStartChar',
              type: 'text',
              required: true,
            },
            {
              name: 'seatStartNum',
              type: 'number',
              required: true,
              min: 1,
            },
            {
              name: 'rowOrder',
              type: 'select',
              options: ['down', 'up'],
              required: true,
            },
            {
              name: 'seatOrder',
              type: 'select',
              options: ['left', 'right'],
              required: true,
            },
            {
              name: 'rowLabel',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'venueImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'customSeatNames',
      type: 'json',
      required: false,
    },
    {
      name: 'seats',
      type: 'json',
      required: true,
      admin: {
        description: 'JSON object containing seat configurations',
      },
    },
    {
      name: 'summary',
      type: 'group',
      fields: [
        {
          name: 'totalSeats',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'availableSeats',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'unavailableSeats',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'soldSeats',
          type: 'number',
          required: true,
          min: 0,
        },
      ],
    },
  ],
  timestamps: true,
}

export default SeatMaps
