import { writable } from 'svelte/store';
import type { GuestProps } from '$lib/types';
import type { TicketProps } from '$lib/types';
import type { VoucherProps } from '$lib/types';
import type { EventProps } from '$lib/types';
import type { WalletTransactionProps } from '$lib/types';

export const eventStore = writable<EventProps[]>([]);
export const ticketStore = writable<TicketProps[]>([]);
export const voucherStore = writable<VoucherProps[]>([]);
export const registrantStore = writable<GuestProps[]>([]);
export const walletTransactionStore = writable<WalletTransactionProps[]>([]);
export const eventHeaderStore = writable<any>();