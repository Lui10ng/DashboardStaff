import type { Access } from 'payload'
import type { EventRole } from '@/types/eventRoles'
import { isAdmin } from './isAdmin'

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
	(
		allowedRoles: EventRole[]
	): Access =>
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
			let eventId: number | string | undefined // Event ID can be number or string depending on DB/config

			// Determine the Event ID to check permissions against.
			// This logic currently only handles reading/updating/deleting EXISTING documents
			// where an 'id' is provided. It does not handle the 'create' case using 'data'.
			if (id) {
				// Fetch the document being accessed (e.g., an EventUserRole document)
				// using its ID to find the related event ID.
				const doc = await payload.findByID({
					collection: 'event-user-roles', // Assumes this access control is used on or relates heavily to event-user-roles
					id: id,
					depth: 0, // No need to populate relationships deeply.
					user, // Pass the user for underlying access checks on findByID, if any.
					overrideAccess: true, // Crucial: Temporarily bypass read access control on event-user-roles
					// itself just to read the linked event ID for this permission check.
					// Use with caution and ensure this doesn't expose sensitive data unintentionally.
				})

				// Extract the event ID from the fetched document.
				// Handles both direct ID and populated relationship object.
				// Note: Uses hardcoded 'event' field name based on current implementation.
				eventId = typeof doc?.event === 'object' ? doc?.event?.id : doc?.event
			} else {
				// If we are creating a new document, extract the event ID from the incoming data.
				eventId = typeof data?.event === 'object' ? data?.event?.id : data?.event;
			}

			// If we couldn't determine the event ID from the document, deny access.
			if (!eventId) {
				console.warn(
					`isAdminOrEventRole: Could not determine event ID for document ${id}. Denying access.`
				)
				return false
			}

			// Query the 'event-user-roles' collection to see if the current user
			// has an entry linking them to the determined eventId with one of the allowedRoles.
			const userEventRoles = await payload.find({
				collection: 'event-user-roles',
				where: {
					user: { equals: user.id }, // Match current user
					event: { equals: eventId }, // Match the specific event
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
		} catch (error) {
			// Log any errors during the access check process.
			console.error('Error in isAdminOrEventRole access control check:', error)
			// Deny access by default if any error occurs.
			return false
		}

		// If none of the access conditions (global admin, specific event role) were met, deny access.
		return false
	}