<script lang="ts">
	import { Tooltip } from 'bits-ui';

	let props = $props();
</script>

<Tooltip.Root delayDuration={200}>
	<Tooltip.Trigger class="{props.classTrigger} cursor-pointer">
		<i class={props.icon}></i>
		<p class={props.classText}>{props.text}</p>
	</Tooltip.Trigger>
	<Tooltip.Content sideOffset={8}>
		<div class={props.classContent}>
			{props.content}
		</div>
	</Tooltip.Content>
</Tooltip.Root>
