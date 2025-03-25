<script lang="ts">
	import EventHeader from '$lib/components/layouts/EventHeader.svelte';

	let { children } = $props();
</script>

<EventHeader />
{@render children()}
