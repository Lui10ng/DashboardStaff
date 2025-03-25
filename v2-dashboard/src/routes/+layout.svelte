<script lang="ts">
	import Header from '$lib/components/layouts/Header.svelte';
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { Tooltip } from 'bits-ui';

	let { children } = $props();
</script>

<Header />

<div class="bg-gray-100">
	<div
		class="mx-auto min-h-svh max-w-7xl px-5 pt-6 pb-8"
	>
		<Tooltip.Provider>
			{@render children()}
		</Tooltip.Provider>
	</div>
</div>
