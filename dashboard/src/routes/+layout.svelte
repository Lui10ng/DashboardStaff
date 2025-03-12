<script lang="ts">
	import Navigation from '$lib/components/ui/Navigation.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<!-- Reusable Navigation -->
<Navigation />

{@render children()}
