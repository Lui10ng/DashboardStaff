import type { AuthStrategy, AuthStrategyFunctionArgs, AuthStrategyResult, Payload } from 'payload';
import type { User } from '../payload-types'; // Adjust path if needed
import { verifyToken } from '@clerk/backend'; // Import JwtPayload type

/**
 * Custom Payload Authentication Strategy: 'clerkOrPayloadAdmin'
 *
 * This strategy determines if a user is logged in based on two possible methods:
 * 1. Standard Payload Admin UI Login: Checks for Payload's session cookie or
 *    a 'JWT' type Authorization header.
 * 2. Clerk Authentication: Checks for a 'Bearer' type Authorization header
 *    containing a token issued by Clerk.
 *
 * How it decides who is logged in:
 * - First, it looks for signs of a regular Payload login. If found, this
 *   strategy doesn't interfere and lets Payload's default mechanisms handle it.
 *   It effectively says "not me" by returning a null user.
 * - If no Payload login signs are detected, it then looks for a Clerk 'Bearer'
 *   token in the request's 'Authorization' header.
 * - If a Clerk token is found, it's securely verified using your Clerk secret key.
 * - Upon successful verification, it extracts the Clerk User ID (the 'sub' claim).
 * - It then searches your Payload 'users' collection for a user record that has a
 *   'clerkId' field matching the ID from the token. (Crucial: Your 'users'
 *   collection must have this 'clerkId' field!).
 * - If a matching Payload user is found, that user object (with the required
 *   'collection' property added) is returned, granting them access.
 * - If the Clerk token is invalid, expired, doesn't contain a user ID, or if no
 *   corresponding user is found in Payload, the Clerk authentication path fails.
 * - If neither Payload nor Clerk authentication succeeds in identifying a user,
 *   this strategy returns a null user, indicating an overall authentication failure
 *   for the request.
 *
 * @type {AuthStrategy}
 */
const clerkOrPayloadAdminStrategy: AuthStrategy = {
	name: 'clerkOrPayloadAdmin',
	authenticate: async ({ headers, payload }: AuthStrategyFunctionArgs): Promise<AuthStrategyResult> => {
		console.log('clerkOrPayloadAdmin strategy executing (v2 - returning user)...');

		// --- Part A: Check for Payload Authentication ---
		// If Payload auth is present, we *don't* return immediately.
		// We let Payload handle its own authentication and user resolution later.
		const payloadCookieName = `${payload.config.cookiePrefix || 'payload'}-token`;
		const cookieHeader = headers.get('cookie');
		const authHeader = headers.get('authorization'); // Get auth header once

		const isPayloadAuthAttempt =
			(cookieHeader && cookieHeader.includes(`${payloadCookieName}=`)) ||
			(authHeader && authHeader.startsWith('JWT '));

		if (isPayloadAuthAttempt) {
			console.log('Payload auth cookie or JWT detected. Deferring to Payload.');
			// Return null to signal this strategy didn't authenticate
			return { user: null };
		}
		// --- End Part A ---


		// --- Part B: Check for Clerk Token and Find Linked Payload User ---
		if (authHeader && authHeader.startsWith('Bearer ')) {
			console.log('Clerk Bearer token detected.');
			const clerkToken = authHeader.substring(7); // Remove "Bearer " prefix

			try {
				// Verify the token and get claims
				const clerkClaims = await verifyToken(clerkToken, {
					secretKey: process.env.CLERK_SECRET_KEY,
				});
				console.log('Clerk token verified successfully. Claims:', clerkClaims);

				// Check if we got the subject (user ID) from Clerk
				if (clerkClaims?.sub) {
					const clerkUserId = clerkClaims.sub;
					console.log(`Searching for Payload user with clerkId: ${clerkUserId}`);

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
					});

					if (docs && docs.length > 0) {
						const payloadUser = docs[0];
						console.log(`Found matching Payload user: ID ${payloadUser.id}`);
						// Add the collection slug to the user object
						return { user: { ...payloadUser, collection: 'users' } };
					} else {
						console.log(`No Payload user found with clerkId: ${clerkUserId}`);
						// Fall through to return null (auth failure by this strategy for Clerk)
					}
				} else {
					console.error('Clerk token verified, but "sub" (user ID) was missing in claims.');
					// Fall through
				}
			} catch (error: unknown) {
				// Log the error if verifyToken fails
				console.error('Error verifying Clerk token:', error instanceof Error ? error.message : JSON.stringify(error));
				// Fall through to return null (auth failure by this strategy for Clerk)
			}
		}
		// --- End Part B ---

		// If neither Payload auth was detected, nor Clerk auth succeeded in finding a user, return null.
		console.log('No Payload auth detected and Clerk auth failed or found no linked user.');
		return { user: null }; // Indicate authentication failure
	},
};

export default clerkOrPayloadAdminStrategy;
