<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Drawer from '$lib/components/ui/Drawer.svelte';
	import DropdownMenu from '$lib/components/ui/DropdownMenu.svelte';
	import { ticketDrawer, voucherDrawer, editTicketDrawer, editVoucherDrawer} from '$lib/stores/state.svelte';
	import type { TicketProps, TicketStatus, PromotionProps, VoucherStatus } from '$lib/types';
	import { Tabs } from 'bits-ui';
	import { seatGeneratorStore } from '$lib/stores/seat-generator.svelte';
	import type { SeatConfig as SeatConfigType } from '$lib/types/seat-generator';
	import { superForm } from 'sveltekit-superforms/client';
	import { ticketSchema } from '$lib/schema/ticket';
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
	import ReserveSeatToggle from '$lib/components/ui/ReserveSeatToggle.svelte';
	import { seatMapStore } from '$lib/stores/seat-map';
	import { createEventDispatcher } from 'svelte';
	import { toast } from '$lib/stores/toast';
	import { get } from 'svelte/store';
	import type { SeatMap } from '$lib/types/seatMap';
	import type { SeatMap as StoreSeatMap } from '$lib/stores/seat-map';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();

	// Helper function to adapt between the two different SeatMap type formats
	function adaptSeatMapForStore(seatMap: SeatMap): StoreSeatMap {
		// Convert seats to include status and displayName properties required by store
		const adaptedSeats: Record<
			string,
			{ status: 'available' | 'unavailable' | 'sold'; displayName: string }
		> = {};

		Object.entries(seatMap.seats).forEach(([id, seat]) => {
			adaptedSeats[id] = {
				status: seat.isPurchasable ? 'available' : 'unavailable',
				displayName: seat.seatNumber
			};
		});

		return {
			name: seatMap.name,
			config: seatMap.config,
			seats: adaptedSeats,
			customSeatNames: seatMap.customSeatNames || {},
			summary: seatMap.summary,
			venueImage: seatMap.venueImage
		};
	}

	// Update the type for activeTab
	let activeTab: 'ticket' | 'reserve-seating' = $state('ticket');

	// Add proper typing for the ticket mapping
	function mapTicketTypeToProps(ticket: any): TicketProps {
		return {
			id: String(ticket.id),
			name: ticket.name,
			description: ticket.description || '',
			price: ticket.price,
			currency: ticket.currency,
			quantityAvailable: ticket.quantityAvailable,
			minOrderQuantity: ticket.minOrderQuantity,
			maxOrderQuantity: ticket.maxOrderQuantity,
			salesStart: ticket.salesStart,
			salesEnd: ticket.salesEnd,
			color: ticket.color,
			status: ticket.status as TicketStatus,
			event: {
				relationTo: 'events',
				value: String(ticket.event)
			},
			seatMap: ticket.seatMap
				? {
						relationTo: 'seat-maps',
						value: String(ticket.seatMap)
					}
				: undefined,
			paymentActive: ticket.paymentActive
		};
	}

	// Add store subscription
	const seatGeneratorState = $derived($seatGeneratorStore);
	let reserveSeatingEnabled = $derived(seatGeneratorState.reserveSeatingEnabled);

	// Update the ticket list and voucher list types with proper mapping
	const ticketList = $derived(data.ticketData ? data.ticketData.map(mapTicketTypeToProps) : []);
	const voucherList = $derived(data.voucherData as PromotionProps[]);

	const {
		form,
		errors,
		enhance,
		message: ticketMessage
	} = superForm(data.form, {
		taintedMessage: null,
		onSubmit: ({ formData, cancel }) => {
			console.log('Starting ticket form submission...');

			// Get seat map data from store
			const seatMapData = $seatMapStore;
			console.log('Current seat map data in store:', seatMapData);

			if (reserveSeatingEnabled && !seatMapData) {
				console.error('Reserve seating is enabled but no seat map data found');
				cancel();
				return;
			}

			if (seatMapData) {
				formData.append('seatMapStore', JSON.stringify(seatMapData));
				console.log('Added seat map data to form submission');
			}
		},
		onResult: ({ result }) => {
			console.log('Ticket submission result:', result);
			if (result.type === 'success') {
				// Only reset store and close drawer after successful server action
				seatMapStore.reset();
				ticketDrawer.open = false;
				console.log('Ticket created successfully');
			} else {
				console.error('Ticket creation failed:', result);
			}
		}
	});

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
			editVoucherDrawer.open = false;
		}
	});

	const TicketdrawerState = $derived(ticketDrawer.open);
	const VoucherdrawerState = $derived(voucherDrawer.open);
	const EditTicketdrawerState = $derived(editTicketDrawer.open);
	const EditVoucherdrawerState = $derived(editVoucherDrawer.open);

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

	// Fix the state declarations
	let selectedTicketStatus = $state<TicketStatus | ''>('');
	let selectedVoucherStatus = $state<VoucherStatus | ''>('');
	let selectedTicket = $state<TicketProps>();
	let selectedVoucher = $state<PromotionProps>();

	const handleEditVoucher = (voucher: PromotionProps) => {
	selectedVoucher = voucher;
	editVoucherDrawer.open = true;
	};
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

<<<<<<< HEAD
=======
	const handleTogglePayment = (value: boolean) => {
		isActivePayment = value;
		if (form) {
			console.log('Updating paymentActive value:', value);
			// If there's a hidden input for payment active, we could update it here
		}
	};

>>>>>>> 67511ce8 (initial backend integration of seat generator to sear selector)
	const getStatusColor = (status: string) => {
		if (status === 'active') return 'bg-green-500';
		else if (status === 'expired') return 'bg-primary';
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
		isActivePayment = ticket.status === 'active';
		selectedColor = ticket.color;
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
<<<<<<< HEAD
=======

	// Add this state for tracking reserve seating toggle
	let seatMapId: string | null = $state(null);
	let isActiveReserveSeating = $state(false);

	// Add effect to keep the toggles synchronized
	$effect(() => {
		if (!initialized) return;
		isActiveReserveSeating = reserveSeatingEnabled;
	});

	// Update the handleTabChange function
	function handleTabChange(event: CustomEvent<{ tab: 'ticket' | 'reserve-seating' }>) {
		console.log('Tab change event:', event.detail);
		activeTab = event.detail.tab;
	}

	// Modify the toggle function to update both states and switch tabs
	function handleReserveSeatingToggle(value: boolean) {
		console.log('Reserve seating toggled:', value);
		isActiveReserveSeating = value;
		seatGeneratorStore.setReserveSeatingEnabled(value);
		if (value) {
			handleTabChange(new CustomEvent('tabChange', { detail: { tab: 'reserve-seating' } }));
		}
	}

>>>>>>> 67511ce8 (initial backend integration of seat generator to sear selector)
	$effect(() => {
		if (initialized) return;

		// Initialize stores with server-provided data
		console.log('Initializing from server data:', data.initialConfig);

		// Set ticket quantity
		seatGeneratorStore.setTicketQuantity(data.initialConfig?.ticketQuantity ?? 0);

		// Set reserve seating state
		const reserveSeatingEnabled = data.initialConfig?.reserveSeatingEnabled ?? false;
		console.log('Setting reserve seating enabled:', reserveSeatingEnabled);
		seatGeneratorStore.setReserveSeatingEnabled(reserveSeatingEnabled);
		isActiveReserveSeating = reserveSeatingEnabled;

		// Update section config if available
		if (data.initialConfig?.seatConfig) {
			console.log('Setting seat config:', data.initialConfig.seatConfig);
			seatGeneratorStore.setSectionConfig(data.initialConfig.seatConfig as Partial<SeatConfigType>);
			seatGeneratorStore.regenerateSeats();
		}

		// Mark as initialized
		initialized = true;
	});

	// Add debug log for form submission
	function logFormData() {
		console.log('Submitting form with reserveSeating:', isActiveReserveSeating);
	}

	// Add state for seat map
	let createdSeatMapId: string | null = $state(null);
	let isReserveSeatingConfigured = $state(false);
	let seatMapName = $state('Reserved Seating Layout');

	// Handle seat map creation success
	function handleSeatMapCreated(event: CustomEvent<{ seatMapId: string }>) {
		createdSeatMapId = event.detail.seatMapId;
		isReserveSeatingConfigured = true;
	}

	// Define the ticket data interface
	interface TicketData {
		event: number;
		name: FormDataEntryValue | null;
		description: string;
		price: number;
		currency: string;
		status: string;
		quantityAvailable: number;
		minOrderQuantity: number;
		maxOrderQuantity: number;
		salesStart: FormDataEntryValue | null;
		salesEnd: FormDataEntryValue | null;
		color: string;
		paymentActive: boolean;
		seatMap?: number;
	}

	const dispatch = createEventDispatcher();

	// Debugging helper
	function logDebug(message: string, data?: any) {
		console.log(`[DEBUG] ${message}`, data || '');
	}

	async function handleSaveLayout() {
		console.log('[DEBUG] handleSaveLayout called');
		const currentSeatMap = get(seatMapStore);
		console.log('[DEBUG] Current seat map:', currentSeatMap);

		if (!currentSeatMap) {
			console.log('[DEBUG] No seat map data found');
			toast.show({ type: 'error', message: 'No seat map data to save' });
			return;
		}

		try {
			const response = await fetch('/api/seat-maps', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(currentSeatMap),
			});

			console.log('[DEBUG] Seat map save response:', response);

			if (!response.ok) {
				const errorText = await response.text();
				console.log('[DEBUG] Seat map save error:', errorText);
				throw new Error(`Failed to save seat map: ${errorText}`);
			}

			const data = await response.json();
			console.log('[DEBUG] Seat map creation response:', data);

			const seatMapId = data.doc.id;
			console.log('[DEBUG] Extracted seat map ID:', seatMapId);

			seatMapStore.setSeatMap({ ...currentSeatMap, id: seatMapId });
			toast.show({ type: 'success', message: 'Seat map saved successfully' });
		} catch (error) {
			console.error('[DEBUG] Error saving seat map:', error);
			toast.show({ type: 'error', message: error.message || 'Failed to save seat map' });
		}
	}

	async function handleTicketSubmit(event: SubmitEvent) {
		console.log('[DEBUG] handleSaveLayout called');
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		console.log('Starting ticket submission...');

		// Get seat map data from store
		const seatMapData = get(seatMapStore);
		console.log('Current seat map data in store:', seatMapData);

		if (!seatMapData?.id) {
			console.error('No valid seat map data found in store');
			toast.show({
				message: 'Please save the seat map before creating a ticket',
				type: 'error',
			});
			return;
		}

		// Append seat map ID to form data
		formData.append('seatMap', seatMapData.id.toString());
		console.log('Added seat map ID to form submission:', seatMapData.id);

		try {
			const response = await fetch(form.action, {
				method: 'POST',
				body: formData,
			});

			const result = await response.json();
			console.log('Ticket creation response:', result);

			if (response.ok) {
				toast.show({
					message: 'Ticket created successfully',
					type: 'success',
				});

				// Reset the seat map store
				seatMapStore.reset();

				// Optionally refresh the page or update the ticket list
				window.location.reload();
			} else {
				console.error('Ticket creation failed:', result);
				toast.show({
					message: result.error || 'Failed to create ticket',
					type: 'error',
				});
			}
		} catch (error) {
			console.error('Error submitting ticket:', error);
			toast.show({
				message: 'Failed to create ticket: Network error',
				type: 'error',
			});
		}
	}

	console.log(data.currentEvent.title);
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
		</div>
	</div>

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
			<Tabs.Root value={activeTab} onValueChange={(value) => (activeTab = value)} class="mb-8">
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

					{#if reserveSeatingEnabled}
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
					{/if}
				</Tabs.List>

				<Tabs.Content value="ticket">
					<form method="POST" action="?/createTicket" use:enhance class="w-full space-y-8">
						<input type="hidden" name="event" value={data.eventId} />
						<div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div class="space-y-6">
								<div>
									<label for="name" class="mb-2 block text-sm">Ticket Name</label>
									<input
										type="text"
										name="name"
										value={$form.name}
										placeholder="Enter ticket name"
										class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
									/>
									{#if $errors.name}
										<p class="text-primary text-sm">
											{$errors.name}
										</p>
									{/if}
								</div>
								<div>
									<label for="description" class="mb-2 block text-sm">Description (Optional)</label>
									<textarea
										name="description"
										value={$form.description}
										placeholder="Enter ticket description"
										class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
									/>
								</div>
								<div>
									<label for="price" class="mb-2 block text-sm">Price</label>
									<input
										type="number"
										name="price"
										value={$form.price}
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
									<label for="salesStart" class="mb-2 block text-sm">Sales Start (DD/MM/YYYY)</label
									>
									<DatePicker
										name="salesStart"
										value={$form.salesStart}
										className="h-input rounded-input flex w-full select-none items-center border px-2 py-4 text-gray-500"
									/>
									{#if $errors.salesStart}
										<p class="text-primary text-sm">
											{$errors.salesStart}
										</p>
									{/if}
								</div>
								<div>
									<label for="salesEnd" class="mb-2 block text-sm">Sales End (DD/MM/YYYY)</label>
									<DatePicker
										name="salesEnd"
										value={$form.salesEnd}
										className="h-input rounded-input flex w-full select-none items-center border px-2 py-4 text-gray-500"
									/>
									{#if $errors.salesEnd}
										<p class="text-primary text-sm">
											{$errors.salesEnd}
										</p>
									{/if}
								</div>
							</div>
							<div class="space-y-6">
								<div>
									<label for="quantityAvailable" class="mb-2 block text-sm"
										>Available For Sale</label
									>
									<input
										type="number"
										name="quantityAvailable"
										value={$form.quantityAvailable}
										placeholder="Enter quantity"
										class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
									/>
									{#if $errors.quantityAvailable}
										<p class="text-primary text-sm">
											{$errors.quantityAvailable}
										</p>
									{/if}
								</div>
								<div>
									<label for="minOrderQuantity" class="mb-2 block text-sm">Min Order Quantity</label
									>
									<input
										type="number"
										name="minOrderQuantity"
										value={$form.minOrderQuantity}
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
									<label for="maxOrderQuantity" class="mb-2 block text-sm">Max Order Quantity</label
									>
									<input
										type="number"
										name="maxOrderQuantity"
										value={$form.maxOrderQuantity}
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
									<label for="currency" class="mb-2 block text-sm">Currency</label>
									<select
										name="currency"
										value={$form.currency}
										class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
									>
										<option value="PHP">PHP</option>
										<option value="USD">USD</option>
										<option value="EUR">EUR</option>
									</select>
								</div>

								<div>
									<label for="status" class="mb-2 block text-sm">Status</label>
									<select
										name="status"
										value={$form.status}
										class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
									>
										<option value="active">Active</option>
										<option value="inactive">Inactive</option>
									</select>
								</div>

								<div>
									<label for="reserveSeating" class="mb-2 block text-sm"
										>Enable Reserve Seating</label
									>
									<div class="relative inline-flex items-center">
										<ReserveSeatToggle
											value={isActiveReserveSeating}
											OnChange={handleReserveSeatingToggle}
										/>
										<span class="ml-2 text-xs text-gray-500">
											{#if isActiveReserveSeating && !isReserveSeatingConfigured}
												Configure seating in the Reserve Seating tab
											{:else if isActiveReserveSeating && isReserveSeatingConfigured}
												✓ Seat map configured
											{/if}
										</span>
									</div>
									<p class="mt-1 text-xs text-gray-500">
										Enable reserve seating to allow customers to select specific seats.
									</p>
								</div>
							</div>
						</div>

						<div>
							<label for="color" class="my-4 block text-sm">Label Color</label>
							<div
								class="mb-3 rounded-md p-3 text-center text-white"
								style="background-color: {$form.color}"
							>
								{$form.color}
							</div>
							<div class="flex gap-2">
								{#each colors as color}
									<button
										type="button"
										class="h-8 w-8 rounded-full border-2 transition-all"
										style="background-color: {color}; border-color: {$form.color === color
											? 'black'
											: 'transparent'}"
										on:click={() => ($form.color = color)}
										aria-label="Select color {color}"
									></button>
								{/each}

								<label
									class="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-gray-500"
								>
									<input
										class="absolute top-0 right-0 hidden"
										type="color"
										name="color"
										value={$form.color}
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
								type="submit"
								onClick={() => {}}
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
					<div class="space-y-4">
						<SeatConfig />
						<RenameControl />
						<SaveLayout on:seatMapCreated={handleSeatMapCreated} on:tabChange={handleTabChange} eventName={data.currentEvent.title}/>
						<ReserveToggle />
						<QuantityWarning />
						<VenueImageUpload />
						<PanzoomContainer />
						<StatusControls />
						<SeatStats />
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
		{#if selectedTicket}
			<div class="space-y-6">
				<div class="border-gray-200 pb-4">
					<h2 class="text-xl font-semibold">{selectedTicket.name}</h2>
					<p class="text-sm text-gray-500">Edit Ticket Details</p>
				</div>

				<Tabs.Root value={activeTab} onValueChange={(value) => (activeTab = value)} class="mb-8">
					<Tabs.List class="flex space-x-4 border-b border-gray-200">
						<Tabs.Trigger
							value="ticket"
							class="border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none data-[state=active]:border-[#DF4D60] data-[state=active]:text-[#DF4D60] data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:border-gray-300 data-[state=inactive]:hover:text-gray-700"
						>
							<div class="flex items-center">
								<i class="fa-solid fa-ticket-simple pe-2"></i>
								Ticket
							</div>
						</Tabs.Trigger>

						{#if reserveSeatingEnabled}
							<Tabs.Trigger
								value="reserve-seating"
								class="border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none data-[state=active]:border-[#DF4D60] data-[state=active]:text-[#DF4D60] data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:border-gray-300 data-[state=inactive]:hover:text-gray-700"
							>
								<div class="flex items-center">
									<i class="fa-solid fa-chair pe-2"></i>
									Reserve Seating
								</div>
							</Tabs.Trigger>
						{/if}
					</Tabs.List>

<<<<<<< HEAD
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
											<PaymentToggle 
											value={isActivePayment} 
											name="status"
											OnChange={(value) => {
												isActivePayment = value;
												// If you want to update the status immediately
												if (selectedTicket) {
													selectedTicket.status = value ? 'active' : 'inactive';
												}
											}} 
										/>
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
				isOpen={EditTicketdrawerState}
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
														value={selectedTicket.salesStart}
														className="h-input rounded-input flex w-full select-none items-center border px-2 py-4 text-gray-500"
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
														value={selectedTicket.salesEnd}
														className="h-input rounded-input flex w-full select-none items-center border px-2 py-4 text-gray-500"
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
													<PaymentToggle 
													value={isActivePayment} 
													name="status"
													OnChange={(value) => {
														isActivePayment = value;
														// If you want to update the status immediately
														if (selectedTicket) {
															selectedTicket.status = value ? 'active' : 'inactive';
														}
													}} 
												/>
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
=======
					<Tabs.Content value="ticket">
						<form action="?/updateTicket" method="POST" use:enhance>
							<input type="hidden" name="id" value={selectedTicket.id} />
							<div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div class="space-y-6">
									<div>
										<label for="name" class="mb-2 block text-sm">Ticket Name</label>
										<input
											type="text"
											name="name"
											value={selectedTicket.name}
											placeholder="Enter ticket name"
											class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
										/>
										{#if $errors.name}
											<p class="text-primary text-sm">
												{$errors.name}
											</p>
>>>>>>> 67511ce8 (initial backend integration of seat generator to sear selector)
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
										<label for="salesStart" class="mb-2 block text-sm"
											>Sales Start (DD/MM/YYYY)</label
										>
										<DatePicker
											name="salesStart"
											value={selectedTicket.salesStart}
											className="h-input rounded-input flex w-full select-none items-center border px-2 py-4 text-gray-500"
										/>
										{#if $errors.salesStart}
											<p class="text-primary text-sm">
												{$errors.salesStart}
											</p>
										{/if}
									</div>
									<div>
										<label for="salesEnd" class="mb-2 block text-sm">Sales End (DD/MM/YYYY)</label>
										<DatePicker
											name="salesEnd"
											value={selectedTicket.salesEnd}
											className="h-input rounded-input flex w-full select-none items-center border px-2 py-4 text-gray-500"
										/>
										{#if $errors.salesEnd}
											<p class="text-primary text-sm">
												{$errors.salesEnd}
											</p>
										{/if}
									</div>
								</div>
								<div class="space-y-6">
									<div>
										<label for="quantityAvailable" class="mb-2 block text-sm"
											>Available For Sale</label
										>
										<input
											type="number"
											name="quantityAvailable"
											value={selectedTicket.quantityAvailable}
											placeholder="Enter quantity"
											class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
										/>
										{#if $errors.quantityAvailable}
											<p class="text-primary text-sm">
												{$errors.quantityAvailable}
											</p>
										{/if}
									</div>
									<div>
										<label for="minOrderQuantity" class="mb-2 block text-sm"
											>Min Order Quantity</label
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
										<label for="maxOrderQuantity" class="mb-2 block text-sm"
											>Max Order Quantity</label
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

									<input
										type="hidden"
										name="reserveSeating"
										value={isActiveReserveSeating.toString()}
									/>

									<div>
										<label for="activePayment" class="mb-2 block text-sm">Active payment</label>
										<PaymentToggle value={isActivePayment} OnChange={handleTogglePayment} />
									</div>

									<div>
										<label for="reserveSeating" class="mb-2 block text-sm"
											>Enable Reserve Seating</label
										>
										<div class="relative inline-flex items-center">
											<ReserveSeatToggle
												value={isActiveReserveSeating}
												OnChange={handleReserveSeatingToggle}
											/>
											<span class="ml-2 text-xs text-gray-500">
												{isActiveReserveSeating ? 'Enabled' : 'Disabled'}
											</span>
										</div>
										<input
											type="hidden"
											name="reserveSeating"
											value={isActiveReserveSeating.toString()}
										/>
										<p class="mt-1 text-xs text-gray-500">
											Enable reserve seating to allow customers to select specific seats.
										</p>
									</div>
								</div>
							</div>
						</form></Tabs.Content
					>

					<Tabs.Content value="reserve-seating">
						<div class="space-y-4">
							<SeatConfig />
							<RenameControl />
							<SaveLayout on:save={handleSaveLayout} />
							<ReserveToggle />
							<QuantityWarning />
							<VenueImageUpload />
							<PanzoomContainer />
							<StatusControls />
							<SeatStats />
						</div>
					</Tabs.Content>
				</Tabs.Root>
			</div>
		{/if}
	</Drawer>

	<div class="flex gap-4 overflow-x-auto pb-4">
		{#if ticketList && ticketList.length > 0}
			{#each ticketList as ticket}
				<div
					class="min-w-[298px] flex-shrink-0 rounded-lg border border-l-10 border-gray-400"
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
						<div class="mt-2 mb-4 text-lg font-bold">₱{ticket.price}</div>
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
        <div class="flex w-full flex-col items-center justify-center py-8">
            <div class="mb-4 rounded-full bg-gray-100 p-4">
                <i class="fa-solid fa-ticket text-2xl text-gray-400"></i>
            </div>
            <h3 class="mb-1 text-lg font-medium">No Tickets Available</h3>
            <p class="text-sm text-gray-500">Create your first ticket to get started</p>
        </div>
		{/if}
	</div>

	<!-- Voucher Toggle Section -->
	<div class="mt-4 mb-4 flex items-center justify-between">
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
										class="absolute top-1/2 left-2 -translate-y-1/2 rounded-md bg-gray-100 py-1 pr-6 pl-1 text-sm font-medium"
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
							items={['all', ...ticketList.map((ticket) => ticket.name)]} 
							multiple={true}
							alignContent="start"
							on:select={(event) => {
								const selected = event.detail;
								console.log('Selected tickets:', selected);
								if (selected.includes('all')) {
									selectedTickets = ['all'];
								} else {
									selectedTickets = selected.filter(ticket => ticket !== 'all');
								}
							}}
						/>
					</div>
					<div class="sm:hidden">
						<h3 class="text-lg font-medium">Preview</h3>
						<div class="flex gap-4 overflow-x-auto pb-4">
							{#if selectedTickets.includes('all')}
								{#each ticketList as ticket}
									<div
										class="min-w-[298px] flex-shrink-0 rounded-lg border border-l-10 border-gray-400"
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
											<div class="mt-2 mb-4 text-lg font-bold">₱{ticket.price}</div>
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
										class="min-w-[298px] flex-shrink-0 rounded-lg border border-l-10 border-gray-400"
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
											<div class="mt-2 mb-4 text-lg font-bold">₱{ticket.price}</div>
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
										class="peer h-6 w-11 cursor-pointer rounded-full bg-gray-200 transition-colors peer-checked:bg-[#DF4D60] hover:bg-gray-300 peer-checked:hover:bg-[#DF4D60]/90"
									>
										<span
											class="absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white transition-all peer-checked:left-[22px]"
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
										class="peer h-6 w-11 cursor-pointer rounded-full bg-gray-200 transition-colors peer-checked:bg-[#DF4D60] hover:bg-gray-300 peer-checked:hover:bg-[#DF4D60]/90"
									>
										<span
											class="absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white transition-all peer-checked:left-[22px]"
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
									class="min-w-[298px] flex-shrink-0 rounded-lg border border-l-10 border-gray-400"
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
										<div class="mt-2 mb-4 text-lg font-bold">₱{ticket.price}</div>
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
									class="min-w-[298px] flex-shrink-0 rounded-lg border border-l-10 border-gray-400"
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
										<div class="mt-2 mb-4 text-lg font-bold">₱{ticket.price}</div>
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
				{#if voucherList && voucherList.length > 0}
					{#each voucherList as voucher}
					<div 
					class="min-w-[298px] flex-shrink-0 rounded-lg border border-gray-400 shadow-sm cursor-pointer"
					Onclick={() => handleEditVoucher(voucher)}
				>
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
												Valid until {formatDate(voucher.validFrom)} - {formatDate(
													voucher.validUntil
												)}
											</p>
											<p>1/{voucher.usageLimit}</p>
										</div>
										<div class="h-1.5 w-full rounded-full bg-gray-200">
											<div class={`bg-primary h-1.5 rounded-full`} style="width: 30%"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					{/each}
					{:else}
					<div class="flex w-full flex-col items-center justify-center py-8">
					<div class="mb-4 rounded-full bg-gray-100 p-4">
						<i class="fa-solid fa-ticket-simple text-2xl text-gray-400"></i>
					</div>
					<h3 class="mb-1 text-lg font-medium">No Vouchers Available</h3>
					<p class="text-sm text-gray-500">Create your first voucher to get started</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}
	<Drawer
		isOpen={EditVoucherdrawerState}
		contentBaseClass="bg-white p-4 space-y-6 shadow-xl w-full h-[90vh] rounded-t-xl overflow-y-auto"
		alignment="items-end"
		positionIn={{ y: 600, duration: 200 }}
		positionOut={{ y: 600, duration: 200 }}
		>
		{#if selectedVoucher}
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<div class="space-y-6">
				<div class="border-gray-200 pb-4">
					<h2 class="text-xl font-semibold">{selectedVoucher.code}</h2>
					<p class="text-sm text-gray-500">Edit voucher details</p>
				</div>

				<form action="?/updateVoucher" method="POST" use:voucherEnhance class="space-y-4">
					<input type="hidden" name="id" value={selectedVoucher.id} />

					<div>
						<label for="code" class="mb-2 block text-sm">Voucher Code</label>
						<input
							type="text"
							name="code"
							value={selectedVoucher.code}
							placeholder="Enter voucher code"
							class="w-full rounded-md border-none bg-gray-100 p-3 uppercase"
						/>
						{#if $voucherErrors.code}
							<p class="text-primary text-sm">{$voucherErrors.code}</p>
						{/if}
					</div>

					<div>
						<label for="description" class="mb-2 block text-sm">
							Description <span class="text-gray-500">(optional)</span>
						</label>
						<input
							type="text"
							name="description"
							value={selectedVoucher.description}
							placeholder="Enter description"
							class="w-full rounded-md border-none bg-gray-100 p-3"
						/>
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
						</div>

						<div>
							<label for="discountValue" class="mb-2 block text-sm">Discount amount</label>
							<div class="relative w-full">
								{#if discountType === 'fixed_amount'}
									<select
										name="currency"
										class="absolute left-2 top-1/2 -translate-y-1/2 rounded-md bg-gray-100 py-1 pl-1 pr-6 text-sm font-medium"
										value={selectedVoucher.currency}
									>
										<option value="PHP">PHP</option>
										<option value="USD">USD</option>
										<option value="EUR">EUR</option>
									</select>
								{/if}
								<input
									type="number"
									name="discountValue"
									value={selectedVoucher.discountValue}
									placeholder="e.g., 50 or 10%"
									class="w-full rounded-md border-none bg-gray-100 p-3 {discountType === 'fixed_amount' ? 'pl-24' : ''}"
								/>
							</div>
						</div>
					</div>

					<!-- Add date pickers -->
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label for="validFrom" class="mb-2 block text-sm">Valid From</label>
							<DatePicker
								name="validFrom"
								value={selectedVoucher.validFrom}
								className="h-input rounded-input flex w-full select-none items-center border px-2 py-4 text-gray-500"
							/>
						</div>
						<div>
							<label for="validUntil" class="mb-2 block text-sm">Valid Until</label>
							<DatePicker
								name="validUntil"
								value={selectedVoucher.validUntil}
								className="h-input rounded-input flex w-full select-none items-center border px-2 py-4 text-gray-500"
							/>
						</div>
					</div>
				
					<!-- Add quantity field -->
					<div>
						<label for="quantity" class="mb-2 block text-sm">Quantity</label>
						<input
							type="number"
							name="quantity"
							value={selectedVoucher.usageLimit}
							placeholder="Enter quantity"
							class="w-full rounded-md border-none bg-gray-100 p-3"
						/>
					</div>
					<div>
						<label for="code" class="mb-2 block text-sm">Minimum Order Amount</label>
						<div class="relative w-full">
							<input
								type="number"
								name="minOrderAmount"
								value={selectedVoucher.minimumOrderAmount}
								placeholder="Enter minimum order"
								class="w-full rounded-md border-none bg-gray-100 p-3"
							/>
						</div>
						{#if $voucherErrors.minOrderAmount}
							<p class="text-primary text-sm">
								{$voucherErrors.minOrderAmount}
							</p>
						{/if}
					</div>
					
					
					<div class="mt-8 grid grid-cols-2 gap-4">
						<Button
							type="submit"
							onClick={() => {}}
							label="Save Changes"
							className="bg-[#DF4D60] text-white p-2 rounded-md"
						/>
						<Button
							onClick={() => {
								editVoucherDrawer.open = false;
							}}
							label="Cancel"
							className="border border-gray-300 text-gray-700 p-2 rounded-md"
						/>
					</div>

				</form>
			</div>
		</div>       
			{/if}
		</Drawer>
</div>
