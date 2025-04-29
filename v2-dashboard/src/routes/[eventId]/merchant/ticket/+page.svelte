<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Drawer from '$lib/components/ui/Drawer.svelte';
	import DropdownMenu from '$lib/components/ui/DropdownMenu.svelte';
	import { ticketDrawer, voucherDrawer, editTicketDrawer } from '$lib/stores/state.svelte';
	import type { TicketProps, TicketStatus, PromotionProps, VoucherStatus } from '$lib/types';
	import { Tabs } from 'bits-ui';
	import { seatGeneratorStore } from '$lib/stores/seat-generator.svelte';
	import type { SeatConfig as SeatConfigType } from '$lib/types/seat-generator';
	import { superForm } from 'sveltekit-superforms';
	import DatePicker from '$lib/components/ui/DatePicker.svelte';
	import PaymentToggle from '$lib/components/ui/PaymentToggle.svelte';
	import SeatConfig from '$lib/components/seat-generator/SeatConfig.svelte';
	import RenameControl from '$lib/components/seat-generator/RenameControl.svelte';
	import SaveLayout from '$lib/components/seat-generator/SaveLayout.svelte';
	import ReserveToggle from '$lib/components/seat-generator/ReserveToggle.svelte';
	import QuantityWarning from '$lib/components/seat-generator/QuantityWarning.svelte';
	import VenueImageUpload from '$lib/components/seat-generator/VenueImageUpload.svelte';
	import PanzoomContainer from '$lib/components/seat-generator/PanzoomContainer.svelte';
	import StatusControls from '$lib/components/seat-generator/StatusControls.svelte';
	import SeatStats from '$lib/components/seat-generator/SeatStats.svelte';
	import { formatDate } from '$lib/utils/datetime.js';
	import VoucherToggle from '$lib/components/ui/VoucherToggle.svelte';

	let { data } = $props();

	const ticketList: TicketProps[] = $derived(data.ticketData);
	const voucherList: PromotionProps[] = $derived(data.voucherData);

	const {
		form: ticketForm,
		errors: ticketErrors,
		enhance: ticketEnhance,
		delayed: ticketDelayed,
		message: ticketMessage
	} = superForm(data.ticketForm);

	const {
		form: voucherForm,
		errors: voucherErrors,
		enhance: voucherEnhance,
		delayed: voucherDelayed,
		message: voucherMessage
	} = superForm(data.voucherForm);

	ticketMessage.subscribe(async (msg) => {
		if (msg && msg.success) {
			ticketDrawer.open = false;
			editTicketDrawer.open = false;
		}
	});

	voucherMessage.subscribe(async (msg) => {
		if (msg && msg.success) {
			voucherDrawer.open = false;
		}
	});

	const TicketdrawerState = $derived(ticketDrawer.open);
	const VoucherdrawerState = $derived(voucherDrawer.open);

	// Update the selectedTickets state declaration
	let selectedTickets: string[] = $state([]);

	$inspect('selectedTickets: , ', selectedTickets);

	// Add the arrays here
	const ticketFilterItems = ['active', 'disabled'] as const;
	const voucherFilterItems = ['active', 'deactivated', 'expired'] as const;

	// Track initialization state
	let initialized = $state(false);
	let isActivePayment = $state(false);
	const colors = ['#0066FF', '#F7D002', '#0FBA81', '#4B7B3B', '#DF4D60'];
	let selectedColor = $state('#0FBA81');

	let isActive = $state(true);
	let isSingleUse = $state(false);
	let voucherCode = $state('');

	// Fix the state declarations
	let selectedTicketStatus = $state<TicketStatus | ''>('');
	let selectedVoucherStatus = $state<VoucherStatus | ''>('');
	let selectedTicket = $state<TicketProps>();

	// Add voucher toggle state
	let voucherEnabled = $state(true);

	let discountType = $state('percentage'); // default selected
	// you can change this or make it dynamic

	// Toggle function for vouchers
	const toggleVouchers = () => {
		voucherEnabled = !voucherEnabled;
	};

	const handleTicketDrawer = () => {
		return (ticketDrawer.open = true);
	};
	const handleVoucherDrawer = () => {
		return (voucherDrawer.open = true);
	};

	// Update the handler functions to remove Clear Filter logic
	const handleTicketFilterSelect = (event: CustomEvent<string>) => {
		selectedTicketStatus = event.detail as TicketStatus;
	};

	const handleTogglePayment = (value: boolean) => {
		isActivePayment = value;
	};

	const getStatusColor = (status: string) => {
		if (status === 'active') return 'bg-green-500';
		else if (status === 'expired') return 'bg-red-500';
		else if (status === 'deactivated') return 'bg-gray-500';
		else return 'bg-gray-400';
	};

	const getStatusTextColor = (status: string) => {
		if (status === 'active') return 'text-green-500';
		if (status === 'expired') return 'text-red-500';
		if (status === 'inactive') return 'text-gray-500';
		return 'text-gray-400';
	};

	const handleVoucherFilterSelect = (event: CustomEvent<string>) => {
		selectedVoucherStatus = event.detail as VoucherStatus;
	};

	const handleEditTicket = (ticket: TicketProps) => {
		selectedTicket = ticket;
		editTicketDrawer.open = true;
	};

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

<div>
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-xl font-semibold">Tickets</h2>
		<div class="flex">
			<DropdownMenu
				icon="fa-solid fa-filter"
				className={selectedTicketStatus ? ' p-2' : 'p-2 rounded'}
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
					<p class="mb-6 text-sm text-gray-500">Please fill up your ticket information</p>
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

						<Tabs.Content value="ticket">
							<form action="?/createTicket" method="POST" use:ticketEnhance>
								<div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div class="space-y-6">
										<div>
											<label for="ticket" class="mb-2 block text-sm">Ticket Name</label>
											<input
												type="text"
												name="ticketName"
												placeholder="Enter ticket name"
												class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
											/>
											{#if $ticketErrors.ticketName}
												<p class="text-primary text-sm">
													{$ticketErrors.ticketName}
												</p>
											{/if}
										</div>
										<div>
											<label for="price" class="mb-2 block text-sm">Price</label>
											<input
												type="number"
												name="price"
												placeholder="Enter ticket price"
												class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
											/>
											{#if $ticketErrors.price}
												<p class="text-primary text-sm">
													{$ticketErrors.price}
												</p>
											{/if}
										</div>
										<div>
											<label for="validfrom" class="mb-2 block text-sm"
												>Valid from (DD/MM/YYYY)</label
											>
											<DatePicker
												name="validfrom"
												className="h-input rounded-input  flex w-full select-none items-center border px-2 py-4 text-gray-500"
											/>
											{#if $ticketErrors.validfrom}
												<p class="text-primary text-sm">
													{$ticketErrors.validfrom}
												</p>
											{/if}
										</div>
										<div>
											<label for="valid-in" class="mb-2 block text-sm">Valid to (DD/MM/YYYY)</label>
											<DatePicker
												name="validto"
												className="h-input rounded-input  flex w-full select-none items-center border px-2 py-4 text-gray-500"
											/>
											{#if $ticketErrors.validto}
												<p class="text-primary text-sm">
													{$ticketErrors.validto}
												</p>
											{/if}
										</div>
									</div>
									<div class="space-y-6">
										<div>
											<label for="quantity" class="mb-2 block text-sm"> Available For Sale</label>
											<input
												type="number"
												name="quantity"
												placeholder="Enter quantity"
												class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
											/>
											{#if $ticketErrors.quantity}
												<p class="text-primary text-sm">
													{$ticketErrors.quantity}
												</p>
											{/if}
										</div>
										<div>
											<label for="quantity" class="mb-2 block text-sm">Min Order Quantity</label>
											<input
												type="number"
												name="minOrderQuantity"
												placeholder="Enter min quantity"
												class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
											/>
											{#if $ticketErrors.minOrderQuantity}
												<p class="text-primary text-sm">
													{$ticketErrors.minOrderQuantity}
												</p>
											{/if}
										</div>
										<div>
											<label for="quantity" class="mb-2 block text-sm">Max Order Quantity</label>
											<input
												type="number"
												name="maxOrderQuantity"
												placeholder="Enter max quantity"
												class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
											/>
											{#if $ticketErrors.maxOrderQuantity}
												<p class="text-primary text-sm">
													{$ticketErrors.maxOrderQuantity}
												</p>
											{/if}
										</div>

										<div>
											<label for="activePayment" class="mb-2 block text-sm">Active payment</label>
											<PaymentToggle value={isActivePayment} OnChange={handleTogglePayment} />
										</div>
									</div>
								</div>

								<div>
									<label for="Label-color" class="my-4 block text-sm">Label Color</label>
									<div
										class="mb-3 rounded-md p-3 text-center text-white"
										style="background-color: {selectedColor}"
									>
										{selectedColor}
									</div>
									<div class="flex gap-2">
										{#each colors as color}
											<button
												type="button"
												class="h-8 w-8 rounded-full border-2 transition-all"
												style="background-color: {color}; border-color: {selectedColor === color
													? 'black'
													: 'transparent'}"
												onclick={() => (selectedColor = color)}
												aria-label="Select color {color}"
											></button>
										{/each}

										<label
											class="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-gray-500"
										>
											<input
												class="absolute right-0 top-0 hidden"
												type="color"
												name="color"
												bind:value={selectedColor}
											/>
											+
										</label>
									</div>

									{#if $ticketErrors.color}
										<p class="text-primary text-sm">
											{$ticketErrors.color}
										</p>
									{/if}
								</div>

								<div class="mt-8 grid grid-cols-2 gap-4">
									<Button
										onClick={() => {}}
										type="submit"
										label="Save Ticket"
										className="bg-[#DF4D60] text-white p-2 rounded-md"
									/>
									<Button
										onClick={() => {
											ticketDrawer.open = false;
										}}
										label="Cancel"
										className="border border-gray-300 text-gray-700 p-2 rounded-md"
									/>
								</div>
							</form>
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
			<Drawer
				isOpen={editTicketDrawer.open}
				contentBaseClass="bg-white p-4 space-y-4 shadow-xl w-full h-[90vh] rounded-t-xl overflow-y-auto"
				alignment="items-end"
				positionIn={{ y: 600, duration: 200 }}
				positionOut={{ y: 600, duration: 200 }}
			>
				<div class="space-y-6">
					{#if selectedTicket}
						<div class="border-gray-200 pb-4">
							<h2 class="text-xl font-semibold">{selectedTicket.name}</h2>
							<p class="text-sm text-gray-500">Edit Ticket Details</p>
						</div>

						<div class="space-y-6">
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

								<Tabs.Content value="ticket">
									<form action="?/updateTicket" method="POST" use:ticketEnhance>
										<input type="hidden" name="id" value={selectedTicket.id} />
										<div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
											<div class="space-y-6">
												<div>
													<label for="ticket" class="mb-2 block text-sm">Ticket Name</label>
													<input
														type="text"
														name="ticketName"
														value={selectedTicket.name}
														placeholder="Enter ticket name"
														class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
													/>
													{#if $ticketErrors.ticketName}
														<p class="text-primary text-sm">
															{$ticketErrors.ticketName}
														</p>
													{/if}
												</div>
												<div>
													<label for="price" class="mb-2 block text-sm">Price</label>
													<input
														type="number"
														name="price"
														value={selectedTicket.price}
														placeholder="Enter ticket price"
														class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
													/>
													{#if $ticketErrors.price}
														<p class="text-primary text-sm">
															{$ticketErrors.price}
														</p>
													{/if}
												</div>
												<div>
													<label for="validfrom" class="mb-2 block text-sm"
														>Valid from (DD/MM/YYYY)</label
													>
													<DatePicker
														name="validfrom"
														className="h-input rounded-input  flex w-full select-none items-center border px-2 py-4 text-gray-500"
													/>
													{#if $ticketErrors.validfrom}
														<p class="text-primary text-sm">
															{$ticketErrors.validfrom}
														</p>
													{/if}
												</div>
												<div>
													<label for="valid-in" class="mb-2 block text-sm"
														>Valid to (DD/MM/YYYY)</label
													>
													<DatePicker
														name="validto"
														className="h-input rounded-input  flex w-full select-none items-center border px-2 py-4 text-gray-500"
													/>
													{#if $ticketErrors.validto}
														<p class="text-primary text-sm">
															{$ticketErrors.validto}
														</p>
													{/if}
												</div>
											</div>
											<div class="space-y-6">
												<div>
													<label for="quantity" class="mb-2 block text-sm">
														Available For Sale</label
													>
													<input
														type="number"
														name="quantity"
														value={selectedTicket.quantityAvailable}
														placeholder="Enter quantity"
														class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
													/>
													{#if $ticketErrors.quantity}
														<p class="text-primary text-sm">
															{$ticketErrors.quantity}
														</p>
													{/if}
												</div>
												<div>
													<label for="quantity" class="mb-2 block text-sm">Min Order Quantity</label
													>
													<input
														type="number"
														name="minOrderQuantity"
														value={selectedTicket.minOrderQuantity}
														placeholder="Enter min quantity"
														class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
													/>
													{#if $ticketErrors.minOrderQuantity}
														<p class="text-primary text-sm">
															{$ticketErrors.minOrderQuantity}
														</p>
													{/if}
												</div>
												<div>
													<label for="quantity" class="mb-2 block text-sm">Max Order Quantity</label
													>
													<input
														type="number"
														name="maxOrderQuantity"
														value={selectedTicket.maxOrderQuantity}
														placeholder="Enter max quantity"
														class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
													/>
													{#if $ticketErrors.maxOrderQuantity}
														<p class="text-primary text-sm">
															{$ticketErrors.maxOrderQuantity}
														</p>
													{/if}
												</div>

												<div>
													<label for="activePayment" class="mb-2 block text-sm"
														>Active payment</label
													>
													<PaymentToggle value={isActivePayment} OnChange={handleTogglePayment} />
												</div>
											</div>
										</div>

										<div>
											<label for="Label-color" class="my-4 block text-sm">Label Color</label>
											<div
												class="mb-3 rounded-md p-3 text-center text-white"
												style="background-color: {selectedColor}"
											>
												{selectedColor}
											</div>
											<div class="flex gap-2">
												{#each colors as color}
													<button
														type="button"
														class="h-8 w-8 rounded-full border-2 transition-all"
														style="background-color: {color}; border-color: {selectedColor === color
															? 'black'
															: 'transparent'}"
														onclick={() => (selectedColor = color)}
														aria-label="Select color {color}"
													></button>
												{/each}

												<label
													class="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-gray-500"
												>
													<input
														class="absolute right-0 top-0 hidden"
														type="color"
														name="color"
														bind:value={selectedColor}
													/>
													+
												</label>
											</div>

											{#if $ticketErrors.color}
												<p class="text-primary text-sm">
													{$ticketErrors.color}
												</p>
											{/if}
										</div>

										<div class="mt-8 grid grid-cols-2 gap-4">
											<Button
												onClick={() => {}}
												type="submit"
												label="Save Ticket"
												className="bg-[#DF4D60] text-white p-2 rounded-md"
											/>
											<Button
												onClick={() => {
													editTicketDrawer.open = false;
												}}
												label="Cancel"
												className="border border-gray-300 text-gray-700 p-2 rounded-md"
											/>
										</div>
									</form>
								</Tabs.Content>

								<Tabs.Content value="reserve-seating">
									<div class="flex flex-col space-y-6">
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
					{/if}
				</div>
			</Drawer>
		</div>
	</div>

	<div class="flex gap-4 overflow-x-auto pb-4">
		{#if ticketList}
			{#each ticketList as ticket, index}
				<div
					class="border-l-10 min-w-[298px] flex-shrink-0 rounded-lg border border-gray-400"
					style="border-left-color: {ticket.color};"
				>
					<div class="p-4">
						<div class="mb-1 text-xs text-gray-500">
							Valid from {formatDate(ticket.salesStart)} to {formatDate(ticket.salesEnd)}
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
									onClick={() => handleEditTicket(ticket)}
									icon="fa-solid fa-pen-to-square"
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
								<p>0/{ticket.quantityAvailable} Sold</p>
							</div>
							<div class="h-1.5 w-full rounded-full bg-gray-200">
								<div
									class="h-1.5 rounded-full"
									style="width: 0%; background-color: {ticket.color};"
								></div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<!-- Voucher Toggle Section -->
	<div class="mb-4 mt-4 flex items-center justify-between">
		<div class="flex items-center gap-4">
			<h2 class="text-xl font-semibold">Vouchers</h2>
			<VoucherToggle enabled={voucherEnabled} onChange={toggleVouchers} />
		</div>
		{#if voucherEnabled}
			<div class="flex">
				<DropdownMenu
					icon="fa-solid fa-filter"
					className={selectedVoucherStatus ? 'p-2' : 'p-2 rounded'}
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

				<form action="?/createVoucher" method="POST" use:voucherEnhance class="space-y-4">
					<!-- Form inputs -->

					<div>
						<label for="code" class="mb-2 block text-sm">Voucher Code</label>
						<input
							type="text"
							name="code"
							placeholder="Enter voucher code"
							class="w-full rounded-md border-none bg-gray-100 p-3 uppercase"
						/>
						{#if $voucherErrors.code}
							<p class="text-primary text-sm">
								{$voucherErrors.code}
							</p>
						{/if}
					</div>
					<div>
						<label for="code" class="mb-2 block text-sm"
							>Description <span class="text-gray-500">(optional)</span></label
						>
						<input
							type="text"
							name="description"
							placeholder="Enter description"
							class="w-full rounded-md border-none bg-gray-100 p-3"
						/>
						{#if $voucherErrors.description}
							<p class="text-primary text-sm">
								{$voucherErrors.description}
							</p>
						{/if}
					</div>

					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label for="discountType" class="mb-2 block text-sm">Type</label>
							<select
								bind:value={discountType}
								name="discountType"
								class="w-full rounded-md border-none bg-gray-100 p-3"
							>
								<option value="percentage">Percentage Off (%)</option>
								<option value="fixed_amount">Fixed Amount Off</option>
							</select>
							{#if $voucherErrors.discountType}
								<p class="text-primary text-sm">
									{$voucherErrors.discountType}
								</p>
							{/if}
						</div>

						<div>
							<label for="discountValue" class="mb-2 block text-sm">Discount amount</label>
							<div class="relative w-full">
								{#if discountType === 'fixed_amount'}
									<select
										name="currency"
										class="absolute left-2 top-1/2 -translate-y-1/2 rounded-md bg-gray-100 py-1 pl-1 pr-6 text-sm font-medium"
									>
										<option value="PHP">PHP</option>
										<option value="USD">USD</option>
										<option value="EUR">EUR</option>
									</select>
								{/if}
								<input
									type="number"
									name="discountValue"
									placeholder="e.g., 50 or 10%"
									class="w-full rounded-md border-none bg-gray-100 p-3 {discountType ===
									'fixed_amount'
										? 'pl-24'
										: ''}"
								/>
							</div>
							{#if $voucherErrors.discountValue}
								<p class="text-primary text-sm">
									{$voucherErrors.discountValue}
								</p>
							{/if}
						</div>
					</div>

					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label for="validFrom" class="mb-2 block text-sm">Valid From</label>
							<DatePicker
								name="validFrom"
								className="h-input rounded-input  flex w-full select-none items-center border px-2 py-4 text-gray-500"
							/>
							{#if $voucherErrors.validFrom}
								<p class="text-primary text-sm">
									{$voucherErrors.validFrom}
								</p>
							{/if}
						</div>
						<div>
							<label for="validUntil" class="mb-2 block text-sm">Valid Until</label>
							<DatePicker
								name="validUntil"
								className="h-input rounded-input  flex w-full select-none items-center border px-2 py-4 text-gray-500"
							/>
							{#if $voucherErrors.validUntil}
								<p class="text-primary text-sm">
									{$voucherErrors.validUntil}
								</p>
							{/if}
						</div>
					</div>

					<div>
						<label for="quantity" class="mb-2 block text-sm">Quantity</label>
						<input
							type="number"
							name="quantity"
							placeholder="Enter quantity"
							class="w-full rounded-md border-none bg-gray-100 p-3"
						/>
						{#if $voucherErrors.quantity}
							<p class="text-primary text-sm">
								{$voucherErrors.quantity}
							</p>
						{/if}
					</div>

					<div>
						<label for="code" class="mb-2 block text-sm">Minimum Order Amount</label>
						<input
							type="text"
							name="minOrderAmount"
							placeholder="Enter minimum order"
							class="w-full rounded-md border-none bg-gray-100 p-3"
						/>
						{#if $voucherErrors.minOrderAmount}
							<p class="text-primary text-sm">
								{$voucherErrors.minOrderAmount}
							</p>
						{/if}
					</div>

					<div>
						<label for="select-ticket" class="mb-2 flex text-sm">Select Ticket</label>
						<DropdownMenu
							buttonText={getTicketSelectionText(selectedTickets)}
							className="w-full justify-between rounded-md border border-gray-200 bg-white px-4 py-2 text-sm hover:border-[#DF4D60]"
							items={['all', ...ticketList.map((ticket) => ({ id: ticket.id, name: ticket.name }))]}
							multiple={true}
							alignContent="start"
							on:select={(event) => {
								const selected = event.detail;
								console.log('selected', selected);

								if (selected.includes('all')) {
									selectedTickets = ['all'];
								} else {
									selectedTickets = selected;
								}
							}}
						/>
					</div>
					<div class="sm:hidden">
						<h3 class="text-lg font-medium">Preview</h3>
						<div class="flex gap-4 overflow-x-auto pb-4">
							{#if selectedTickets.includes('all')}
								{#each ticketList as ticket, index}
									<div
										class="border-l-10 min-w-[298px] flex-shrink-0 rounded-lg border border-gray-400"
										style="border-left-color: {ticket.color};"
									>
										<div class="p-4">
											<div class="mb-1 text-xs text-gray-500">
												Valid from {formatDate(ticket.salesStart)} to {formatDate(ticket.salesEnd)}
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
														onClick={() => handleEditTicket(ticket)}
														icon="fa-solid fa-pen-to-square"
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
													<p>0/{ticket.quantityAvailable} Sold</p>
												</div>
												<div class="h-1.5 w-full rounded-full bg-gray-200">
													<div
														class="h-1.5 rounded-full"
														style="width: 0%; background-color: {ticket.color};"
													></div>
												</div>
											</div>
										</div>
									</div>
								{/each}
							{:else}
								<!-- Show only the selected ticket -->
								{#each ticketList.filter( (ticket) => selectedTickets.includes(ticket.name) ) as ticket, index}
									<div
										class="border-l-10 min-w-[298px] flex-shrink-0 rounded-lg border border-gray-400"
										style="border-left-color: {ticket.color};"
									>
										<div class="p-4">
											<div class="mb-1 text-xs text-gray-500">
												Valid from {formatDate(ticket.salesStart)} to {formatDate(ticket.salesEnd)}
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
														onClick={() => handleEditTicket(ticket)}
														icon="fa-solid fa-pen-to-square"
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
													<p>0/{ticket.quantityAvailable} Sold</p>
												</div>
												<div class="h-1.5 w-full rounded-full bg-gray-200">
													<div
														class="h-1.5 rounded-full"
														style="width: 0%; background-color: {ticket.color};"
													></div>
												</div>
											</div>
										</div>
									</div>
								{/each}
							{/if}
						</div>
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
										<span
											class="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-all peer-checked:left-[22px]"
										></span>
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
										<span
											class="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-all peer-checked:left-[22px]"
										></span>
									</label>
								</div>
							</div>
						</div>

						<!-- Helper Text -->
						<div class="space-y-1">
							<p class="text-xs text-gray-500">
								Single use vouchers will generate a unique voucher that can only be used once.
							</p>
							<p class="text-xs text-gray-500">
								If you disable "Single Use", the voucher can only be used based on your defined
								quantity.
							</p>
							<p class="text-xs text-gray-500">
								Entering "100%" discount will give the voucher user zero payment of their ticket
								while other values will entail a minimum of 100PHP transaction, thus discounts will
								be adjusted.
							</p>
						</div>

						<!-- Voucher Code -->
						<div class="space-y-2">
							<!-- Action Buttons -->
							<div class="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-start">
								<Button
									type="submit"
									onClick={() => {}}
									label="Add Voucher"
									className="w-full rounded-md bg-primary px-4 py-2  text-white  sm:w-auto"
								/>
								<Button
									onClick={() => {
										voucherDrawer.open = false;
									}}
									label="Cancel"
									className="w-full rounded-md border border-gray-200 px-4 py-2  text-gray-700 hover:bg-gray-50 sm:w-auto"
								/>
							</div>
						</div>
					</div>
				</form>
			</div>
			<!-- Replace the preview section with this updated code -->

			<div class="space-y-6">
				<div class=" hidden lg:block">
					<h3 class="text-lg font-medium">Preview</h3>
					<div class="flex-wrap gap-4 sm:grid sm:grid-cols-2">
						{#if selectedTickets.includes('all')}
							{#each ticketList as ticket, index}
								<div
									class="border-l-10 min-w-[298px] flex-shrink-0 rounded-lg border border-gray-400"
									style="border-left-color: {ticket.color};"
								>
									<div class="p-4">
										<div class="mb-1 text-xs text-gray-500">
											Valid from {formatDate(ticket.salesStart)} to {formatDate(ticket.salesEnd)}
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
											</div>
										</div>
										<div class="mb-4 mt-2 text-lg font-bold">₱{ticket.price}</div>
										<div class="space-y-1">
											<div class="flex justify-between text-xs">
												<p>0/{ticket.quantityAvailable} Sold</p>
											</div>
											<div class="h-1.5 w-full rounded-full bg-gray-200">
												<div
													class="h-1.5 rounded-full"
													style="width: 0%; background-color: {ticket.color};"
												></div>
											</div>
										</div>
									</div>
								</div>
							{/each}
						{:else}
							<!-- Show only the selected ticket -->
							{#each ticketList.filter( (ticket) => selectedTickets.includes(ticket.name) ) as ticket, index}
								<div
									class="border-l-10 min-w-[298px] flex-shrink-0 rounded-lg border border-gray-400"
									style="border-left-color: {ticket.color};"
								>
									<div class="p-4">
										<div class="mb-1 text-xs text-gray-500">
											Valid from {formatDate(ticket.salesStart)} to {formatDate(ticket.salesEnd)}
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
													onClick={() => handleEditTicket(ticket)}
													icon="fa-solid fa-pen-to-square"
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
												<p>0/{ticket.quantityAvailable} Sold</p>
											</div>
											<div class="h-1.5 w-full rounded-full bg-gray-200">
												<div
													class="h-1.5 rounded-full"
													style="width: 0%; background-color: {ticket.color};"
												></div>
											</div>
										</div>
									</div>
								</div>
							{/each}
						{/if}
					</div>
				</div>
			</div>
		</div>
	</Drawer>
	{#if voucherEnabled}
		<div class="block">
			<div class="flex gap-4 overflow-x-auto pb-4">
				{#if voucherList}
					{#each voucherList as voucher}
						<div class="min-w-[298px] flex-shrink-0 rounded-lg border border-gray-400 shadow-sm">
							<div class="space-y-2 p-4">
								<div class="flex items-start justify-between">
									<div class="font-medium">{voucher.code}</div>
									<div class="flex items-center text-xs">
										<span class="mr-1 h-2 w-2 rounded-full {getStatusColor(voucher.status)}"></span>
										{voucher.status}
									</div>
								</div>
								<div class="space-y-4">
									<div class="text-2xl font-bold text-red-500">
										{voucher.currency}
										{voucher.discountValue}{voucher.currency ? '' : '%'}
									</div>
									<div class="space-y-1">
										<div class="flex justify-between text-xs">
											<p class="text-gray-500">
												Valid until {formatDate(voucher.validUntil)} - {formatDate(
													voucher.validFrom
												)}
											</p>
											<p>0/{voucher.usageLimit}</p>
										</div>
										<div class="h-1.5 w-full rounded-full bg-gray-200">
											<div class={`bg-primary h-1.5 rounded-full`} style="width: 70%"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>
