// src/collections/SeatMaps.ts
import type { CollectionConfig } from 'payload';
// import { isAdmin } from '../access/isAdmin';
import type { User } from '../payload-types';

const SeatMaps: CollectionConfig = {
  slug: 'seat-maps',
  admin: {
    useAsTitle: 'name',
    description: 'Define reusable seating chart layout templates (sections, rows, seats).',
    defaultColumns: ['name', 'venue', /* 'totalSeats', */ 'updatedAt'], // totalSeats would need a hook
    listSearchableFields: ['name'],
    group: 'Configuration',
    // Consider a custom React component for the Edit view to visualize the map being built
  },
  // Access Control Notes:
  // Managing complex layouts is typically an Admin task.
  // Organizers may need read access to select a map for their event.
  access: {
    // read: ({ req: { user } }) => Boolean(user), // Allow logged-in users to see/select maps
    // create: isAdmin,
    // update: isAdmin,
    // delete: isAdmin,
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Seat Map Name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique name for this layout (e.g., "Standard Theater Setup", "Workshop Room B Layout").',
      },
    },
    {
      name: 'venue',
      label: 'Typically Used At Venue (Optional)',
      type: 'relationship',
      relationTo: 'venues',
      hasMany: false,
      admin: {
        description: 'Optionally associate this layout primarily with one venue for easier filtering.',
      },
    },
    {
      name: 'description',
      label: 'Internal Description / Notes',
      type: 'textarea',
    },
    // --- Layout Definition (Nested Arrays) ---
    {
      name: 'sections',
      label: 'Sections',
      type: 'array',
      minRows: 1,
      admin: {
        initCollapsed: false, // Show sections expanded by default
        // labels: { singular: 'Section', plural: 'Sections' },
        description: 'Define distinct seating areas (e.g., Orchestra, Balcony, Floor).',
      },
      fields: [
        {
          name: 'sectionName', // Identifier for the section
          label: 'Section Name / Code',
          type: 'text',
          required: true,
          admin: { description: 'e.g., ORCH, MEZZ, GAFLR, A, B' },
        },
        {
          name: 'rows',
          label: 'Rows within this Section',
          type: 'array',
          minRows: 1,
          admin: {
            initCollapsed: true, // Collapse rows by default
            // labels: { singular: 'Row', plural: 'Rows' },
          },
          fields: [
            {
              name: 'rowLabel', // Identifier for the row
              label: 'Row Label / Number',
              type: 'text',
              required: true,
              admin: { description: 'e.g., A, B, AA, 1, 2, GA1' },
            },
            {
              name: 'seats',
              label: 'Seats within this Row',
              type: 'array',
              minRows: 1,
              admin: {
                initCollapsed: true, // Collapse seats by default
                // labels: { singular: 'Seat', plural: 'Seats' },
              },
              fields: [
                {
                  name: 'seatNumber', // Identifier for the seat within the row
                  label: 'Seat Number / ID',
                  type: 'text', // Use text for flexibility (e.g., "1", "1A", "W1")
                  required: true,
                  admin: { width: '30%' },
                },
                {
                  name: 'seatType',
                  label: 'Seat Type',
                  type: 'select',
                  options: [
                    { label: 'Standard', value: 'standard' },
                    { label: 'Wheelchair', value: 'wheelchair' },
                    { label: 'Companion', value: 'companion' }, // Seat next to wheelchair spot
                    { label: 'Restricted View', value: 'restricted_view' },
                    { label: 'Premium', value: 'premium' }, // Example extra type
                    { label: 'Aisle Marker', value: 'aisle_marker' }, // Not purchasable
                    { label: 'Unavailable/Hold', value: 'unavailable' }, // Not purchasable
                  ],
                  defaultValue: 'standard',
                  required: true,
                  admin: { width: '40%' },
                },
                {
                  name: 'isPurchasable', // Explicit flag for saleability
                  label: 'Purchasable?',
                  type: 'checkbox',
                  // Default based on type? Maybe better to be explicit.
                  defaultValue: true,
                  admin: {
                    width: '30%',
                    description: 'Can this seat type generally be sold?',
                  }
                },
                // Optional: Coordinates within the section/map for visual rendering
                // { name: 'xPos', type: 'number', admin: { width: '50%', step: 1 } },
                // { name: 'yPos', type: 'number', admin: { width: '50%', step: 1 } },
              ],
            },
          ],
        },
      ],
    },
    // Optional: A hook could calculate and potentially store the total purchasable seats
    // on save, or a virtual field could calculate it on read.
  ],
  timestamps: true,
};

export default SeatMaps;