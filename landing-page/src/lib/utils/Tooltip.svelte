<script lang="ts">
	import { onMount } from 'svelte';
	import tippy from 'tippy.js';
	import 'tippy.js/dist/tippy.css';

	export let content = 'Tooltip text'; // Default text
	let element: HTMLElement; // Reference to the element

	onMount(() => {
		tippy(element, {
			content
		});
	});
</script>

<span bind:this={element}>
	<slot />
	<!-- This allows wrapping any element inside -->
</span>
