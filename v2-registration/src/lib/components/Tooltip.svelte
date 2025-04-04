<script lang="ts">
	import { Tooltip } from '@skeletonlabs/skeleton-svelte';
	let data = $props();
</script>

<Tooltip
	positioning={{ placement: 'bottom' }}
	contentBase="rounded-md p-3 max-w-sm text-left italic text-white bg-blue-500"
	openDelay={200}
	arrow
>
	{#snippet trigger()}{data.text}{/snippet}
	{#snippet content()}
		{data.content}{/snippet}
</Tooltip>
