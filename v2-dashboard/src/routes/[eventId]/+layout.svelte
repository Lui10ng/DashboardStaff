<script lang="ts">
	import { navigating } from '$app/stores';
	import { ProgressRing } from '@skeletonlabs/skeleton-svelte';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import Button from '$lib/components/ui/Button.svelte';
	import { navEditEvents, navItems } from '$lib/stores/data';
	import { stateEditEvent } from '$lib/stores/state.svelte.ts';

	let { children, data } = $props();

	let event = $derived(data.currentEvent);

	const activeEditHeader = $derived(stateEditEvent.open);

	const handleActiveNav = (path: string) => {
    return data.pathname.includes(path) ? 'bg-primary text-white' : '';
};

	const handleActiveEditEventNav = (path: string) => {
		return data.pathname.includes(path) ? 'bg-primary text-white' : '';
	};

	$effect(() => {
		if (data.pathname.includes('edit')) {
			stateEditEvent.open = true;
		} else {
			stateEditEvent.open = false;
		}
	});

	const handleEditEvent = async () => {
		stateEditEvent.open = true;
		goto(`/${data.eventId}/edit/details`);
	};

	const handleBack = async () => {
		stateEditEvent.open = false;
		goto(`/${data.eventId}/registrants`);
	};
</script>

<div>
	<div class="flex flex-col justify-between sm:flex-row">
		<div class="flex flex-col items-start gap-4 sm:mb-8 sm:flex-row sm:items-center sm:gap-6">
			{#if !activeEditHeader}
				<img
					src={event.imageUrl}
					alt={event.title}
					class="h-48 w-full rounded-lg object-cover shadow-lg sm:h-32 sm:w-32"
				/>
				<div>
					<div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
						<h1 class="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">{event.title}</h1>
					</div>
					<div class="flex flex-col gap-2 text-gray-600">
						<div class="flex items-center gap-2">
							<i class="fa-regular fa-calendar-minus text-red"></i>
							<span>{event.date}</span>
						</div>
						<div class="flex items-center gap-2">
							<i class="fa-solid fa-location-dot text-red"></i>
							<span class="text-sm sm:text-base">{event.location}</span>
						</div>
					</div>

					<div class="mt-2 flex items-center gap-2">
						<div class="mt-2 flex items-center  text-gray-600 gap-2">
							<i class="fa-solid fa-link"></i>
						</div>
						<a
							href={event.url}
							target="_blank"
							rel="noopener noreferrer"
							class="text-primary break-all text-sm transition-colors sm:text-base"

						>
							{event.url}
						</a>
					
					</div>
				</div>
			{:else}
				{#each navEditEvents(event.id) as item}
					<Button
						label={item.label}
						className="rounded-lg border border-gray-200 py-2 shadow-sm transition-colors px-6 capitalize {handleActiveEditEventNav(
							item.tab
						)}"
						onClick={() => {
							goto(item.path);
						}}
					/>
				{/each}
			{/if}
		</div>

		<div>
			<Button
				label={activeEditHeader ? 'Back' : 'Edit Event'}
				icon="fa-solid {activeEditHeader ? 'fa-arrow-left' : 'fa-pen'}"
				className="text-primary rounded-lg px-4 py-2"
				onClick={() => (activeEditHeader ? handleBack() : handleEditEvent())}
			/>
		</div>
	</div>
	{#if !activeEditHeader}
		<div class="-mx-4 mb-6 overflow-x-auto rounded-lg px-4 py-3 sm:mx-0 sm:mb-8 sm:px-0">
			<nav class="grid grid-cols-2 gap-4 
				sm:grid-cols-4 sm:gap-2
				lg:flex lg:min-w-max lg:space-x-4 lg:gap-0">
				{#each navItems(event.id) as item}
					<Button
						label={item.label}
						className="rounded-lg border border-gray-200 py-2 shadow-sm transition-colors w-full capitalize {handleActiveNav(
							item.label
						)}"
						onClick={() => {
							goto(item.path);
						}}
					/>
				{/each}
			</nav>
		</div>
	{/if}
</div>

{#if $navigating}
	<div class="flex justify-center items-center py-10"> 
		<ProgressRing 
			value={null} 
			size="size-40" 
			trackStroke="stroke-surface-200"
			meterStroke="stroke-primary"
		/>
	</div>
{:else}
	<div in:fade={{ duration: 200 }}>
		{@render children()}
	</div>
{/if}
