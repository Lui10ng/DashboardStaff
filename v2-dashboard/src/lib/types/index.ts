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
	children: any;
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

export type Event = {
	id: number;
	title: string;
	location: string;
	date: string;
	status: string;
	tickets: {
		sold: number;
		total: number;
	};
	image: string;
};

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestOptions {
	body?: unknown;
	params?: Record<string, string> | URLSearchParams;
	fetchInstance?: typeof fetch;
	token?: string;
	headers?: Record<string, string>;
}

export interface ApiClientOptions extends Omit<RequestOptions, 'params' | 'body'> {}

export interface ApiClient {
	get: <T = unknown>(
		path: string,
		params?: Record<string, string> | URLSearchParams | undefined,
		options?: ApiClientOptions
	) => Promise<T>;

	post: <T = unknown>(path: string, body: unknown, options?: ApiClientOptions) => Promise<T>;

	patch: <T = unknown>(path: string, body: unknown, options?: ApiClientOptions) => Promise<T>;

	del: <T = unknown>(path: string, options?: ApiClientOptions) => Promise<T>;
}

export interface PayloadError {
	message?: string;
	errors?: { field: string; message: string }[];
	// Add other potential properties if known
	[key: string]: any; // Allow other properties
}
