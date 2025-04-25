import type { AuthStrategy, AuthStrategyFunctionArgs, AuthStrategyResult, Payload } from 'payload'
import { verifyToken, createClerkClient } from '@clerk/backend' // Import JwtPayload type

/**
 * Payload Authentication Strategy: 'clerkOrPayloadAdmin'
 *
 * Checks if a user is logged in using either Payload's standard login
 * (cookie or JWT) or a Clerk login (Bearer token). It tries Payload
 * first.
 *
 * @type {AuthStrategy}
 */
const clerkOrPayloadAdminStrategy: AuthStrategy = {
  name: 'clerkOrPayloadAdmin',

  /**
   * Tries to log in a user for an incoming request.
   *
   * How it works:
   * 1. **Check Payload Admin Login:** Looks for a Payload cookie or JWT header.
   *    - If found, tries Payload's own login check (`payload.auth`).
   *    - If Payload login works AND the authenticated user has the 'admin' role (in `clerkRoles`), returns the Payload user.
   *    - If Payload login fails, or the user is authenticated but is NOT an admin, stops and
   *      returns `null` (no user). Clerk is NOT checked in these Payload auth attempt cases.
   * 2. **Check Clerk Login:** If no Payload cookie/JWT was found, looks
   *    for a Clerk `Bearer` token in the `Authorization` header.
   *    - If found, verifies the token with Clerk.
   *    - If valid, gets the Clerk user ID.
   *    - Searches for a Payload user with a matching `clerkId`.
   *      (Your 'users' collection needs a 'clerkId' field!)
   *    - If a match is found, returns the Payload user.
   *    - If token is bad, ID is missing, or no match is found,
   *      returns `null`.
   * 3. **No Login:** If neither method works, returns `null`.
   *
   * @param {object} args - Info provided by Payload.
   * @param {Headers} args.headers - Request headers.
   * @param {Payload} args.payload - Payload API object.
   * @returns {Promise<object>} A promise that resolves to `{ user: User }`
   *   if logged in, or `{ user: null }` if not.
   */
  authenticate: async ({
    headers,
    payload,
  }: AuthStrategyFunctionArgs): Promise<AuthStrategyResult> => {
    // --- Part A: Check for Payload Authentication ---
    // --- Check for Payload Auth Indicators ---
    const payloadCookieName = `${payload.config.cookiePrefix || 'payload'}-token`
    const cookieHeader = headers.get('cookie')
    const authHeader = headers.get('authorization') // Get auth header once

    const isPayloadCookieAttempt = cookieHeader && cookieHeader.includes(`${payloadCookieName}=`)
    const isPayloadJwtAttempt = authHeader && authHeader.startsWith('JWT ') // Check for Payload JWT prefix

    if (isPayloadCookieAttempt || isPayloadJwtAttempt) {
      console.log('Payload auth cookie or JWT detected. Attempting Payload authentication...')
      try {
        // --- Attempt Payload Authentication ---
        // payload.auth attempts to verify based on cookie or JWT header
        const payloadAuthResult = await payload.auth({ headers }) // Pass headers

        if (payloadAuthResult?.user) {
          // --- Payload Auth Successful, NOW check for admin role ---
          // Ensure clerkRoles is defined and includes 'admin'
          // Note: This relies on clerkRoles being correctly added to the User type and populated.
          // Cast to 'any' temporarily if TS complains about clerkRoles before type regeneration
          const userIsAdmin = (payloadAuthResult.user as any)?.clerkRoles?.includes('admin')

          if (userIsAdmin) {
            console.log(
              `Payload strategy authenticated Payload ADMIN user: ${payloadAuthResult.user.id}`,
            )
            // Return the user found by Payload's internal auth
            // Ensure the collection slug is included if not already present
            const userWithCollection = {
              ...payloadAuthResult.user,
              collection: payloadAuthResult.user.collection || 'users', // Add collection slug if missing
            }
            return { user: userWithCollection }
          } else {
            console.log(
              `Payload user ${payloadAuthResult.user.id} authenticated but is NOT an admin. Denying login via Payload method.`,
            )
            return { user: null } // Deny login for non-admins using Payload auth
          }
        } else {
          console.log('Payload auth indicators present, but payload.auth() failed.')
          // If Payload indicators were present but auth failed, stop here.
          // Don't proceed to Clerk check for this request.
          return { user: null }
        }
      } catch (error) {
        console.error('Error during payload.auth() check:', error)
        // An error occurred during Payload's check, treat as auth failure.
        return { user: null }
      }
    }
    // --- End Part A ---

    // --- Part B: Check for Clerk Token and Find Linked Payload User ---
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

          // Optional: Fetch additional Clerk user details if needed
          // const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
          // const clerkUser = await clerkClient.users.getUser(clerkUserId);
          // console.log('Fetched Clerk User:', clerkUser.firstName, clerkUser.emailAddresses);

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
            // Add the collection slug to the user object
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
    // --- End Part B ---

    // If neither Payload auth indicators were present, nor Clerk auth succeeded, return null.
    console.log('No Payload auth detected and Clerk auth failed or found no linked user.')
    return { user: null } // Indicate authentication failure
  },
}

export default clerkOrPayloadAdminStrategy
