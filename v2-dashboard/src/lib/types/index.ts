import type { Dialog, DropdownMenu, WithoutChild } from 'bits-ui';
import type { Snippet } from 'svelte';

export type DropdownMenuProps = {
	icon: string;
	className?: string;
	classMenu?: string;
	buttonText: string;
	alignContent?: string;
	items: string[];
	contentProps?: any; // fallback to any if Content.Props is not available
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
	slug: string;
	title: string;
	location: string;
	description: string;
	date: string;
	startTime: string;
	endTime: string;
	status: string;
	tickets: {
		sold: number;
		total: number;
	};
	image: string;
	eventImages: {
		url: string;
	}[];
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

export type ClientOptions = Omit<RequestOptions, 'fetchInstance' | 'token'>;

export interface PayloadError {
	message?: string;
	errors?: { field: string; message: string }[];
	// Add other potential properties if known
	[key: string]: any; // Allow other properties
}

export type TicketProps = {
	id: number;
	name: string;
	description?: string;
	price: number;
	currency: string;
	quantityAvailable: number;
	minOrderQuantity: number;
	maxOrderQuantity: number;
	salesStart: string;
	salesEnd: string;
	color: string;
	status: string;
	event: {
		relationTo: string;
		value: string;
	};
	seatMap?: {
		relationTo: string;
		value: string;
	};
	paymentActive?: boolean;
};

export type TicketStatus = 'active' | 'inactive';
export type VoucherStatus = 'active' | 'deactivated' | 'expired';

export type PromotionProps = {
	id: number;
	code: string;
	description: string;
	status: 'active' | 'inactive' | 'expired';
	discountType: 'percentage' | 'fixed_amount';
	discountValue: number;
	currency: 'PHP' | 'USD' | 'EUR' | null;
	usageLimit: number;
	validFrom: string;
	validUntil: string;
	minimumOrderAmount: number;
	appliesToAllEvents: boolean;
	event: Event[];
	applicableEvents: number[];
};

export type RegistrantProps = {
	id: string;
	status?: string;
	createdAt: string;
	submittedAnswers: any[];
};

export type themeProps = {
	theme?: string;
	themeMode?: string;
};

export interface EventDetailsResponse {
	id: number;
	title: string;
	slug: string;
	location: string;
	description: string;
	date: string;
	startTime: string;
	endTime: string;
	status: string;
	tickets: {
		sold: number;
		total: number;
	};
	image: string;
	eventImages: {
		url: string;
	}[];
}

export interface EventAnnouncement {
	id: number;
	event: number | Event;
	status: 'draft' | 'published';
	publishDate?: string | null;
	eventAnnouncement?:
		| {
				announcementImage?: string | null;
				title: string;
				content: string;
				id?: string | null;
		  }[]
		| null;
	updatedAt: string;
	createdAt: string;
}

export interface EventInstruction {
	id: number;
	event: number | Event;
	status: 'draft' | 'published';
	/**
	 * List specific Instruction for this event.
	 */
	eventInstructions?:
		| {
				instructionImage?: string | null;
				title: string;
				content: string;
				id?: string | null;
		  }[]
		| null;
	updatedAt: string;
	createdAt: string;
}

export interface InstructionData {
	instructionImage?: string | null;
	title: string;
	content: string;
}

export interface postsData {
	instructionImage?: string | null;
	title: string;
	content: string;
}
