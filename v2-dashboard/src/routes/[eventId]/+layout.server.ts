import { currentEvent } from '$lib/stores/data';

export const load = async () => {
	return {
		currentEvent
	};
};
