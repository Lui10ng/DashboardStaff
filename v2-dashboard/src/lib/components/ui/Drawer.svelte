<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import {
		stateDrawer,
		staffDrawer,
		ticketDrawer,
		themeDrawer,
		editTicketDrawer,
		voucherDrawer,
		editVoucherDrawer,
		contactDrawer
	} from '$lib/stores/state.svelte.ts';

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
		if (themeDrawer.open) return (themeDrawer.open = false);
		stateDrawer.open = false;
		staffDrawer.open = false;
		ticketDrawer.open = false;
		editTicketDrawer.open = false;
		voucherDrawer.open = false;
		editVoucherDrawer.open = false;
		contactDrawer.open = false;
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
			<div class="mx-auto max-w-7xl px-5">
				<h1 class="text-2xl font-bold">{title}</h1>
				{@render children()}
			</div>
		</header>
	{/snippet}
</Modal>
