<script lang="ts">
	import type { DropdownMenuProps } from '$lib/types';
	import { DropdownMenu } from 'bits-ui';

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
</script>

<DropdownMenu.Root bind:open {...restProps}>
	<DropdownMenu.Trigger class="{className} cursor-pointer">
		<i class="{icon} cursor-pointer"></i>
		{buttonText}
	</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content {...contentProps} align={alignContent}>
			<DropdownMenu.Group
				aria-label="icon"
				class="space-y-3 rounded-lg border border-gray-400 bg-white px-4 py-2 {classMenu}"
			>
				{#each items as item}
					<DropdownMenu.Item textValue={item} class="cursor-pointer">
						{item}
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
