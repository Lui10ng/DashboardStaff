// src/collections/OrganizerPhotos.ts
import type { CollectionConfig } from 'payload';
import path from 'path';
import type { User } from '../payload-types';
import { fileURLToPath } from 'url';

// Helper to check environment more reliably
const isDevelopment = process.env.NODE_ENV === 'development';

// Calculate __dirname equivalent for ES Modules
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Define local storage path (used only in development)
// Use the calculated dirname instead of the CommonJS __dirname
const localOrganizersMediaDir = path.resolve(dirname, '../../media/organizers'); 

const OrganizerPhotos: CollectionConfig = {
  slug: 'organizer-photos',
  admin: {
    useAsTitle: 'filename',
    description: 'Dedicated image library for organizer logos, banners, etc.',
    defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'],
    listSearchableFields: ['filename', 'alt'],
    group: 'Organizers & Events', // Group related collections
  },
  // Access Control Notes:
  // Read access likely public if used in profiles.
  // Write access should be limited, perhaps to managing users of the organizer it's linked from, or admins.
  access: {
    read: () => true, // Public can view images
    create: () => true,
    update: () => true,
    delete: () => true,
    // Create/Update/Delete might be restricted based on who manages the related Organizer
    // create: ({ req: { user } }) => Boolean(user), // Logged-in user can upload (needs refinement)
    // update: ({ req: { user } }) => Boolean(user), // Logged-in user can update alt text (needs refinement)
    // delete: ({ req: { user } }) => user?.roles?.includes('admin'), // Admins can delete
  },
  // --- Enable Uploads ---
  upload: {
    // --- Local Storage (Development Only) ---
    staticDir: isDevelopment ? localOrganizersMediaDir : undefined,
    // staticURL: isDevelopment ? '/media/organizers' : undefined, // Path relative to server URL

    // --- Image Resizing & Formatting (Optional) ---
    imageSizes: [
      { name: 'thumbnail', width: 480, height: 320, position: 'centre', formatOptions: { format: 'webp' } },
      { name: 'logo', width: 600, height: 600, fit: 'inside', formatOptions: { format: 'webp' } }, // Example size for logos
      { name: 'banner', width: 1600, height: 400, position: 'centre', formatOptions: { format: 'webp' } }, // Example size for banners
    ],
    // --- Other Upload Options ---
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'], // Specify allowed image types
    adminThumbnail: 'thumbnail', // Use 'thumbnail' size in admin list/grid views
    // --- File Size Limits ---
    // filesize: 5 * 1024 * 1024, // Example: 5MB limit
  },
  // --- Fields for Metadata ---
  fields: [
    {
      name: 'alt',
      label: 'Alt Text',
      type: 'text',
      required: true, // Essential for accessibility
      admin: {
        description: 'Describe the image for screen readers and SEO. Crucial for accessibility.',
      },
    },
    {
      name: 'caption',
      label: 'Caption',
      type: 'text', // Optional caption for the image
    },
    // Payload automatically adds: filename, filesize, mimeType, width, height, sizes (if image), url.
    // Remember: An afterRead hook is needed to rewrite 'url' and 'sizes[].url' fields
    // if serving from a CDN in staging/production environments.
  ],
  timestamps: true,
};

// IMPORTANT: Add '/media/organizers' (or your chosen local path) to your .gitignore file!

export default OrganizerPhotos;