// src/payload/payloadClient.ts
import payload, { Payload } from 'payload';
import path from 'path';
import fs from 'fs'; // Needed for config path resolution usually
import 'dotenv/config'; // Load .env file from project root

// Helper to find the config path dynamically
const findPayloadConfig = (dir = process.cwd()): string | null => {
    const potentialPath = path.resolve(dir, 'payload.config.js'); // Look for compiled JS
    if (fs.existsSync(potentialPath)) {
        return potentialPath;
    }
    const potentialTsPath = path.resolve(dir, 'payload.config.ts'); // Or TS
     if (fs.existsSync(potentialTsPath)) {
        return potentialTsPath;
    }
    const parentDir = path.resolve(dir, '..');
    if (parentDir === dir) { // Reached root
        return null;
    }
    return findPayloadConfig(parentDir); // Go up one directory
};


// Cache the client
let cachedClient: Payload | null = null;

export const getPayloadClient = async (): Promise<Payload> => {
  if (cachedClient) {
    return cachedClient;
  }

  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET environment variable is missing.');
  }

  // --- Find the compiled config path ---
  // This might need adjustment based on your build output structure
  // Option 1: Use env var if reliable (set in compose/script)
  // const configPath = process.env.PAYLOAD_CONFIG_PATH
  // Option 2: Search dynamically (example above)
  const configPath = findPayloadConfig();
  if (!configPath) {
      throw new Error('Could not find payload.config.js or payload.config.ts');
  }
  console.log(`Using Payload config path: ${configPath}`);


  try {
    console.log('Initializing Payload client programmatically (local)...');
    // Import config dynamically
    const config = await import(configPath); // Adjust if using default export etc.

    cachedClient = await payload.init({
    //   secret: process.env.PAYLOAD_SECRET,
      config: config.default || config, // Adjust based on how your config is exported
    //   local: true, // !! Important for programmatic access without running HTTP server
      // Optionally disable email for seeding
      // email: {
      //   transportOptions: { jsonTransport: true }, // Prevents actual email sending
      //   fromName: 'Seed',
      //   fromAddress: 'seed@example.com',
      // },
      onInit: async (initPayload) => {
        // Optional: Can add logic here specific to programmatic init if needed
        initPayload.logger.info('Payload Programmatic Client Initialized for Seeding');
      },
    });
     console.log('Payload client initialized successfully.');
  } catch (e: unknown) {
    console.error("Error initializing Payload client:", e);
    throw e;
  }

  return cachedClient;
};