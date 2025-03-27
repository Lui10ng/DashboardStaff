import type { Dialog, DropdownMenu, WithoutChild } from 'bits-ui';
import type { Snippet } from 'svelte';

export type DropdownMenuProps = DropdownMenu.Props & {
	icon: string;
	className?: string;
	classMenu?: string;
	buttonText: string;
	alignContent?: string;
	items: string[];
	contentProps?: WithoutChild<DropdownMenu.Content.Props>;
};

export type ModalProps = Dialog.RootProps & {
	dialogClass?: string;
	button: Snippet;
	header?: Snippet;
	content: Snippet;
	contentProps?: WithoutChild<Dialog.ContentProps>;
};

export type VoucherProps = {
	voucher: {
		id: string;
		discount: string;
		status: string;
		validUntil: string;
		validTime: string;
		sold: string;
		progressColor: string;
	};
};

export type TicketProps = {
	ticket: {
		status: string;
		validFrom: string;
		validTo: string;
		name: string;
		price: string;
		sold: string;
	};
};

export type GuestProps = {
	guest: {
		id: string;
		name: string;
		email: string;
		registrationDate: string;
		status: string;
		avatar: string;
	};
};

export type CardProps = {
	card: {
		icon: string;
		iconText: string;
		content: string;
	};
};
