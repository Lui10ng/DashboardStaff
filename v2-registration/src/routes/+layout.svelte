<script lang="ts">
	import { ToastProvider } from '@skeletonlabs/skeleton-svelte';
	import '../app.css';

	let { children } = $props();
</script>

<ToastProvider
	placement="top-end"
	stateSuccess="bg-green-500 text-white text-base p-2"
	stateError="bg-red-500 text-white text-base p-2"
>
	{@render children()}
</ToastProvider>
