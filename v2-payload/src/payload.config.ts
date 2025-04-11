// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { s3Storage } from '@payloadcms/storage-s3'

import EventAnnouncements from './collections/EventAnnouncements'
import EventCategories from './collections/EventCategories'
import Events from './collections/Events'
import Media from './collections/Media'
import Orders from './collections/Orders'
import OrganizerPhotos from './collections/OrganizerPhotos'
import Organizers from './collections/Organizers'
import Promotions from './collections/Promotions'
import Registrants from './collections/Registrants'
import RegistrationFormTemplates from './collections/RegistrationFormTemplates'
import SeatMaps from './collections/SeatMaps'
import Tickets from './collections/Tickets'
import TicketTypes from './collections/TicketTypes'
import Transactions from './collections/Transactions'
import Users from './collections/Users'
import Venues from './collections/Venues'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const isDev = (process.env.NODE_ENV === 'development')

// Define plugins conditionally
const conditionalPlugins = [
  (!isDev) ? s3Storage({
      collections: {
        'media': true,
      },
      config: {
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
        },
        region: 'ap-southeast-1',
        endpoint: "https://sgp1.digitaloceanspaces.com",
      },
      bucket: 'veent',
      acl: "public-read",
    })
    : null,
  // Add other conditional plugins here if needed
]

// Filter out null values
const activePlugins = conditionalPlugins.filter(plugin => plugin !== null)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    EventAnnouncements,
    EventCategories,
    Events,
    Media,
    Orders,
    OrganizerPhotos,
    Organizers,
    Promotions,
    Registrants,
    RegistrationFormTemplates,
    SeatMaps,
    Tickets,
    TicketTypes,
    Transactions,
    Users,
    Venues,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    push: false
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    ...activePlugins
  ],
  cors: [
  'http://localhost:5173', 
  'http://localhost:5174', 
  'http://localhost:1344',
  ]
})
