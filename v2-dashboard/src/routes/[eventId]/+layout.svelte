<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import { navItems } from '$lib/stores/data';
	import { page } from '$app/stores';

	let { children, data } = $props();

	let event = $derived(data.currentEvent);

	let isModalOpen = $state(false);
	let activeTab = $state('Registration Instructions');

	function setTab(tab: string) {
		activeTab = tab;
	}

	const handleActiveNav = (path: string) => {
		return $page.url.pathname.includes(path) ? 'bg-primary text-white' : '';
	};
</script>

<div>
	<div class="flex flex-col items-start gap-4 sm:mb-8 sm:flex-row sm:items-center sm:gap-6">
		<img
			src={event.imageUrl}
			alt={event.title}
			class="h-48 w-full rounded-lg object-cover shadow-lg sm:h-32 sm:w-32"
		/>
		<div class="w-full flex-1">
			<div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
				<h1 class="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">{event.title}</h1>
				<button
					class="flex items-center gap-2 text-red-600 transition-colors hover:text-red-700"
					onclick={() => (isModalOpen = true)}
				>
					Edit Event
					<i class="fa-solid fa-pen"></i>
				</button>
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
				<a
					href={event.url}
					target="_blank"
					rel="noopener noreferrer"
					class="text-blue break-all text-sm transition-colors sm:text-base"
				>
					{event.url}
				</a>
				<div class="flex items-center gap-2 text-gray-500">
					<i class="fa-solid fa-link"></i>
				</div>
			</div>
		</div>
	</div>
	<div class="-mx-4 mb-6 overflow-x-auto rounded-lg px-4 py-3 sm:mx-0 sm:mb-8 sm:px-0">
		<nav class="flex min-w-max space-x-4">
			{#each navItems as item}
				<Button
					label={item.label}
					className="rounded-lg border border-gray-200 py-2 shadow-sm transition-colors w-35 capitalize {handleActiveNav(
						item.label
					)}"
					onClick={() => {
						goto(item.path);
					}}
				/>
			{/each}
		</nav>
	</div>

	{#if isModalOpen}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4 backdrop-blur-md"
		>
			<div class="flex h-[90vh] w-full max-w-4xl flex-col rounded-lg border bg-white sm:h-[80vh]">
				<div class="overflow-x-auto p-2 sm:p-4">
					<div class="flex min-w-max gap-2">
						<button
							onclick={() => setTab('Edit Details')}
							class="attendance h-10 flex-shrink-0 cursor-pointer whitespace-nowrap rounded-md px-3 py-2 text-xs transition-colors sm:w-auto sm:px-4"
							class:attendance2={activeTab === 'Edit Details'}
						>
							Edit Details
						</button>
						<button
							onclick={() => setTab('Visual')}
							class="attendance h-10 flex-shrink-0 cursor-pointer whitespace-nowrap rounded-md px-3 py-2 text-xs transition-colors sm:w-auto sm:px-4"
							class:attendance2={activeTab === 'Visual'}
						>
							Visual
						</button>
						<button
							onclick={() => setTab('Contacts')}
							class="attendance h-10 flex-shrink-0 cursor-pointer whitespace-nowrap rounded-md px-3 py-2 text-xs transition-colors sm:w-auto sm:px-4"
							class:attendance2={activeTab === 'Contacts'}
						>
							Contacts
						</button>
						<button
							onclick={() => setTab('Registration Instructions')}
							class="attendance h-10 flex-shrink-0 cursor-pointer whitespace-nowrap rounded-md px-3 py-2 text-xs transition-colors sm:w-auto sm:px-4"
							class:attendance2={activeTab === 'Registration Instructions'}
						>
							Registration Instructions
						</button>
					</div>
				</div>

				<div class="flex-grow overflow-y-auto p-4 sm:p-6">
					<h2 class="mb-4 text-xl font-semibold">{activeTab}</h2>
					<!-- Add content for each tab here -->
				</div>

				<div class="mt-auto flex justify-end gap-3 p-4">
					<button
						onclick={() => (isModalOpen = false)}
						class="cancel cursor-pointer rounded px-4 py-2"
					>
						Cancel
					</button>
					<button class="attendance2 cursor-pointer px-4 py-2">Save changes</button>
				</div>
			</div>
		</div>
	{/if}
</div>
{@render children()}
