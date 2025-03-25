<script lang="ts">
	let {
		label = '',
		className = '',
		disabled = false,
		type = 'button' as 'button' | 'submit' | 'reset',
		icon = '',
		onClick
	} = $props();
</script>

<button
	onclick={onClick}
	{type}
	{disabled}
	class={`${className} flex cursor-pointer items-center justify-center gap-2 active:scale-[0.98] active:transition-all`}
>
	{#if icon}
		<i class={icon}></i>
	{/if}
	<slot />
	{label}
</button>
