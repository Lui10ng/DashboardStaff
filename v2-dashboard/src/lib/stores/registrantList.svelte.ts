import type { GuestProps } from '$lib/types';
import { writable, derived, type Writable } from 'svelte/store';



// Create the main stores with initial values
export const registrantStore: Writable<GuestProps[]> = writable([]);
export const guestStatusFilter: Writable<'all' | 'registered' | 'pending'> = writable('all');
export const searchQuery: Writable<string> = writable('');
export const currentPage: Writable<number> = writable(1);
export const itemsPerPage: Writable<number> = writable(10);

// Derived store for filtered and paginated guests
export const filteredGuests = derived(
  [registrantStore, guestStatusFilter, searchQuery],
  ([$registrantStore, $guestStatusFilter, $searchQuery]) => {
    let filtered = $registrantStore;

    // Filter by status
    if ($guestStatusFilter !== 'all') {
      filtered = filtered.filter((guest) => guest.status === $guestStatusFilter);
    }

    // Filter by search query
    if ($searchQuery) {
      const lowerCaseQuery = $searchQuery.toLowerCase();
      filtered = filtered.filter((guest) => {
        return (
          guest.name.toLowerCase().includes(lowerCaseQuery) ||
          guest.email.toLowerCase().includes(lowerCaseQuery)
        );
      });
    }

    return filtered;
  }
);

// Derived store for paginated guests
export const paginatedGuests = derived(
  [filteredGuests, currentPage, itemsPerPage],
  ([$filteredGuests, $currentPage, $itemsPerPage]) => {
    const startIndex = ($currentPage - 1) * $itemsPerPage;
    const endIndex = startIndex + $itemsPerPage;
    return $filteredGuests.slice(startIndex, endIndex);
  }
);

// Derived store for total pages
export const totalPages = derived(
  [filteredGuests, itemsPerPage],
  ([$filteredGuests, $itemsPerPage]) => {
    return Math.ceil($filteredGuests.length / $itemsPerPage);
  }
);

// Helper functions to interact with the store
export function updateRegistrant(id: string, updates: Partial<GuestProps>): void {
  registrantStore.update(registrants => 
    registrants.map(reg => reg.id === id ? { ...reg, ...updates } : reg)
  );
}

export function addRegistrant(registrant: GuestProps): void {
  registrantStore.update(registrants => [...registrants, registrant]);
}

export function removeRegistrant(id: string): void {
  registrantStore.update(registrants => registrants.filter(reg => reg.id !== id));
}

export function resetFilters(): void {
  guestStatusFilter.set('all');
  searchQuery.set('');
  currentPage.set(1);
}

