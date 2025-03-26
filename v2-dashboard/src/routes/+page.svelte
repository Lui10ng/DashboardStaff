<script lang="ts">
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import DropdownMenu from '$lib/components/ui/DropdownMenu.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { goto } from '$app/navigation';
	import Drawer from '$lib/components/ui/Drawer.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import DynamicEventForm from '../lib/components/dataDisplay/TestEventForm.svelte';
	import { eventStore } from '$lib/stores';

	let { data } = $props();

	$effect(() => {
		eventStore.set(data.eventList);
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

	const handleEvent = () => {
		goto('eventId/registrants');
	};

	const handeCreateEvent = () => {
		goto('/create');
	};
</script>

<!-- <Drawer /> -->

<div class="space-y-5">
	<div class="space-y-2">
		<h1 class="text-2xl font-semibold sm:text-3xl sm:font-bold">Welcome back, Aero Dev!</h1>
		<p class="text-gray-500">Manage your events and track their performance</p>
	</div>
	<div class="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
		<div class="flex flex-col gap-5 sm:flex-row">
			<div class="relative">
				<input
					type="text"
					placeholder="Search events..."
					class="w-full rounded-lg border border-gray-200 px-10 py-2 text-gray-900 focus:outline-none"
				/>

				<i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 h-5 w-5 text-gray-400"></i>
			</div>
			<select
				class="sm:w-50 w-full cursor-pointer rounded-lg border border-gray-200 px-4 py-2 focus:outline-none"
			>
				<option value="all">All Events</option>
				<option value="live">Live</option>
				<option value="upcoming">Upcoming</option>
				<option value="past">Past</option>
				<option value="draft">Draft</option>
			</select>
			<select
				class="sm:w-50 w-full cursor-pointer rounded-lg border border-gray-200 px-4 py-2 focus:outline-none"
			>
				<option value="name">Sort by Date</option>
				<option value="date">Newest First</option>
				<option value="status">Oldest First</option>
			</select>
		</div>
		<Button
			onClick={handeCreateEvent}
			label="Create Event"
			icon="fa-solid fa-plus"
			className="bg-primary text-white rounded-lg px-4 py-2"
		/>

		<!-- <Modal>
			{#snippet button()}
				<h1 class="bg-primary cursor-pointer rounded-lg px-2 py-1 text-white">Create Event</h1>
			{/snippet}
			{#snippet content()}
				<DynamicEventForm />
			{/snippet}
		</Modal> -->
	</div>

	<div class="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
		<!-- Guest List Items -->
		<div>
			{#each $eventStore as event (event.id)}
				<div
					class="flex flex-col justify-between gap-5 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:p-6 md:gap-10"
				>
					<div class="flex justify-between">
						<div class="flex items-center gap-4">
							<Button className="overflow-hidden rounded-lg" onClick={handleEvent}>
								<img
									src={event.image}
									alt={event.name}
									class="h-16 w-16 rounded-lg object-cover object-center transition-all duration-500 hover:scale-125"
								/>
							</Button>

							<div class="flex-1">
								<h3 class="font-medium text-gray-900">{event.name}</h3>
								<p class="text-sm text-gray-500">
									<i class="fa-solid fa-location-dot text-gray-400"></i>
									{event.location}
								</p>
							</div>
						</div>
						<div class="block sm:hidden">
							<DropdownMenu
								icon="fa-solid fa-ellipsis text-2xl text-gray-400 hover:text-primary p-2"
								items={['Scanner', 'Ticket', 'Copy link', 'Share link', 'Disable']}
								alignContent="end"
							/>
						</div>
					</div>
					<div
						class="flex flex-wrap items-center justify-between gap-x-6 gap-y-5 sm:justify-end md:gap-10"
					>
						<div>
							<h3 class="rounded-full px-2 py-1 text-sm {formatStatus(event.status)}">
								{event.status}
							</h3>
							<p class="text-sm text-gray-500 sm:text-end">Status</p>
						</div>
						<div>
							<h3 class="font-medium sm:text-end">{event.ticketSold}</h3>
							<p class="text-sm text-gray-500">Ticket Sold</p>
						</div>
						<div>
							<h3 class="font-medium">{event.created}</h3>
							<p class="text-end text-sm text-gray-500">Date</p>
						</div>
						<div class="hidden sm:block">
							<div>
								<Tooltip
									icon="fa-solid fa-expand hover:text-primary p-2"
									content="Scanner"
									classTrigger="text-lg text-gray-400"
									classContent="border bg-white px-2 py-1 rounded-lg text-primary"
								/>

								<Tooltip
									icon="fa-solid fa-ticket hover:text-primary p-2"
									content="Ticket"
									classTrigger="text-lg text-gray-400"
									classContent="border bg-white px-2 py-1 rounded-lg text-primary"
								/>

								<Tooltip
									icon="fa-solid fa-link hover:text-primary p-2"
									content="Copy link"
									classTrigger="text-lg text-gray-400"
									classContent="border bg-white px-2 py-1 rounded-lg text-primary "
								/>

								<Tooltip
									icon="fa-solid fa-share-nodes hover:text-primary p-2"
									content="Share event"
									classTrigger="text-lg text-gray-400"
									classContent="border bg-white px-2 py-1 rounded-lg text-primary"
								/>
								<DropdownMenu
									icon="fa-solid fa-ellipsis-vertical text-lg text-gray-400 hover:text-primary p-2"
									items={['option 1', 'option 2', 'option 3']}
									alignContent="center"
								/>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<div class="px-3 py-4 sm:px-6">
			<Pagination total={100} />
		</div>
	</div>
</div>
