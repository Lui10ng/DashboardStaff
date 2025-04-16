<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { stateDrawer } from '$lib/stores/state.svelte.ts';

	let {
		isOpen,
		contentBaseClass = '',
		justify = '',
		alignment = '',
		positionIn,
		positionOut,
		title = '',
		children
	} = $props();

	const handleCloseDrawer = () => {
		stateDrawer.open = false;
	};
</script>

<Modal
	open={isOpen}
	onOpenChange={handleCloseDrawer}
	contentBase={contentBaseClass}
	positionerJustify={justify}
	positionerAlign={alignment}
	positionerPadding=""
	transitionsPositionerIn={positionIn}
	transitionsPositionerOut={positionOut}
	backdropClasses="backdrop-blur-md bg-black/20"
>
	{#snippet content()}
		<header class="flex items-center justify-between px-4">
			<button
				type="button"
				class="text-gray-500 hover:text-gray-700"
				onclick={handleCloseDrawer}
				aria-label="Close drawer"
			>
				<i class="fa-solid fa-xmark text-2xl"></i>
			</button>
		</header>
		<div class="mx-auto max-w-7xl px-5">
			<h1 class="text-2xl font-bold">{title}</h1>
			{@render children()}
		</div>
	{/snippet}
</Modal>
