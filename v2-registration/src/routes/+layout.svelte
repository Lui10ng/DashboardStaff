<script lang="ts">
	import { ToastProvider } from '@skeletonlabs/skeleton-svelte';
	import '../app.css';

	let { children } = $props();
</script>

{@render children()}
