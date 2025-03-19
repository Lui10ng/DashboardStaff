<script lang="ts">
	import EventFilters from '$lib/components/ui/EventFilters.svelte';
	import Navigation from '$lib/components/ui/Navigation.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';

	// Supports weights 100-900
	import '@fontsource-variable/inter';
	type EventStatus = 'Live' | 'Upcoming' | 'Past' | 'Draft';

	type Event = {
		id: string;
		title: string;
		location: string;
		date: string;
		status: EventStatus;
		tickets: {
			sold: number;
			total: number;
		};
		image: string;
	};

	const events: Event[] = [
		{
			id: '1',
			title: 'Tech Conference 2024',
			location: 'San Francisco',
			date: 'Mar 15, 2024',
			status: 'Live',
			tickets: { sold: 145, total: 200 },
			image: 'https://veent.s3.ap-southeast-1.amazonaws.com/media/arou56pj4tsdx1yilpge.jpg'
		},
		{
			id: '2',
			title: 'Music Festival',
			location: 'Los Angeles',
			date: 'Apr 20, 2024',
			status: 'Upcoming',
			tickets: { sold: 0, total: 500 },
			image: 'https://veent.s3.ap-southeast-1.amazonaws.com/media/arou56pj4tsdx1yilpge.jpg'
		},
		{
			id: '3',
			title: 'Music Festival',
			location: 'Los Angeles',
			date: 'Apr 20, 2024',
			status: 'Upcoming',
			tickets: { sold: 0, total: 500 },
			image: 'https://veent.s3.ap-southeast-1.amazonaws.com/media/arou56pj4tsdx1yilpge.jpg'
		},
		{
			id: '4',
			title: 'Music gwapo',
			location: 'Los Angeles',
			date: 'Apr 20, 2024',
			status: 'Upcoming',
			tickets: { sold: 0, total: 500 },
			image: 'https://veent.s3.ap-southeast-1.amazonaws.com/media/arou56pj4tsdx1yilpge.jpg'
		},
		{
			id: '5',
			title: 'Music Festival',
			location: 'Los Angeles',
			date: 'Apr 20, 2024',
			status: 'Upcoming',
			tickets: { sold: 0, total: 500 },
			image: 'https://veent.s3.ap-southeast-1.amazonaws.com/media/arou56pj4tsdx1yilpge.jpg'
		}
	];

	let searchQuery = '';
	let selectedStatus = 'All Events';
	let sortBy = 'Sort by Date';

	const statusOptions = ['All Events', 'Live', 'Upcoming', 'Past', 'Draft'];
	const sortOptions = ['Sort by Date', 'Newest First', 'Oldest First'];

	let currentPage = 1;
	const itemsPerPage = 3;

	$: paginatedEvents = filteredEvents.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	$: filteredEvents = events
		.filter((event) => {
			const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = selectedStatus === 'All Events' || selectedStatus === event.status;
			return matchesSearch && matchesStatus;
		})
		.sort((a, b) => {
			const dateA = new Date(a.date);
			const dateB = new Date(b.date);

			switch (sortBy) {
				case 'Newest First':
					return dateB.getTime() - dateA.getTime();
				case 'Oldest First':
					return dateA.getTime() - dateB.getTime();
				default: // 'Sort by Date'
					return dateA.getTime() - dateB.getTime();
			}
		});

	const handlePageChange = (page: number) => {
		currentPage = page;
		// Optionally scroll to top of events list
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	fetch('http://localhost:3000/api/posts?limit=10')
		.then((res) => res.json())
		.then((data) => {
			const text =
				data?.docs?.[0]?.content?.root?.children?.[0]?.children?.[0]?.text ||
				'No content available';

			const titleElement = document.getElementById('post-title');
			if (titleElement) {
				titleElement.innerText = text;
			}
		})
		.catch((err) => console.error('Error fetching posts:', err));
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	
	<header class="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white">
		<div class="px-6 py-3">
			<div class="flex items-center justify-between">
				<Navigation />
				<button
					class="hidden h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white lg:flex"
					aria-label="Profile"
				>
					JT
				</button>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="mx-auto max-w-7xl px-6 pt-20">
		
		<div class="my-5">
			<h1 class="text-2xl font-bold text-gray-900 md:text-3xl">Welcome back, Jie clark Terec!</h1>
			<h1 id="post-title" class="text-2xl font-bold">Loading...</h1>
			<p class="mt-2 text-gray-600">Manage your events and track their performance</p>
		</div>

		<!-- Filters Section -->
		<div class="mb-8 flex flex-col gap-4">
			<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<EventFilters
					bind:searchQuery
					bind:selectedStatus
					bind:sortBy
					{statusOptions}
					{sortOptions}
				/>

				<a
					href="/create"
					class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition-all duration-200 hover:bg-red-600 hover:shadow-md md:w-auto"
				>
					<i class="ri-add-line"></i>
					Create Event
				</a>
			</div>

			<!-- Events List -->
			<div class="space-y-4">
				<!-- Desktop Table View -->
				<div class="hidden overflow-hidden rounded-lg border border-gray-200 bg-white md:block">
					<table class="w-full">
						<thead>
							<tr class="border-b border-gray-200">
								<th class="px-6 py-4 text-left text-sm font-medium text-gray-500">Event</th>
								<th class="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
								<th class="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
								<th class="px-6 py-4 text-left text-sm font-medium text-gray-500">Tickets</th>
								<th class="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each paginatedEvents as event (event.id)}
								<tr class="border-b border-gray-200 last:border-0">
									<td class="px-6 py-4">
										<div class="flex items-center gap-4">
											<img
												src={event.image}
												alt={event.title}
												class="h-12 w-12 rounded-lg object-cover"
											/>
											<div>
												<a
													href="/registrants"
													class="transition-colors duration-200 hover:text-red-500"
													tabindex="0"
													aria-label={`View registrants for ${event.title}`}
												>
													<h3 class="font-medium text-gray-900">
														{event.title}
													</h3>
												</a>
												<p class="flex items-center gap-1 text-sm text-gray-600">
													<i class="ri-map-pin-line"></i>
													{event.location}
												</p>
											</div>
										</div>
									</td>
									<td class="px-6 py-4">
										<div class="flex items-center gap-2 text-gray-600">
											<i class="ri-calendar-event-line"></i>
											{event.date}
										</div>
									</td>
									<td class="px-6 py-4">
										<span
											class={`inline-flex rounded-full px-2 py-1 text-sm ${
												event.status === 'Live'
													? 'bg-red-100 text-red-800'
													: event.status === 'Upcoming'
														? 'bg-blue-100 text-blue-800'
														: event.status === 'Past'
															? 'bg-gray-100 text-gray-800'
															: 'bg-yellow-100 text-yellow-800'
											}`}
										>
											{event.status}
										</span>
									</td>
									<td class="px-6 py-4">
										<span class="text-gray-900">{event.tickets.sold}/{event.tickets.total}</span>
									</td>
									<td class="px-6 py-4">
										<div class="flex items-center justify-end gap-2">
											<a
												class="cursor-pointer p-2 text-gray-400 transition-colors hover:text-gray-600"
												aria-label="Tickets"
												href="/qr-scanner"
											>
												<i class="ri-qr-scan-2-line text-xl"></i>
											</a>
											<button
												class="cursor-pointer p-2 text-gray-400 transition-colors hover:text-gray-600"
												aria-label="Tickets"
											>
												<i class="ri-coupon-2-line text-xl"></i>
											</button>
											<button
												class="cursor-pointer p-2 text-gray-400 transition-colors hover:text-gray-600"
												aria-label="Copy link"
											>
												<i class="ri-links-line text-xl"></i>
											</button>
											<button
												class="cursor-pointer p-2 text-gray-400 transition-colors hover:text-gray-600"
												aria-label="Share"
											>
												<i class="ri-share-line text-xl"></i>
											</button>
											<button
												class="cursor-pointer p-2 text-gray-400 transition-colors hover:text-gray-600"
												aria-label="More options"
											>
												<i class="ri-more-2-fill text-xl"></i>
											</button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Mobile Card View -->
				<div class="space-y-4 md:hidden">
					{#each paginatedEvents as event (event.id)}
						<a
							href="/registrants"
							class="block rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-red-200 hover:shadow-md"
							tabindex="0"
							aria-label={`View registrants for ${event.title}`}
						>
							<div class="flex gap-4">
								<img
									src={event.image}
									alt={event.title}
									class="h-16 w-16 rounded-lg object-cover"
								/>
								<div class="flex-1">
									<h3 class="font-medium text-gray-900">{event.title}</h3>
									<p class="flex items-center gap-1 text-sm text-gray-600">
										<i class="ri-map-pin-line"></i>
										{event.location}
									</p>
								</div>
							</div>

							<div class="mt-4 space-y-3">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-2 text-gray-600">
										<i class="ri-calendar-event-line"></i>
										{event.date}
									</div>
									<span
										class={`rounded-full px-2 py-1 text-sm ${
											event.status === 'Live'
												? 'bg-red-100 text-red-800'
												: event.status === 'Upcoming'
													? 'bg-blue-100 text-blue-800'
													: event.status === 'Past'
														? 'bg-gray-100 text-gray-800'
														: 'bg-yellow-100 text-yellow-800'
										}`}
									>
										{event.status}
									</span>
								</div>

								<div class="flex items-center justify-between">
									<div class="text-gray-600">
										<span class="text-sm">Tickets</span>
										<div>{event.tickets.sold}/{event.tickets.total}</div>
									</div>
									<div class="flex items-center gap-2" on:click|stopPropagation>
										<button class="p-2 text-gray-400 hover:text-gray-600" aria-label="Tickets">
											<i class="ri-coupon-2-line text-xl"></i>
										</button>
										<button class="p-2 text-gray-400 hover:text-gray-600" aria-label="copy-link">
											<i class="ri-links-line text-xl"></i>
										</button>
										<button class="p-2 text-gray-400 hover:text-gray-600" aria-label="share">
											<i class="ri-share-line text-xl"></i>
										</button>
										<button class="p-2 text-gray-400 hover:text-gray-600" aria-label="More">
											<i class="ri-more-2-fill text-xl"></i>
										</button>
									</div>
								</div>
							</div>
						</a>
					{/each}
				</div>

				<!-- Pagination -->
				<Pagination
					{currentPage}
					totalItems={filteredEvents.length}
					{itemsPerPage}
					onPageChange={handlePageChange}
				/>
			</div>
		</div>
	</main>
</div>
