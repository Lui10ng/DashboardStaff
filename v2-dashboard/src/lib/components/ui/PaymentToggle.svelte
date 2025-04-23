<script lang="ts">
	let value = $state(false);
	let onChange = (newValue: boolean) => {};

	function toggleValue() {
		value = !value;
		onChange(value);
	}
</script>

<button
	type="button"
	class="relative inline-flex h-6 w-11 items-center rounded-full"
	class:bg-gray-400={!value}
	class:bg-gray-500={value}
	Onclick={toggleValue}
	aria-checked={value}
	role="switch"
	aria-labelledby="activePaymentLabel"
>
	<span
		class="inline-block h-4 w-4 transform rounded-full bg-white transition"
		class:translate-x-1={!value}
		class:translate-x-6={value}
	></span>
</button>
