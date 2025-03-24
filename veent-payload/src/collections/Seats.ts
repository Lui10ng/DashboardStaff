import type { CollectionConfig } from 'payload'

export const Seats: CollectionConfig = {
  slug: 'seats',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['id', 'seats'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  timestamps: false,
  fields: [
    {
      name: 'seats',
      type: 'json',
      required: true,
      admin: {
        description: 'Seat data in JSON format',
      },
    },
  ],
}
