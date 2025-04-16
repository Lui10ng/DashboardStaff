<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Drawer from '$lib/components/ui/Drawer.svelte';
	import { ticketStore, voucherStore } from '$lib/stores';

	import { Tabs } from 'bits-ui';
	import { seatGeneratorStore } from '$lib/stores/seat-generator.svelte';
	import type { SeatConfig as SeatConfigType } from '$lib/types/seat-generator';

	// import Components
	import ReserveToggle from '$lib/components/seat-generator/ReserveToggle.svelte';
	import SeatConfig from '$lib/components/seat-generator/SeatConfig.svelte';
	import RenameControl from '$lib/components/seat-generator/RenameControl.svelte';
	import SaveLayout from '$lib/components/seat-generator/SaveLayout.svelte';
	import QuantityWarning from '$lib/components/seat-generator/QuantityWarning.svelte';
	import PanzoomContainer from '$lib/components/seat-generator/PanzoomContainer.svelte';
	import StatusControls from '$lib/components/seat-generator/StatusControls.svelte';
	import SeatStats from '$lib/components/seat-generator/SeatStats.svelte';
	import VenueImageUpload from '$lib/components/seat-generator/VenueImageUpload.svelte';
	import { fly } from 'svelte/transition';
	import { ticketDrawer } from '$lib/stores/state.svelte.ts';

	// Get server data
	let { data } = $props();

	const drawerState = $derived(ticketDrawer.open);

	// Track initialization state
	let initialized = $state(false);

	$effect(() => {
		ticketStore.set(data.tickets);
	});

	$effect(() => {
		voucherStore.set(data.vouchers);
	});

	const getStatusColor = (status: string) => {
		if (status === 'Active') return 'bg-green-500';
		else if (status === 'Expired') return 'bg-red-500';
		else if (status === 'Deactivated') return 'bg-gray-500';
		else return 'bg-gray-400';
	};

	const getStatusTextColor = (status: string) => {
		if (status === 'Active') return 'text-green-500';
		if (status === 'Expired') return 'text-red-500';
		if (status === 'Deactivated') return 'text-gray-500';
		return 'text-gray-400';
	};

	// Initialize data with effect (runs once on component creation)
	$effect(() => {
		if (initialized) return;

		// Initialize stores with server-provided data
		seatGeneratorStore.setTicketQuantity(data.initialConfig.ticketQuantity);
		seatGeneratorStore.setReserveSeatingEnabled(data.initialConfig.reserveSeatingEnabled);

		// Update section config - using type assertion to handle rowLabel type
		seatGeneratorStore.setSectionConfig(data.initialConfig.seatConfig as Partial<SeatConfigType>);

		// Generate seats based on the configuration
		seatGeneratorStore.regenerateSeats();
		// Mark as initialized
		initialized = true;
	});

	const handleOpenDrawer = () => {
		return (ticketDrawer.open = true);
	};
</script>

<div class="space-y-8" in:fly={{ y: -50, duration: 200 }}>
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-xl font-semibold">Tickets</h2>
		<div class="flex gap-2">
			<Button
				label="Add Ticket"
				icon="fa-solid fa-plus text-sm"
				className="bg-gray-200 px-4 py-2 rounded-md"
				onClick={() => handleOpenDrawer()}
			/>
			<Drawer
				isOpen={drawerState}
				contentBaseClass="bg-white p-4 space-y-4 shadow-xl w-full h-[90vh] rounded-t-xl overflow-y-auto"
				alignment="items-end"
				positionIn={{ y: 600, duration: 200 }}
				positionOut={{ y: 600, duration: 200 }}
				title="Monterde"
			>
				<div class="w-full">
					<!-- Tab Navigation - Using Bits UI -->
					<Tabs.Root
						value={seatGeneratorStore.activeTab}
						onValueChange={(value: string) =>
							seatGeneratorStore.setActiveTab(value as 'ticket' | 'reserve-seating')}
						class="mb-8"
					>
						<Tabs.List class="flex space-x-4 border-b border-gray-200">
							<Tabs.Trigger
								value="ticket"
								class="border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none data-[state=active]:border-[#DF4D60] data-[state=inactive]:border-transparent data-[state=active]:text-[#DF4D60] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:border-gray-300 data-[state=inactive]:hover:text-gray-700"
								aria-label="Switch to Ticket tab"
								tabindex={0}
							>
								<div class="flex items-center">
									<i class="fa-solid fa-ticket-simple pe-2"></i>
									Ticket
								</div>
							</Tabs.Trigger>

							<Tabs.Trigger
								value="reserve-seating"
								class="border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none data-[state=active]:border-[#DF4D60] data-[state=inactive]:border-transparent data-[state=active]:text-[#DF4D60] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:border-gray-300 data-[state=inactive]:hover:text-gray-700"
								aria-label="Switch to Reserve Seating tab"
								tabindex={0}
							>
								<div class="flex items-center">
									<i class="fa-solid fa-chair pe-2"></i>
									Reserve Seating
								</div>
							</Tabs.Trigger>
						</Tabs.List>

						<!-- Tab Content -->
						<Tabs.Content value="ticket">
							<!-- Ticket Tab Content -->
							<div class="mx-auto flex max-w-3xl flex-col space-y-6">
								<!-- Ticket tab content  -->
							</div>
						</Tabs.Content>

						<Tabs.Content value="reserve-seating">
							<!-- Reserve Seating Tab Content -->
							<div class="flex flex-col space-y-6">
								<!-- Reserve Seating Toggle -->
								<ReserveToggle />

								<!-- Reserve Seating Configuration (only shown when enabled) -->
								{#if seatGeneratorStore.reserveSeatingEnabled}
									<div class="flex gap-8">
										<!-- Left Column -->
										<div class="w-[400px] flex-shrink-0 space-y-6">
											<SeatConfig />
											<RenameControl />
											<SaveLayout />
										</div>

										<!-- Venue Floor Plan Image Upload -->
										<div class="min-w-0 flex-1 space-y-6">
											<QuantityWarning />
											<VenueImageUpload />
											<PanzoomContainer />
											<StatusControls />
											<SeatStats />
										</div>
									</div>
								{/if}
							</div>
						</Tabs.Content>
					</Tabs.Root>
				</div>
			</Drawer>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each $ticketStore as ticket}
			<div
				class="border-l-10 rounded-lg border border-gray-400 {ticket.status === 'Active'
					? 'border-l-green-500'
					: 'border-l-gray-300'} shadow-sm"
			>
				<div class="p-4">
					<div class="mb-1 text-xs text-gray-500">
						Valid from {ticket.validFrom} to {ticket.validTo}
					</div>
					<div class="flex justify-between">
						<div class="font-medium">{ticket.name}</div>
						<div class="flex gap-1">
							<span
								class="inline-flex items-center rounded-full px-2 py-1 text-xs {getStatusTextColor(
									ticket.status
								)}"
							>
								{ticket.status}
							</span>
							<Button
								onClick={() => {}}
								icon="fa-regular fa-eye"
								className="text-xs text-gray-400 hover:text-primary p-1"
							/>
							<Button
								onClick={() => {}}
								icon="fa-regular fa-trash-can"
								className="text-xs text-gray-400 hover:text-primary p-1"
							/>
						</div>
					</div>
					<div class="mb-4 mt-2 text-lg font-bold">₱{ticket.price}</div>
					<div class="space-y-1">
						<div class="flex justify-between text-xs">
							<p>Sold</p>
							<p>{ticket.sold}</p>
						</div>
						<div class="h-1.5 w-full rounded-full bg-gray-200">
							<div
								class={`${ticket.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'} h-1.5 rounded-full`}
								style="width: 70%"
							></div>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-xl font-semibold">Vouchers</h2>
		<div class="flex gap-2">
			<Button
				onClick={() => {}}
				label="Add Voucher"
				icon="fa-solid fa-plus text-sm"
				className="bg-gray-200 px-4 py-2 rounded-md"
			/>
		</div>
	</div>

	<div class="mb-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each $voucherStore as voucher}
			<div class="rounded-lg border border-gray-400 shadow-sm">
				<div class="space-y-2 p-4">
					<div class="flex items-start justify-between">
						<div class="font-medium">{voucher.id}</div>
						<div class="flex items-center text-xs">
							<span class="mr-1 h-2 w-2 rounded-full {getStatusColor(voucher.status)}"></span>
							{voucher.status}
						</div>
					</div>
					<div class="space-y-4">
						<div class="text-2xl font-bold text-red-500">{voucher.discount}</div>
						<div class="space-y-1">
							<div class="flex justify-between text-xs">
								<p class="text-gray-500">Valid until {voucher.validUntil} - {voucher.validTime}</p>
								<p>{voucher.sold}</p>
							</div>
							<div class="h-1.5 w-full rounded-full bg-gray-200">
								<div class={`${voucher.progressColor} h-1.5 rounded-full`} style="width: 70%"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
