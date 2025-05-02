import type { User, Session, AuthObject } from 'svelte-clerk/server';
import type { User as PayloadUser } from '$lib/types/payload-types';

interface CustomAuthObject {
	userId: string;
	sessionId: string;
	getToken: () => Promise<string | null>;
}

declare global {
	namespace App {
		interface Error { }
		interface Locals {
			auth: () => Promise<CustomAuthObject | null>,
			payloadUser: PayloadUser | null
		}
		interface PageData { }
		interface PageState { }
		interface Platform { }
	}
}

export { };
