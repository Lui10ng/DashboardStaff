<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Drawer from '$lib/components/ui/Drawer.svelte';

	let { data } = $props();

	const donationData = $derived(data.donationData);

	// Donation settings
	let donationEnabled = $state(true);
	let showOnlyTestPayments = $state(false);
	let donationButtonText = $state('');
	let presetDonationAmounts = $state([250, 550, 350, 450]);
	let customDonationEnabled = $state(true);
	let minDonation = $state(100);
	let maxDonation = $state(1000);

	// Drawer state - replacing modal state
	let donationDrawerOpen = $state(false);

	// Toggle Donation drawer
	const toggleDonationDrawer = () => {
		donationDrawerOpen = !donationDrawerOpen;
	};

	// Add new preset donation amount
	const addPresetAmount = () => {
		presetDonationAmounts = [...presetDonationAmounts, 0];
	};

	// Remove preset donation amount
	const removePresetAmount = (index: number) => {
		presetDonationAmounts = presetDonationAmounts.filter((_, i) => i !== index);
	};

	// Update preset donation amount
	const updatePresetAmount = (index: number, value: number) => {
		const newAmounts = [...presetDonationAmounts];
		newAmounts[index] = value;
		presetDonationAmounts = newAmounts;
	};
</script>

<div class="mb-4 flex items-center justify-between">
	<div class="flex items-center gap-4">
		<h2 class="text-xl font-semibold">Donation</h2>
		<div class="relative inline-flex cursor-pointer items-center">
			<input
				type="checkbox"
				value=""
				class="peer sr-only"
				checked={donationEnabled}
				Onchange={() => (donationEnabled = !donationEnabled)}
			/>
			<div
				class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"
			></div>
		</div>
	</div>
	<div class="flex gap-2">
		<Button
			onClick={toggleDonationDrawer}
			label="Manage Donation"
			icon="fa-solid fa-gear text-sm"
			className="bg-gray-200 px-4 py-2 rounded-md"
		/>
		<Drawer
			isOpen={donationDrawerOpen}
			contentBaseClass="bg-white p-4 space-y-4 shadow-xl w-full h-[90vh] rounded-t-xl overflow-y-auto"
			alignment="items-end"
			positionIn={{ y: 600, duration: 200 }}
			positionOut={{ y: 600, duration: 200 }}
			title="Manage Donation"
		>
			<div class="space-y-6">
				<!-- Donate Button Text -->
				<div>
					<label for="Donation" class="mb-2 block text-sm font-medium text-gray-700"
						>Donate Button Text</label
					>
					<input
						type="text"
						class="w-full rounded-md border border-gray-300 p-2"
						value={donationButtonText}
						Oninput={(e) => (donationButtonText = e.target.value)}
					/>
				</div>

				<!-- Preset Donation Amounts -->
				<div>
					<label for="Donation" class="mb-2 block text-sm font-medium text-gray-700"
						>Preset Donation Amounts</label
					>
					<div class="flex flex-wrap gap-2">
						{#each presetDonationAmounts as amount, i}
							<div class="flex items-center">
								<div class="relative">
									<span
										class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
									>
										₱
									</span>
									<input
										type="number"
										class="w-24 rounded-l-md border border-gray-300 p-2 pl-6"
										value={amount}
										Oninput={(e) => updatePresetAmount(i, parseInt(e.target.value))}
									/>
								</div>
								<button
									aria-labelledby="Remove Preset Amount"
									class="rounded-r-md bg-primary p-2 text-red-600 hover:bg-red-200"
									Onclick={() => removePresetAmount(i)}
								>
									<i class="fa-solid fa-times"></i>
								</button>
							</div>
						{/each}
						<button
							aria-labelledby="Add Preset Amount"
							class="rounded-md bg-green-100 p-2 text-green-600 hover:bg-green-200"
							Onclick={addPresetAmount}
						>
							<i class="fa-solid fa-plus"></i>
						</button>
					</div>
				</div>

				<!-- Enable Custom Donation Amount -->
				<div>
					<div class="flex items-center justify-between">
						<label for="enable" class="text-sm font-medium text-gray-700"
							>Enable Custom Donation Amount</label
						>
						<div class="relative inline-flex cursor-pointer items-center">
							<input
								type="checkbox"
								class="peer sr-only"
								checked={customDonationEnabled}
								Onchange={() => (customDonationEnabled = !customDonationEnabled)}
							/>
							<div
								class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"
							></div>
						</div>
					</div>
					<p class="mt-1 text-xs text-gray-500">Keep it clean | recommended if no preset</p>
				</div>

				<!-- Minimum Donation -->
				<div>
					<label for="minimum" class="mb-2 block text-sm font-medium text-gray-700"
						>Minimum Donation</label
					>
					<div class="relative">
						<input
							type="number"
							class="w-full rounded-md border border-gray-300 p-2"
							value={minDonation}
							Oninput={(e) => (minDonation = parseInt(e.target.value))}
						/>
					</div>
				</div>

				<!-- Maximum Donation -->
				<div>
					<label for="maximum" class="mb-2 block text-sm font-medium text-gray-700"
						>Maximum Donation</label
					>
					<div class="relative">
						<input
							type="number"
							class="w-full rounded-md border border-gray-300 p-2"
							value={maxDonation}
							Oninput={(e) => (maxDonation = parseInt(e.target.value))}
						/>
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="mt-6 flex justify-end gap-2">
					<button
						class="rounded-md bg-primary px-4 py-2 text-white hover:bg-red-500"
						Onclick={toggleDonationDrawer}
					>
						Save Changes
					</button>
					<button
						class="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
						Onclick={toggleDonationDrawer}
					>
						Cancel
					</button>
				</div>
			</div>
		</Drawer>
	</div>
</div>

{#if donationEnabled}
	<div class="mb-4">
		<div class="mb-4 flex items-center">
			<input
				id="showTestPayments"
				type="checkbox"
				class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
				checked={showOnlyTestPayments}
				Onchange={() => (showOnlyTestPayments = !showOnlyTestPayments)}
			/>
			<label for="showTestPayments" class="ml-2 text-sm font-medium text-gray-900"
				>Show Only Test Payments</label
			>
		</div>

		<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
			<table class="w-full text-left text-sm text-gray-500">
				<thead class="bg-gray-50 text-xs uppercase text-gray-700">
					<tr>
						<th scope="col" class="px-6 py-3">#</th>
						<th scope="col" class="px-6 py-3">Full Name</th>
						<th scope="col" class="px-6 py-3">Contact Number</th>
						<th scope="col" class="px-6 py-3">Email</th>
						<th scope="col" class="px-6 py-3">Donation Amount</th>
						<th scope="col" class="px-6 py-3">Net Amount</th>
						<th scope="col" class="px-6 py-3">Date & Time</th>
						<th scope="col" class="px-6 py-3">Live Mode</th>
					</tr>
				</thead>
				<tbody>
					{#each donationData as donation}
						<tr class="border-b bg-white hover:bg-gray-50">
							<td class="px-6 py-4">{donation.id}</td>
							<td class="px-6 py-4">{donation.name}</td>
							<td class="px-6 py-4">{donation.contact}</td>
							<td class="px-6 py-4">{donation.email}</td>
							<td class="px-6 py-4">{donation.donationAmount.toFixed(2)}</td>
							<td class="px-6 py-4">{donation.netAmount.toFixed(2)}</td>
							<td class="px-6 py-4">{donation.date} - {donation.time}</td>
							<td class="px-6 py-4">Live Mode</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}
