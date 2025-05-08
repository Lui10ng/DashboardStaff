<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	export let title = '';
	export let description = '';
	export let buttonLabel = '';
	export let buttonIcon = '';
	export let onClick: () => void;
</script>

<div class="flex flex-col items-center justify-center px-4 py-16 text-center">
	<img src="/images/empty.svg" alt="No items" class="mb-6 h-64 w-48 text-gray-400" />
	<h3 class="prose mb-2 text-lg font-medium text-gray-900">{title}</h3>
	<p class="prose mb-6 text-sm text-gray-500">
		{description}
	</p>
	<Button
		label={buttonLabel}
		icon={buttonIcon}
		className="bg-primary text-white rounded-lg px-4 py-2"
		{onClick}
	/>
</div>
