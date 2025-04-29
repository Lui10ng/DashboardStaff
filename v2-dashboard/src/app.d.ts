import type { User, Session, AuthObject } from 'svelte-clerk/server';

interface CustomAuthObject {
	userId: string;
	sessionId: string;
	getToken: () => Promise<string | null>;
}

declare global {
	namespace App {
		interface Error { }
		interface Locals {
			auth: () => Promise<CustomAuthObject | null>;
		}
		interface PageData { }
		interface PageState { }
		interface Platform { }
	}
}

export { };
