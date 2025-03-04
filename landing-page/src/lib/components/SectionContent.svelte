<script lang="ts">
	import type { Section } from '../types';

	export let section: Section;
</script>

{#if section.content[0].type === 'intro'}
	<p class="text-md mb-12 text-gray-900 md:text-xl">
		{section.content[0].text}
	</p>
	{#each section.content.slice(1) as item}
		{#if 'title' in item}
			<div class="mt-8">
				<h3 class="mb-4 text-2xl font-bold text-rose-600">{item.title}</h3>
				<p class="text-md text-gray-900 md:text-xl">{item.text}</p>
			</div>
		{/if}
	{/each}
{:else if section.content[0].type === 'features'}
	{#each section.content[0].items as item}
		<div class="mt-8">
			<h3 class="mb-4 text-2xl font-bold text-rose-600">{item.title}</h3>
			<p class="text-md text-gray-900 md:text-xl">{item.text}</p>
		</div>
	{/each}
{/if}
