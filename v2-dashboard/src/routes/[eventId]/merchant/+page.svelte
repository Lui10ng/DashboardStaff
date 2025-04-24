<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Drawer from '$lib/components/ui/Drawer.svelte';
	import { ticketStore, voucherStore } from '$lib/stores';
	import { Tabs } from 'bits-ui';
	import { seatGeneratorStore } from '$lib/stores/seat-generator.svelte';
	import type { SeatConfig as SeatConfigType } from '$lib/types/seat-generator';
	import { fly } from 'svelte/transition';
	import { ticketDrawer, voucherDrawer } from '$lib/stores/state.svelte';
	import DatePicker from '$lib/components/ui/DatePicker.svelte';

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
	import VoucherToggle from '$lib/components/ui/VoucherToggle.svelte';
	import Ticket from '$lib/components/merchant/Ticket.svelte';
	import TicketCard from '$lib/components/merchant/TicketCard.svelte';
	import Donation from '$lib/components/merchant/Donation.svelte';
	import DropdownMenu from '$lib/components/ui/DropdownMenu.svelte';

	// Get server data
	let { data } = $props();

	const TicketdrawerState = $derived(ticketDrawer.open);
	const VoucherdrawerState = $derived(voucherDrawer.open);

	// Track initialization state
	let initialized = $state(false);

	// Add voucher toggle state
	let voucherEnabled = $state(true);

	// Toggle function for vouchers
	const toggleVouchers = () => {
		voucherEnabled = !voucherEnabled;
	};

	// Main tab navigation state
	let activeMainTab = $state('tickets');

	// Add these type definitions at the top of your script section
	type TicketStatus = 'active' | 'disabled';
	type VoucherStatus = 'active' | 'deactivated' | 'expired';

	// Fix the state declarations
	let selectedTicketStatus = $state<TicketStatus | ''>('');
	let selectedVoucherStatus = $state<VoucherStatus | ''>('');

	let isActive = $state(true);
    let isSingleUse = $state(false);
    let voucherCode = $state('');

    const generateVoucherCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        voucherCode = result;
    };
	// Add the arrays here
	const ticketFilterItems = ['active', 'disabled'] as const;
	const voucherFilterItems = ['active', 'deactivated', 'expired'] as const;

	const getTicketSelectionText = (selected: string[]) => {
        if (selected.includes('all')) {
            return 'All Tickets';
        } else if (selected.length > 1) {
            return `${selected.length} Tickets Selected`;
        } else if (selected.length === 1) {
            return selected[0];
        }
        return 'Select Tickets';
    };

	// Update the handler functions to remove Clear Filter logic
	const handleTicketFilterSelect = (event: CustomEvent<string>) => {
		selectedTicketStatus = event.detail as TicketStatus;
	};

	const handleVoucherFilterSelect = (event: CustomEvent<string>) => {
		selectedVoucherStatus = event.detail as VoucherStatus;
	};
	$effect(() => {
		ticketStore.set(data.tickets);
	});

	$effect(() => {
		voucherStore.set(data.vouchers);
	});
	
// Update the selectedTickets state declaration
let selectedTickets: string[] = $state([]);

// Update the handleTicketSelection function to handle multiple selections
const handleTicketSelection = (event: Event) => {
    const select = event.target as HTMLSelectElement;
    const selectedOptions = Array.from(select.selectedOptions).map(option => option.value);
    
    if (selectedOptions.includes('all')) {
        // If 'all' is selected, deselect other options
        selectedTickets = ['all'];
        Array.from(select.options).forEach(option => {
            if (option.value !== 'all') {
                option.selected = false;
            }
        });
    } else if (selectedOptions.length > 0) {
        // For multiple selections, deselect 'all' if it was previously selected
        const allOption = select.querySelector('option[value="all"]') as HTMLOptionElement;
        if (allOption) {
            allOption.selected = false;
        }
        // Store the selected ticket IDs
        selectedTickets = selectedOptions;
    } else {
        // If nothing is selected, default to showing all tickets
        selectedTickets = ['all'];
    }
    console.log('Selected tickets:', selectedTickets);
};
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

	const ticketBorderColors = ['black', 'green', 'yellow', 'red'];

	const getTicketColor = (index: number) => {
		return ticketBorderColors[index % ticketBorderColors.length];
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

	const handleTicketDrawer = () => {
		return (ticketDrawer.open = true);
	};
	const handleVoucherDrawer = () => {
		return (voucherDrawer.open = true);
	};
</script>

<div class="space-y-8" in:fly={{ y: -50, duration: 200 }}>
	<!-- New Merchant Header -->
	<div
		class="flex flex-col items-start justify-between border border-gray-200 bg-white px-4 py-4 md:flex-row md:items-center md:px-6"
	>
		<div class="mb-4 flex flex-col md:mb-0 md:flex-row md:items-center">
			<div class="mb-2 font-medium text-gray-800 md:mb-0">Merchant</div>
			<div class="flex items-center md:ml-2">
				<span class="mr-1 inline-block h-2 w-2 rounded-full bg-green-500"></span>
				<span class="text-xs text-gray-500">Test Mode Active</span>
			</div>
			<div class="mt-2 text-xs text-gray-500 md:mt-0 md:ml-2">
				Transactions will be logged as "test transaction".
				<a href="#contactus" class="text-blue-600 hover:underline">Contact us here</a> to enable receiving
				live payments.
			</div>
		</div>
		<button
			class="flex w-full items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500 md:w-auto"
		>
			<i class="fa-solid fa-phone mr-2"></i>
			Contact Us Here
		</button>
	</div>

	<!-- Main Tab Navigation - Using Bits UI -->
	<Tabs.Root
		value={activeMainTab}
		onValueChange={(value) => (activeMainTab = value)}
		class="w-full"
	>
		<Tabs.List class="flex space-x-4 border-b border-gray-200">
			<Tabs.Trigger
				value="tickets"
				class="border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none data-[state=active]:border-[#DF4D60] data-[state=active]:text-[#DF4D60] data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:border-gray-300 data-[state=inactive]:hover:text-gray-700"
				aria-label="Switch to Tickets tab"
			>
				<div class="flex items-center">
					<i class="fa-solid fa-ticket-simple pe-2"></i>
					Tickets
				</div>
			</Tabs.Trigger>

			<Tabs.Trigger
				value="donations"
				class="border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none data-[state=active]:border-[#DF4D60] data-[state=active]:text-[#DF4D60] data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:border-gray-300 data-[state=inactive]:hover:text-gray-700"
				aria-label="Switch to Donations tab"
			>
				<div class="flex items-center">
					<i class="fa-solid fa-hand-holding-heart pe-2"></i>
					Donations
				</div>
			</Tabs.Trigger>

			<Tabs.Trigger
				value="store"
				class="border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none data-[state=active]:border-[#DF4D60] data-[state=active]:text-[#DF4D60] data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:border-gray-300 data-[state=inactive]:hover:text-gray-700"
				aria-label="Switch to Store tab"
			>
				<div class="flex items-center">
					<i class="fa-solid fa-store pe-2"></i>
					Store
				</div>
			</Tabs.Trigger>
		</Tabs.List>

		<!-- Tickets Tab Content -->
		<Tabs.Content value="tickets" class="mt-6">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold">Tickets</h2>
				<div class="flex gap-2">
					<DropdownMenu
					icon="fa-solid fa-filter"
					className={selectedTicketStatus ? " p-2" : "p-2 rounded"}
					items={ticketFilterItems}
					alignContent="end"
					Onselect={handleTicketFilterSelect}
				  />
					<Button
						label="Add Ticket"
						icon="fa-solid fa-plus text-sm"
						className="bg-gray-200 px-4 py-2 rounded-md"
						onClick={() => handleTicketDrawer()}
					/>
					<Drawer
					isOpen={TicketdrawerState}
					contentBaseClass="bg-white p-4 space-y-4 shadow-xl w-full h-[90vh] rounded-t-xl overflow-y-auto"
					alignment="items-end"
					positionIn={{ y: 600, duration: 200 }}
					positionOut={{ y: 600, duration: 200 }}
					title="Add Ticket"
				>
				<div class="w-full">
					<p class="text-gray-500 text-sm mb-6">Please fill up your ticket information</p>
							<Tabs.Root
								value={seatGeneratorStore.activeTab}
								onValueChange={(value: string) =>
									seatGeneratorStore.setActiveTab(value as 'ticket' | 'reserve-seating')}
								class="mb-8"
							>
								<Tabs.List class="flex space-x-4 border-b border-gray-200">
									<Tabs.Trigger
										value="ticket"
										class="border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none data-[state=active]:border-[#DF4D60] data-[state=active]:text-[#DF4D60] data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:border-gray-300 data-[state=inactive]:hover:text-gray-700"
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
										class="border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none data-[state=active]:border-[#DF4D60] data-[state=active]:text-[#DF4D60] data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:border-gray-300 data-[state=inactive]:hover:text-gray-700"
										aria-label="Switch to Reserve Seating tab"
										tabindex={0}
									>
										<div class="flex items-center">
											<i class="fa-solid fa-chair pe-2"></i>
											Reserve Seating
										</div>
									</Tabs.Trigger>
								</Tabs.List>

								<Tabs.Content value="ticket">
									<div class="mx-auto max-w-xl p-8">
										<Ticket />
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
			<TicketCard />

			<!-- Voucher Toggle Section -->
			<div class="mt-4 mb-4 flex items-center justify-between">
				<div class="flex items-center gap-4">
					<h2 class="text-xl font-semibold">Vouchers</h2>
					<VoucherToggle enabled={voucherEnabled} onChange={toggleVouchers} />
				</div>
				{#if voucherEnabled}
					<div class="flex gap-2">
						<DropdownMenu
						icon="fa-solid fa-filter"
						className={selectedVoucherStatus ? "p-2" : "p-2 rounded"}
						items={voucherFilterItems}
						alignContent="end"
						Onselect={handleVoucherFilterSelect}
					  />
					  <Button
						onClick={handleVoucherDrawer}
						label="Add Voucher"
						icon="fa-solid fa-plus text-sm"
						className="bg-gray-200 px-4 py-2 rounded-md"
					/>
					</div>
				{/if}
			</div>
			<Drawer
			isOpen={VoucherdrawerState}
			contentBaseClass="bg-white p-4 space-y-6 shadow-xl w-full h-[90vh] rounded-t-xl overflow-y-auto"
			alignment="items-end"
			positionIn={{ y: 600, duration: 200 }}
			positionOut={{ y: 600, duration: 200 }}
		>
			<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
				<!-- Left Column - Form -->
				<div class="space-y-6">
					<div class="border-gray-200 pb-4">
						<h2 class="text-xl font-semibold">Add Voucher</h2>
						<p class="text-sm text-gray-500">Please fill up your voucher information</p>
					</div>
		
					<div class="space-y-4">
						<!-- Form inputs -->
						<div>
							<label for="voucher-name" class="mb-2 block text-sm">Voucher Name</label>
							<input
								type="text"
								id="voucher-name"
								placeholder="Enter voucher name"
								class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
							/>
						</div>
		
						<div>
							<label for="discount-amount" class="mb-2 block text-sm">Discount amount</label>
							<input
								type="text"
								id="discount-amount"
								placeholder="e.g., 50 or 10%"
								class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
							/>
						</div>
		
						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<label for="quantity" class="mb-2 block text-sm">Quantity</label>
								<input
									type="number"
									id="quantity"
									placeholder="Enter quantity"
									class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
								/>
							</div>
							<div>
								<label for="limit-bulk-quantity" class="mb-2 block text-sm">Limit Bulk Quantity</label>
								<input
									type="number"
									id="limit-bulk-quantity"
									placeholder="Enter quantity"
									class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
								/>
							</div>
						</div>
		
						<div>
							<label for="expiry" class="mb-2 block text-sm">Expiry</label>
							<DatePicker
								name="expiry"
								className="rounded-md border-none bg-[#F8F9FC] p-3 text-sm w-fit"
							/>
						</div>
		
						<div>
							<label for="select-ticket" class="mb-2 flex text-sm">Select Ticket</label>
							<DropdownMenu
								buttonText={getTicketSelectionText(selectedTickets)}
								className="w-full justify-between rounded-md border border-gray-200 bg-white px-4 py-2 text-sm hover:border-[#DF4D60]"
								items={['all', ...$ticketStore.map(ticket => ticket.name)]}
								multiple={true}
								alignContent="start"
								on:select={(event) => {
									const selected = event.detail;
									if (selected.includes('all')) {
										selectedTickets = ['all'];
									} else {
										selectedTickets = selected;
									}
								}}
							/>
						</div>
		
						<!-- Toggles and Helper Text -->
						<div class="mt-4 space-y-4">
							<!-- Toggles -->
							<div class="flex flex-col gap-4 sm:flex-row sm:gap-8">
								<!-- Active Voucher -->
								<div class="flex items-center justify-between sm:justify-start sm:space-x-4">
									<label for="activevoucher" class="text-sm">Active Voucher</label>
									<div class="relative inline-flex items-center">
										<input
											type="checkbox"
											bind:checked={isActive}
											class="peer sr-only"
											id="active-toggle"
										/>
										<label
											for="active-toggle"
											class="peer h-6 w-11 cursor-pointer rounded-full bg-gray-200 transition-colors hover:bg-gray-300 peer-checked:bg-[#DF4D60] peer-checked:hover:bg-[#DF4D60]/90"
										>
											<span class="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-all peer-checked:left-[22px]"></span>
										</label>
									</div>
								</div>
		
								<!-- Single Use -->
								<div class="flex items-center justify-between sm:justify-start sm:space-x-4">
									<label for="singleuse" class="text-sm">Single Use</label>
									<div class="relative inline-flex items-center">
										<input
											type="checkbox"
											bind:checked={isSingleUse}
											class="peer sr-only"
											id="single-use-toggle"
										/>
										<label
											for="single-use-toggle"
											class="peer h-6 w-11 cursor-pointer rounded-full bg-gray-200 transition-colors hover:bg-gray-300 peer-checked:bg-[#DF4D60] peer-checked:hover:bg-[#DF4D60]/90"
										>
											<span class="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-all peer-checked:left-[22px]" ></span>
										</label>
									</div>
								</div>
							</div>
		
							<!-- Helper Text -->
							<div class="space-y-1">
								<p class="text-xs text-gray-500">Single use vouchers will generate a unique voucher that can only be used once.</p>
								<p class="text-xs text-gray-500">If you disable "Single Use", the voucher can only be used based on your defined quantity.</p>
								<p class="text-xs text-gray-500">Entering "100%" discount will give the voucher user zero payment of their ticket while other values will entail a minimum of 100PHP transaction, thus discounts will be adjusted.</p>
							</div>
		
							<!-- Voucher Code -->
							<div class="space-y-2">
								<label for="voucher-code" class="mb-2 block text-sm">Voucher Code</label>
								<div class="flex flex-col gap-2 sm:flex-row">
									<div class="relative ">
										<select 
											id="voucher-code"
											bind:value={voucherCode}
											class="w-full appearance-none rounded-md border-none bg-[#F8F9FC] p-3 pr-8 text-sm"
										>
											<option value="QGN342">QGN342</option>
										</select>
										<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
											<i class="fa-solid fa-chevron-down text-gray-400"></i>
										</div>
									</div>
									<button
										aria-labelledby="voucher-code"
										Onclick={() => {
											navigator.clipboard.writeText(voucherCode);
										}}
										class="flex w-full items-center justify-center rounded-md border border-gray-200 px-3 py-2 hover:bg-gray-50 sm:w-auto sm:py-0"
										title="Copy voucher code"
									>
										<i class="fa-regular fa-copy text-gray-600"></i>
									</button>
								</div>
		
								<!-- Action Buttons -->
								<div class="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-start">
									<button
										class="w-full rounded-md bg-[#DF4D60] px-4 py-2 text-sm text-white hover:bg-[#DF4D60]/90 sm:w-auto"
										Onclick={() => {
											voucherDrawer.open = false;
										}}
									>
										Add Voucher
									</button>
									<button
										class="w-full rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 sm:w-auto"
										Onclick={() => {
											voucherDrawer.open = false;
										}}
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			<!-- Replace the preview section with this updated code -->

			<div class="space-y-6">
				<h3 class="text-lg font-medium">Preview</h3>
				<div class="grid grid-cols-2 gap-4">
					{#if selectedTickets.includes('all')}
						{#each $ticketStore as ticket, index}
                <div 
                    class="rounded-lg border border-l-8 border-gray-400 bg-white p-4 shadow-sm"
                    style="border-left-color: {getTicketColor(index)};"
                >
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium">{ticket.name}</span>
                        <span class="inline-flex items-center rounded-full px-2 py-1 text-xs {getStatusTextColor(ticket.status)}">
                            <span class="mr-1 h-2 w-2 rounded-full {getStatusColor(ticket.status)}"></span>
                            {ticket.status || 'Active'}
                        </span>
                    </div>
                    <div class="mt-4 space-y-2">
                        <div class="text-2xl font-bold text-red-500">
                            {(document.getElementById('discount-amount') as HTMLInputElement)?.value || '-50%'}
                        </div>
                        <div class="flex items-center justify-between text-xs text-gray-500">
                            <span>Valid from {ticket.validFrom} to {ticket.validTo}</span>
                            <span>{(document.getElementById('quantity') as HTMLInputElement)?.value || '0'}/{(document.getElementById('limit-bulk-quantity') as HTMLInputElement)?.value || '50'}</span>
                        </div>
                        <div class="h-1.5 w-full rounded-full bg-gray-200">
                            <div 
                                class="h-1.5 rounded-full"
                                style="width: 30%; background-color: {getTicketColor(index)};"
                            ></div>
                        </div>
                    </div>
                </div>
            {/each}
        {:else}
            <!-- Show only the selected ticket -->
            {#each $ticketStore.filter(ticket => selectedTickets.includes(ticket.name)) as ticket, index}
			<div 
                    class="rounded-lg border border-l-8 border-gray-400 bg-white p-4 shadow-sm"
                    style="border-left-color: {getTicketColor(index)};"
                >
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium">{ticket.name}</span>
                        <span class="inline-flex items-center rounded-full px-2 py-1 text-xs {getStatusTextColor(ticket.status)}">
                            <span class="mr-1 h-2 w-2 rounded-full {getStatusColor(ticket.status)}"></span>
                            {ticket.status || 'Active'}
                        </span>
                    </div>
                    <div class="mt-4 space-y-2">
                        <div class="text-2xl font-bold text-red-500">
                            {(document.getElementById('discount-amount') as HTMLInputElement)?.value || '-50%'}
                        </div>
                        <div class="flex items-center justify-between text-xs text-gray-500">
                            <span>Valid from {ticket.validFrom} to {ticket.validTo}</span>
                            <span>{(document.getElementById('quantity') as HTMLInputElement)?.value || '0'}/{(document.getElementById('limit-bulk-quantity') as HTMLInputElement)?.value || '50'}</span>
                        </div>
                        <div class="h-1.5 w-full rounded-full bg-gray-200">
                            <div 
                                class="h-1.5 rounded-full"
                                style="width: 30%; background-color: {getTicketColor(index)};"
                            ></div>
                        </div>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>


		</Drawer>
			{#if voucherEnabled}
				<div class="block">
					<!-- Mobile Horizontal Scrolling Container (visible on small screens) -->
					<div class="flex gap-4 overflow-x-auto pb-4 sm:hidden">
						{#each $voucherStore as voucher}
							<div class="min-w-[260px] flex-shrink-0 rounded-lg border border-gray-400 shadow-sm">
								<div class="space-y-2 p-4">
									<div class="flex items-start justify-between">
										<div class="font-medium">{voucher.id}</div>
										<div class="flex items-center text-xs">
											<span class="mr-1 h-2 w-2 rounded-full {getStatusColor(voucher.status)}"
											></span>
											{voucher.status}
										</div>
									</div>
									<div class="space-y-4">
										<div class="text-2xl font-bold text-red-500">{voucher.discount}</div>
										<div class="space-y-1">
											<div class="flex justify-between text-xs">
												<p class="text-gray-500">
													Valid until {voucher.validUntil} - {voucher.validTime}
												</p>
												<p>{voucher.sold}</p>
											</div>
											<div class="h-1.5 w-full rounded-full bg-gray-200">
												<div
													class={`${voucher.progressColor} h-1.5 rounded-full`}
													style="width: 70%"
												></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>

					<!-- Desktop Grid Layout (hidden on mobile) -->
					<div class="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
						{#each $voucherStore as voucher}
							<div class="rounded-lg border border-gray-400 shadow-sm">
								<div class="space-y-2 p-4">
									<div class="flex items-start justify-between">
										<div class="font-medium">{voucher.id}</div>
										<div class="flex items-center text-xs">
											<span class="mr-1 h-2 w-2 rounded-full {getStatusColor(voucher.status)}"
											></span>
											{voucher.status}
										</div>
									</div>
									<div class="space-y-4">
										<div class="text-2xl font-bold text-red-500">{voucher.discount}</div>
										<div class="space-y-1">
											<div class="flex justify-between text-xs">
												<p class="text-gray-500">
													Valid until {voucher.validUntil} - {voucher.validTime}
												</p>
												<p>{voucher.sold}</p>
											</div>
											<div class="h-1.5 w-full rounded-full bg-gray-200">
												<div
													class={`${voucher.progressColor} h-1.5 rounded-full`}
													style="width: 70%"
												></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</Tabs.Content>

		<!-- Donations Tab Content -->
		<Tabs.Content value="donations" class="mt-6">
			<Donation />
		</Tabs.Content>

		<!-- Store Tab Content -->
		<Tabs.Content value="store" class="mt-6">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold">Store</h2>
				<div class="flex gap-2">
					<Button
						onClick={() => {}}
						label="Add Product"
						icon="fa-solid fa-plus text-sm"
						className="bg-gray-200 px-4 py-2 rounded-md"
					/>
				</div>
			</div>

			<div class="rounded-lg border border-gray-200 bg-white p-6">
				<div class="flex flex-col items-center justify-center py-10">
					<i class="fa-solid fa-store mb-4 text-6xl text-gray-300"></i>
					<h3 class="mb-2 text-xl font-medium text-gray-700">No Products</h3>
					<p class="mb-6 max-w-md text-center text-gray-500">
						You haven't added any products to your store yet. Add some products to start selling!
					</p>
					<button
						class="flex items-center rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-500"
					>
						<i class="fa-solid fa-plus mr-2"></i>
						Add First Product
					</button>
				</div>
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>