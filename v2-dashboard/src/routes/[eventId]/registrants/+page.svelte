<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { registrantStore } from '$lib/stores';
	import { fly } from 'svelte/transition';
	import { Dialog } from 'bits-ui';

	let { data } = $props();

	$effect(() => {
		registrantStore.set(data.guestList);
	});
</script>

<div class="space-y-8" in:fly={{ y: -50, duration: 200 }}>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<Card icon="fa-solid fa-users text-blue" iconText="Guests" content="250">
			<Modal>
				{#snippet button()}
					<h1 class="text-primary cursor-pointer text-sm">Email Blast</h1>
				{/snippet}
				{#snippet content()}
					<div>
						<div
							class="flex w-full items-center justify-center text-lg font-semibold tracking-tight"
						>
							<div class="mb-4 flex items-start justify-between sm:mb-6">
								<div class="flex items-center gap-2 sm:gap-3">
									<div
										class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 sm:h-10 sm:w-10"
									>
										<i class="fa-solid fa-envelope text-gray-500"></i>
									</div>
									<div>
										<h2 class="text-lg font-semibold text-gray-800 sm:text-xl">Send Blast</h2>
										<p class="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">
											Guests will receive the blast via email, SMS or in-app notification.
										</p>
									</div>
								</div>
								<Dialog.Close class="cursor-pointer p-2 text-gray-500">
									<i class="fa-solid fa-xmark"></i>
								</Dialog.Close>
							</div>
						</div>

						<form class="space-y-5">
							<div class="space-y-2">
								<label for="name" class="block text-sm font-medium text-gray-700">Recipients</label>
								<div class="relative">
									<input
										type="text"
										placeholder="Search guests..."
										class="w-full rounded-lg border border-gray-300 bg-white p-2 pl-9 text-sm shadow-sm outline-none sm:p-2.5 sm:pl-10"
									/>
									<i
										class="fa-solid fa-magnifying-glass absolute left-2.5 top-2.5 text-gray-400 sm:left-3 sm:top-3"
									></i>
								</div>
							</div>
							<div class="space-y-2">
								<label for="message" class="block text-sm font-medium text-gray-700">Message</label>
								<textarea
									rows="4"
									class="w-full resize-none rounded-lg border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:p-2.5"
									placeholder="Type your message..."
								></textarea>
							</div>
							<div class="flex w-full justify-between">
								<div>
									<Dialog.Close class="cursor-pointer rounded-lg bg-gray-400 px-4 py-2"
										>Cancel</Dialog.Close
									>
								</div>
								<div class="flex gap-3">
									<Dialog.Close class="bg-primary w-32 cursor-pointer rounded-lg py-2 text-white">
										Schedule
									</Dialog.Close>
									<Dialog.Close class="bg-blue w-32 cursor-pointer rounded-lg py-2 text-white">
										Schedule Blast
									</Dialog.Close>
								</div>
							</div>
						</form>
					</div>
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
					onClick={() => {}}
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

		<div class="mb-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
			<div class="relative flex-1">
				<input
					type="text"
					placeholder="Search guests..."
					class="focus:ring-blue w-full rounded-lg border border-gray-200 bg-gray-50 px-10 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 sm:text-base"
				/>

				<i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 h-5 w-5 text-gray-400"></i>
			</div>
			<div class="flex flex-col gap-2 sm:flex-row sm:gap-4">
				<select
					class="focus:ring-blue cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 sm:text-base"
				>
					<option value="all">All Guests</option>
					<option value="registered">Registered</option>
					<option value="pending">Pending</option>
				</select>
				<select
					class="focus:ring-blue cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 sm:text-base"
				>
					<option value="name">Name, Email...</option>
					<option value="date">Registration Date</option>
					<option value="status">Status</option>
				</select>
			</div>
		</div>

		<!-- Guest List Items -->
		<div class="space-y-4">
			{#each $registrantStore as guest (guest.id)}
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
								<button
									class={`order-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors sm:order-none ${
										guest.status === 'pending'
											? 'cursor-not-allowed bg-[#E2E2E2] text-[#B7B7B7]'
											: 'border-1 cursor-pointer text-red-500 hover:border-red-600 hover:bg-red-200 hover:text-red-600'
									}`}
									disabled={guest.status === 'pending'}
								>
									<i class="fa-solid fa-location-arrow text-xl"></i>
									<span class="hidden sm:inline">Resend QR Code</span>
								</button>
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
									onClick={() => {}}
									label="Check-In"
									className="bg-primary w-full p-2 text-white rounded-lg"
								/>
							</div>
						</div>
					{/snippet}
				</Modal>
			{/each}
			<div class="pb-5 sm:pb-0">
				<Pagination />
			</div>
		</div>
	</div>
</div>
