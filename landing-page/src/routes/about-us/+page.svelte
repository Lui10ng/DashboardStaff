<script lang="ts">
	import { onMount } from 'svelte';
	import { sections } from '../../lib/types/data';
	import BackgroundPatterns from '../../lib/components/BackgroundPatterns.svelte';
	import FloatingElements from '$lib/components/FloatingElements.svelte';
	import BlobAnimation from '$lib/components/BlobAnimation.svelte';
	import SectionContent from '$lib/components/SectionContent.svelte';
	import { page } from '$app/state';


	

	let mounted = false;
	let currentSection = 0;

	function setSection(index: number) {
		currentSection = index;
	}

	onMount(() => {
		mounted = true;
		console.log(page.error);
	});
</script>

<div class="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 to-white">
	<BackgroundPatterns />

	{#if mounted}
		<BlobAnimation />
		<FloatingElements />

		<div class="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-16 sm:px-6 lg:px-8">
			<div class="grid items-center gap-12 lg:grid-cols-2">
				<div class="space-y-16">
					<div>
						<div class="mb-2 flex flex-wrap gap-2 sm:gap-4">
							{#each sections as section, i}
								<button
									on:click={() => setSection(i)}
									class="cursor-pointer rounded-full px-2 py-1.5 text-sm font-semibold transition-all duration-300 sm:px-4 sm:py-2 sm:text-base
			{currentSection === i ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-600 hover:bg-rose-200'}"
								>
									{section.title}
								</button>
							{/each}
						</div>

						<h1 class="mt-5 mb-5 text-3xl font-extrabold text-gray-900 md:text-6xl">
							{sections[currentSection].title}
						</h1>

						<SectionContent section={sections[currentSection]} />
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
