import type { EventAnnouncement, RegistrantProps } from '$lib/types';
import type { ContactData } from '$lib/types/eventContacts';

export const stateDrawer = $state({
	open: false
});

export const staffDrawer = $state({
	open: false
});

export const ticketDrawer = $state({
	open: false
});
export const editTicketDrawer = $state({
	open: false
});

export const voucherDrawer = $state({
	open: false
});

export const editVoucherDrawer = $state({
	open: false
});

export const themeDrawer = $state({
	open: false
});

export const stateEditEvent = $state({
	open: false
});

export const contactDrawer = $state({
	open: false
});

export const registrantList = () => {
	let registrantData = $state<RegistrantProps[]>();

	return {
		get registrantData() {
			return registrantData;
		},
		set registrantData(value) {
			registrantData = value;
		}
	};
};

export const themeState = $state({
	theme: '',
	modeTheme: true
});

export const postState = () => {
	let postData = $state<EventAnnouncement[]>();

	return {
		get postData() {
			return postData;
		},
		set postData(value) {
			postData = value;
		}
	};
};

export const contacts = () => {
	let contactData = $state<ContactData[]>();

	return {
		get contactData() {
			return contactData;
		},
		set contactData(value) {
			contactData = value;
		}
	};
};
