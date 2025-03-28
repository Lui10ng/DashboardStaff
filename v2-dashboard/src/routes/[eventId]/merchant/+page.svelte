<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { ticketStore, voucherStore } from '$lib/stores';

	let { data } = $props();

	$effect(() => {
		ticketStore.set(data.tickets);
	});

	$effect(() => {
		voucherStore.set(data.vouchers);
	});

	const getStatusColor = (status: string) => {
		if (status === 'Active') return 'bg-green-500';
		else if (status === 'Expired') return 'bg-red-500';
		else if (status === 'Deactivated') return 'bg-gray-500';
		else return 'bg-gray-400';
	};

	const getStatusTextColor = (status: string) => {
		if (status === 'Active') return 'text-green-500';
		if (status === 'Expired') return 'text-red-500';
		if (status === 'Deactivated') return 'text-gray-500';
		return 'text-gray-400';
	};
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
			<div
				class="border-l-10 rounded-lg border border-gray-400 {ticket.status === 'Active'
					? 'border-l-green-500'
					: 'border-l-gray-300'} shadow-sm"
			>
				<div class="p-4">
					<div class="mb-1 text-xs text-gray-500">
						Valid from {ticket.validFrom} to {ticket.validTo}
					</div>
					<div class="flex justify-between">
						<div class="font-medium">{ticket.name}</div>
						<div class="flex gap-1">
							<span
								class="inline-flex items-center rounded-full px-2 py-1 text-xs {getStatusTextColor(
									ticket.status
								)}"
							>
								{ticket.status}
							</span>
							<Button
								onClick={() => {}}
								icon="fa-regular fa-eye"
								className="text-xs text-gray-400 hover:text-primary p-1"
							/>
							<Button
								onClick={() => {}}
								icon="fa-regular fa-trash-can"
								className="text-xs text-gray-400 hover:text-primary p-1"
							/>
						</div>
					</div>
					<div class="mb-4 mt-2 text-lg font-bold">₱{ticket.price}</div>
					<div class="space-y-1">
						<div class="flex justify-between text-xs">
							<p>Sold</p>
							<p>{ticket.sold}</p>
						</div>
						<div class="h-1.5 w-full rounded-full bg-gray-200">
							<div
								class={`${ticket.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'} h-1.5 rounded-full`}
								style="width: 70%"
							></div>
						</div>
					</div>
				</div>
			</div>
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
			<div class="rounded-lg border border-gray-400 shadow-sm">
				<div class="space-y-2 p-4">
					<div class="flex items-start justify-between">
						<div class="font-medium">{voucher.id}</div>
						<div class="flex items-center text-xs">
							<span class="mr-1 h-2 w-2 rounded-full {getStatusColor(voucher.status)}"></span>
							{voucher.status}
						</div>
					</div>
					<div class="space-y-4">
						<div class="text-2xl font-bold text-red-500">{voucher.discount}</div>
						<div class="space-y-1">
							<div class="flex justify-between text-xs">
								<p class="text-gray-500">Valid until {voucher.validUntil} - {voucher.validTime}</p>
								<p>{voucher.sold}</p>
							</div>
							<div class="h-1.5 w-full rounded-full bg-gray-200">
								<div class={`${voucher.progressColor} h-1.5 rounded-full`} style="width: 70%"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
