<script lang="ts">
	import type { DropdownMenuProps } from '$lib/types';
	import { DropdownMenu } from 'bits-ui';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ select: string }>();

	let {
		open = $bindable(false),
		children,
		className,
		classMenu,
		buttonText,
		alignContent,
		icon,
		items,
		contentProps,
		...restProps
	}: DropdownMenuProps = $props();

	const handleItemSelect = (item: string) => {
		dispatch('select', item);
		open = false;
	};
</script>

<DropdownMenu.Root bind:open {...restProps}>
	<DropdownMenu.Trigger class="{className} inline-flex items-center justify-center">
		<i class="{icon} flex-shrink-0"></i>
		{#if buttonText}
			<span class="ml-2">{buttonText}</span>
		{/if}
	</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content sideOffset={5} {...contentProps} align={alignContent} class="z-50">
			<DropdownMenu.Group
				aria-label="icon"
				class="space-y-2 rounded-lg border border-red-200 bg-white px-4 py-2 shadow-lg {classMenu}"
			>
				{#each items as item}
					<DropdownMenu.Item 
						textValue={item} 
						class="cursor-pointer py-2 px-1 hover:bg-gray-100 rounded transition-colors"
						onSelect={() => handleItemSelect(item)}
					>
						{item}
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
