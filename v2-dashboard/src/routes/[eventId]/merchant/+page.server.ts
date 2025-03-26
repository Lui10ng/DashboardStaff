import { tickets, vouchers } from '$lib/stores/data';

export const load = async () => {
	return {
		tickets,
		vouchers
	};
};
