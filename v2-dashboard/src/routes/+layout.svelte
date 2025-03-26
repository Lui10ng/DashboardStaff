<script lang="ts">
	import Header from '$lib/components/layouts/Header.svelte';
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { Tooltip } from 'bits-ui';

	let { children } = $props();
</script>

<Header />

<div class="bg-white">
	<div class="mx-auto min-h-svh max-w-7xl px-5 pb-8 pt-6">
		<Tooltip.Provider>
			{@render children()}
		</Tooltip.Provider>
	</div>
</div>
