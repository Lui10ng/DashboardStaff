<script lang="ts">
	import { browser } from '$app/environment';
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
	import { PUBLIC_PAYLOAD_API_URL } from '$env/static/public';
	import Button from '$lib/components/ui/Button.svelte';
	import { stateDrawer } from '$lib/stores/state.svelte.ts';
	import { useClerkContext } from 'svelte-clerk/client';
	import { Tabs } from 'bits-ui';
	import { event } from '$lib/types/eventData.js';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import HomeSkeleton from '$lib/components/ui/HomeSkeleton.svelte';

	const ctx = useClerkContext();
	const fullName = $derived(ctx.user?.fullName);

	let { data } = $props();
	let loading = $state(true);

	$effect(() => {
		if (browser && data.requiresRedirect && data.redirectTo) {
			window.location.assign(data.redirectTo); // This forces a full page load
		}
	});

	const drawerState = $derived(stateDrawer.open);

	// Pagination state
	let currentPage = $state(1);
	let eventsPerPage = $state(5);
	let subdomainError = $state('');
	let subdomainDebounceTimer: NodeJS.Timeout;
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
		console.log('does have events', data.events?.length);
		if (data.events !== undefined) {
			eventListStore.setEvents(data.events);
			loading = false;
		}
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

	async function validateSubdomain(subdomain: string) {
		try {
			const response = await fetch('/api/checkSubdomain', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ subdomain })
			});

			const data = await response.json();

			if (!response.ok) {
				subdomainError = data.error;
				return false;
			}

			subdomainError = '';
			return true;
		} catch (error) {
			subdomainError = 'Error checking subdomain';
			return false;
		}
	}

	function handleSubdomainInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const value = input.value.replace(/\s/g, '').toLowerCase();
		// Update input value to immediately remove spaces
		input.value = value;
		$form.subdomain = value;

		// Clear previous timer
		clearTimeout(subdomainDebounceTimer);

		// Set new timer
		subdomainDebounceTimer = setTimeout(() => {
			validateSubdomain(value);
		}, 500); // Wait 500ms after user stops typing
	}

	const extractLocation = (location: string): string => {
		if (!location) return '';
		return location.split(',')[0].trim();
	};

	// Handle location selection from the LocationMap component
	const handleLocationChange = (event: CustomEvent<string>) => {
		$form.location = event.detail;
	};

	const handleLocationSelect = (event: CustomEvent<string>) => {
		$form.location = event.detail;
	};

	const handleEvent = (id: number) => {
		goto(`${id}/analytics`);
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

{#if !data.requiresRedirect}
	<div class="space-y-5" in:fly={{ y: -50, duration: 200 }}>
		<div class="prose space-y-2">
			{#if loading || !fullName}
				<div class="animate-pulse space-y-3">
					<!-- Title skeleton -->
					<div class="h-8 w-64 rounded bg-gray-200 sm:h-9 sm:w-72"></div>
					<!-- Subtitle skeleton -->
					<div class="h-4 w-80 rounded bg-gray-200"></div>
				</div>
			{:else}
				<h1 class="text-2xl font-semibold sm:text-3xl sm:font-bold">
					Welcome back, {fullName}
				</h1>
				<p class="text-gray-500">Manage your events and track their performance</p>
			{/if}
		</div>

		<Tabs.Root value="tab1">
			<Tabs.List>
				<Tabs.Trigger
					value="tab1"
					class="prose border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none data-[state=active]:border-[#DF4D60] data-[state=inactive]:border-transparent data-[state=active]:text-[#DF4D60] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:border-gray-300 data-[state=inactive]:hover:text-gray-700"
					>My Events</Tabs.Trigger
				>
				<Tabs.Trigger
					value="tab2"
					class="prose border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none data-[state=active]:border-[#DF4D60] data-[state=inactive]:border-transparent data-[state=active]:text-[#DF4D60] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:border-gray-300 data-[state=inactive]:hover:text-gray-700"
					>Analytics Overview</Tabs.Trigger
				>
			</Tabs.List>
			<Tabs.Content class="pt-5" value="tab1">
				{#if events.length > 0}
					<Button
						label="Create Event"
						icon="fa-solid fa-plus"
						className="bg-primary text-white rounded-lg mb-4 px-4 py-2"
						onClick={() => handleOpenDrawer()}
					/>
				{/if}
				<Drawer
					isOpen={drawerState}
					contentBaseClass="bg-white py-7 px-4 space-y-4 shadow-xl w-full h-[90svh] overflow-y-auto"
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
								<label for="event" class="prose block text-sm font-medium text-gray-700"
									>Event Name</label
								>
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
								<label for="subdomain" class="prose block text-sm font-medium text-gray-700"
									>Subdomain</label
								>
								<div class="flex items-center overflow-hidden rounded-xl border border-gray-200">
									<span class="p-4">
										<i class="fa-solid fa-globe text-gray-400"></i>
									</span>
									<input
										type="text"
										name="subdomain"
										bind:value={$form.subdomain}
										oninput={handleSubdomainInput}
										placeholder="your-event"
										class="prose flex-1 px-2 py-4 text-[16px] text-gray-500 outline-none transition-colors"
									/>
									<span class="prose p-4 text-gray-500">.veent.co</span>
								</div>
								<!-- para ma prevent ang pag display sa duha ka error -->
								{#if subdomainError}
									<p class="text-primary text-sm">{subdomainError}</p>
								{:else if $errors.subdomain}
									<p class="text-primary text-sm">{$errors.subdomain}</p>
								{/if}
							</div>

							<!-- Date/Time Section -->
							<div class="mt-8 space-y-6">
								<!-- Start Date/Time -->
								<div class="space-y-2">
									<div class="flex items-center gap-2">
										<i class="fa-regular fa-calendar-minus text-gray-400"></i>
										<label for="startDate" class="prose text-sm font-medium text-gray-700"
											>Start</label
										>
									</div>
									<div class="grid grid-cols-2 gap-4">
										<DatePicker
											name="startDate"
											className="prose h-[62px] rounded-input flex w-full select-none items-center border px-2 py-4 text-gray-500"
										/>
										<div class="relative">
											<label for="startTime" class="prose sr-only">Start Time</label>
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
										<i class="fa-regular fa-calendar-minus text-gray-400"></i>
										<label for="endDate" class="prose text-sm font-medium text-gray-700">End</label>
									</div>
									<div class="grid grid-cols-2 gap-4">
										<DatePicker
											name="endDate"
											className="prose h-[62px] rounded-input flex w-full select-none items-center border px-2 py-4 text-gray-500"
										/>
										<div class="relative">
											<label for="endTime" class="prose sr-only">End Time</label>
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
										<label for="location" class="prose text-sm font-medium text-gray-700"
											>Location</label
										>
									</div>
									<LocationMap
										selectedLocation={$form.location || ''}
										on:locationChange={handleLocationChange}
										on:locationSelect={handleLocationSelect}
									/>

									<input type="hidden" name="location" value={$form.location || ''} />

									{#if $errors.location}
										<p class="prose text-primary mt-2 text-sm">
											{$errors.location}
										</p>
									{/if}
								</div>

								<div class="space-y-2">
									<label for="description" class="prose text-gray-700">Description</label>
									<RichText />
									{#if $errors.richText}
										<p class="prose text-primary mt-2 text-sm">
											{$errors.richText}
										</p>
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
										<span class="prose">Preview</span>
									</button>
								</div>

								<div class="space-y-2">
									<label for="logo" class="prose mb-2 block text-sm font-medium text-gray-700"
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
									<label for="poster" class="prose mb-2 block text-sm font-medium text-gray-700">
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
									<label
										for="background"
										class="prose mb-2 block text-sm font-medium text-gray-700"
									>
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
					{#if loading}
						<!-- Skeleton loading for events -->
						{#each Array(Math.min(data.events?.length || 0)) as _}
							<HomeSkeleton />
						{/each}
					{:else if !loading && events.length > 0}
						<!-- Event List Items -->
						<div>
							{#each paginatedEvents as event (event.id)}
								<div
									class="grid cursor-pointer grid-cols-12 items-center justify-between gap-x-4 gap-y-2 border-b border-gray-200 p-4 transition-colors hover:bg-gray-50"
									onclick={() => handleEvent(event.id)}
									onkeydown={(e) => e.key === 'Enter' && handleEvent(event.id)}
									tabindex="0"
									role="button"
								>
									<div class="col-span-3 flex items-center sm:col-span-2">
										<img
											src={event.eventImages && event.eventImages.length > 0
												? `${PUBLIC_PAYLOAD_API_URL}${event.eventImages[0].url}`
												: '/images/veent-logo.svg'}
											alt={event.title}
											class={event.eventImages && event.eventImages.length > 0
												? 'h-16 w-16 rounded-lg bg-gray-100 object-cover object-center transition-all duration-500 hover:scale-125'
												: 'h-16 w-16 rounded-lg bg-gray-100 object-contain p-2 sm:h-20 sm:w-20'}
										/>
									</div>

									<div class="col-span-9 flex flex-col justify-center sm:col-span-4">
										<h3 class="prose truncate font-medium text-gray-900">
											{event.title}
										</h3>

										<div class="text-xs sm:hidden">
											<span
												class="prose inline-block rounded-full px-2 py-0.5 text-xs {formatStatus(
													event.status
												)}"
											>
												{event.status}
											</span>
										</div>
										<div class="hidden sm:block">
											<Tooltip
												icon="fa-solid fa-location-dot text-sm text-gray-500"
												text={extractLocation(event.location)}
												content={event.location}
												classTrigger="prose text-sm text-gray-500 flex items-center gap-1 cursor-pointer"
												classContent="border bg-white px-2 py-1 rounded-lg text-gray-900 max-w-xs break-words"
											/>
										</div>
									</div>

									<div class="hidden sm:col-span-3 sm:flex sm:flex-col sm:justify-center">
										<div class="flex items-center gap-2">
											<i class="fa-regular fa-calendar text-gray-400"></i>
											<span class="prose text-sm text-gray-600">
												{new Date(event.startTime).toLocaleDateString('en-US', {
													month: 'short' /* Using short month for space */,
													day: 'numeric',
													year: 'numeric'
												})}
											</span>
										</div>
										<div class="flex items-center gap-2">
											<i class="fa-regular fa-clock text-gray-400"></i>
											<span class="prose text-sm text-gray-600">
												{new Date(event.startTime).toLocaleTimeString('en-US', {
													hour: 'numeric',
													minute: '2-digit',
													hour12: true
												})} - {new Date(event.endTime).toLocaleTimeString('en-US', {
													/* Note: corrected 'to' to '-' for consistency */
													hour: 'numeric',
													minute: '2-digit',
													hour12: true
												})}
											</span>
										</div>
									</div>

									<div class="hidden sm:col-span-1 sm:flex sm:items-center sm:justify-start">
										<h3
											class="prose inline-block rounded-full px-3 py-1 text-xs {formatStatus(
												event.status
											)}"
										>
											{event.status}
										</h3>
									</div>

									{#if !stateDrawer.open}
										<div class="col-span-3 col-start-10 flex items-center justify-end sm:hidden">
											<DropdownMenu
												icon="fa-solid fa-ellipsis text-xl text-gray-400 hover:text-red-600 p-1"
												className="prose cursor-pointer relative z-10"
												classMenu="mt-2 shadow-md"
												alignContent="end"
												buttonText=""
												items={['Scanner', 'Copy link', 'Share event', 'Duplicate event']}
												on:select={(e) => {
													e.stopPropagation();
													handleDropdownSelection(e.detail, event.id);
												}}
											/>
										</div>
									{/if}

									<div
										class="hidden space-x-1 sm:col-span-2 sm:flex sm:items-center sm:justify-end"
									>
										<button
											class="cursor-pointer p-1 text-gray-500 transition-colors hover:text-gray-600"
											aria-label="QR Scanner"
											tabindex="0"
											onkeydown={(e) => e.key === 'Enter' && handleScanQR(event.id)}
										>
											<Tooltip
												icon="fa-solid fa-expand text-base text-gray-400 hover:text-red-600"
												content="Scanner"
												classContent="border bg-white px-2 py-1 rounded-lg text-red-600 text-xs"
											/>
										</button>
										<button
											class="cursor-pointer p-1 text-gray-500 transition-colors hover:text-gray-600"
											aria-label="Copy link"
											tabindex="0"
											onkeydown={(e) => e.key === 'Enter' && handleCopyLink(event.id)}
										>
											<Tooltip
												icon="fa-sharp fa-solid fa-link text-base text-gray-400 hover:text-red-600"
												content="Copy link"
												classContent="border bg-white px-2 py-1 rounded-lg text-red-600 text-xs"
											/>
										</button>
										<button
											class="cursor-pointer p-1 text-gray-500 transition-colors hover:text-gray-600"
											aria-label="Share"
											tabindex="0"
											onkeydown={(e) => e.key === 'Enter' && handleShare(event.id)}
										>
											<Tooltip
												icon="fa-sharp fa-solid fa-share-nodes text-base text-gray-400 hover:text-red-600"
												content="Share event"
												classContent="border bg-white px-2 py-1 rounded-lg text-red-600 text-xs"
											/>
										</button>
										<button
											class="cursor-pointer p-1 text-gray-500 transition-colors hover:text-gray-600"
											aria-label="Duplicate event"
											tabindex="0"
											onkeydown={(e) => e.key === 'Enter' && handleDuplicateEvent(event.id)}
										>
											<Tooltip
												icon="fa-solid fa-clone text-base text-gray-400 hover:text-red-600"
												content="Duplicate event"
												classContent="border bg-white px-2 py-1 rounded-lg text-red-600 text-xs"
											/>
										</button>
									</div>
								</div>
							{/each}
							<div class="px-3 py-4 sm:px-6">
								<div class="px-3 py-4 sm:px-6">
									<Pagination
										totalItems={events?.length || 0}
										itemsPerPage={eventsPerPage}
										{currentPage}
										on:pageChange={handlePageChange}
										on:pageSizeChange={handlePageSizeChange}
									/>
								</div>
							</div>
						</div>
					{:else}
						<EmptyState
							title="No events yet"
							buttonLabel="Create Event"
							onClick={() => handleOpenDrawer()}
							description="Get started by creating your first event. Click the 'Create Event' button above to begin."
						/>
					{/if}
				</div>
			</Tabs.Content>
			<Tabs.Content class="pt-5" value="tab2">
				<div class="prose pb-5 font-semibold">Reports & Analytics</div>

				<div class="mt-3 w-full overflow-x-auto border border-gray-200 shadow-sm sm:rounded-lg">
					<div class="inline-block min-w-full align-middle">
						<table class="min-w-full divide-y divide-gray-200">
							<!-- Table Header -->
							<thead class="bg-secondary">
								<tr>
									<th
										class="prose whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-black"
										>No.</th
									>
									<th
										class="prose whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-black"
										>Event Name</th
									>
									<th
										class="prose whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-black"
										>Total Attendees</th
									>
									<th
										class="prose whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-black"
										>Gross Sales</th
									>

									<th
										class="prose whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-black"
										>Status</th
									>
								</tr>
							</thead>
							<!-- Table Body -->
							<tbody class="divide-y divide-gray-200 bg-white">
								{#each paginatedEvents as event, index}
									<tr class="hover:bg-gray-50">
										<td class="prose whitespace-nowrap px-4 py-3 text-sm text-gray-900"
											>{index + 1}</td
										>
										<td class="prose whitespace-nowrap px-4 py-3 text-sm text-gray-900"
											>{event.title}</td
										>
										<td class="prose whitespace-nowrap px-4 py-3 text-sm text-gray-900"
											>{event?.attendees?.length || 0}</td
										>
										<td class="prose whitespace-nowrap px-4 py-3 text-sm text-gray-900"
											>₱{event.grossSales || 0}</td
										>
										<td class="prose whitespace-nowrap px-4 py-3 text-sm text-gray-900"
											>{event.tickets.sold}</td
										>
										<td class="prose whitespace-nowrap px-4 py-3">
											<span
												class="inline-flex rounded-full px-6 py-1 text-xs font-semibold {formatStatus(
													event.status
												)}"
											>
												{event.status}
											</span>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
				<!-- Pagination -->
				<div class="px-4 py-3 sm:px-6">
					<Pagination
						totalItems={events.length}
						itemsPerPage={eventsPerPage}
						{currentPage}
						on:pageChange={handlePageChange}
						on:pageSizeChange={handlePageSizeChange}
					/>
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</div>
{/if}
