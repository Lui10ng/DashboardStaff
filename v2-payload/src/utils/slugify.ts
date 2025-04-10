/**
 * Converts a string into a URL-friendly slug.
 * - Converts to lowercase
 * - Removes diacritics/accents
 * - Replaces spaces with hyphens
 * - Removes characters that are not alphanumeric or hyphens
 * - Trims leading/trailing hyphens
 * @param text The string to slugify.
 * @returns The slugified string.
 */
export const formatSlug = (text: string | null | undefined): string => {
    if (!text) {
        return ''; // Return empty string if input is null, undefined, or empty
    }

    return text
        .toString()                     // Ensure input is a string
        .toLowerCase()                  // Convert to lowercase
        .normalize('NFD')               // Decompose accented characters (e.g., é -> e + ´)
        .replace(/[\u0300-\u036f]/g, '') // Remove the combining diacritical marks
        .trim()                         // Remove leading/trailing whitespace
        .replace(/\s+/g, '-')           // Replace spaces and sequences of whitespace with a single hyphen
        .replace(/[^\w-]+/g, '')        // Remove all characters that are NOT word characters (a-z, 0-9, _), underscores, or hyphens
        .replace(/--+/g, '-')           // Replace multiple hyphens with a single hyphen
        .replace(/^-+/, '')             // Trim leading hyphens
        .replace(/-+$/, '');            // Trim trailing hyphens
};