<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Drawer from '$lib/components/ui/Drawer.svelte';
	import DropdownMenu from '$lib/components/ui/DropdownMenu.svelte';
	import { ticketDrawer, voucherDrawer, editTicketDrawer } from '$lib/stores/state.svelte';
	import type { TicketProps, TicketStatus, VoucherStatus } from '$lib/types';
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
	import { voucherStore } from '$lib/stores';

	let { data } = $props();

	const ticketList: TicketProps[] = $derived(data.ticketData);

	const { form, errors, enhance, delayed, message } = superForm(data.form);

	message.subscribe(async (msg) => {
		if (msg && msg.success) {
			ticketDrawer.open = false;
		}
	});

	const TicketdrawerState = $derived(ticketDrawer.open);
	const VoucherdrawerState = $derived(voucherDrawer.open);

	// Update the selectedTickets state declaration
	let selectedTickets: string[] = $state([]);

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
		if (status === 'Active') return 'bg-green-500';
		else if (status === 'Expired') return 'bg-red-500';
		else if (status === 'Deactivated') return 'bg-gray-500';
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
		voucherStore.set(data.vouchers);
	});

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
		<div class="flex gap-2">
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
							<div class="mx-auto max-w-xl p-8">
								<form action="?/createTicket" method="POST" use:enhance>
									<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
										<div class="space-y-6">
											<div>
												<label for="ticket" class="mb-2 block text-sm">Ticket Name</label>
												<input
													type="text"
													name="ticketName"
													placeholder="Enter ticket name"
													class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
												/>
												{#if $errors.ticketName}
													<p class="text-primary text-sm">
														{$errors.ticketName}
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
												{#if $errors.price}
													<p class="text-primary text-sm">
														{$errors.price}
													</p>
												{/if}
											</div>
											<div>
												<label for="validfrom" class="mb-2 block text-sm"
													>Valid from (DD/MM/YYYY)</label
												>
												<DatePicker name="validfrom" className="" />
												{#if $errors.validfrom}
													<p class="text-primary text-sm">
														{$errors.validfrom}
													</p>
												{/if}
											</div>
											<div>
												<label for="valid-in" class="mb-2 block text-sm"
													>Valid to (DD/MM/YYYY)</label
												>
												<DatePicker name="validto" className="" />
												{#if $errors.validto}
													<p class="text-primary text-sm">
														{$errors.validto}
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
												{#if $errors.quantity}
													<p class="text-primary text-sm">
														{$errors.quantity}
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
												{#if $errors.minOrderQuantity}
													<p class="text-primary text-sm">
														{$errors.minOrderQuantity}
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
												{#if $errors.maxOrderQuantity}
													<p class="text-primary text-sm">
														{$errors.maxOrderQuantity}
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

										{#if $errors.color}
											<p class="text-primary text-sm">
												{$errors.color}
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
									<form action="?/updateTicket" method="POST" use:enhance>
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
													{#if $errors.ticketName}
														<p class="text-primary text-sm">
															{$errors.ticketName}
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
													{#if $errors.price}
														<p class="text-primary text-sm">
															{$errors.price}
														</p>
													{/if}
												</div>
												<div>
													<label for="validfrom" class="mb-2 block text-sm"
														>Valid from (DD/MM/YYYY)</label
													>
													<DatePicker name="validfrom" className="" />
													{#if $errors.validfrom}
														<p class="text-primary text-sm">
															{$errors.validfrom}
														</p>
													{/if}
												</div>
												<div>
													<label for="valid-in" class="mb-2 block text-sm"
														>Valid to (DD/MM/YYYY)</label
													>
													<DatePicker name="validto" className="" />
													{#if $errors.validto}
														<p class="text-primary text-sm">
															{$errors.validto}
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
													{#if $errors.quantity}
														<p class="text-primary text-sm">
															{$errors.quantity}
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
													{#if $errors.minOrderQuantity}
														<p class="text-primary text-sm">
															{$errors.minOrderQuantity}
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
													{#if $errors.maxOrderQuantity}
														<p class="text-primary text-sm">
															{$errors.maxOrderQuantity}
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
												style="background-color: {selectedTicket.color}"
											>
												{selectedTicket.color}
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
														bind:value={selectedTicket.color}
													/>
													+
												</label>
											</div>

											{#if $errors.color}
												<p class="text-primary text-sm">
													{$errors.color}
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
			<div class="flex gap-2">
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
							<label for="limit-bulk-quantity" class="mb-2 block text-sm">Limit Bulk Quantity</label
							>
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
							items={['all', ...ticketList.map((ticket) => ticket.name)]}
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
							<label for="voucher-code" class="mb-2 block text-sm">Voucher Code</label>
							<div class="flex flex-col gap-2 sm:flex-row">
								<div class="relative">
									<select
										id="voucher-code"
										bind:value={voucherCode}
										class="w-full appearance-none rounded-md border-none bg-[#F8F9FC] p-3 pr-8 text-sm"
									>
										<option value="QGN342">QGN342</option>
									</select>
									<div
										class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2"
									>
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
		</div></Drawer
	>
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
									<span class="mr-1 h-2 w-2 rounded-full {getStatusColor(voucher.status)}"></span>
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
									<span class="mr-1 h-2 w-2 rounded-full {getStatusColor(voucher.status)}"></span>
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
</div>
