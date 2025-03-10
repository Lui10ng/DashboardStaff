import { writable } from 'svelte/store';

export const eventDetails = writable();
export const activeRoute = writable('registrants');