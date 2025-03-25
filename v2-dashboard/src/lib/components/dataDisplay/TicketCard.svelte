<script lang="ts">
	import Button from '../ui/Button.svelte';
	export let status = '';
	export let validFrom = '';
	export let validTo = '';
	export let ticketName = '';
	export let tiketPrice = 0;
	export let ticketSold = '';

	const getStatusTextColor = (status: string) => {
		if (status === 'Active') return 'text-green-500';
		if (status === 'Expired') return 'text-red-500';
		if (status === 'Deactivated') return 'text-gray-500';
		return 'text-gray-400';
	};
</script>

<div
	class="rounded-lg border border-l-10 border-gray-400 {status === 'Active'
		? 'border-l-green-500'
		: 'border-l-gray-300'} shadow-sm"
>
	<div class="p-4">
		<div class="mb-1 text-xs text-gray-500">
			Valid from {validFrom} to {validTo}
		</div>
		<div class="flex justify-between">
			<div class="font-medium">{ticketName}</div>
			<div class="flex gap-1">
				<span
					class="inline-flex items-center rounded-full px-2 py-1 text-xs {getStatusTextColor(
						status
					)}"
				>
					{status}
				</span>
				<Button onClick={() => {}} icon="fa-regular fa-eye" className="text-xs text-gray-400 hover:text-primary p-1" />
				<Button
				onClick={() => {}}
					icon="fa-regular fa-trash-can"
					className="text-xs text-gray-400 hover:text-primary p-1"
				/>
			</div>
		</div>
		<div class="mt-2 mb-4 text-lg font-bold">₱{tiketPrice}</div>
		<div class="space-y-1">
			<div class="flex justify-between text-xs">
				<p>Sold</p>
				<p>{ticketSold}</p>
			</div>
			<div class="h-1.5 w-full rounded-full bg-gray-200">
				<div
					class={`${status === 'Active' ? 'bg-green-500' : 'bg-gray-400'} h-1.5 rounded-full`}
					style="width: 70%"
				></div>
			</div>
		</div>
	</div>
</div>
