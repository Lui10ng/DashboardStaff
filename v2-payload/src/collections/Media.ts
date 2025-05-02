import type { CollectionConfig } from 'payload'
import { isAdminOrSelf } from '@/access/isAdminOrSelf'

const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
  upload: true,
}

export default Media
