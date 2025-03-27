<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import TicketCard from '$lib/components/dataDisplay/TicketCard.svelte';
	import VoucherCard from '$lib/components/dataDisplay/VoucherCard.svelte';
	import { ticketStore, voucherStore } from '$lib/stores';

	let { data } = $props();

	$effect(() => {
		ticketStore.set(data.tickets);
	});

	$effect(() => {
		voucherStore.set(data.vouchers);
	});
</script>

<div class="space-y-8">
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-xl font-semibold">Tickets</h2>
		<div class="flex gap-2">
			<Button
				onClick={() => {}}
				label="Add Ticket"
				icon="fa-solid fa-plus text-sm"
				className="bg-gray-200 px-4 py-2 rounded-md"
			/>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each $ticketStore as ticket}
			<TicketCard {ticket} />
		{/each}
	</div>

	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-xl font-semibold">Vouchers</h2>
		<div class="flex gap-2">
			<Button
				onClick={() => {}}
				label="Add Voucher"
				icon="fa-solid fa-plus text-sm"
				className="bg-gray-200 px-4 py-2 rounded-md"
			/>
		</div>
	</div>

	<div class="mb-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each $voucherStore as voucher}
			<VoucherCard {voucher} />
		{/each}
	</div>
</div>
