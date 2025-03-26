<script lang="ts">
	import Button from '../ui/Button.svelte';

	let { ticketProps } = $props();

	const getStatusTextColor = (status: string) => {
		if (status === 'Active') return 'text-green-500';
		if (status === 'Expired') return 'text-red-500';
		if (status === 'Deactivated') return 'text-gray-500';
		return 'text-gray-400';
	};
</script>

<!-- status={ticket.status}
				validFrom={ticket.validFrom}
				validTo={ticket.validTo}
				ticketName={ticket.name}
				tiketPrice={ticket.price ?? 0}
				ticketSold={ticket.sold} -->

<div
	class="border-l-10 rounded-lg border border-gray-400 {ticketProps.status === 'Active'
		? 'border-l-green-500'
		: 'border-l-gray-300'} shadow-sm"
>
	<div class="p-4">
		<div class="mb-1 text-xs text-gray-500">
			Valid from {ticketProps.validFrom} to {ticketProps.validTo}
		</div>
		<div class="flex justify-between">
			<div class="font-medium">{ticketProps.name}</div>
			<div class="flex gap-1">
				<span
					class="inline-flex items-center rounded-full px-2 py-1 text-xs {getStatusTextColor(
						ticketProps.status
					)}"
				>
					{ticketProps.status}
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
		<div class="mb-4 mt-2 text-lg font-bold">₱{ticketProps.price}</div>
		<div class="space-y-1">
			<div class="flex justify-between text-xs">
				<p>Sold</p>
				<p>{ticketProps.Sold}</p>
			</div>
			<div class="h-1.5 w-full rounded-full bg-gray-200">
				<div
					class={`${ticketProps.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'} h-1.5 rounded-full`}
					style="width: 70%"
				></div>
			</div>
		</div>
	</div>
</div>
