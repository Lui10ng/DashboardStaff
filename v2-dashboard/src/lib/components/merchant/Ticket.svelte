<script lang="ts">
	import DatePicker from '$lib/components/ui/DatePicker.svelte';
	import PaymentToggle from '$lib/components/ui/PaymentToggle.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	// State management
	let ticketName = $state('');
	let validFrom = $state('');
	let validTo = $state('');
	let price = $state('');
	let quantity = $state('');
	let selectedColor = $state('#0FBA81');
	let isActivePayment = $state(false);

	const colors = ['#0066FF', '#F7D002', '#0FBA81', '#4B7B3B', '#DF4D60'];

	function handleAddTicket() {
		console.log({
			ticketName,
			validFrom,
			validTo,
			price,
			quantity,
			selectedColor,
			isActivePayment
		});
	}

	function handleTogglePayment(value: boolean) {
		isActivePayment = value;
	}
</script>

<div class="space-y-6">
	<div class="grid grid-cols-2 gap-4">
		<div>
			<label for="ticket" class="mb-2 block text-sm">Ticket Name</label>
			<input
				type="text"
				bind:value={ticketName}
				placeholder="Enter ticket name"
				class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
			/>
		</div>
		<div>
			<label for="validfrom" class="mb-2 block text-sm">Valid from (DD/MM/YYYY)</label>
			<DatePicker name="validfrom" bind:value={validFrom} />
		</div>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<div>
			<label for="price" class="mb-2 block text-sm">Price</label>
			<input
				type="number"
				bind:value={price}
				placeholder="Enter ticket price"
				class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
			/>
		</div>
		<div>
			<label for="valid-in" class="mb-2 block text-sm">Valid to (DD/MM/YYYY)</label>
			<DatePicker name="validto" bind:value={validTo} />
		</div>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<div>
			<label for="quantity" class="mb-2 block text-sm">Quantity</label>
			<input
				type="number"
				bind:value={quantity}
				placeholder="Enter quantity"
				class="w-full rounded-md border-none bg-[#F8F9FC] p-3"
			/>
		</div>
		<div>
			<label for="activePayment" class="mb-2 block text-sm">Active payment</label>
			<PaymentToggle value={isActivePayment} OnChange={handleTogglePayment} />
		</div>
	</div>

	<div>
		<label for="Label-color" class="mb-2 block text-sm">Label Color</label>
		<div
			class="mb-3 rounded-md p-3 text-center text-white"
			style="background-color: {selectedColor}"
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
					onclick={() => (selectedColor = color)}
					aria-label="Select color {color}"
				></button>
			{/each}
			<button
				class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300"
			>
				+
			</button>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-4 pt-4">
		<Button
			onClick={handleAddTicket}
			label="Save Ticket"
			className="bg-[#DF4D60] text-white p-2 rounded-md"
		/>
		<Button
			onClick={() => {}}
			label="Cancel"
			className="border border-gray-300 text-gray-700 p-2 rounded-md"
		/>
	</div>
</div>
