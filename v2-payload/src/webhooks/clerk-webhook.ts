// src/webhooks/clerkWebhookHandler.ts
import { Webhook } from 'svix';
import type { PayloadRequest } from 'payload';
import type { User } from '../payload-types'; // Adjust path if needed

/**
 * Handles Clerk webhooks to sync users with Payload.
 *
 * Verifies the request came from Clerk. Then, based on the event
 * ('user.created', 'user.updated', 'user.deleted'), it creates,
 * updates, or deletes the corresponding user in Payload.
 * Responds 200 on success, 400/500 on errors.
 *
 * @param {PayloadRequest} req Incoming Clerk request.
 * @returns {Promise<Response>} Response to Clerk (200, 400, or 500).
 * @throws {Response} Implicitly via return on verification/processing errors.
 * @requires process.env.CLERK_WEBHOOK_SECRET Clerk secret key.
 * @requires svix Library for verification (`npm install svix`).
 */
export const clerkWebhookHandler = async (req: PayloadRequest): Promise<Response> => {
    // --- Verification Start ---

    // 1. Get the secret from environment variables
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
        console.error('Clerk webhook secret is not configured.');
        // Don't tell the sender too much, just that it failed
        return new Response('Webhook Error: Configuration missing', { status: 400 });
    }

    // 2. Get headers sent by Clerk
    const headers = req.headers;
    const svix_id = headers.get('svix-id');
    const svix_timestamp = headers.get('svix-timestamp');
    const svix_signature = headers.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
        console.error('Clerk webhook error: Missing svix headers');
        return new Response('Webhook Error: Missing headers', { status: 400 });
    }

    // 3. Get the RAW request body (important: must be raw, not parsed JSON)
    let rawBody: string = ''; // Initialize rawBody
    try {
        // Check if req and req.text are valid before calling
        if (req && typeof req.text === 'function') {
            // req.text() reads the raw body stream
            rawBody = await req.text();
        } else {
            console.error('Clerk webhook error: Request object or text method is undefined.');
            return new Response('Webhook Error: Invalid request object', { status: 400 });
        }
    } catch (err: unknown) { // Add explicit type 'unknown' to the error
        console.error('Clerk webhook error: Could not read raw body.', err);
        // Ensure err is an Error instance before accessing message
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
    }

    const wh = new Webhook(secret);
    let eventPayload: Record<string, any>; // Or Clerk's WebhookEvent type

    try {
        const rawBody = await req.text(); // Get raw body *before* verification
        eventPayload = wh.verify(rawBody, { /* svix headers */ }) as Record<string, any>;
        console.log('Clerk Webhook Verified Successfully!');
    } catch (err: unknown) {
        console.error('Clerk webhook error: Invalid signature.', (err as Error).message);
        return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
    }
    // --- Verification End ---


    // --- Processing Start (New Logic) ---
    const eventType = eventPayload.type;
    const eventData = eventPayload.data; // Clerk user data is usually here

    // Use req.payload to access Payload's Local API
    const payload = req.payload;

    try {
        // Use a switch to handle different event types from Clerk
        switch (eventType) {
            case 'user.created':
                console.log(`Processing Clerk event: ${eventType} for Clerk User ID: ${eventData.id}`);
                // Check if user already exists (important for resilience)
                const existingUserCheck = await payload.find({
                    collection: 'users',
                    where: { clerkId: { equals: eventData.id } },
                    limit: 1,
                    depth: 0,
                    req: req, // Pass req for context
                });

                if (existingUserCheck.docs.length === 0) {
                    // Create a new user in Payload
                    const email = eventData.email_addresses?.[0]?.email_address;
                    const clerkId = eventData.id;
                    await payload.create({
                        collection: 'users',
                        data: {
                            email,
                            clerkId,
                            roles: ['organizer'], // Add default roles
                        },
                        overrideAccess: true, // Often needed when creating system users
                        req: req, // Pass req for context
                    });
                    console.log(`-> Created Payload user for Clerk User ID: ${eventData.id}`);
                } else {
                    console.log(`-> Payload user already exists for Clerk User ID: ${eventData.id}. Skipping creation.`);
                }
                break;

            case 'user.updated':
                console.log(`Processing Clerk event: ${eventType} for Clerk User ID: ${eventData.id}`);
                // Find the existing Payload user by Clerk User ID
                const userToUpdateQuery = await payload.find({
                    collection: 'users',
                    where: { clerkId: { equals: eventData.id } },
                    limit: 1,
                    depth: 0,
                    req: req,
                });
                const userToUpdate = userToUpdateQuery.docs[0] as User | undefined;

                if (userToUpdate) {
                    // Update the Payload user
                    await payload.update({
                        collection: 'users',
                        id: userToUpdate.id, // Use the Payload ID to update
                        data: {
                            email: eventData.email_addresses?.[0]?.email_address,
                            // Map other updatable fields
                        },
                        overrideAccess: true,
                        req: req,
                    });
                    console.log(`-> Updated Payload user for Clerk User ID: ${eventData.id}`);
                } else {
                    console.warn(`-> Received user.updated for Clerk User ID ${eventData.id}, but no matching Payload user found.`);
                    // Optionally: handle this case, maybe attempt creation?
                }
                break;

            case 'user.deleted':
                console.log(`Processing Clerk event: ${eventType} for Clerk User ID: ${eventData.id}`);
                // Find the existing Payload user by Clerk User ID
                const userToDeleteQuery = await payload.find({
                    collection: 'users',
                    where: { clerkId: { equals: eventData.id } },
                    limit: 1,
                    depth: 0,
                    req: req,
                });
                const userToDelete = userToDeleteQuery.docs[0] as User | undefined;

                if (userToDelete) {
                    // Delete the Payload user
                    await payload.delete({
                        collection: 'users',
                        id: userToDelete.id, // Use the Payload ID to delete
                        overrideAccess: true,
                        req: req,
                    });
                    console.log(`-> Deleted Payload user for Clerk User ID: ${eventData.id}`);
                } else {
                    console.warn(`-> Received user.deleted for Clerk User ID ${eventData.id}, but no matching Payload user found.`);
                }
                break;

            // Add cases for other events you care about (e.g., 'session.created')
            // case 'session.created':
            //    console.log(`User ${eventData.user_id} created a session`);
            //    // You might update a 'lastLogin' field here
            //    break;

            default:
                console.log(`Received unhandled Clerk event type: ${eventType}`);
        }

        // --- Processing End ---

        // Respond after processing
        return Response.json({ message: 'Webhook processed successfully' }, { status: 200 });

    } catch (error) {
        payload.logger.error(`Error processing Clerk webhook event ${eventType}: ${error}`);
        // Send a generic server error response
        return Response.json({ message: 'Internal server error processing webhook' }, { status: 500 });
    }
}