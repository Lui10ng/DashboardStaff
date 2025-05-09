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
	import {
        revenueGoal,
        attendeesGoal,
        statistics,
        totalRevenueData,
        totalEventData,
        totalTicketSoldData,
        totalAttendees
    } from '$lib/services/analyticsData';
	import {
		Chart,
		Svg,
		Axis,
		Highlight,
		Area,
		Spline,
		Bars,
		Tooltip as LayerchartTooltip,
		AreaChart
	} from 'layerchart';
	import { scaleBand, scaleTime } from 'd3-scale';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { format } from 'date-fns';

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

	// svelte-ignore non_reactive_update

	let activeFilter = $state('day');
	let filteredRevenueData = $derived(filterChartData(totalRevenueData, activeFilter));
	let isEditModalOpen = $state(false);
	let tempRevenueGoal = $state(0);
	let tempAttendeesGoal = $state(0);

	function filterChartData(data: any[], filter: string) {
		const today = new Date();
		const startDate = new Date();

		// First filter the date range
		switch (filter) {
			case 'day':
				startDate.setDate(today.getDate() - 7); // Last 7 days
				break;
			case 'week':
				startDate.setDate(today.getDate() - 28); // Last 4 weeks
				break;
			case 'month':
				startDate.setMonth(today.getMonth() - 6); // Last 6 months
				break;
			case 'year':
				startDate.setFullYear(today.getFullYear() - 1); // Last year
				break;
			default:
				return data;
		}

		// Filter data within date range
		const filteredData = data.filter((item) => {
			const itemDate = new Date(item.date);
			return itemDate >= startDate && itemDate <= today;
		});

		// Aggregate data based on filter
		if (filter === 'week') {
			// Group by week
			const weeklyData = new Map();

			filteredData.forEach((item) => {
				const date = new Date(item.date);
				const weekStart = new Date(date);
				weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
				const weekKey = weekStart.toISOString();

				if (!weeklyData.has(weekKey)) {
					weeklyData.set(weekKey, { date: weekStart, value: 0 });
				}
				weeklyData.get(weekKey).value += item.value;
			});

			return Array.from(weeklyData.values());
		} else if (filter === 'month') {
			// Group by month
			const monthlyData = new Map();

			filteredData.forEach((item) => {
				const date = new Date(item.date);
				const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
				const monthKey = monthStart.toISOString();

				if (!monthlyData.has(monthKey)) {
					monthlyData.set(monthKey, { date: monthStart, value: 0 });
				}
				monthlyData.get(monthKey).value += item.value;
			});

			return Array.from(monthlyData.values());
		} else if (filter === 'year') {
			// Group by year
			const yearlyData = new Map();

			filteredData.forEach((item) => {
				const date = new Date(item.date);
				const yearStart = new Date(date.getFullYear(), 0, 1);
				const yearKey = yearStart.toISOString();

				if (!yearlyData.has(yearKey)) {
					yearlyData.set(yearKey, { date: yearStart, value: 0 });
				}
				yearlyData.get(yearKey).value += item.value;
			});

			return Array.from(yearlyData.values());
		}

		return filteredData; // Return daily data as is
	}

	function handleFilterChange(filter: string) {
		activeFilter = filter;
	}

	function handleEditGoal() {
		tempRevenueGoal = statistics.totalRevenue.goal.target;
		tempAttendeesGoal = statistics.totalAttendees.goal.target;
		isEditModalOpen = true;
	}

	function handleSaveGoals() {
		statistics.totalRevenue.goal.target = tempRevenueGoal;
		statistics.totalAttendees.goal.target = tempAttendeesGoal;
		isEditModalOpen = false;
	}

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
				<div class="flex items-center justify-between mb-5">
					<div class="font-semibold">Reports & Analytics</div>
					<div class="relative">
						<i class="fa-solid fa-filter absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
						<select
							class="border rounded-lg pl-10 pr-5 px-3 py-2 text-sm text-gray-700 text-left"
						>
							<option value="Day">Day</option>
							<option value="Month">Month</option>
							<option value="Custom">Custom</option>
						</select>
					</div>
				</div>
				
				<div class="space-y-8" in:fly={{ y: -50, duration: 200 }}>
					<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
						<!-- Card 1 -->
						<div class="rounded-lg border border-gray-200 bg-white p-0 shadow-sm">
							<div class="p-3 sm:p-4">
								<div class="flex items-center justify-between pb-5">
									<h3 class="text-[10px] text-[#121826] md:text-[16px] lg:text-[14px]">
										Total Revenue
									</h3>
									<div
										class="m-[1px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#E0E7FF] text-[12px] text-[#4F46E5] md:h-8 md:w-8 lg:h-8 lg:w-8"
									>
										<i class="fa-solid fa-chart-line text-[8px] md:text-[13px] lg:text-[13px]"></i>
									</div>
								</div>
	
								<div
									class="grid w-full grid-cols-1 items-center justify-between space-x-4 md:grid-cols-2 md:gap-10 lg:grid-cols-2 lg:gap-10 2xl:gap-10"
								>
									<div class="order-2 md:order-1 w-full">
										<span class="text-[10px] text-green-500 md:text-[12px] lg:text-[10px]"
											>{statistics.totalRevenue.change}</span
										>
										<p class="text-[16px] font-semibold md:text-[20px]">
											{statistics.totalRevenue.value}
										</p>
									</div>
	
									<div class="order-1 md:order-2 md-h-full flex h-11 w-full justify-between py-2 md:w-full md:py-0">
										<Chart
											height={40}
											data={totalRevenueData}
											x="date"
											xScale={scaleTime()}
											y="value"
											yDomain={[0, null]}
											yNice
											tooltip={{ mode: 'bisect-x' }}
										>
											<Svg>
												<defs>
													<!-- Stroke gradient (optional, for smooth fade) -->
													<linearGradient id="lineGradient1" x1="0" x2="0" y1="0" y2="1">
														<stop offset="50%" stop-color="#4F46E5" stop-opacity="1" />
														<stop offset="100%" stop-color="#4F46E5" stop-opacity="0.0" />
													</linearGradient>
	
													<!-- Area fill gradient -->
													<linearGradient id="areaGradient1" x1="0" x2="0" y1="0" y2="1">
														<stop offset="50%" stop-color="#4F46E5" stop-opacity="0.2" />
														<stop offset="100%" stop-color="#4F46E5" stop-opacity="0" />
													</linearGradient>
												</defs>
	
												<!-- Area spline with smooth curve -->
												<Area
													spline
													class="fill-[url(#areaGradient1)] stroke-[url(#lineGradient1)] stroke-2"
												/>
	
												<Highlight points lines />
											</Svg>
	
											<LayerchartTooltip.Root let:data>
												<LayerchartTooltip.Header class="rounded-lg bg-[#f1f1f1] px-2 text-black">
													{format(data.date, 'eee, MMMM do')}
												</LayerchartTooltip.Header>
												<LayerchartTooltip.List>
													<LayerchartTooltip.Item
														class="rounded-lg bg-[#f1f1f1] px-2 text-black"
														label="Total Revenue"
														value={data.value}
													/>
												</LayerchartTooltip.List>
											</LayerchartTooltip.Root>
										</Chart>
									</div>
								</div>
							</div>
						</div>
	
						<!-- Card 2 -->
						<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
							<div class="p-3 sm:p-4">
								<div class="flex items-center justify-between pb-5">
									<h3 class="text-[10px] text-[#121826] md:text-[12px] lg:text-[14px]">
										Total Ticket Sold
									</h3>
									<div
										class="m-[1px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#FEE2E2] text-[12px] text-[#DC2626] md:h-8 md:w-8 lg:h-8 lg:w-8"
									>
										<i class="fa-solid fa-ticket text-[8px] md:text-[13px] lg:text-[13px]"></i>
									</div>
								</div>
								<div
									class="grid w-full grid-cols-1 items-center justify-between space-x-4 md:grid-cols-2 md:gap-10 lg:grid-cols-2 lg:gap-10 2xl:gap-10"
								>
									<div class="order-2 md:order-1 w-full">
										<span class="text-[10px] text-green-500 md:text-[12px] lg:text-[10px]"
											>{statistics.totalTicketSold.change}</span
										>
										<p class="text-[16px] font-semibold md:text-[20px]">
											{statistics.totalTicketSold.value}
										</p>
									</div>
	
									<div class="order-1 md:order-2 md-h-full flex h-11 w-full justify-between py-2 md:w-full md:py-0">
										<Chart
											height={40}
											data={totalTicketSoldData}
											x="date"
											xScale={scaleTime()}
											y="value"
											yDomain={[0, null]}
											yNice
											tooltip={{ mode: 'bisect-x' }}
										>
											<Svg>
												<defs>
													<!-- Stroke gradient (optional, for smooth fade) -->
													<linearGradient id="lineGradient2" x1="0" x2="0" y1="0" y2="1">
														<stop offset="50%" stop-color="#DC2626" stop-opacity="1" />
														<stop offset="100%" stop-color="#DC2626" stop-opacity="0.0" />
													</linearGradient>
	
													<!-- Area fill gradient -->
													<linearGradient id="areaGradient2" x1="0" x2="0" y1="0" y2="1">
														<stop offset="50%" stop-color="#DC2626" stop-opacity="0.2" />
														<stop offset="100%" stop-color="#DC2626" stop-opacity="0" />
													</linearGradient>
												</defs>
	
												<!-- Area spline with smooth curve -->
												<Area
													spline
													class="fill-[url(#areaGradient2)] stroke-[url(#lineGradient2)] stroke-2"
												/>
	
												<Highlight points lines />
											</Svg>
	
											<LayerchartTooltip.Root let:data>
												<LayerchartTooltip.Header class="rounded-lg bg-[#f1f1f1] px-2 text-black">
													{format(data.date, 'eee, MMMM do')}
												</LayerchartTooltip.Header>
												<LayerchartTooltip.List>
													<LayerchartTooltip.Item
														class="rounded-lg bg-[#f1f1f1] px-2 text-black"
														label="Total ticket Sold"
														value={data.value}
													/>
												</LayerchartTooltip.List>
											</LayerchartTooltip.Root>
										</Chart>
									</div>
								</div>
							</div>
						</div>
	
						<!-- Card 3 -->
						<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
							<div class="p-3 sm:p-4">
								<div class="flex items-center justify-between pb-5">
									<h3 class="text-[10px] text-[#121826] md:text-[12px] lg:text-[14px]">
										Total Attendees
									</h3>
									<div
										class="m-[1px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#DCFCE7] text-[10px] text-[#19A44C] md:h-8 md:w-8 lg:h-8 lg:w-8"
									>
										<i class="fa-solid fa-user-group text-[8px] md:text-[13px] lg:text-[13px]"></i>
									</div>
								</div>
								<div
									class="grid w-full grid-cols-1 items-center justify-between space-x-4 md:grid-cols-2 md:gap-10 lg:grid-cols-2 lg:gap-10 2xl:gap-10"
								>
									<div class="order-2 md:order-1 w-full">
										<span class="text-[10px] text-green-500 md:text-[12px] lg:text-[10px]"
											>{statistics.totalAttendees.change}</span
										>
										<p class="text-[16px] font-semibold md:text-[20px]">
											{statistics.totalAttendees.value}
										</p>
									</div>
	
									<div class="order-1 md:order-2 md-h-full flex h-11 w-full justify-between py-2 md:w-full md:py-0">
										<Chart
											height={40}
											data={totalAttendees}
											x="date"
											xScale={scaleTime()}
											y="value"
											yDomain={[0, null]}
											yNice
											tooltip={{ mode: 'bisect-x' }}
										>
											<Svg>
												<defs>
													<!-- Stroke gradient (optional, for smooth fade) -->
													<linearGradient id="lineGradient3" x1="0" x2="0" y1="0" y2="1">
														<stop offset="50%" stop-color="#19A44C" stop-opacity="1" />
														<stop offset="100%" stop-color="#19A44C" stop-opacity="0.0" />
													</linearGradient>
	
													<!-- Area fill gradient -->
													<linearGradient id="areaGradient3" x1="0" x2="0" y1="0" y2="1">
														<stop offset="50%" stop-color="#19A44C" stop-opacity="0.2" />
														<stop offset="100%" stop-color="#19A44C" stop-opacity="0" />
													</linearGradient>
												</defs>
	
												<!-- Area spline with smooth curve -->
												<Area
													spline
													class="fill-[url(#areaGradient3)] stroke-[url(#lineGradient3)] stroke-2"
												/>
	
												<Highlight points lines />
											</Svg>
	
											<LayerchartTooltip.Root let:data>
												<LayerchartTooltip.Header class="rounded-lg bg-[#f1f1f1] px-2 text-black">
													{format(data.date, 'eee, MMMM do')}
												</LayerchartTooltip.Header>
												<LayerchartTooltip.List>
													<LayerchartTooltip.Item
														class="rounded-lg bg-[#f1f1f1] px-2 text-black"
														label="Total Attendees"
														value={data.value}
													/>
												</LayerchartTooltip.List>
											</LayerchartTooltip.Root>
										</Chart>
									</div>
								</div>
							</div>
						</div>
	
						<!-- Card 4 -->
						<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
							<div class="p-3 sm:p-4">
								<div class="flex items-center justify-between pb-5">
									<h3 class="text-[10px] text-[#121826] md:text-[12px] lg:text-[14px]">
										Total Event
									</h3>
									<div
										class="m-[1px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#FFE0F6] text-[12px] text-[#824E73] md:h-8 md:w-8 lg:h-8 lg:w-8"
									>
										<i class="fa-regular fa-calendar text-[8px] md:text-[13px] lg:text-[13px]"></i>
									</div>
								</div>
	
								
								<div
									class="grid w-full grid-cols-1 items-center justify-between space-x-4 md:grid-cols-2 md:gap-10 lg:grid-cols-2 lg:gap-10 2xl:gap-10"
								>
								<div class="order-1 md:order-2 md-h-full flex h-11 w-full justify-between py-2 md:w-full md:py-0"></div>
								<div class="order-2 md:order-1 w-full flex-inline">
									<span class="text-[10px] text-green-500 md:text-[12px] lg:text-[10px]"
										>{statistics.totalEvent.change}</span
									>
									<div class="flex items-end justify-between">
										<p class="text-[16px] font-semibold md:text-[20px]">
											{statistics.totalEvent.value.toLocaleString()}
										</p>
									</div>
								</div>
									
								</div>
							</div>
						</div>
					</div>
				</div>

				<div
					class="mt-5 flex flex-col justify-between space-y-6 lg:flex-row lg:space-x-6 lg:space-y-0"
				>
					<div class="flex w-full flex-col space-y-6 lg:flex-row lg:space-x-6 lg:space-y-0">
						<!-- Revenue Overtime Card -->
						<div class="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm lg:w-2/3">
							<div
								class="mb-6 flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-x-5 lg:space-y-0"
							>
								<div class="text-[16px] text-[#121826]">Revenue Overtime</div>
								<div class="flex space-x-4">
									<button
										class="focus:ring-offset-3 rounded-lg bg-white px-4 py-2 text-[12px] font-medium text-gray-500 hover:bg-gray-200 focus:bg-gray-200 focus:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
										onclick={() => handleFilterChange('day')}
									>
										Day
									</button>
									<button
										class="focus:ring-offset-3 rounded-lg bg-white px-4 py-2 text-[12px] font-medium text-gray-500 hover:bg-gray-200 focus:bg-gray-200 focus:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
										onclick={() => handleFilterChange('week')}
									>
										Week
									</button>
									<button
										class="focus:ring-offset-3 rounded-lg bg-white px-4 py-2 text-[12px] font-medium text-gray-500 hover:bg-gray-200 focus:bg-gray-200 focus:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
										onclick={() => handleFilterChange('month')}
									>
										Month
									</button>
									<button
										class="focus:ring-offset-3 rounded-lg bg-white px-4 py-2 text-[12px] font-medium text-gray-500 hover:bg-gray-200 focus:bg-gray-200 focus:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
										onclick={() => handleFilterChange('year')}
									>
										Year
									</button>
								</div>
							</div>

							<div class="mt-4 flex flex-col">
								{#if !filteredRevenueData || filteredRevenueData.length === 0}
									<div class="flex h-[300px] items-center justify-center">
										<div class="text-center">
											<i class="fa-solid fa-chart-line mb-2 text-4xl text-gray-400"></i>
											<p class="text-gray-500">No revenue data available</p>
										</div>
									</div>
								{:else}
									<div class="h-[300px] rounded border p-4 pt-20">
										<Chart
											data={filteredRevenueData}
											x="date"
											xScale={scaleTime()}
											y="value"
											yDomain={[0, null]}
											yNice
											padding={{ left: 20, right: 20, bottom: 50, top: 50 }}
											tooltip={{ mode: 'bisect-x' }}
										>
											<Svg>
												<defs>
													<linearGradient id="lineGradient4" x1="0" x2="0" y1="0" y2="1">
														<stop offset="0%" stop-color="#A30B37" stop-opacity="1" />
														<stop offset="100%" stop-color="#A30B37" stop-opacity="0.0" />
													</linearGradient>

													<linearGradient id="areaGradient4" x1="0" x2="0" y1="0" y2="1">
														<stop offset="0%" stop-color="#A30B37" stop-opacity="0.2" />
														<stop offset="100%" stop-color="#A30B37" stop-opacity="0" />
													</linearGradient>
												</defs>
												<Axis placement="left" grid rule />
												<Axis
													placement="bottom"
													format={(date: Date) => format(date, 'MMM d')}
													rule
													ticks={7}
													tickRotate={-45}
													gridColor="#f1f1f1"
													tickSize={8}
													tickPadding={16}
												/>
												<Area
													spline
													class="fill-[url(#areaGradient4)] stroke-[url(#lineGradient4)] stroke-2"
												/>
												<Highlight points lines />
											</Svg>

											<LayerchartTooltip.Root let:data>
												<LayerchartTooltip.Header class="rounded-lg bg-[#f1f1f1] px-2 text-black">
													{#if activeFilter === 'week'}
														Week of {format(data.date, 'MMM d, yyyy')}
													{:else if activeFilter === 'month'}
														{format(data.date, 'MMMM yyyy')}
													{:else if activeFilter === 'year'}
														{format(data.date, 'yyyy')}
													{:else}
														{format(data.date, 'eee, MMMM do')}
													{/if}
												</LayerchartTooltip.Header>
												<LayerchartTooltip.List>
													<LayerchartTooltip.Item
														class="rounded-lg bg-[#f1f1f1] px-2 text-black"
														label="Total Sales"
														value={data.value}
													/>
												</LayerchartTooltip.List>
											</LayerchartTooltip.Root>
										</Chart>
									</div>
								{/if}
							</div>
						</div>

						<!-- Ticket Sales Per Event Card -->
						<div
							class="w-full rounded-lg border border-gray-200 bg-white p-6 py-5 shadow-sm lg:w-1/3"
						>
							<h3 class="text-[16px] text-[#121826]">Ticket Sales Per Event</h3>
							<div class="mt-4">
								{#if events.length === 0}
									<div class="flex h-[400px] items-center justify-center">
										<div class="text-center">
											<i class="fa-regular fa-calendar-xmark mb-2 text-4xl text-gray-400"></i>
											<p class="text-gray-500">No events registered</p>
										</div>
									</div>
								{:else}
									<div class="group h-[300px]">
										<div class="h-full rounded">
											<Chart
												data={events.map((event) => ({
													name: event.title,
													value: event.tickets.sold
												}))}
												x="name"
												xScale={scaleBand().padding(0.3)}
												y="value"
												yDomain={[0, 1000]}
												padding={{ bottom: 20, top: 15, right: 40 }}
												tooltip={{ mode: 'bisect-band' }}
											>
												<Svg>
													<Axis placement="right" grid rule />
													<Axis placement="bottom" rule />
													<Bars
														radius={10}
														class="fill-[#FFCACA] transition-colors group-hover:fill-white"
														stroke="#DC2626"
														strokeWidth={0.3}
													/>

													<Highlight
														area={{
															fill: 'rgba(223, 77, 96, 0.2)',
															strokeWidth: 0.1
														}}
														bar={{
															fill: '#DF4D60',
															rx: 10,
															ry: 10
														}}
													/>
												</Svg>

												<LayerchartTooltip.Root let:data>
													<div class="rounded-[10px] bg-[#f1f1f1] p-3 text-black">
														<LayerchartTooltip.Header class="text-[14px] font-bold">
															{data.name}
														</LayerchartTooltip.Header>
														<div class="inline-flex items-center justify-between gap-5 text-[12px]">
															<LayerchartTooltip.Item label="Ticket Sales" />
															<LayerchartTooltip.Item
																class="text-green font-semibold"
																label=""
																value={data.value.toLocaleString()}
															/>
														</div>
													</div>
												</LayerchartTooltip.Root>
											</Chart>
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<div class="mt-6">
					<!-- Title and Edit Button -->
					<div class="mb-4 flex items-center justify-between">
						<h2 class="pb-5 font-semibold">Goals and Milestone</h2>
						<button
							class="rounded-lg bg-red-300 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-red-200"
							onclick={handleEditGoal}
						>
							Edit Goal
						</button>
					</div>

					<!-- Cards Container -->
					<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
						<!-- Revenue Goal Progress -->
						<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
							<div class="mb-4 flex items-center justify-between">
								<h3 class="text-[16px] text-[#121826]">Revenue Goal Progress</h3>
								<span class="text-2xl font-medium">{statistics.totalRevenue.value}</span>
							</div>
							<div class="space-y-2">
								<div class="flex justify-between text-sm">
									<span>Progress</span>
									<span>{statistics.totalRevenue.goal.percentage}%</span>
								</div>
								<div class="h-2 w-full rounded-full bg-gray-100">
									<div
										class="bg-primary h-full rounded-full transition-all duration-300"
										style="width: {statistics.totalRevenue.goal.percentage}%"
									></div>
								</div>
								<div class="flex items-start justify-start text-sm text-black">
									<span>{statistics.totalRevenue.value}</span>
									<span class="ml-3 mr-3">to</span>
									<span
										>{statistics.totalRevenue.goal.formatCurrency(
											statistics.totalRevenue.goal.target
										)}</span
									>
								</div>
							</div>
						</div>

						<!-- Attendees Goal Progress -->
						<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
							<div class="mb-4 flex items-center justify-between">
								<h3 class="text-[16px] text-[#121826]">Attendees Goal Progress</h3>
								<span class="text-2xl font-medium">{statistics.totalAttendees.value}</span>
							</div>
							<div class="space-y-2">
								<div class="flex justify-between text-sm">
									<span>Progress</span>
									<span>{statistics.totalAttendees.goal.percentage}%</span>
								</div>
								<div class="h-2 w-full rounded-full bg-gray-100">
									<div
										class="bg-primary h-full rounded-full transition-all duration-300"
										style="width: {statistics.totalAttendees.goal.percentage}%"
									></div>
								</div>
								<div class="flex items-start justify-start text-sm text-black">
									<span>{statistics.totalAttendees.value}</span>
									<span class="ml-3 mr-3">to</span>
									<span
										>{statistics.totalAttendees.goal.formatNumber(
											statistics.totalAttendees.goal.target
										)}</span
									>
								</div>
							</div>
						</div>
					</div>

					<!-- Edit Modal -->
					<Modal bind:open={isEditModalOpen}>
						{#snippet button()}
							<span></span>
						{/snippet}

						{#snippet header()}
							<div class="flex items-center justify-between">
								<h2 class="text-xl font-semibold text-gray-900">Edit Goals</h2>
								<button
									class="rounded-lg bg-gray-100 p-2 text-gray-400 hover:text-gray-500"
									onclick={() => (isEditModalOpen = false)}
								>
									<i class="fa-solid fa-xmark"></i>
								</button>
							</div>
						{/snippet}

						{#snippet content()}
							<div class="space-y-6 p-6">
								<form
									class="space-y-6"
									onsubmit={(e) => {
										e.preventDefault();
										handleSaveGoals();
									}}
								>
									<div class="space-y-2">
										<label class="text-sm font-medium text-gray-700">Revenue Goal</label>
										<div class="relative">
											<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
											<input
												type="number"
												bind:value={tempRevenueGoal}
												class="focus:border-primary w-full rounded-lg border border-gray-200 px-8 py-2 focus:outline-none"
												min="0"
												required
											/>
										</div>
										<p class="text-xs text-gray-500">
											Current progress: {statistics.totalRevenue.goal.percentage}%
										</p>
									</div>

									<div class="space-y-2">
										<label class="text-sm font-medium text-gray-700">Attendees Goal</label>
										<input
											type="number"
											bind:value={tempAttendeesGoal}
											class="focus:border-primary w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none"
											min="0"
											required
										/>
										<p class="text-xs text-gray-500">
											Current progress: {statistics.totalAttendees.goal.percentage}%
										</p>
									</div>

									<div class="flex justify-end gap-3 pt-4">
										<button
											type="button"
											class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
											onclick={() => (isEditModalOpen = false)}
										>
											Cancel
										</button>
										<button
											type="submit"
											class="bg-primary rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
										>
											Save Changes
										</button>
									</div>
								</form>
							</div>
						{/snippet}
					</Modal>
				</div>

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
