import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	return {
		urlConfig: {
			fbMessengerUrl: 'https://m.me/veent.io',
			loginUrl: 'https://dashboard.veent.io/login',
			signupUrl: 'https://dashboard.veent.io/signup'
		}
	};
};
