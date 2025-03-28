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
	id: string;
	discount: string;
	status: string;
	validUntil: string;
	validTime: string;
	sold: string;
	progressColor: string;
};

export type TicketProps = {
	status: string;
	validFrom: string;
	validTo: string;
	name: string;
	price: number;
	sold: string;
};

export type GuestProps = {
	id: string;
	name: string;
	email: string;
	registrationDate: string;
	status: string;
	avatar: string;
};

export type CardProps = {
	icon: string;
	iconText: string;
	content: string;
};

export type EventProps = {
	id: string;
	name: string;
	location: string;
	status: string;
	ticketSold: string;
	created: string;
	image: string;
};

export type WalletTransactionProps = {
	id: string;
	name: string;
	email: string;
	phone: string;
	registrationDate: string;
	event: string;
	amount: number;
	paymentMethod: string;
	netIncome: number;
	referenceNo: string;
	avatar: string;
};
