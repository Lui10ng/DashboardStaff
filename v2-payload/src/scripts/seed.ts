import { getPayloadClient } from '@/payload/payloadClient'
import type { Payload } from 'payload'
// import { formatSlug } from '@/utils/slugify'
import { users } from './users.json'

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
      for (const user of users) {
        // await payload.create({
        //   collection: 'users',
        //   overrideAccess: true,
        //   data: user,
        // })
      }

      console.log('  - Admin user created.')
    } else {
      console.log('  - Admin user already exists.')
    }

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
