// src/collections/Organizers.ts
import type { CollectionConfig } from 'payload';
import type { User } from '../payload-types';
// import { isAdmin } from '../access/isAdmin';
// import { isAdminOrSelf } from '../access/isAdminOrSelf'; // Needs full implementation

const Organizers: CollectionConfig = {
  slug: 'organizers',
  admin: {
    useAsTitle: 'name',
    description: 'Individuals or organizations hosting events.',
    defaultColumns: ['name', 'contactEmail', 'website', 'updatedAt'],
    listSearchableFields: ['name', 'contactEmail'],
    group: 'Organizers & Events', // Group related items
  },
  // Access Control Notes:
  // Public read for profiles. Create might be open or restricted.
  // Update/Delete restricted to linked Managing Users or Admins.
  access: {
    read: () => true, // Public can view organizer profiles    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
    // create: ({ req: { user } }) => Boolean(user), // Allow logged-in users to create (consider adding creator to managingUsers via hook)
    // update: isAdminOrSelf('managingUsers'), // Custom check: isAdmin OR user is in managingUsers
    // delete: isAdmin, // Only Admins can delete profiles
  },
  fields: [
    // --- Basic Info ---
    {
      name: 'name',
      label: 'Organizer/Organization Name',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'description',
      label: 'About the Organizer',
      type: 'richText', // Allows formatted text, links, etc.
    },
    // --- Contact & Links ---
    {
      type: 'row',
      fields: [
        {
          name: 'contactEmail',
          label: 'Primary Contact Email',
          type: 'email',
          admin: { width: '50%' },
        },
        {
          name: 'website',
          label: 'Website URL',
          type: 'text',
          admin: { width: '50%' },
          // Add validation if desired
        },
      ],
    },
    // --- Branding Assets ---
    {
      name: 'logo',
      label: 'Logo',
      type: 'relationship',
      relationTo: 'organizer-photos', // ** Link to the dedicated photos collection **
      hasMany: false,
    },
    {
      name: 'bannerImage',
      label: 'Banner Image',
      type: 'relationship',
      relationTo: 'organizer-photos', // ** Link to the dedicated photos collection **
      hasMany: false,
      admin: {
        description: 'Optional banner for profile pages.',
      }
    },
    {
      name: 'photoGallery',
      label: 'Photo Gallery',
      type: 'relationship',
      relationTo: 'organizer-photos', // ** Link to the dedicated photos collection **
      hasMany: true, // Allow multiple gallery images
      admin: {
        description: 'Select additional photos associated with this organizer.',
      }
    },
    // --- User Management Link ---
    {
      name: 'managingUsers',
      label: 'Managing Users',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      required: true, // Must have at least one manager
      index: true,
      access: {
        // Only Admins can modify who manages the organizer profile
        // create: isAdmin,
        // update: isAdmin,
      },
      admin: {
        description: 'Users permitted to manage this organizer profile and their events.',
      },
    },
  ],
  timestamps: true,
};

export default Organizers;

// NOTE: The 'isAdminOrSelf' access control function needs to be implemented.
// It should check if req.user is an admin OR if req.user.id exists within
// the managingUsers array of the document being accessed/modified. This often
// requires fetching the document within the access control function for reads/updates/deletes.
// For list queries, it adds a 'where' clause: { managingUsers: { contains: req.user.id } } combined with an OR for admin role.