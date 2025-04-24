import type { CollectionConfig } from 'payload';
import clerkOrPayloadAdminStrategy from '@/auth/clerk-strategy';
import { PLATFORM_ROLES } from '@/types/users';
import { isAdminOrSelf } from '@/access/isAdminOrSelf';
import { isAdmin } from '@/access/isAdmin';

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    disableLocalStrategy: true,
    strategies: [
      clerkOrPayloadAdminStrategy,
    ],
  },
  admin: {
    useAsTitle: 'email', // Use email as the main identifier in lists
    defaultColumns: ['email', 'name', 'roles', 'createdAt'],
    listSearchableFields: ['email', 'name'],
    group: 'Admin', // Group under Admin section
  },
  // Access Control Notes:
  // Payload defaults are usually: Admins can manage all, authenticated users can read/update themselves.
  // You need to ensure this aligns with your app's needs.
  access: {
    // read: isAdminOrSelf(), // Allow reading self or if admin
    // create: isAdmin, // Only admins create users? Or allow public signup? Default allows public signup.
    // update: isAdminOrSelf(), // Allow updating self or if admin
    // delete: isAdmin, // Only admins delete users
    // --- Role-based access ---
    // Example: Only Admins can change the 'roles' field
    // admin: ({ req: { user } }) => user?.roles?.includes(PLATFORM_ROLES.ADMIN),
    read: isAdminOrSelf,
    create: () => true, // or only allow it programmatically (via webhook)
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    // Default fields Payload adds: email, password (hashed), etc.
    // You typically don't need to redefine 'email' or 'password' unless customizing heavily.
    // --- Add Custom Fields Below ---
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      // No longer required if using Clerk and syncing name from there, maybe?
      // Make required if using Payload's local auth primarily.
      // required: true,
    },
    {
      name: 'clerkId', // Example field if using Clerk Auth
      label: 'Clerk User ID',
      type: 'text',
      index: true, // Essential for finding users based on Clerk's sub claim
      unique: true, // Each Payload user should map to one Clerk user
      admin: {
        readOnly: true, // Usually set programmatically on first login/sync
        position: 'sidebar',
        description: 'Internal ID linking to the Clerk authentication provider.',
      },
      // Access should be highly restricted, likely admin only read/update
      access: {
        // read: isAdmin,
        // update: isAdmin,
      }
    },
    {
      name: 'organizer', // Or 'associatedOrganizer', etc.
      label: 'Associated Organizer',
      type: 'relationship',
      relationTo: 'organizers',
      hasMany: false, // A user typically belongs to/manages one primary organizer
      required: false, // Or true if every user MUST be linked
      index: true,
    },
    {
      name: 'clerkRoles',
      label: 'Clerk Roles',
      type: 'select',
      hasMany: true,
      options: Object.values(PLATFORM_ROLES).map(role => ({ label: role, value: role })),
      admin: {
        position: 'sidebar',
        description: 'Roles synced from Clerk. This field is read-only and managed by the authentication system.',
      },
      access: {
        read: () => true, // Everyone can read their own roles
        update: () => false, // This field is managed by Clerk and should not be manually edited
      },
    },
    // Consider adding other fields if needed:
    // - Phone number
    // - Profile picture (relationship to 'media')
    // - Link to Organizer profile(s) they manage (though the link is primarily on Organizer collection)
  ],
  timestamps: true,
};

export default Users;