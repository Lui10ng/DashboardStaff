<script lang="ts">
	import EventTable from '$lib/components/dataDisplay/EventTable.svelte';
	import WelcomeMessage from '$lib/components/dataDisplay/WelcomeMessage.svelte';
</script>

<div class="space-y-5">
	<WelcomeMessage name="Aero dev" />
	<EventTable />
</div>
