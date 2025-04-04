<script lang="ts">
	import { Tabs } from 'bits-ui';
	import { seatGeneratorStore } from '$lib/stores/seat-generator.svelte';
	import type { SeatConfig as SeatConfigType } from '$lib/types/seat-generator';

	
	// Import components
	import ReserveToggle from '$lib/components/seat-generator/ReserveToggle.svelte';
	import SeatConfig from '$lib/components/seat-generator/SeatConfig.svelte';
	import RenameControl from '$lib/components/seat-generator/RenameControl.svelte';
	import SaveLayout from '$lib/components/seat-generator/SaveLayout.svelte';
	import QuantityWarning from '$lib/components/seat-generator/QuantityWarning.svelte';
	import PanzoomContainer from '$lib/components/seat-generator/PanzoomContainer.svelte';
	import StatusControls from '$lib/components/seat-generator/StatusControls.svelte';
	import SeatStats from '$lib/components/seat-generator/SeatStats.svelte';
	import VenueImageUpload from '$lib/components/seat-generator/VenueImageUpload.svelte';
	
	// Get server data
	let { data } = $props();
	
	// Track initialization state
	let initialized = $state(false);
	
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
</script>

<div class="mx-auto max-w-7xl p-6">
	<h1 class="mb-6 text-2xl font-bold">Event Title</h1>
	
	<!-- Tab Navigation - Using Bits UI -->
	<Tabs.Root value={seatGeneratorStore.activeTab} onValueChange={(value: string) => seatGeneratorStore.setActiveTab(value as 'ticket' | 'reserve-seating')} class="mb-8">
		<Tabs.List class="flex space-x-4 border-b border-gray-200">
			<Tabs.Trigger 
				value="ticket" 
				class="border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none data-[state=active]:border-[#DF4D60] data-[state=active]:text-[#DF4D60] data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300"
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
				class="border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none data-[state=active]:border-[#DF4D60] data-[state=active]:text-[#DF4D60] data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300"
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

