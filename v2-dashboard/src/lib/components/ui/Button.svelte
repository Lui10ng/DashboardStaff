<script lang="ts">
	let {
		label = '',
		className = '',
		disabled = false,
		type = 'button' as 'button' | 'submit' | 'reset',
		icon = '',
		onClick = undefined,
		children = null
	} = $props();
</script>

<button
	{type}
	{disabled}
	class={`${className} flex cursor-pointer items-center justify-center gap-2 active:scale-[0.98] active:transition-all`}
	on:click={onClick}
>
	{#if icon}
		<i class={icon}></i>
	{/if}
	{#if children}
		{@render children()}
	{/if}

	{label}
</button>
