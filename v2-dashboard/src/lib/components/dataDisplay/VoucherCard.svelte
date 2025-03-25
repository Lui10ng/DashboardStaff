<script lang="ts">
	export let voucherId = '';
	export let status = '';
	export let discount = '';
	export let validUntil = '';
	export let validTime = '';
	export let sold = '';
	export let progressColor = '';

	const getStatusColor = (status: string) => {
		if (status === 'Active') return 'bg-green-500';
		else if (status === 'Expired') return 'bg-red-500';
		else if (status === 'Deactivated') return 'bg-gray-500';
		else return 'bg-gray-400';
	};
</script>

<div class="rounded-lg border border-gray-400 shadow-sm">
	<div class="space-y-2 p-4">
		<div class="flex items-start justify-between">
			<div class="font-medium">{voucherId}</div>
			<div class="flex items-center text-xs">
				<span class="mr-1 h-2 w-2 rounded-full {getStatusColor(status)}"></span>
				{status}
			</div>
		</div>
		<div class="space-y-4">
			<div class="text-2xl font-bold text-red-500">{discount}</div>
			<div class="space-y-1">
				<div class="flex justify-between text-xs">
					<p class="text-gray-500">Valid until {validUntil} - {validTime}</p>
					<p>{sold}</p>
				</div>
				<div class="h-1.5 w-full rounded-full bg-gray-200">
					<div class={`${progressColor} h-1.5 rounded-full`} style="width: 70%"></div>
				</div>
			</div>
		</div>
	</div>
</div>
