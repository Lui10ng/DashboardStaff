import type { Access } from 'payload'
import type { User } from '@/payload-types'
import { isAdmin } from './isAdmin'

/**
 * Access control function: Grants access if the user is an admin OR
 * if the user is accessing their own document.
 *
 * Assumes:
 * - The [isAdmin] function correctly identifies global administrators.
 * - The collection this is applied to is likely the 'users' collection or similar,
 *   where the document `id` corresponds to the user's ID.
 * - The user object (`req.user`) has an `id` property.
 */
export const isAdminOrSelf: Access<User> = async (args) => {
  // Handle cases where args or req might be missing (e.g., during type generation)
  if (!args || !args.req) {
    // Default to false access if request context isn't available
    return false;
  }
  const { req, id } = args; // Destructure after checking
  const { user } = req;

  // Condition 1: User is a global admin
  if (user && await isAdmin({ req })) {
    return true
  }

  // Condition 2: User is logged in and accessing their own document
  if (user && id === user.id) {
    return true
  }

  // If neither condition is met, deny access
  return false
}

/**
 * Access control function: Grants read access if the user is an admin OR
 * if the user is reading their own document.
 *
 * For 'read' operations, Payload allows returning a 'Where' constraint
 * to filter the documents shown. This is often preferred over a simple boolean
 * for list views, but returning 'true' is fine for accessing a single document by ID.
 * This simplified version returns boolean like the main isAdminOrSelf.
 */
export const readIsAdminOrSelf: Access<User> = async (args) => {
  // Handle cases where args or req might be missing
  if (!args || !args.req) {
    return false;
  }
  const { req, id } = args; // Destructure after checking

  // For simplicity, reuse the same logic as isAdminOrSelf for read.
  // A more advanced version could return a 'where' clause for list views
  // if (user && isAdmin({ req })) return true; // Admins see all
  // if (user) return { id: { equals: user.id } }; // Non-admins only see themselves
  // return false; // No user, no access
  return isAdminOrSelf({ req, id }); // Pass the validated args down
}
