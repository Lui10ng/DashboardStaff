import { walletTransactions } from '$lib/stores/data';

export const load = async () => {
	return {
		walletTransactions
	};
};
