import type { AuthStrategy, AuthStrategyFunctionArgs, AuthStrategyResult, Payload } from 'payload'
import { verifyToken } from '@clerk/backend' // Removed unused createClerkClient for now

/**
 * Payload Authentication Strategy: 'clerkAuthStrategy'
 *
 * Authenticates users based *only* on a Clerk Bearer token provided in the
 * 'Authorization' header. It does NOT handle Payload's standard cookie/JWT
 * authentication.
 *
 * @type {AuthStrategy}
 */
const clerkAuthStrategy: AuthStrategy = {
  name: 'clerkAuthStrategy', // Strategy name used internally by Payload

  /**
   * Authenticates an incoming request using a Clerk Bearer token.
   *
   * How it works:
   * 1. **Check for Clerk Token:** Looks for a `Bearer` token in the
   *    `Authorization` header. If not found or not in the correct format,
   *    authentication fails (`{ user: null }`).
   * 2. **Verify Token:** Verifies the extracted token using Clerk's backend SDK
   *    (`verifyToken`) and the `CLERK_SECRET_KEY`.
   * 3. **Extract User ID:** If verification is successful, extracts the Clerk
   *    User ID (the `sub` claim) from the token payload.
   * 4. **Find Payload User:** Searches the Payload `users` collection for a
   *    document where the `clerkId` field matches the verified Clerk User ID.
   *    (Requires your 'users' collection to have a unique 'clerkId' field).
   * 5. **Return Result:**
   *    - If a matching Payload user is found, returns `{ user: User }`
   *      (including the collection slug).
   *    - If the token is invalid, the `sub` claim is missing, or no matching
   *      Payload user is found, returns `{ user: null }`.
   *
   * @param {AuthStrategyFunctionArgs} args - Arguments provided by Payload.
   * @param {Headers} args.headers - Incoming request headers.
   * @param {Payload} args.payload - Payload API object.
   * @returns {Promise<AuthStrategyResult>} A promise resolving to
   *   `{ user: User }` on successful authentication, or `{ user: null }` otherwise.
   */
  authenticate: async ({
    headers,
    payload,
  }: AuthStrategyFunctionArgs): Promise<AuthStrategyResult> => {
    const authHeader = headers.get('authorization') // Get auth header once

    // --- Check for Clerk Token and Find Linked Payload User ---
    if (authHeader && authHeader.startsWith('Bearer ')) {
      console.log('Clerk Bearer token detected.')
      const clerkToken = authHeader.substring(7) // Remove "Bearer " prefix

      try {
        // Verify the token and get claims
        const clerkClaims = await verifyToken(clerkToken, {
          secretKey: process.env.CLERK_SECRET_KEY,
        })
        console.log('Clerk token verified successfully. Claims:', clerkClaims)

        // Check if we got the subject (user ID) from Clerk
        if (clerkClaims?.sub) {
          const clerkUserId = clerkClaims.sub
          console.log(`Searching for Payload user with clerkId: ${clerkUserId}`)

          // Find the corresponding user in Payload's 'users' collection
          // ASSUMPTION: Your 'users' collection has a 'clerkId' field.
          const { docs } = await payload.find({
            collection: 'users', // Use the slug of your users collection
            where: {
              clerkId: {
                equals: clerkUserId,
              },
            },
            limit: 1,
            depth: 1, // Adjust depth as needed
          })

          if (docs && docs.length > 0) {
            const payloadUser = docs[0]
            console.log(`Found matching Payload user: ID ${payloadUser.id}`)
            // Add the collection slug to the user object for Payload compatibility
            return { user: { ...payloadUser, collection: 'users' } }
          } else {
            console.log(`No Payload user found with clerkId: ${clerkUserId}`)
            return { user: null } // Explicitly return null if no linked user found
          }
        } else {
          console.error('Clerk token verified, but "sub" (user ID) was missing in claims.')
          return { user: null } // Return null if 'sub' claim is missing
        }
      } catch (error: unknown) {
        // Log the error if verifyToken fails
        console.error(
          'Error verifying Clerk token:',
          error instanceof Error ? error.message : JSON.stringify(error),
        )
        return { user: null } // Return null on token verification error
      }
    }
    // --- End Clerk Token Check ---

    // If no valid Clerk Bearer token was found in the header
    console.log('No valid Clerk Bearer token found in Authorization header.')
    return { user: null } // Indicate authentication failure
  },
}

// Consider renaming the export to match the variable for consistency
export default clerkAuthStrategy // Changed from clerkOrPayloadAdminStrategy
