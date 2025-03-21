import { writable } from 'svelte/store';
import type Lenis from 'lenis';

export const lenisInstance = writable<Lenis | null>(null);
