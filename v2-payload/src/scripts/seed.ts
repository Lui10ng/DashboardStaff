import { getPayloadClient } from '@/payload/payloadClient'
import type { Payload } from 'payload'
// import { formatSlug } from '@/utils/slugify'
import type { User } from '../payload-types'
import { users } from './users.json'
import { venues } from './venues.json'

/**
 * when runninng this script, it will create the following:
 * 1. Admin users, organizers, attendees, and checkin staff
 * 2. Organizers
 * 3. Venues
 *
 * Note: This script is intended to be run in a development environment only. Please run migrate:fresh before running this script.
 *
 */

const seedData = async (): Promise<void> => {
  console.log('Starting database seed process...')
  let payload: Payload

  try {
    payload = await getPayloadClient()
    console.log('Payload client initialized.')
  } catch (error) {
    console.error('Error initializing Payload client:', error)
    process.exit(1)
  }

  try {
    // Create Seed Data
    console.log('\nCreating seed data...')

    // 1. Users
    console.log('Seeding Users...')
    const adminFind = await payload.find({
      collection: 'users',
      where: { email: { equals: 'admin@veent.co' } },
      limit: 1,
      overrideAccess: true,
    })
    if (adminFind.docs.length === 0) {
<<<<<<< Updated upstream
      // adminUser = await payload.create({
      //   collection: 'users', overrideAccess: true,
      //   data: {
      //     email: 'admin@example.com',
      //     password: 'password', // Use a secure password or env var
      //     name: 'Admin User',
      //     // roles: ['admin'],
      //   //   _verified: true, // Assuming email verification isn't strictly needed for seeding
      //   }
      // });
      console.log('  - Admin user created.');
=======
      for (const user of users) {
        await payload.create({
          collection: 'users',
          overrideAccess: true,
          data: user,
        })
      }

      console.log('  - Admin user created.')
>>>>>>> Stashed changes
    } else {
      console.log('  - Admin user already exists.')
    }

<<<<<<< Updated upstream
    // const organizerUser = await payload.create({
    //   collection: 'users', overrideAccess: true,
    //   data: {
    //     email: 'organizer@example.com', password: 'password', name: 'Event Organizer One', 
    //     // roles: ['organizer'],
    //   }
    // });
    console.log('  - Organizer user created.');

    // const attendeeUser = await payload.create({
    //   collection: 'users', overrideAccess: true,
    //   data: {
    //     email: 'attendee@example.com', password: 'password', name: 'Regular Attendee', 
    //     // roles: ['attendee'],
    //   }
    // });
    console.log('  - Attendee user created.');


    // --- 2. Categories ---
    console.log(' Seeding Categories...');
    // const techCategory = await payload.create({ collection: 'event-categories', overrideAccess: true, data: { name: 'Technology', description: 'Events about software, hardware, and tech trends.'} });
    // const musicCategory = await payload.create({ collection: 'event-categories', overrideAccess: true, data: { name: 'Music', description: 'Concerts, festivals, and live music performances.'} });
    console.log('  - Categories created.');

    // --- 3. Venues ---
    console.log(' Seeding Venues...');
    // const techHubVenue = await payload.create({ collection: 'venues', overrideAccess: true, data: { name: 'Innovatech Hub', address: { street: '123 Silicon St', city: 'Techville', country: 'USA' }, capacity: 200 }});
    // const concertHallVenue = await payload.create({ collection: 'venues', overrideAccess: true, data: { name: 'Harmony Hall', address: { street: '456 Melody Ln', city: 'Music City', country: 'USA' }, capacity: 1500 }});
    console.log('  - Venues created.');

    // --- 4. Organizers ---
    console.log(' Seeding Organizers...');
    // const techConfOrg = await payload.create({ collection: 'organizers', overrideAccess: true, data: { name: 'Tech Conferences Inc.', contactEmail: 'contact@techconf.example.com', managingUsers: [organizerUser.id] }});
    console.log('  - Organizer created.');

    // --- 5. Registration Form Templates ---
    console.log(' Seeding Registration Form Templates...');
    // const standardTemplate = await payload.create({ collection: 'registration-form-templates', overrideAccess: true, data: {
    //   name: 'Standard Attendee Info',
    //   description: 'Collects basic info and T-shirt size.',
    //   formDefinition: [
    //     { name: 'jobTitle', label: 'Job Title', fieldType: 'text', required: false },
    //     { name: 'company', label: 'Company', fieldType: 'text', required: false },
    //     { name: 'tShirtSize', label: 'T-Shirt Size', fieldType: 'select', required: true, options: [ {label: 'S', value: 's'}, {label: 'M', value: 'm'}, {label: 'L', value: 'l'}, {label: 'XL', value: 'xl'} ]}
    //   ]
    // }});
    console.log('  - Registration template created.');

    // --- 6. Events ---
    // Requires IDs from Users, Categories, Venues, Organizers, RegFormTemplates
    console.log(' Seeding Events...');
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(9, 0, 0, 0);
    const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 7); nextWeek.setHours(19, 0, 0, 0);
    const nextWeekEnd = new Date(nextWeek); nextWeekEnd.setHours(22, 0, 0, 0);

    // await payload.create({ collection: 'events', overrideAccess: true, data: {
    //   name: 'Payload & SvelteKit Integration Summit',
    //   slug: formatSlug('Payload & SvelteKit Integration Summit'),
    //   // status: 'published',
    //   startTime: tomorrow.toISOString(),
    //   endTime: new Date(tomorrow.getTime() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours later
    //   description: { // Wrap the content in the root object
    //     root: {
    //       type: 'root',
    //       format: '',
    //       indent: 0,
    //       version: 1,
    //       children: [
    //         { // This is your original paragraph structure
    //           type: 'paragraph',
    //           format: '',
    //           indent: 0,
    //           version: 1,
    //           children: [
    //             {
    //               detail: 0,
    //               format: 0,
    //               mode: 'normal',
    //               style: '',
    //               text: 'A deep dive into building powerful apps.',
    //               type: 'text',
    //               version: 1,
    //             }
    //           ],
    //         }
    //       ],
    //       direction: 'ltr',
    //     },
    //   },
    //   organizer: techConfOrg.id,
    //   venue: techHubVenue.id,
    //   category: techCategory.id,
    //   // seatingType: 'general_admission', // Simple seating for this one
    //   // seatMap: null, // No seat map needed for GA
    //   registrationForm: standardTemplate.id, // Use the standard form
    //   totalCapacity: 150, // Optional overall capacity
    // }});
    console.log('  - Tech event created.');

    // await payload.create({ collection: 'events', overrideAccess: true, data: {
    //   name: 'Indie Rock Night',
    //   slug: formatSlug('Indie Rock Night'),
    //   // status: 'published',
    //   startTime: nextWeek.toISOString(),
    //   endTime: nextWeekEnd.toISOString(),
    //   description: { // Wrap the content in the root object
    //     root: {
    //       type: 'root',
    //       format: '',
    //       indent: 0,
    //       version: 1,
    //       children: [
    //         { // This is your original paragraph structure
    //           type: 'paragraph',
    //           format: '',
    //           indent: 0,
    //           version: 1,
    //           children: [
    //             {
    //               detail: 0,
    //               format: 0,
    //               mode: 'normal',
    //               style: '',
    //               text: 'Featuring local bands',
    //               type: 'text',
    //               version: 1,
    //             }
    //           ],
    //         }
    //       ],
    //       direction: 'ltr',
    //     },
    //   },
    //   organizer: techConfOrg.id, // Same organizer for simplicity
    //   venue: concertHallVenue.id,
    //   category: musicCategory.id,
    //   // seatingType: 'general_admission', // Could be 'reserved_seating' if a SeatMap was created and linked
    //   registrationForm: standardTemplate.id, // Use same form template
    // }});
    console.log('  - Music event created.');

    // --- Seed other collections as needed (TicketTypes, etc.) ---
    // Note: Orders, Tickets, Registrants are usually created via user interaction simulation or specific test cases,
    // rather than general seeding, but could be added here if needed.

    console.log('\nDatabase seed process completed successfully!');
=======
    // Add Venue Seeding
    console.log('Seeding Venues...')
    const venueFind = await payload.find({
      collection: 'venues',
      limit: 1,
      overrideAccess: true,
    })

    if (venueFind.docs.length === 0) {
      for (const venue of venues) {
        try {
          await payload.create({
            collection: 'venues',
            data: venue,
            overrideAccess: true,
          })
          console.log(`  - Created venue: ${venue.name}`)
        } catch (error) {
          console.error(`  - Failed to create venue ${venue.name}:`, error)
        }
      }
      console.log(`  - ${venues.length} venues created successfully`)
    } else {
      console.log('  - Venues already exist, skipping...')
    }
>>>>>>> Stashed changes

    console.log('\nDatabase seed process completed successfully!')
  } catch (error: unknown) {
    console.error('Error during database seed:', error)
    process.exit(1)
  }
}

// --- Run the Seed Function ---
seedData()
  .then(() => {
    console.log('Seed script finished.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Seeding script failed:', error)
    process.exit(1)
  })
