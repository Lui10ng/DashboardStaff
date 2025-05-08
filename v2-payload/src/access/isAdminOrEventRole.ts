import type { Access } from 'payload'
import type { EventRole } from '@/types/eventRoles'
import { isAdmin } from './isAdmin'
import chalk from 'chalk'
import util from 'util';
import type { FieldQueryOperators, RequestBodyWithEvent } from '@/types/access';

/**
 * Generates a Payload Access Control (ACL) function.
 * Access is granted if the user is an admin OR if they are logged in and possess
 * one of the `allowedRoles` for the event associated with the current operation.
 *
 * This ACL is designed for:
 * 1. The 'events' collection itself.
 * 2. Other collections that have a direct relationship to an 'event' and are
 *    typically queried with a filter specifying the event ID.
 *
 * --- Behavior Breakdown ---
 *
 * Global Admin:
 * - If the user is an admin (checked via `isAdmin`), access is immediately granted (returns `true`).
 *
 * Non-Admin Logged-in User:
 *
 *   A. For the 'events' collection (`req.routeParams.collection === 'events'`):
 *      - Document-level access (e.g., read/update/delete specific event, `id` is present):
 *        Checks if the user has one of the `allowedRoles` for the event specified by `id`.
 *        Returns `true` if a role matches, `false` otherwise.
 *      - Collection-level 'read' access (e.g., listing events, `id` is NOT present):
 *        Finds all events for which the user has one of the `allowedRoles`.
 *        Returns a query constraint (`{ id: { in: [accessibleEventIds] } }`).
 *        If no such events are found, returns a constraint to match no documents.
 *
 *   B. For other collections related to 'events':
 *      - It assumes the query to these collections will include a 'where' clause
 *        filtering by the event ID (e.g., `where: { event: { equals: EVENT_ID } }`).
 *      - It extracts this `EVENT_ID` from `req.query.where.event.equals`.
 *      - Checks if the user has one of the `allowedRoles` for this extracted `EVENT_ID`.
 *      - Returns `true` if a role matches for that event, `false` otherwise.
 *      - Note: This part primarily facilitates access control when fetching related documents
 *        filtered by a specific event. It does not currently build broad query constraints
 *        for these related collections if no event filter is present in the request.
 *
 * General Notes:
 * - If a user is not logged in (and not an admin), access is denied (returns `false`).
 * - The check for event-specific roles is performed by querying the 'event-user-roles' collection.
 * - Errors during the access check process result in access denial.
 *
 * @param {EventRole[]} allowedRoles - An array of event-specific role strings (e.g., ['manager', 'editor'])
 *   that, if held by the user for the relevant event, grant access.
 * @returns {Access} A Payload Access Control function which resolves to `true`, `false`, or a `Where` query constraint.
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

      let collection = req.routeParams?.collection;

      if (collection === 'events') {
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
  
          // Extract the IDs of the events the user has access to
          const accessibleEventIds = userEventRoles.docs
            .map((userEventRole) => userEventRole.event) // Assuming 'event' field stores the ID directly or is populated shallowly
            .filter((eventId): eventId is number => {
              return eventId !== null && eventId !== undefined;
            });
  
          // If the user has access to no events via these roles, return a constraint that matches nothing
          if (accessibleEventIds.length === 0) {
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
          return constraint
        }
      } else {
        // Collections related to events
        const EVENT_FIELD_NAME = 'event';
        const whereClause = req.query?.where;
        
        let eventIdFromQuery: number | undefined;
        
        if (whereClause && typeof whereClause === 'object' && EVENT_FIELD_NAME in whereClause) {
          const eventFieldFilter = whereClause[EVENT_FIELD_NAME] as FieldQueryOperators | undefined;

          eventIdFromQuery = eventFieldFilter?.equals
        } else if (req.data?.event){
          // POST Request
          const requestBody = req.data as RequestBodyWithEvent;
          
          eventIdFromQuery = requestBody.event;
        } else {
          console.error('No event ID found in query or body');
          return false;
        }

        const userHasEventRole = await payload.find({
          collection: 'event-user-roles',
          where: {
            user: { equals: user.id },
            event: { equals: eventIdFromQuery },
            role: { in: allowedRoles },
          },
          depth: 0,
          limit: 1,
          user: user,
        })

        // If the query returned one or more documents, the user has the required role. Grant access.
        if (userHasEventRole.totalDocs > 0) {
          return true
        }
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
