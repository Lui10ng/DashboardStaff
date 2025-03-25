<script lang="ts">
	import { Dialog} from "bits-ui";
	import type { ModalProps } from "$lib/types";
 
	let {
		open = $bindable(false),
		children,
		buttonText,
		buttonClass,
		contentProps,
		header,
		content,
		...restProps
	}: ModalProps = $props();
</script>
 
<Dialog.Root bind:open {...restProps}>
	<Dialog.Trigger class={buttonClass}>
		{buttonText}
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-opacity-30 backdrop-blur-[2.8px]"/>
		<Dialog.Content {...contentProps} class="rounded-2xl border-gray-500 shadow-xl shadow-gray-200 bg-white fixed left-[50%] top-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] border p-6 sm:max-w-[490px] md:w-full">
			<Dialog.Title>
				{@render header()}
			</Dialog.Title>
			{@render content()}
			{@render children?.()}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>