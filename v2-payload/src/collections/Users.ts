// src/collections/Users.ts (Illustrative Customizations)
import type { CollectionConfig } from 'payload';
// import { isAdmin, isAdminOrSelf } from '../access/isAdminOrSelf'; // Assuming these access helpers exist

// Define Roles - use const for consistency
const USER_ROLES = {
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  ATTENDEE: 'attendee',
  CHECK_IN_STAFF: 'check-in-staff',
} as const;

type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

const Users: CollectionConfig = {
  slug: 'users',
  // --- Payload Auth Configuration ---
  auth: {
    // If using JWT (Payload's default)
    tokenExpiration: 7200, // seconds - e.g., 2 hours
    // verify: true, // Enable email verification if needed
    // maxLoginAttempts: 5,
    // lockTime: 600 * 1000, // 10 minutes
    useAPIKey: false, // Set to true if you want users to generate API Keys
    // If using Clerk (or other external provider) primarily, you might:
    // 1. Disable password auth: setting 'auth: false' is too drastic usually.
    // 2. Rely on your custom Clerk auth strategy to handle login/verification.
    // 3. Keep password enabled as a fallback or for specific admin users.
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
    // admin: ({ req: { user } }) => user?.roles?.includes(USER_ROLES.ADMIN),
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
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
      name: 'roles',
      label: 'Roles',
      type: 'select',
      enumName: 'UserRole',
      hasMany: true, // Allow multiple roles per user
      required: true,
      defaultValue: [USER_ROLES.ATTENDEE], // Default new signups to 'attendee'
      options: Object.entries(USER_ROLES).map(([key, value]) => ({ label: key.replace('_', ' '), value })),
      // Access control on the field itself: only Admins can modify roles
      access: {
        read: ({ req: { user } }) => true, // Everyone can see their own roles (and admins see all)
        // create: isAdmin,
        // update: isAdmin,
      },
      admin: {
        description: 'Assign roles that grant specific permissions throughout the application.',
      }
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
    // Consider adding other fields if needed:
    // - Phone number
    // - Profile picture (relationship to 'media')
    // - Link to Organizer profile(s) they manage (though the link is primarily on Organizer collection)
  ],
  timestamps: true,
};

export default Users;