<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let {
		initialDrawerState = false,
		buttonLabel = 'Add Ticket',
		buttonIcon = 'fa-solid fa-plus text-sm',
		buttonClass = 'bg-gray-200 px-4 py-2 rounded-md',
		contentBaseClass = '',
		justify = '',
		alignment = '',
		positionIn,
		positionOut,
		title = '',
		children
	} = $props();

	let drawerState = $state(initialDrawerState);

	const handleOpenDrawer = () => {
		drawerState = true;
	};

	const handleCloseDrawer = () => {
		drawerState = false;
	};
</script>

<Button label={buttonLabel} icon={buttonIcon} className={buttonClass} onClick={handleOpenDrawer} />

<Modal
	open={drawerState}
	onOpenChange={(e) => (drawerState = e.open)}
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
		<div class="mx-auto max-w-7xl">
			<h1 class="text-2xl font-bold">{title}</h1>
			{@render children()}
		</div>
	{/snippet}
</Modal>
