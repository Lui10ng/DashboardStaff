<script lang="ts">
    import { ticketStore } from '$lib/stores';
    import Button from '$lib/components/ui/Button.svelte';
    import { editTicketDrawer, ticketDrawer } from '$lib/stores/state.svelte';
    import Drawer from '$lib/components/ui/Drawer.svelte';
    import { Tabs } from 'bits-ui';
    import { seatGeneratorStore } from '$lib/stores/seat-generator.svelte';
    import type { TicketProps } from '$lib/types';
    import PaymentToggle from '$lib/components/ui/PaymentToggle.svelte';
    import DatePicker from '$lib/components/ui/DatePicker.svelte';
    import ReserveToggle from '$lib/components/seat-generator/ReserveToggle.svelte';
    import SeatConfig from '$lib/components/seat-generator/SeatConfig.svelte';
    import RenameControl from '$lib/components/seat-generator/RenameControl.svelte';
    import SaveLayout from '$lib/components/seat-generator/SaveLayout.svelte';
    import QuantityWarning from '$lib/components/seat-generator/QuantityWarning.svelte';
    import PanzoomContainer from '$lib/components/seat-generator/PanzoomContainer.svelte';
    import StatusControls from '$lib/components/seat-generator/StatusControls.svelte';
    import SeatStats from '$lib/components/seat-generator/SeatStats.svelte';
    import VenueImageUpload from '$lib/components/seat-generator/VenueImageUpload.svelte';

    const colors = ['#0066FF', '#F7D002', '#0FBA81', '#4B7B3B', '#DF4D60'];
    let isActivePayment = $state(false);
    let selectedColor = $state(colors[0]); // Initialize selectedColor

    function handleTogglePayment(value: boolean) {
        isActivePayment = value;
    }

    function handleSaveTicket() {
        // Add your save logic here
        editTicketDrawer.open = false;
        editTicketDrawer.selectedTicket = null;
        console.log('Ticket saved:', editTicketDrawer.selectedTicket);
    }

	function handleColorSelect(color: string) {
    selectedColor = color;
    if (editTicketDrawer.selectedTicket) {
        editTicketDrawer.selectedTicket.color = color;
    }
}

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
    
    const handleEditTicket = (ticket: TicketProps) => {
        editTicketDrawer.selectedTicket = { ...ticket, color: ticket.color || colors[0] };
        editTicketDrawer.open = true;
    };
	
</script>

<div class="block">
    <div class="flex gap-4 overflow-x-auto pb-4 sm:hidden">
        {#each $ticketStore as ticket, index}
            <div
                class="min-w-[260px] flex-shrink-0 rounded-lg border border-l-10 border-gray-400"
                style="border-left-color: {getTicketColor(index)};"
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
                            <p>Sold</p>
                            <p>{ticket.sold}</p>
                        </div>
                        <div class="h-1.5 w-full rounded-full bg-gray-200">
                            <div
                                class="h-1.5 rounded-full"
                                style="width: 30%; background-color: {getTicketColor(index)};"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <div class="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {#each $ticketStore as ticket, index}
            <div
                class="rounded-lg border border-l-10 border-gray-400"
                style="border-left-color: {getTicketColor(index)};"
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
                            <p>Sold</p>
                            <p>{ticket.sold}</p>
                        </div>
                        <div class="h-1.5 w-full rounded-full bg-gray-200">
                            <div
                                class="h-1.5 rounded-full"
                                style="width: 30%; background-color: {getTicketColor(index)};"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <Drawer
        isOpen={editTicketDrawer.open}
        contentBaseClass="bg-white p-4 space-y-4 shadow-xl w-full h-[90vh] rounded-t-xl overflow-y-auto"
        alignment="items-end"
        positionIn={{ y: 600, duration: 200 }}
        positionOut={{ y: 600, duration: 200 }}
    >
        <div class="space-y-6">
            {#if editTicketDrawer.selectedTicket}
                <div class="border-gray-200 pb-4">
                    <h2 class="text-xl font-semibold">{editTicketDrawer.selectedTicket.name}</h2>
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
                            <div class="grid grid-cols-2 gap-4 mt-5">
                                <div>
                                    <label for="ticket" class="mb-2 block text-sm">Ticket Name</label>
                                    <input
                                        type="text"
                                        bind:value={editTicketDrawer.selectedTicket.name}
                                        placeholder="Enter ticket name"
                                        class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
                                    />
                                </div>
                                <div>
                                    <label for="validfrom" class="mb-2 block text-sm">Valid from (DD/MM/YYYY)</label>
                                    <DatePicker
                                        name="validfrom"
                                        value={editTicketDrawer.selectedTicket.validFrom}
                                        format="DD/MM/YYYY"
                                        onChange={(date) => {
                                            editTicketDrawer.selectedTicket.validFrom = date;
                                        }}
                                    />
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label for="price" class="mb-2 block text-sm">Price</label>
                                    <input
                                        type="number"
                                        bind:value={editTicketDrawer.selectedTicket.price}
                                        placeholder="Enter ticket price"
                                        class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
                                    />
                                </div>
                                <div>
                                    <label for="valid-in" class="mb-2 block text-sm">Valid to (DD/MM/YYYY)</label>
                                    <DatePicker
                                        name="validto"
                                        value={editTicketDrawer.selectedTicket.validTo}
                                        onChange={(date) => {
                                            editTicketDrawer.selectedTicket.validTo = date;
                                        }}
                                    />
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label for="quantity" class="mb-2 block text-sm">Quantity</label>
                                    <input
                                        type="number"
                                        bind:value={editTicketDrawer.selectedTicket.sold}
                                        placeholder="Enter quantity"
                                        class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
                                    />
                                </div>
                                <div>
                                    <label for="activePayment" class="mb-2 block text-sm">Active payment</label>
                                    <PaymentToggle value={isActivePayment} OnChange={handleTogglePayment} />
                                </div>
                            </div>

                            <div class="mt-4">
                                <label for="Label-color" class="mb-2 block text-sm">Label Color</label>
                                <div
                                    class="mb-3 rounded-md p-3 text-center text-white"
                                    style="background-color: {editTicketDrawer.selectedTicket?.color || 'transparent'}"
                                >
                                    {selectedColor}
                                </div>
								<div class="flex gap-2">
									{#each colors as color}
										<button
											class="h-8 w-8 rounded-full border-2 transition-all"
											style="background-color: {color}; border-color: {selectedColor === color
												? 'black'
												: 'transparent'}"
											aria-label="Select color {color}"
											Onclick={() => handleColorSelect(color)} 
										></button>
									{/each}
									<button
										class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300"
									>
										+
									</button>
								</div>
                            </div>
							<div class="grid grid-cols-2 gap-4 mt-10">
								<Button
									onClick={handleSaveTicket}
									label="Save Ticket"
									className="bg-[#DF4D60] text-white p-2 rounded-md"
								/>
								<Button
									onClick={() => {
										editTicketDrawer.open = false;
										editTicketDrawer.selectedTicket = null;
									}}
									label="Cancel"
									className="border border-gray-300 text-gray-700 p-2 rounded-md"
								/>
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
            {/if}
        </div>
    </Drawer>
</div>