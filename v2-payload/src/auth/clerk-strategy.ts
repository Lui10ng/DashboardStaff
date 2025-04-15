// src/auth/clerkOrPayloadAdminStrategy.ts
import type { AuthStrategy } from 'payload';
import { verifyToken } from '@clerk/backend';

/**
 * A Payload CMS authentication method that handles two types of users:
 * 1. Logged-in Payload administrators.
 * 2. Users signed in through Clerk.
 *
 * This is useful for APIs that need to work for both backend admins and
 * frontend users authenticated via Clerk.
 *
 * How it Checks:
 * - First, it looks for standard Payload login signs (like a cookie or a
 *   special 'JWT' header). If found, it assumes a Payload admin is logged in
 *   and allows the request.
 * - If no Payload login is found, it then looks for a 'Bearer' token in the
 *   'Authorization' header, which usually comes from Clerk.
 * - It uses Clerk's official tools (`verifyToken`) to check if this
 *   token is valid and belongs to a signed-in Clerk user.
 * - If the Clerk token is good, it allows the request.
 * - If the token is bad, expired, or missing, or if no login method is found,
 *   the request is not allowed by this strategy.
 *
 * Important Note:
 * This strategy returns `{ user: null }` when it successfully identifies
 * either a Payload admin or a valid Clerk user. This tells Payload that the
 * authentication *check* passed, even if it doesn't link to a specific user
 * inside Payload's 'users' collection. This is common for API-only access.
 *
 * @type {AuthStrategy} - Tells Payload this is an authentication strategy.
 * @property {string} name - The unique name for this strategy ('clerkOrPayloadAdmin').
 * @property {Function} authenticate - The main function Payload calls to check
 *   login status. It receives request details (like headers) and returns info
 *   about the user if logged in, or null if not.
 */
const clerkOrPayloadAdminStrategy: AuthStrategy = {
    name: 'clerkOrPayloadAdmin',
    authenticate: async ({ headers, payload }) => {
      console.log('clerkOrPayloadAdmin strategy executing...');
  
      // --- Part A: Check for Payload Authentication (Keep from Step 2) ---
      const payloadCookieName = `${payload.config.cookiePrefix || 'payload'}-token`;
      const cookieHeader = headers.get('cookie');
      const authHeader = headers.get('authorization'); // Get auth header once
  
      if (cookieHeader && cookieHeader.includes(`${payloadCookieName}=`)) {
        console.log('Payload auth cookie detected.');
        return { user: null }; // Allow Payload Admin/User via Cookie
      }
  
      if (authHeader && authHeader.startsWith('JWT ')) {
        console.log('Payload JWT authorization header detected.');
        return { user: null }; // Allow Payload Admin/User via JWT
      }
      // --- End Part A ---
  
  
      // --- Part B: Check for Clerk Token (using @clerk/backend) ---
      if (authHeader && authHeader.startsWith('Bearer ')) {
        console.log('Clerk Bearer token detected.');
        console.log('authHeader:', authHeader);
        const clerkToken = authHeader.substring(7); // Remove "Bearer " prefix
  
        try {
          // Verify the token using Clerk's verifyToken
          // If this succeeds, the token is valid (signature, expiration, etc.)
          // It returns the decoded claims, but we only need to know it didn't throw.
          await verifyToken(clerkToken, { secretKey: process.env.CLERK_SECRET_KEY });
          console.log('Clerk token verified successfully.');
          // Token is valid, fulfill the requirement by returning user: null
          return { user: null }; // Allow Clerk User

        } catch (error: unknown) {
          // Log the error if verifyToken fails (invalid token, expired, etc.)
          console.error('Error verifying Clerk token:', JSON.stringify(error, null, 2));
          // Fall through to return null (auth failure by this strategy)
        }
      }
      // --- End Part B ---
  
  
      // If neither Payload nor Clerk auth was found/valid by this strategy, return null.
      console.log('No Payload or Clerk auth detected/verified by this strategy.');
      return { user: null }; // Default: No authentication found
    },
  };
  
  export default clerkOrPayloadAdminStrategy;