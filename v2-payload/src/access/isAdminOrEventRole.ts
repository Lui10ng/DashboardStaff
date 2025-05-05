import type { Access } from 'payload'
import type { EventRole } from '@/types/eventRoles'
import { isAdmin } from './isAdmin'
import chalk from 'chalk'
import util from 'util';

/**
 * Generates a Payload Access Control function that grants access based on user roles.
 *
 * Access is granted if EITHER of the following conditions is met:
 * 1. The user is a global administrator (determined by the [isAdmin] function).
 * 2. The user is logged in AND possesses one of the `allowedRoles` specifically
 *    for the event associated with the document being accessed or created.
 *
 * This function is designed to be used in the `access` configuration of collections
 * that have a relationship to the 'events' collection (e.g., `EventUserRoles`).
 * It checks permissions against the `event-user-roles` collection.
 *
 * During 'read', 'update', or 'delete' operations, it fetches the existing document
 * using the provided `id` to determine the associated event.
 * During 'create' operations, it inspects the incoming `data` to determine the
 * associated event.
 *
 * @param {EventRole[]} allowedRoles - An array of event-specific role strings (e.g., ['manager', 'editor'])
 *   that grant access to the resource if the user holds one of them for the relevant event.
 * @returns {Access} A Payload Access Control function (`async ({ req, id, data }) => boolean | Where`).
 */
export const isAdminOrEventRole =
  (allowedRoles: EventRole[]): Access =>
  async ({ req, id, data }) => {
    const { user, payload } = req

    // --- Condition 1: Check for Global Admin Role ---
    // If a user object exists and the isAdmin check passes, grant immediate access.
    if (user && (await isAdmin({ req }))) {
      return true
    }

    // --- Condition 2: Check for Logged-in User ---
    // If there's no authenticated user at this point, deny access.
    if (!user) {
      return false
    }

    // --- Condition 3: Check for Event-Specific Role ---
    try {
      if (id !== undefined && id !== null) {

        // Query the 'event-user-roles' collection to see if the current user
        // has an entry linking them to the determined eventId with one of the allowedRoles.
        const userEventRoles = await payload.find({
          collection: 'event-user-roles',
          where: {
            user: { equals: user.id }, // Match current user
            event: { equals: id }, // Match the specific event
            role: { in: allowedRoles }, // Match any of the roles required for this action
          },
          depth: 0, // No need for relationship data.
          limit: 1, // We only need one match to confirm permission.
          user: user, // Pass user for potential underlying access checks.
        })

        // If the query returned one or more documents, the user has the required role. Grant access.
        if (userEventRoles.totalDocs > 0) {
          return true
        }
      } else {
        // For Collection-level wide Acess (Not Event-specific)
        // console.log(
        //   chalk.cyan(`Collection Access Check: Finding events for User ID = ${user.id} with roles: [${allowedRoles.join(', ')}]`),
        // )

        // Find all event roles for the current user where the role is one of the allowed ones
        const userEventRoles = await payload.find({
          collection: 'event-user-roles',
          where: {
            'user.id': { equals: user.id }, // Ensure you query by user *ID*
            role: { in: allowedRoles }, // Filter by allowed roles directly
          },
          depth: 0, // Only need the event ID
          limit: 1000, // Adjust limit as needed, maybe paginate if users can have thousands
          pagination: false,
        })

        // console.log(chalk.cyan('User Event Roles Found:'), userEventRoles)

        // Extract the IDs of the events the user has access to
        const accessibleEventIds = userEventRoles.docs
          .map((userEventRole) => userEventRole.event) // Assuming 'event' field stores the ID directly or is populated shallowly
          .filter((eventId): eventId is number => {
            // console.log(chalk.cyan('Event ID:'), eventId)
            return eventId !== null && eventId !== undefined;
          });

        // console.log(chalk.magenta('Accessible Event IDs for Collection Query:'), accessibleEventIds)

        // If the user has access to no events via these roles, return a constraint that matches nothing
        if (accessibleEventIds.length === 0) {
          // console.log(chalk.cyan('Collection Access: User has no allowed roles for any event. Returning no results.'))
          return {
            id: {
              equals: '__NEVER_MATCH__', // Payload constraint to match no documents
            },
          }
        }

        // Return a query constraint to filter the events collection
        const constraint = {
          id: {
            in: accessibleEventIds, // Filter events where the ID is in the list the user can access
          },
        }
        // console.log(chalk.cyan('Collection Access: Returning constraint:'), constraint)
        return constraint
      }
    } catch (error) {
      // Log any errors during the access check process.
      console.error('Error in isAdminOrEventRole access control check:', error)
      // Deny access by default if any error occurs.
      return false
    }

    // If none of the access conditions (global admin, specific event role) were met, deny access.
    return false
  }
