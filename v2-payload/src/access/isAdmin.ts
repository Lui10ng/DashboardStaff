import type { Access } from 'payload'
import type { User } from '@/payload-types'

/**
 * Checks if the currently authenticated user is a global administrator.
 * Assumes global admin status is determined by the presence of an 'admin' role
 * in the `clerkRoles` array synced from Clerk.
 *
 * @param {object} args - The arguments passed to the access control function.
 * @param {object} args.req - The Express request object.
 * @param {User} [args.req.user] - The currently authenticated user object (if available).
 * @returns {boolean} True if the user is a global admin, false otherwise.
 */
export const isAdmin: Access<User> = ({ req: { user } }) => {
  // Check if user exists and has the 'admin' role synced from Clerk
  return Boolean(user?.clerkRoles?.includes('admin'))
}
