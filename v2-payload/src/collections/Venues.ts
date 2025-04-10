// src/collections/Venues.ts
import type { CollectionConfig } from 'payload';
import type { User } from '../payload-types';

const Venues: CollectionConfig = {
  slug: 'venues',
  admin: {
    useAsTitle: 'name',
    description: 'Physical locations where events can be held.',
    listSearchableFields: ['name', 'address.city', 'address.country'],
    defaultColumns: ['name', 'address.city', 'capacity', 'updatedAt'],
    group: 'Configuration', // Group with Categories in Admin UI
  },
  // Access Control Notes:
  // Public read often needed. Create/Update might be admin-only or restricted roles.
  access: {
    read: () => true, // Public can view venue details
    create: () => true,
    update: () => true,
    delete: () => true,
    // create: ({ req: { user } }) => user?.roles?.includes('admin'), // Example: Only admins create
    // update: ({ req: { user } }) => user?.roles?.includes('admin'), // Example: Only admins update
    // delete: ({ req: { user } }) => user?.roles?.includes('admin'), // Example: Only admins delete
  },
  fields: [
    {
      name: 'name',
      label: 'Venue Name',
      type: 'text',
      required: true,
      index: true,
    },
    // --- Address ---
    {
      name: 'address',
      label: 'Address',
      type: 'group', // Group address fields for better organization
      fields: [
        { name: 'street', label: 'Street Address', type: 'text' },
        { name: 'city', label: 'City', type: 'text', admin: { width: '50%' } },
        { name: 'stateProvince', label: 'State / Province', type: 'text', admin: { width: '50%' } },
        { name: 'postalCode', label: 'Postal Code', type: 'text', admin: { width: '50%' } },
        {
          name: 'country',
          label: 'Country',
          type: 'text', // Consider 'select' if you have a predefined country list
          admin: { width: '50%' },
        },
      ],
    },
    // --- Location & Capacity ---
    // {
    //   name: 'coordinates',
    //   label: 'Coordinates (Lat, Lng)',
    //   type: 'point', // For map display [longitude, latitude]
    //   admin: {
    //     description: 'Optional coordinates for map integration.',
    //   }
    // },
    {
      name: 'capacity',
      label: 'General Capacity',
      type: 'number',
      min: 0,
      admin: {
        description: 'General maximum attendee capacity (may differ from event-specific limits).',
        step: 10,
      },
    },
     // --- Contact Info ---
    {
        type: 'row', // Layout helper for admin UI
        fields: [
             {
                name: 'contactEmail',
                label: 'Venue Contact Email',
                type: 'email',
                 admin: { width: '50%' },
            },
            {
                name: 'contactPhone',
                label: 'Venue Contact Phone',
                type: 'text',
                 admin: { width: '50%' },
            },
        ]
    },
    {
      name: 'website',
      label: 'Venue Website URL',
      type: 'text',
      // Add validation or use a specific URL field type if available/customized
    },
    // --- Venue Details & Assets ---
    {
      name: 'description',
      label: 'Venue Description / Notes',
      type: 'richText', // Allow formatted descriptions
    },
    {
      name: 'images',
      label: 'Venue Images',
      type: 'relationship',
      relationTo: 'media', // Assumes a general 'media' collection exists
      hasMany: true, // Allow multiple venue photos
    },
    // --- Seating Related (Optional) ---
    {
      name: 'seatingChartNotes',
      label: 'Seating Chart Notes',
      type: 'textarea',
      admin: {
          description: 'Internal notes about typical seating arrangements or venue specifics.',
      }
    },
    // Optional link to a default seat map associated with this venue.
    // An Event using this venue could potentially inherit this map if not specified otherwise.
    {
      name: 'defaultSeatMap',
      label: 'Default Seat Map',
      type: 'relationship',
      relationTo: 'seat-maps', // Link to the SeatMaps collection (defined later)
      hasMany: false,
      admin: {
        description: 'Optional: Select a default seat map layout commonly used at this venue.',
      }
    }
  ],
  timestamps: true,
};

export default Venues;