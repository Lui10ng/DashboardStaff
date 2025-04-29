import type { Registrant } from '$lib/types/registrant';
export class RegistrantsStore {
	// Registrants data
	registrants = $state<Registrant[]>([]);
	isLoading = $state(false);
	error = $state<string | null>(null);

	// Set registrants data
	setRegistrants(data: Registrant[]) {
		this.registrants = data || [];
	}
}

// Create and export a singleton instance
export const registrantsStore = new RegistrantsStore();
