<script lang="ts">
	// Props for the component
	interface $$Props {
		enabled: boolean;
		onChange: () => void;
	}

	export let enabled: boolean;
	export let onChange: () => void;
</script>

<div class="flex items-center">
	<button
		aria-labelledby="VoucherToggleLabel"
		class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
		class:bg-gray-500={enabled}
		class:bg-gray-400={!enabled}
		Onclick={onChange}
	>
		<span
			class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
			class:translate-x-6={enabled}
			class:translate-x-1={!enabled}
		></span>
	</button>
</div>
