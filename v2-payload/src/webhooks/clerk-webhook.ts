import { Webhook } from 'svix'
import type { User, PayloadRequest } from 'payload'
import crypto from 'crypto'
import { PLATFORM_ROLES } from '@/types/users'

// Get the secret key needed to verify Clerk webhooks.
// This should be stored securely, usually in environment variables.
const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET

/**
 * Handles incoming webhook requests from Clerk.
 *
 * This function is designed to be used as a Payload endpoint. It does the following:
 * 1. Checks if the request is a POST request.
 * 2. Reads the raw request body.
 * 3. Gets special security headers sent by Clerk (Svix headers).
 * 4. Uses the 'svix' library and your secret key to verify that the webhook request
 *    genuinely came from Clerk and hasn't been tampered with.
 * 5. Parses the verified webhook data to understand the event type (like 'user.created').
 * 6. Processes the event based on its type:
 *    - 'user.created': Creates a new User in Payload.
 *    - 'user.updated': Finds the existing User in Payload and updates their details.
 *    - 'user.deleted': Finds the existing User in Payload and deletes them.
 * 7. Sends back a standard web Response indicating success or failure.
 *
 * @param {PayloadRequest} req - The incoming request object from Payload.
 *                               This contains headers, body, and access to the Payload API.
 * @returns {Promise<Response>} A Promise that resolves to a standard Web API Response object.
 *                              This tells Clerk whether the webhook was processed successfully (status 2xx)
 *                              or if there was an error (status 4xx or 5xx).
 */
export const clerkWebhookHandler = async (req: PayloadRequest): Promise<Response> => {
  // Only allow POST requests, as this is how webhooks are sent.
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  // We need the raw, unprocessed body of the request for verification.
  // Check if Payload provides the 'arrayBuffer' method to get it.
  if (!req.arrayBuffer) {
    console.error('Webhook Error: Incoming request does not support arrayBuffer')
    return new Response('Bad Request: Cannot read request body', { status: 400 })
  }

  // Get the raw body as an ArrayBuffer and convert it to a Buffer (needed by Svix).
  const arrayBuffer = await req.arrayBuffer()
  const rawBody = Buffer.from(arrayBuffer)

  // Clerk includes special headers (using Svix) for security. Get them from the request.
  const svixId = req.headers.get('svix-id') as string
  const svixTimestamp = req.headers.get('svix-timestamp') as string
  const svixSignature = req.headers.get('svix-signature') as string

  // If any of these security headers are missing, we can't verify the request.
  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error('Webhook Error: Missing Svix headers')
    return new Response('Missing Svix headers', { status: 400 })
  }

  // Make sure we have the secret key configured. Without it, verification is impossible.
  if (!secret) {
    console.error('Webhook Error: Clerk signing secret is not configured.')
    return new Response('Server configuration error: Webhook secret missing', { status: 500 })
  }

  // Create a new Svix Webhook instance using your secret key.
  const wh = new Webhook(secret)
  let msg: any // This will hold the verified webhook payload if successful.

  try {
    // Verify the webhook signature. This confirms the request is authentic from Clerk.
    // It uses the raw request body and the Svix headers.
    // If verification fails, it will throw an error.
    msg = wh.verify(rawBody, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    })
    console.log('Webhook received and verified:', msg)
  } catch (err) {
    // Verification failed. Log the error and return a 'Bad Request' response.
    console.error('Webhook verification failed:', err)
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  // --- Verification Successful - Start Processing ---

  // The verified payload ('msg') often needs to be parsed from the rawBody again
  // if you need the structured JSON directly for processing.
  const webhookPayload = JSON.parse(rawBody.toString('utf-8'))

  // Extract the event type (e.g., 'user.created') and the data associated with the event.
  const eventType = webhookPayload.type
  const eventData = webhookPayload.data
  // Get access to the Payload API instance from the request object.
  const payload = req.payload

  try {
    console.log(`Processing verified Clerk event type: ${eventType}`)

    // Handle different event types using a switch statement.
    switch (eventType) {
      case 'user.created':
        /**
         * Handles the 'user.created' event from Clerk.
         * Creates a corresponding User in Payload.
         * Uses a database transaction to ensure both creations succeed or fail together.
         */
        console.log(`Processing Clerk event: ${eventType} for Clerk User ID: ${eventData.id}`)
        // 'msg.data' usually contains the detailed user object from Clerk in this event.
        const clerkUser = msg.data

        // Start a database transaction. This groups the next database operations.
        // If any operation fails, we can undo all of them (rollback).
        const transactionID: string | number | null = await payload.db.beginTransaction()

        // Check if the transaction started successfully.
        if (!transactionID) {
          console.error('Failed to start transaction for user.created')
          return new Response('Failed to process user creation: Could not start transaction', {
            status: 500,
          })
        }
        console.log('Successful check if the transaction started successfully')

        try {
          // Generate a secure, random password.
          // Even though Clerk handles authentication, Payload often requires a password field.
          // This dummy password won't be used for login if Clerk is the primary auth.
          const randomPassword = crypto.randomBytes(32).toString('hex')

          console.log('Generating random password:', randomPassword)

          // Prepare the data for the new Payload User document, mapping fields from Clerk.
          const payloadUserData = {
            email: clerkUser.email_addresses[0].email_address,
            name: `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim(),
            clerkId: clerkUser.id, // Store the Clerk User ID for linking.
            password: randomPassword,
            clerkRoles: [PLATFORM_ROLES.ORGANIZER], // Default Role
          }

          console.log('Creating user in Payload:', payloadUserData)
          // Create the User document in Payload within the transaction.
          const userDoc = await payload.db.create({
            collection: 'users',
            data: payloadUserData,
            // Pass the transaction ID to include this operation in the transaction.
            req: { transactionID: transactionID },
          })
          console.log('Created user in Payload:', userDoc)
          const payloadUserId = userDoc.id // Get the ID of the newly created Payload user.

          // Commit (finalize) the transaction.
          await payload.db.commitTransaction(transactionID)

          console.log(
            `Successfully created Payload user ${payloadUserId} and organizer for Clerk user ${clerkUser.id}`,
          )
          return new Response(JSON.stringify({ success: true, userId: payloadUserId }), {
            status: 201,
          }) // 201 Created
        } catch (error) {
          // If any error occurred during the try block (user or organizer creation),
          // rollback (undo) the transaction.
          await payload.db.rollbackTransaction(transactionID)
          console.log('Error creating user and organizer:', JSON.stringify(error,null,2), msg)
          payload.logger.error(
            'Failed to process Clerk user.created webhook within transaction',
            error,
          )
          
          return new Response(
            JSON.stringify({ success: false, message: 'Failed to create user and organizer' }),
            { status: 500 },
          )
        }

      case 'user.updated':
        /**
         * Handles the 'user.updated' event from Clerk.
         * Finds the corresponding User in Payload via their Clerk ID and updates their details.
         */
        console.log(`Processing Clerk event: ${eventType} for Clerk User ID: ${eventData.id}`)
        // 'eventData' contains the updated user information from Clerk.
        const updatedClerkUser = eventData

        try {
          // Find the Payload user document that matches the Clerk User ID.
          const userQuery = await payload.find({
            collection: 'users',
            where: { clerkId: { equals: updatedClerkUser.id } },
            limit: 1,
            depth: 0, // We don't need related data here.
            req: req,
          })

          const payloadUser = userQuery.docs[0]

          // If no matching user is found in Payload, log a warning and return an error.
          if (!payloadUser) {
            payload.logger.warn(
              `Received user.updated event for Clerk ID ${updatedClerkUser.id}, but no matching user found in Payload.`,
            )
            return new Response(
              JSON.stringify({ success: false, message: 'User not found in Payload' }),
              { status: 404 },
            ) // 404 Not Found
          }

          // Prepare an object to hold only the fields that actually need updating.
          const updateData: { email?: string; name?: string } = {}

          // Check if the email address was updated in Clerk.
          if (updatedClerkUser.email_addresses && updatedClerkUser.email_addresses.length > 0) {
            // Find the primary email address from the Clerk data.
            const primaryEmail = updatedClerkUser.email_addresses.find(
              (e: any) => e.id === updatedClerkUser.primary_email_address_id,
            )?.email_address
            // If a primary email exists, add it to updateData.
            if (primaryEmail) {
              updateData.email = primaryEmail
            }
          }

          // Check if the name was updated in Clerk.
          const newName =
            `${updatedClerkUser.first_name || ''} ${updatedClerkUser.last_name || ''}`.trim()
          // If the new name exists and is different from the one in Payload, add it to updateData.
          if (newName && newName !== payloadUser.name) {
            updateData.name = newName
          }

          // Add similar checks here for any other fields you want to sync (e.g., profile picture).

          // Only perform the update operation if there are actual changes.
          if (Object.keys(updateData).length > 0) {
            // Update the Payload user document with the changed data.
            await payload.update({
              collection: 'users',
              id: payloadUser.id, // Use the Payload User ID we found.
              data: updateData,
              req: req,
            })
            console.log(`Successfully updated Payload user ${payloadUser.id} from Clerk event.`)
          } else {
            // Log that no relevant changes were detected.
            console.log(
              `No relevant user data changes detected for Clerk ID ${updatedClerkUser.id}. No update performed.`,
            )
          }

          // Return success response.
          return new Response(JSON.stringify({ success: true }), { status: 200 }) // 200 OK
        } catch (error) {
          // Handle any errors during the find or update process.
          payload.logger.error(
            `Failed to process Clerk user.updated webhook for Clerk ID ${updatedClerkUser.id}`,
            error,
          )
          return new Response(
            JSON.stringify({ success: false, message: 'Failed to update user' }),
            { status: 500 },
          )
        }

      case 'user.deleted':
        /**
         * Handles the 'user.deleted' event from Clerk.
         * Finds the corresponding User in Payload via their Clerk ID and deletes them.
         */
        console.log(`Processing Clerk event: ${eventType} for Clerk User ID: ${eventData.id}`)
        // 'eventData' contains the ID of the user deleted in Clerk.
        const deletedClerkUser = eventData

        try {
          // Find the Payload user document matching the deleted Clerk User ID.
          const userQuery = await payload.find({
            collection: 'users',
            where: { clerkId: { equals: deletedClerkUser.id } },
            limit: 1,
            depth: 0,
            req: req,
          })

          const payloadUserToDelete = userQuery.docs[0]

          // If no matching user is found, maybe they were already deleted. Log it and return success.
          if (!payloadUserToDelete) {
            payload.logger.warn(
              `Received user.deleted event for Clerk ID ${deletedClerkUser.id}, but no matching user found in Payload.`,
            )
            return new Response(
              JSON.stringify({ success: true, message: 'User not found, assumed already deleted' }),
              { status: 200 },
            )
          }

          // Delete the found Payload user document.
          await payload.delete({
            collection: 'users',
            id: payloadUserToDelete.id,
            req: req,
          })

          console.log(
            `Successfully deleted Payload user ${payloadUserToDelete.id} corresponding to Clerk ID ${deletedClerkUser.id}.`,
          )
          // Return success response.
          return new Response(JSON.stringify({ success: true }), { status: 200 }) // 200 OK
        } catch (error) {
          // Handle any errors during the find or delete process.
          payload.logger.error(
            `Failed to process Clerk user.deleted webhook for Clerk ID ${deletedClerkUser.id}`,
            error,
          )
          return new Response(
            JSON.stringify({ success: false, message: 'Failed to delete user' }),
            { status: 500 },
          )
        }

      default:
        // If the event type is not one we specifically handle, just log it.
        console.log(`Received unhandled Clerk event type: ${eventType}`)
    }

    // If the switch statement finished without returning a specific response (e.g., for unhandled types),
    // return a generic success response. Clerk expects a 2xx response for acknowledged webhooks.
    return new Response(JSON.stringify({ message: 'Webhook received successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (processingError: unknown) {
    // Catch any unexpected errors during the main processing logic (after verification).
    const message =
      processingError instanceof Error ? processingError.message : 'Unknown processing error.'
    console.error(
      `Clerk webhook error: Failed to process event type ${eventType}. Error: ${message}`,
    )
    // Return a generic server error response.
    return new Response(`Webhook Processing Error: ${message}`, { status: 500 })
  }
}
