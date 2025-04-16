<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import EmailBlastForm from '$lib/components/ui/EmailBlastForm.svelte';
	import { downloadCSV } from '$lib/utils/csv';
	import { 
		registrantStore, 
		guestStatusFilter, 
		searchQuery, 
		filteredGuests, 
		paginatedGuests,
		updateRegistrant
	} from '$lib/stores/registrantList.svelte';
	import { fly } from 'svelte/transition';

	// Get the data from props
	let { data } = $props();

	// Initialize the store when data loads
	$effect(() => {
		registrantStore.set(data.guestList);
	});

	// Handler functions
	const handleResendQR = (guestId: string) => {
		console.log('Resending QR code for guest:', guestId);
	};

	function handleQRButtonClick(event: Event) {
		event.stopPropagation();
	}

	function handleDownloadCSV() {
		downloadCSV($filteredGuests);
	}

	function handleCheckIn(guestId: string) {
		updateRegistrant(guestId, { status: 'registered' });
	}
</script>

<div class="space-y-8" in:fly={{ y: -50, duration: 200 }}>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<Card icon="fa-solid fa-users text-blue" iconText="Guests" content={$filteredGuests.length.toString()}>
			<Modal>
				{#snippet button()}
					<h1 class="text-primary cursor-pointer text-sm">Email Blast</h1>
				{/snippet}
				{#snippet content()}
					<EmailBlastForm />
				{/snippet}
			</Modal>
		</Card>
		<Card icon="fa-solid fa-dollar-sign text-green" iconText="Income" content="₱32,550.00">
			<Modal>
				{#snippet button()}
					<h1 class="text-green cursor-pointer text-sm">View Breakdown</h1>
				{/snippet}
				{#snippet header()}
					<div>View Breakdown Header</div>
				{/snippet}
				{#snippet content()}
					<div>List the Breakdown here</div>
				{/snippet}
			</Modal>
		</Card>
	</div>
	<div class="rounded-xl border border-gray-200 shadow-sm sm:p-6">
		<div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
			<h2 class="text-xl font-semibold text-gray-900">Guest List</h2>
			<div class="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-4">
				<Button
					onClick={handleDownloadCSV}
					label="Download CSV"
					className="bg-gray-100 px-4 py-2 hover:bg-gray-200 rounded-lg"
				/>
				<Button
					onClick={() => {}}
					label="See full list"
					className="bg-primary text-white px-4 py-2 rounded-lg"
				/>
			</div>
		</div>


		<div class="mb-6 flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between">
			<div class="flex-grow max-w-md flex items-center border border-gray-200 rounded-lg bg-gray-50 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-spread-px">
			  <i class="fa-solid fa-search pl-3 text-gray-400"></i>
			  <input
				type="text"
				placeholder="Search guests..."
				bind:value={$searchQuery}
				class="w-full pl-3 pr-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none rounded-lg focus:ring-0 md:pl-8"
			  />
			</div>
	  
			<div class="flex flex-col gap-2 md:flex-row md:gap-4">
			  <select
				bind:value={$guestStatusFilter}
				class="focus:ring-blue cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 md:text-base"
			  >
				<option value="all">All Guests</option>
				<option value="registered">Registered</option>
				<option value="pending">Pending</option>
			  </select>
			  <select
				class="focus:ring-blue cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 md:text-base"
			  >
				<option value="name">Name, Email...</option>
				<option value="date">Registration Date</option>
				<option value="status">Status</option>
			  </select>
			</div>
		  </div>

		<div class="space-y-4">
			{#each $paginatedGuests as guest (guest.id)}
				<div>
					<Modal dialogClass="w-full">
						{#snippet button()}
							<div
								class="flex cursor-pointer flex-col justify-between gap-4 rounded-lg bg-gray-100 p-4 transition-colors hover:bg-gray-300 sm:flex-row sm:items-center"
							>
								<div class="flex items-center gap-4 text-left">
									<img src={guest.avatar} alt={guest.name} class="h-10 w-10 rounded-full" />
									<div>
										<h3 class="font-medium text-gray-900">{guest.name}</h3>
										<p class="text-sm text-gray-500">{guest.email}</p>
									</div>
								</div>
								<div
									class="flex flex-wrap items-center justify-between gap-2 sm:justify-end sm:gap-4"
								>
									<span class="order-1 text-sm text-gray-500 sm:order-none"
									>{guest.registrationDate}</span
									>
									<span
										class={`rounded-full px-3 py-1 text-xs font-medium ${
											guest.status === 'registered'
												? 'bg-green-100 text-green-700'
												: 'bg-yellow-100 text-yellow-700'
										} order-2 sm:order-none`}
									>
										{guest.status}
									</span>
									<div class="order-3 sm:order-none">
										{#if guest.status !== 'pending'}
											<button onclick={handleQRButtonClick}>
												<Modal dialogClass="max-w-md">
													{#snippet button()}
														<button
															class="flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors border-1 cursor-pointer text-red-500 hover:border-red-600 hover:bg-red-200 hover:text-red-600"
														>
															<i class="fa-solid fa-paper-plane"></i>
															<span class="hidden sm:inline">Resend QR Code</span>
														</button>
													{/snippet}
													{#snippet content()}
														<div class="text-center">
															<i class="fa-solid fa-qr-code text-4xl text-primary mb-4"></i>
															<h2 class="text-xl font-semibold mb-2">Resend QR Code</h2>
															<p class="text-gray-600 mb-6">
																Are you sure you want to resend the QR code to {guest.name}?
															</p>
															<div class="flex justify-center gap-4">
																<Button
																	onClick={() => {}}
																	label="Cancel"
																	className="bg-gray-300 w-full p-2 rounded-lg"
																/>
																<Button
																	onClick={() => handleResendQR(guest.id)}
																	label="Resend"
																	className="bg-primary w-full p-2 text-white rounded-lg"
																/>
															</div>
														</div>
													{/snippet}
												</Modal>
											</button>
										{:else}
											<button
												class="flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors cursor-not-allowed bg-[#E2E2E2] text-[#B7B7B7]"
												disabled
											>
												<i class="fa-solid fa-paper-plane"></i>
												<span class="hidden sm:inline">Resend QR Code</span>
											</button>
										{/if}
									</div>
								</div>
							</div>
						{/snippet}
						{#snippet content()}
							<div class="mb-2 text-gray-500">Additional Info</div>
							<div class="grid grid-cols-1 gap-5">
								<div>
									<p class="font-medium">First Name</p>
									<p>{guest.name}</p>
								</div>
								<div>
									<p class="font-medium">Email</p>
									<p>{guest.email}</p>
								</div>
								<div>
									<p class="font-medium">Date Registered</p>
									<p>{guest.registrationDate}</p>
								</div>
								<div>
									<p class="font-medium">Status</p>
									<p>{guest.status}</p>
								</div>
								<div class="flex justify-between gap-5">
									<Button
										onClick={() => {}}
										label="Resend Email"
										className="bg-gray-300 w-full p-2 rounded-lg"
									/>
									<Button
										onClick={() => handleCheckIn(guest.id)}
										label="Check-In"
										className="bg-primary w-full p-2 text-white rounded-lg"
									/>
								</div>
							</div>
						{/snippet}
					</Modal>
				</div>
			{/each}
			<div class="pb-5 sm:pb-0">
				<Pagination/>
			</div>
		</div>
	</div>
</div>