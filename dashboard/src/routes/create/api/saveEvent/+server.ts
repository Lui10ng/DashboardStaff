import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const data = await request.json();

        // Generate a unique event ID
        const eventId = crypto.randomUUID(); 

        // Define the path to save the JSON file
        const filePath = path.join(process.cwd(), 'src', 'lib', 'types', 'data', 'data.json');

        // Read existing data asynchronously
        let existingData = [];
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            existingData = JSON.parse(fileContent);
        } catch (err) {
            if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
                // File not found: Ignore error and proceed with an empty array
            } else {
                throw err; // Rethrow other errors
            }
        }

        // Append new data with eventId
        const eventWithId = { eventId, ...data };
        existingData.push(eventWithId);

        // Write updated data back to the file asynchronously
        await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));

        return json({ message: 'Event saved successfully!', eventId }, { status: 200 });
    } catch (error) {
        console.error('Error saving event:', error);
        return json({ error: 'Failed to save event' }, { status: 500 });
    }
};