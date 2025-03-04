<script lang="ts">
	import '../../app.css';
	import Navigation from '$lib/StaffAndEditEvent/components/Navigation.svelte';
	let { children } = $props();
</script>

<Navigation />
{@render children()}
