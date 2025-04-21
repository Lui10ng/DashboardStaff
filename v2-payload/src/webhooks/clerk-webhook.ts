// src/webhooks/clerkWebhookHandler.ts
import { Webhook } from 'svix';
import type { PayloadRequest } from 'payload';
import type { WebhookEvent } from '@clerk/backend';

// Ensure your secret is loaded correctly (e.g., from environment variables)
const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

// Return standard Web API Response
export const clerkWebhookHandler = async (req: PayloadRequest): Promise<Response> => {
  // Ensure the request method is POST
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // Access the raw request body as an ArrayBuffer and convert to Buffer
  if (!req.arrayBuffer) {
     console.error('Webhook Error: Incoming request does not support arrayBuffer');
     return new Response('Bad Request: Cannot read request body', { status: 400 });
  }

  const arrayBuffer = await req.arrayBuffer();
  const rawBody = Buffer.from(arrayBuffer);

  // Extract Svix Headers
  const svixId = req.headers.get('svix-id') as string;
  const svixTimestamp = req.headers.get('svix-timestamp') as string;
  const svixSignature = req.headers.get('svix-signature') as string;

  // If any required header is missing, return an error
  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error('Webhook Error: Missing Svix headers');
    return new Response('Missing Svix headers', { status: 400 });
  }

  // Perform Svix Verification
  const wh = new Webhook(secret as string);
  let msg: any; // Type this according to your expected webhook payload
  try {
    // The verify function takes the raw body (Buffer) and headers
    msg = wh.verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (err) {
    // Verification failed
    console.error('Webhook verification failed:', err);
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  // Webhook is successfully verified, process the event
  console.log('Webhook received and verified:', msg);

    // Webhook is successfully verified, you can now process the rawBody
    // If the webhook payload is JSON, you'll need to parse the rawBody buffer:
    const webhookPayload = JSON.parse(rawBody.toString('utf-8'));

    console.log('Webhook received and verified:', webhookPayload);

    // --- Processing Start ---
    const eventType = webhookPayload.type;
    const eventData = webhookPayload.data;
    const payload = req.payload;

    try {
        console.log(`Processing verified Clerk event type: ${eventType}`);

        switch (eventType) {
            case 'user.created':
                console.log(`Processing Clerk event: ${eventType} for Clerk User ID: ${eventData.id}`);
                // const existingUserCheck = await payload.find({
                //     collection: 'users',
                //     where: { clerkId: { equals: eventData.id } },
                //     limit: 1,
                //     depth: 0,
                //     req: req, 
                // });

                // if (existingUserCheck.docs.length === 0) {
                //     const email = eventData.email_addresses?.[0]?.email_address;
                //     const clerkId = eventData.id;
                //     await payload.create({
                //         collection: 'users',
                //         data: {
                //             email,
                //             clerkId,
                //             roles: ['organizer'], 
                //         },
                //         overrideAccess: true, 
                //         req: req, 
                //     });
                //     console.log(`-> Created Payload user for Clerk User ID: ${eventData.id}`);
                // } else {
                //     console.log(`-> Payload user already exists for Clerk User ID: ${eventData.id}. Skipping creation.`);
                // }
                break;

            case 'user.updated':
                console.log(`Processing Clerk event: ${eventType} for Clerk User ID: ${eventData.id}`);
                // const userToUpdateQuery = await payload.find({
                //     collection: 'users',
                //     where: { clerkId: { equals: eventData.id } },
                //     limit: 1,
                //     depth: 0,
                //     req: req,
                // });
                // const userToUpdate = userToUpdateQuery.docs[0] as any;

                // if (userToUpdate) {
                //     await payload.update({
                //         collection: 'users',
                //         id: userToUpdate.id, 
                //         data: {
                //             email: eventData.email_addresses?.[0]?.email_address,
                //         },
                //         overrideAccess: true,
                //         req: req,
                //     });
                //     console.log(`-> Updated Payload user for Clerk User ID: ${eventData.id}`);
                // } else {
                //     console.warn(`-> Received user.updated for Clerk User ID ${eventData.id}, but no matching Payload user found.`);
                // }
                break;

            case 'user.deleted':
                console.log(`Processing Clerk event: ${eventType} for Clerk User ID: ${eventData.id}`);
                // const userToDeleteQuery = await payload.find({
                //     collection: 'users',
                //     where: { clerkId: { equals: eventData.id } },
                //     limit: 1,
                //     depth: 0,
                //     req: req,
                // });
                // const userToDelete = userToDeleteQuery.docs[0] as any;

                // if (userToDelete) {
                //     await payload.delete({
                //         collection: 'users',
                //         id: userToDelete.id, 
                //         overrideAccess: true,
                //         req: req,
                //     });
                //     console.log(`-> Deleted Payload user for Clerk User ID: ${eventData.id}`);
                // } else {
                //     console.warn(`-> Received user.deleted for Clerk User ID ${eventData.id}, but no matching Payload user found.`);
                // }
                break;

            default:
                console.log(`Received unhandled Clerk event type: ${eventType}`);
        }

        // Return a Response object for success
        return new Response(JSON.stringify({ message: 'Webhook received successfully' }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (processingError: unknown) {
        const message = processingError instanceof Error ? processingError.message : 'Unknown processing error.';
        console.error(`Clerk webhook error: Failed to process event type ${eventType}. Error: ${message}`);
        // Return a Response object for errors
        return new Response(`Webhook Processing Error: ${message}`, { status: 500 });
    }
};