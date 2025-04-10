import type { CollectionConfig } from 'payload';
import type { User } from '../payload-types'; // Assuming User type is needed for access control

const EventCategories: CollectionConfig = {
  // Collection slug (API path: /api/event-categories)
  slug: 'event-categories',
  // Admin UI configuration
  admin: {
    useAsTitle: 'name',
    description: 'Broad categories for events (e.g., Music, Workshop, Conference, Community).',
    listSearchableFields: ['name'],
    defaultColumns: ['name', 'updatedAt'],
    group: 'Configuration', // Group related admin sidebar items
  },
  // Access Control Notes:
  // Define who can manage these categories. Often restricted to admins.
  // Public read access is usually appropriate for filtering/display.
  access: {
    read: () => true, // Public can view categories
    create: () => true,
    update: () => true,
    delete: () => true,
    // create: ({ req: { user } }) => user?.roles?.includes('admin'), // Example: Only admins create
    // update: ({ req: { user } }) => user?.roles?.includes('admin'), // Example: Only admins update
    // delete: ({ req: { user } }) => user?.roles?.includes('admin'), // Example: Only admins delete
  },
  // Fields definition
  fields: [
    {
      name: 'name',
      label: 'Category Name',
      type: 'text',
      required: true,
      unique: true, // Ensure category names are unique
      index: true,  // Add a database index for faster lookups
      admin: {
        description: 'The name of the category (e.g., Technology, Music Festival, Charity). Must be unique.',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      admin: {
        description: 'Optional internal or public-facing description for the category.',
      },
    },
    // Optional: Add a slug field if needed for category-specific pages/URLs
    // {
    //   name: 'slug', label: 'Slug', type: 'text', unique: true, index: true,
    //   admin: { position: 'sidebar', readOnly: true },
    //   hooks: { beforeValidate: [ /* hook to generate slug from name */ ] }
    // }
  ],
  timestamps: true, // Automatically add createdAt and updatedAt
};

export default EventCategories;