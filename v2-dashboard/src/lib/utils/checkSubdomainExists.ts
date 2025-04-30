import { PUBLIC_PAYLOAD_API_URL } from '$env/static/public';

export async function checkSubdomainExists(subdomain: string) {
	try {
		const response = await fetch(
			`${PUBLIC_PAYLOAD_API_URL}/api/events?where[slug][equals]=${subdomain}`
		);
        const data = await response.json();
        
		/**
		 * if makakita og same subdomain sa isa ka event then return true
		 *
		 */
		return data.totalDocs > 0;
	} catch (error) {
		console.error('Error checking subdomain:', error);
		throw error;
	}
}