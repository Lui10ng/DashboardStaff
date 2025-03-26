<script lang="ts">
	import EventHeader from '$lib/components/layouts/EventHeader.svelte';
	import { eventHeaderStore } from '$lib/stores';

	let { children, data } = $props();

	eventHeaderStore.set(data.currentEvent);
</script>

<EventHeader />
{@render children()}
