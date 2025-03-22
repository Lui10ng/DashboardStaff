import type { PageServerLoad } from './$types';

export interface Feature {
	text: string;
	category?: string;
}

interface Pricing {
	title: string;
	description: string;
	price: number;
	features: Feature[];
	buttonText: string;
}

interface PageServerData {
	pricing: Pricing[];
	pageTitle: string;
	pageDescription: string;
	urlConfig: {
		signupUrl: string;
	};
}

export const load: PageServerLoad = async ({ parent }) => {
	// Access the urlConfig from layout.server.ts
	const parentData = await parent();

	// Page-specific data
	const pageData: PageServerData = {
		pricing: [
			{
				title: 'Free plan',
				description: 'No hidden charges',
				price: 0,
				features: [
					// Core features
					{ text: 'Customizable Registration Form', category: 'core' },
					{ text: 'Personal QR Codes', category: 'core' },
					{ text: 'QR Attendance', category: 'core' },
					{ text: 'Certificate Generator', category: 'core' },
					{ text: 'Raffle Draw from Attendance', category: 'core' },

					// Monetization features
					{ text: 'Merch Store', category: 'monetize' },
					{ text: 'Paid Registration', category: 'monetize' },
					{ text: 'Discount Voucher Generation', category: 'monetize' },

					// Fee collection features
					{ text: 'Platform Fee: 5% of transaction value', category: 'fees' }
				],
				buttonText: 'Sign up now!'
			}
		],
		pageTitle: 'Choose the right plan for you',
		pageDescription:
			'Veent offers a suite of event management features completely free of charge, with a 5% transaction fee on ticket sales or products sold through the platform.',
		urlConfig: {
			signupUrl: parentData.urlConfig.signupUrl
		}
	};

	return pageData;
};
