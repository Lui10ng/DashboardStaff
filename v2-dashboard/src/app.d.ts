import type { User, Session, AuthObject } from 'svelte-clerk/server';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {

			user: User | null;

			session: Session | null;

			auth(): () => void;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
