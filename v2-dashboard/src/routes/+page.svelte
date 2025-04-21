<script lang="ts">
	import 'leaflet/dist/leaflet.css';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import DropdownMenu from '$lib/components/ui/DropdownMenu.svelte';
	import { goto } from '$app/navigation';
	import { eventListStore } from '$lib/stores/eventList.svelte.ts';
	import { fly } from 'svelte/transition';
	import Drawer from '$lib/components/ui/Drawer.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
	import DatePicker from '$lib/components/ui/DatePicker.svelte';
	import RichText from '$lib/components/ui/RichText.svelte';
	import LocationMap from '$lib/components/ui/LocationMap.svelte';

	import Button from '$lib/components/ui/Button.svelte';
	import { stateDrawer } from '$lib/stores/state.svelte.ts';

	let { data } = $props();

	const drawerState = $derived(stateDrawer.open);

	// Pagination state
	let currentPage = $state(1);
	let eventsPerPage = $state(5);
	let events = $derived(eventListStore.events);

	let paginatedEvents = $derived(
		events.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage)
	);

	const { form, errors, enhance, delayed, message } = superForm(data.form);

	message.subscribe(async (msg) => {
		if (msg && msg.success) {
			stateDrawer.open = false;
		}
	});

	$effect(() => {
		eventListStore.setEvents(data.events);
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

	// Handle location selection from the LocationMap component
	const handleLocationChange = (event: CustomEvent<string>) => {
		$form.location = event.detail;
	};

	const handleLocationSelect = (event: CustomEvent<string>) => {
		$form.location = event.detail;
	};

	const handleEvent = (id: number) => {
		goto(`${id}/registrants`);
	};

	const handlePageChange = (event: CustomEvent<{ page: number }>) => {
		currentPage = event.detail.page;
	};

	const handlePageSizeChange = (event: CustomEvent<{ size: number }>) => {
		eventsPerPage = event.detail.size;
		// Reset to first page when changing page size
		currentPage = 1;
	};

	const handleScanQR = (id: number) => {
		console.log(`Scan QR for event ${id}`);
	};

	const handleTickets = (id: number) => {
		console.log(`View tickets for event ${id}`);
	};

	const handleCopyLink = (id: number) => {
		console.log(`Copy link for event ${id}`);
	};

	const handleShare = (id: number) => {
		console.log(`Share event ${id}`);
	};

	// Handle duplicating an event
	const handleDuplicateEvent = (id: number) => {
		console.log(`Duplicating event ${id}`);
		// Code to duplicate the event would go here
	};

	const handleDropdownSelection = (item: string, eventId: number) => {
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

	const handleOpenDrawer = () => {
		return (stateDrawer.open = true);
	};
</script>

<div class="space-y-5" in:fly={{ y: -50, duration: 200 }}>
	<div class="space-y-2">
		<h1 class="text-2xl font-semibold sm:text-3xl sm:font-bold">Welcome back, Aero Dev!</h1>
		<p class="text-gray-500">Manage your events and track their performance</p>
	</div>
	<Button
		label="Create Event"
		icon="fa-solid fa-plus"
		className="bg-primary text-white rounded-lg px-4 py-2"
		onClick={() => handleOpenDrawer()}
	/>
	<Drawer
		isOpen={drawerState}
		contentBaseClass="bg-white p-10 space-y-4 shadow-xl w-full h-[90svh] overflow-y-auto"
		justify="justify-end"
		alignment="items-end"
		positionIn={{ y: 600, duration: 200 }}
		positionOut={{ y: 600, duration: 200 }}
	>
		<form
			action="?/createEvent"
			method="POST"
			use:enhance
			enctype="multipart/form-data"
			class=" grid grid-cols-1 gap-8 lg:grid-cols-2"
		>
			<!-- Left Column -->
			<div class="space-y-6">
				<!-- Event Name -->
				<div class="space-y-2">
					<label for="event" class="block text-sm font-medium text-gray-700">Event Name</label>
					<input
						type="text"
						bind:value={$form.event}
						placeholder="Enter your event name"
						name="event"
						class="w-full rounded-xl border border-gray-200 px-4 py-4 text-[16px] text-gray-500 placeholder-gray-500 outline-none transition-colors"
					/>
					{#if $errors.event}
						<p class="text-primary text-sm">{$errors.event}</p>
					{/if}
				</div>

				<!-- Subdomain -->
				<div class="mt-8 space-y-2">
					<label for="subdomain" class="block text-sm font-medium text-gray-700">Subdomain</label>
					<div class="flex items-center overflow-hidden rounded-xl border border-gray-200">
						<span class="p-4">
							<i class="fa-solid fa-globe text-gray-400"></i>
						</span>
						<input
							type="text"
							name="subdomain"
							bind:value={$form.subdomain}
							placeholder="your-event"
							class="flex-1 px-2 py-4 text-[16px] text-gray-500 outline-none transition-colors"
						/>
						<span class="p-4 text-gray-500">.veent.co</span>
					</div>
					{#if $errors.subdomain}
						<p class="text-primary text-sm">{$errors.subdomain}</p>
					{/if}
				</div>

				<!-- Date/Time Section -->
				<div class="mt-8 space-y-6">
					<!-- Start Date/Time -->
					<div class="space-y-2">
						<div class="flex items-center gap-2">
							<i class="fa-regular fa-calendar-minus text-gray-400"></i>
							<label for="startDate" class="text-sm font-medium text-gray-700">Start</label>
						</div>
						<div class="grid grid-cols-2 gap-4">
							<DatePicker
								name="startDate"
								className="h-input rounded-input  flex w-full select-none items-center border px-2 py-4 text-gray-500"
							/>
							<div class="relative">
								<label for="startTime" class="sr-only">Start Time</label>
								<input
									id="startTime"
									type="time"
									name="startTime"
									value="08:00"
									placeholder="Select end time"
									class="w-full appearance-none rounded-xl border border-gray-200 px-4 py-4 text-gray-500 outline-none"
								/>
							</div>
						</div>
						{#if $errors.startDate}
							<p class="text-primary text-sm">{$errors.startDate}</p>
						{/if}
					</div>

					<!-- End Date/Time -->
					<div class="space-y-2">
						<div class="flex items-center gap-2">
							<i class="ri-time-line text-lg text-gray-400"></i>
							<label for="endDate" class="text-sm font-medium text-gray-700">End</label>
						</div>
						<div class="grid grid-cols-2 gap-4">
							<DatePicker
								name="endDate"
								className="h-input rounded-input  flex w-full select-none items-center border px-2 py-4 text-gray-500"
							/>
							<div class="relative">
								<label for="endTime" class="sr-only">End Time</label>
								<input
									id="endTime"
									type="time"
									name="endTime"
									value="17:00"
									placeholder="Select end time"
									class="w-full appearance-none rounded-xl border border-gray-200 px-4 py-4 text-gray-500 outline-none"
								/>
							</div>
						</div>
						{#if $errors.endDate}
							<p class="text-primary text-sm">{$errors.endDate}</p>
						{/if}
					</div>

					<!-- Location (Using LocationMap component) -->
					<div class="space-y-2">
						<div class="flex items-center gap-2">
							<label for="location" class="text-sm font-medium text-gray-700">Location</label>
						</div>

						<LocationMap
							selectedLocation={$form.location || ''}
							on:locationChange={handleLocationChange}
							on:locationSelect={handleLocationSelect}
						/>

						<input type="hidden" name="location" value={$form.location || ''} />

						{#if $errors.location}
							<p class="text-primary mt-2 text-sm">{$errors.location}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<label for="description" class="text-gray-700">Description</label>
						<RichText />
						{#if $errors.richText}
							<p class="text-primary mt-2 text-sm">{$errors.richText}</p>
						{/if}
					</div>
				</div>
			</div>

			<!-- Right Column -->
			<div class="space-y-6">
				<div class="shadow-xs space-y-5 rounded-lg border border-gray-200 p-6">
					<div class="flex justify-end pb-1">
						<button
							class="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
						>
							<i class="ri-eye-line"></i>
							<span>Preview</span>
						</button>
					</div>

					<div class="space-y-2">
						<label for="logo" class="mb-2 block text-sm font-medium text-gray-700"
							>Company Logo</label
						>

						<FileUpload
							label="Upload a file or drag here"
							interfaceText="text-primary text-center"
							subtext="PNG, JPG, GIF up to 10MB"
							interfaceSubtext="text-sm text-gray-500"
							name="logo"
							accept="image/*"
							maxFiles={2}
							onFileChange={console.log}
							onFileReject={console.error}
							classes="cursor-pointer rounded-lg border-2 border-dashed"
						>
							{#snippet iconInterface()}
								<i class="fa-solid fa-image text-4xl text-gray-300"></i>
							{/snippet}
						</FileUpload>
						{#if $errors.logo}
							<p class="text-primary text-sm">{$errors.logo}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<label for="poster" class="mb-2 block text-sm font-medium text-gray-700">
							Event Poster
						</label>

						<FileUpload
							label="Upload a file or drag here"
							interfaceText="text-primary text-center"
							subtext="PNG, JPG, GIF up to 10MB"
							interfaceSubtext="text-sm text-gray-500"
							name="poster"
							accept="image/*"
							maxFiles={2}
							onFileChange={console.log}
							onFileReject={console.error}
							classes="cursor-pointer rounded-lg border-2 border-dashed"
						>
							{#snippet iconInterface()}
								<i class="fa-solid fa-image text-4xl text-gray-300"></i>
							{/snippet}
						</FileUpload>
						{#if $errors.poster}
							<p class="text-primary text-sm">{$errors.poster}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<label for="background" class="mb-2 block text-sm font-medium text-gray-700">
							Background Image
						</label>

						<FileUpload
							label="Upload a file or drag here"
							interfaceText="text-primary text-center"
							subtext="PNG, JPG, GIF up to 10MB"
							interfaceSubtext="text-sm text-gray-500"
							name="background"
							accept="image/*"
							maxFiles={2}
							onFileChange={console.log}
							onFileReject={console.error}
							classes="cursor-pointer rounded-lg border-2 border-dashed"
						>
							{#snippet iconInterface()}
								<i class="fa-solid fa-image text-4xl text-gray-300"></i>
							{/snippet}
						</FileUpload>
						{#if $errors.background}
							<p class="text-primary text-sm">{$errors.background}</p>
						{/if}
					</div>

					<Button
						type="submit"
						onClick={() => {}}
						label="Create Event"
						className="bg-primary w-full rounded-lg py-4 text-white transition-colors"
					/>
				</div>
			</div>
		</form>
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
