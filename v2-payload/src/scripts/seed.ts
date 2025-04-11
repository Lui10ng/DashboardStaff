// src/scripts/seed.ts
import 'dotenv/config'; // Load .env variables from project root
import { getPayloadClient } from '../payload/payloadClient'; // Adjust path if needed
import type { Payload } from 'payload';
import { formatSlug } from '@/utils/slugify';
import type { User } from '../payload-types'; // Import generated types

// Function to create data, ensuring dependencies are handled
const seedData = async (): Promise<void> => {
  console.log('Starting database seed process...');
  let payload: Payload;

  try {
    payload = await getPayloadClient();
    console.log('Payload client initialized.');
  } catch (error) {
    console.error('Error initializing Payload client:', error);
    process.exit(1);
  }

  try {
    // --- Optional: Clear existing data (Use with caution!) ---
    // Consider only clearing specific collections or adding where clauses
    console.log('Clearing existing data (excluding admin user)...');
    await Promise.all([
      payload.delete({ collection: 'events', where: {}, overrideAccess: true }),
      payload.delete({ collection: 'venues', where: {}, overrideAccess: true }),
      payload.delete({ collection: 'event-categories', where: {}, overrideAccess: true }),
      payload.delete({ collection: 'organizers', where: {}, overrideAccess: true }),
      payload.delete({ collection: 'registration-form-templates', where: {}, overrideAccess: true }),
      payload.delete({ collection: 'orders', where: {}, overrideAccess: true }), // Clear dependent data too
      payload.delete({ collection: 'tickets', where: {}, overrideAccess: true }),
      payload.delete({ collection: 'registrants', where: {}, overrideAccess: true }),
      payload.delete({ collection: 'users', where: { email: { not_equals: 'admin@example.com' } }, overrideAccess: true }), // Keep your main admin
    ]);
    console.log('Existing data cleared.');

    // --- Create Seed Data ---
    console.log('\nCreating seed data...');

    // --- 1. Users ---
    console.log(' Seeding Users...');
    let adminUser: User | undefined;
    const adminFind = await payload.find({ collection: 'users', where: { email: { equals: 'admin@example.com'}}, limit: 1, overrideAccess: true });
    if (adminFind.docs.length === 0) {
      adminUser = await payload.create({
        collection: 'users', overrideAccess: true,
        data: {
          email: 'admin@example.com',
          password: 'password', // Use a secure password or env var
          name: 'Admin User',
          // roles: ['admin'],
        //   _verified: true, // Assuming email verification isn't strictly needed for seeding
        }
      });
      console.log('  - Admin user created.');
    } else {
      adminUser = adminFind.docs[0];
      console.log('  - Admin user already exists.');
    }

    const organizerUser = await payload.create({
      collection: 'users', overrideAccess: true,
      data: {
        email: 'organizer@example.com', password: 'password', name: 'Event Organizer One', 
        // roles: ['organizer'],
      }
    });
    console.log('  - Organizer user created.');

    const attendeeUser = await payload.create({
      collection: 'users', overrideAccess: true,
      data: {
        email: 'attendee@example.com', password: 'password', name: 'Regular Attendee', 
        // roles: ['attendee'],
      }
    });
    console.log('  - Attendee user created.');


    // --- 2. Categories ---
    console.log(' Seeding Categories...');
    const techCategory = await payload.create({ collection: 'event-categories', overrideAccess: true, data: { name: 'Technology', description: 'Events about software, hardware, and tech trends.'} });
    const musicCategory = await payload.create({ collection: 'event-categories', overrideAccess: true, data: { name: 'Music', description: 'Concerts, festivals, and live music performances.'} });
    console.log('  - Categories created.');

    // --- 3. Venues ---
    console.log(' Seeding Venues...');
    const techHubVenue = await payload.create({ collection: 'venues', overrideAccess: true, data: { name: 'Innovatech Hub', address: { street: '123 Silicon St', city: 'Techville', country: 'USA' }, capacity: 200 }});
    const concertHallVenue = await payload.create({ collection: 'venues', overrideAccess: true, data: { name: 'Harmony Hall', address: { street: '456 Melody Ln', city: 'Music City', country: 'USA' }, capacity: 1500 }});
    console.log('  - Venues created.');

    // --- 4. Organizers ---
    console.log(' Seeding Organizers...');
    const techConfOrg = await payload.create({ collection: 'organizers', overrideAccess: true, data: { name: 'Tech Conferences Inc.', contactEmail: 'contact@techconf.example.com', managingUsers: [organizerUser.id] }});
    console.log('  - Organizer created.');

    // --- 5. Registration Form Templates ---
    console.log(' Seeding Registration Form Templates...');
    const standardTemplate = await payload.create({ collection: 'registration-form-templates', overrideAccess: true, data: {
      name: 'Standard Attendee Info',
      description: 'Collects basic info and T-shirt size.',
      formDefinition: [
        { name: 'jobTitle', label: 'Job Title', fieldType: 'text', required: false },
        { name: 'company', label: 'Company', fieldType: 'text', required: false },
        { name: 'tShirtSize', label: 'T-Shirt Size', fieldType: 'select', required: true, options: [ {label: 'S', value: 's'}, {label: 'M', value: 'm'}, {label: 'L', value: 'l'}, {label: 'XL', value: 'xl'} ]}
      ]
    }});
    console.log('  - Registration template created.');

    // --- 6. Events ---
    // Requires IDs from Users, Categories, Venues, Organizers, RegFormTemplates
    console.log(' Seeding Events...');
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(9, 0, 0, 0);
    const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 7); nextWeek.setHours(19, 0, 0, 0);
    const nextWeekEnd = new Date(nextWeek); nextWeekEnd.setHours(22, 0, 0, 0);

    await payload.create({ collection: 'events', overrideAccess: true, data: {
      name: 'Payload & SvelteKit Integration Summit',
      slug: formatSlug('Payload & SvelteKit Integration Summit'),
      // status: 'published',
      startTime: tomorrow.toISOString(),
      endTime: new Date(tomorrow.getTime() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours later
      description: { // Wrap the content in the root object
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          children: [
            { // This is your original paragraph structure
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'A deep dive into building powerful apps.',
                  type: 'text',
                  version: 1,
                }
              ],
            }
          ],
          direction: 'ltr',
        },
      },
      organizer: techConfOrg.id,
      venue: techHubVenue.id,
      category: techCategory.id,
      // seatingType: 'general_admission', // Simple seating for this one
      // seatMap: null, // No seat map needed for GA
      registrationForm: standardTemplate.id, // Use the standard form
      totalCapacity: 150, // Optional overall capacity
    }});
    console.log('  - Tech event created.');

    await payload.create({ collection: 'events', overrideAccess: true, data: {
      name: 'Indie Rock Night',
      slug: formatSlug('Indie Rock Night'),
      // status: 'published',
      startTime: nextWeek.toISOString(),
      endTime: nextWeekEnd.toISOString(),
      description: { // Wrap the content in the root object
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          children: [
            { // This is your original paragraph structure
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Featuring local bands',
                  type: 'text',
                  version: 1,
                }
              ],
            }
          ],
          direction: 'ltr',
        },
      },
      organizer: techConfOrg.id, // Same organizer for simplicity
      venue: concertHallVenue.id,
      category: musicCategory.id,
      // seatingType: 'general_admission', // Could be 'reserved_seating' if a SeatMap was created and linked
      registrationForm: standardTemplate.id, // Use same form template
    }});
    console.log('  - Music event created.');

    // --- Seed other collections as needed (TicketTypes, etc.) ---
    // Note: Orders, Tickets, Registrants are usually created via user interaction simulation or specific test cases,
    // rather than general seeding, but could be added here if needed.

    console.log('\nDatabase seed process completed successfully!');

  } catch (error: unknown) {
    console.error('Error during database seed:', error);
    process.exit(1); // Exit with error code
  }
};

// --- Run the Seed Function ---
seedData()
  .then(() => {
    console.log("Seed script finished.");
    process.exit(0); // Exit successfully
  })
  .catch((error) => {
    console.error("Seeding script failed:", error);
    process.exit(1); // Exit with error code if seedData itself throws unhandled
  });