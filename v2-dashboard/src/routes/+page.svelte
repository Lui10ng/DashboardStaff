<script lang="ts">
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import DropdownMenu from '$lib/components/ui/DropdownMenu.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { goto } from '$app/navigation';
	import { eventListStore } from '$lib/stores/eventList.svelte.ts';
	import { fly } from 'svelte/transition';
	import Drawer from '$lib/components/ui/Drawer.svelte';
	import CreateUpdateEvent from '$lib/components/dataDisplay/CreateUpdateEvent.svelte';

	let { data } = $props();

	$effect(() => {
		eventListStore.setEvents(data.events || []);
	});

	const formatStatus = (status: string) => {
		if (status === 'Live') {
			return 'bg-red-100 text-red-800';
		} else if (status === 'Upcoming') {
			return 'bg-blue-100 text-blue-800';
		} else if (status === 'Past') {
			return 'bg-gray-100 text-gray-800';
		} else {
			return 'bg-yellow-100 text-yellow-800';
		}
	};

	const handleEvent = (id: string) => {
		goto(`${id}/registrants`);
	};

	// Pagination state
	let currentPage = $state(1);
	let eventsPerPage = $state(5);
	let events = $derived(eventListStore.events);

	let paginatedEvents = $derived(
		events.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage)
	);

	const handlePageChange = (event: CustomEvent<{ page: number }>) => {
		currentPage = event.detail.page;
	};

	const handlePageSizeChange = (event: CustomEvent<{ size: number }>) => {
		eventsPerPage = event.detail.size;
		// Reset to first page when changing page size
		currentPage = 1;
	};

	const handleScanQR = (id: string) => {
		console.log(`Scan QR for event ${id}`);
	};

	const handleTickets = (id: string) => {
		console.log(`View tickets for event ${id}`);
	};

	const handleCopyLink = (id: string) => {
		console.log(`Copy link for event ${id}`);
	};

	const handleShare = (id: string) => {
		console.log(`Share event ${id}`);
	};

	// Handle duplicating an event
	const handleDuplicateEvent = (id: string) => {
		console.log(`Duplicating event ${id}`);
		// Code to duplicate the event would go here
	};

	const handleDropdownSelection = (item: string, eventId: string) => {
		switch (item) {
			case 'Scanner':
				handleScanQR(eventId);
				break;
			case 'Ticket':
				handleTickets(eventId);
				break;
			case 'Copy link':
				handleCopyLink(eventId);
				break;
			case 'Share event':
				handleShare(eventId);
				break;
			case 'Duplicate event':
				handleDuplicateEvent(eventId);
				break;
			default:
				console.log(`Unknown item selected: ${item}`);
		}
	};
</script>

<div class="space-y-5" in:fly={{ y: -50, duration: 200 }}>
	<div class="space-y-2">
		<h1 class="text-2xl font-semibold sm:text-3xl sm:font-bold">Welcome back, Aero Dev!</h1>
		<p class="text-gray-500">Manage your events and track their performance</p>
	</div>
	<Drawer
		contentBaseClass="bg-white p-10 space-y-4 shadow-xl w-full h-[90svh] overflow-y-auto"
		buttonLabel="Create Event"
		buttonClass="bg-primary text-white rounded-lg px-4 py-2"
		buttonIcon="fa-solid fa-plus"
		justify="justify-end"
		alignment="items-end"
		positionIn={{ y: 600, duration: 200 }}
		positionOut={{ y: 600, duration: 200 }}
	>
		<CreateUpdateEvent data={data.form} />
	</Drawer>

	<div class="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
		<!-- Event List Items -->
		<div>
			{#each paginatedEvents as event (event.id)}
				<div
					class="flex cursor-pointer flex-col justify-between gap-5 border-b border-gray-200 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:p-6 md:gap-10"
					onclick={() => handleEvent(event.id)}
					onkeydown={(e) => e.key === 'Enter' && handleEvent(event.id)}
					tabindex="0"
					role="button"
					aria-label="View details for {event.title}"
				>
					<div class="flex justify-between">
						<div class="flex items-center gap-4">
							<div class="overflow-hidden rounded-lg">
								<img
									src={event.image}
									alt={event.title}
									class="h-16 w-16 rounded-lg object-cover object-center transition-all duration-500 hover:scale-125"
								/>
							</div>

							<div class="flex-1">
								<h3 class="font-medium text-gray-900">{event.title}</h3>
								<p class="text-sm text-gray-500">
									<i class="ri-map-pin-line text-gray-400"></i>
									{event.location}
								</p>
							</div>
						</div>
						<div class="block sm:hidden">
							<DropdownMenu
								icon="fa-solid fa-ellipsis text-2xl text-gray-400 hover:text-red-600 p-2"
								className="cursor-pointer relative z-10"
								classMenu="mt-2 shadow-md"
								alignContent="end"
								buttonText=""
								items={['Scanner', 'Ticket', 'Copy link', 'Share event', 'Duplicate event']}
								on:select={(e) => {
									e.stopPropagation();
									handleDropdownSelection(e.detail, event.id);
								}}
							/>
						</div>
					</div>
					<div
						class="flex flex-wrap items-center justify-between gap-x-6 gap-y-5 sm:justify-end md:gap-10"
					>
						<div>
							<p class="text-sm text-gray-500 sm:text-end">Status</p>
							<h3 class="px-2 py-1 text-sm {formatStatus(event.status)}">
								{event.status}
							</h3>
						</div>
						<div>
							<p class="text-sm text-gray-500">Ticket Sold</p>
							<h3 class="font-medium sm:text-end">{event.tickets.sold}/{event.tickets.total}</h3>
						</div>
						<div>
							<p class="text-end text-sm text-gray-500">Date</p>

							<h3 class="font-medium">{event.date}</h3>
						</div>
						<div class="hidden sm:block">
							<div>
								<button
									class="cursor-pointer p-2 text-gray-500 transition-colors hover:text-gray-600"
									aria-label="QR Scanner"
									tabindex="0"
									onclick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										handleScanQR(event.id);
									}}
									onkeydown={(e) => e.key === 'Enter' && handleScanQR(event.id)}
								>
									<Tooltip
										icon="fa-solid fa-expand text-lg text-gray-400 hover:text-red-600"
										text=""
										content="Scanner"
										classTrigger=""
										classContent="border bg-white px-2 py-1 rounded-lg text-red-600"
									/>
								</button>
								<button
									class="cursor-pointer p-2 text-gray-500 transition-colors hover:text-gray-600"
									aria-label="Tickets"
									tabindex="0"
									onclick={(e) => {
										e.stopPropagation();
										handleTickets(event.id);
									}}
									onkeydown={(e) => e.key === 'Enter' && handleTickets(event.id)}
								>
									<Tooltip
										icon="fa-solid fa-ticket text-lg text-gray-400 hover:text-red-600"
										text=""
										content="Ticket"
										classTrigger=""
										classContent="border bg-white px-2 py-1 rounded-lg text-red-600"
									/>
								</button>
								<button
									class="cursor-pointer p-2 text-gray-500 transition-colors hover:text-gray-600"
									aria-label="Copy link"
									tabindex="0"
									onclick={(e) => {
										e.stopPropagation();
										handleCopyLink(event.id);
									}}
									onkeydown={(e) => e.key === 'Enter' && handleCopyLink(event.id)}
								>
									<Tooltip
										icon="fa-sharp fa-solid fa-link text-lg text-gray-400 hover:text-red-600"
										text=""
										content="Copy link"
										classTrigger=""
										classContent="border bg-white px-2 py-1 rounded-lg text-red-600"
									/>
								</button>
								<button
									class="cursor-pointer p-2 text-gray-500 transition-colors hover:text-gray-600"
									aria-label="Share"
									tabindex="0"
									onclick={(e) => {
										e.stopPropagation();
										handleShare(event.id);
									}}
									onkeydown={(e) => e.key === 'Enter' && handleShare(event.id)}
								>
									<Tooltip
										icon="fa-sharp fa-solid fa-share-nodes text-lg text-gray-400 hover:text-red-600"
										text=""
										content="Share event"
										classTrigger=""
										classContent="border bg-white px-2 py-1 rounded-lg text-red-600"
									/>
								</button>
								<button
									class="cursor-pointer p-2 text-gray-500 transition-colors hover:text-gray-600"
									aria-label="Duplicate event"
									tabindex="0"
									onclick={(e) => {
										e.stopPropagation();
										handleDuplicateEvent(event.id);
									}}
									onkeydown={(e) => e.key === 'Enter' && handleDuplicateEvent(event.id)}
								>
									<Tooltip
										icon="fa-solid fa-clone text-lg text-gray-400 hover:text-red-600"
										text=""
										content="Duplicate event"
										classTrigger=""
										classContent="border bg-white px-2 py-1 rounded-lg text-red-600"
									/>
								</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<div class="px-3 py-4 sm:px-6">
			<Pagination
				totalItems={events.length}
				itemsPerPage={eventsPerPage}
				{currentPage}
				on:pageChange={handlePageChange}
				on:pageSizeChange={handlePageSizeChange}
			/>
		</div>
	</div>
</div>
