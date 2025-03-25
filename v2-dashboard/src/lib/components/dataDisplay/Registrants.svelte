<script>
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import { guestList } from '$lib/stores/data';
	import { Dialog } from 'bits-ui';
	import Modal from '../ui/Modal.svelte';
	
</script>

<div class="space-y-8">
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<Card  icon="fa-solid fa-users text-blue" iconText="Guests" content="250">
			<Modal buttonText="Email Blast" buttonClass="text-sm text-primary cursor-pointer">
				{#snippet header()}
					<div class="flex w-full items-center justify-center text-lg font-semibold tracking-tight">
						<div class="flex items-start justify-between mb-4 sm:mb-6">
							<div class="flex items-center gap-2 sm:gap-3">
							<div class="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center">
								<i class="fa-solid fa-envelope text-gray-500"></i>
							</div>
							<div>
								<h2 class="text-lg sm:text-xl font-semibold text-gray-800">Send Blast</h2>
								<p class="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
								Guests will receive the blast via email, SMS or in-app notification.
								</p>
							</div>
							</div>
							<Dialog.Close
								class="p-2 cursor-pointer text-gray-500"
							>
								<i class="fa-solid fa-xmark"></i>
							</Dialog.Close>
						</div>
					</div>
				{/snippet}
				{#snippet content()}
					<form class="space-y-5">
						<div class="space-y-2">
							<label for="name" class="block text-sm font-medium text-gray-700">Recipients</label>
							<div class="relative">
							<input
								type="text"
								placeholder="Search guests..."
								
								class="w-full p-2 sm:p-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm outline-none pl-9 sm:pl-10"
							/>
							<i class="fa-solid fa-magnifying-glass text-gray-400 absolute left-2.5 sm:left-3 top-2.5 sm:top-3"></i>
							</div>
						</div>
						<div class="space-y-2">
							<label for="message" class="block text-sm font-medium text-gray-700">Message</label>
							<textarea
							rows="4"
							class="w-full p-2 sm:p-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Type your message..."
							></textarea>
						</div>
						<div class="flex w-full justify-between">
							<div>
								<Dialog.Close
									class="bg-gray-400 px-4 py-2 rounded-lg cursor-pointer"
								>
									Cancel
								</Dialog.Close>
							</div>
							<div class="flex gap-3">
								<Dialog.Close
									class="bg-primary w-32 py-2 text-white rounded-lg cursor-pointer"
								>
									Schedule
								</Dialog.Close>
								<Dialog.Close
									class="bg-blue w-32 py-2 text-white rounded-lg cursor-pointer"
								>
									Schedule Blast
								</Dialog.Close>
							</div>
						</div>
					</form>
				{/snippet}
			</Modal>
		</Card>
		<Card  icon="fa-solid fa-dollar-sign text-green" iconText="Income" content="₱32,550.00">
			<Modal buttonText="View breakdown" buttonClass="text-sm text-green cursor-pointer">
				{#snippet header()}
					<div>
						View Breakdown Header
					</div>
				{/snippet}
				{#snippet content()}
					<div>
						List the Breakdown here
					</div>
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
				<Button onClick={() => {}} label="See full list" className="bg-primary text-white px-4 py-2 rounded-lg" />
			</div>
		</div>

		<div class="mb-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
			<div class="relative flex-1">
				<input
					type="text"
					placeholder="Search guests..."
					class="focus:ring-blue w-full rounded-lg border border-gray-200 bg-gray-50 px-10 py-2 text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none sm:text-base"
				/>

				<i class="fa-solid fa-magnifying-glass absolute top-2.5 left-3 h-5 w-5 text-gray-400"></i>
			</div>
			<div class="flex flex-col gap-2 sm:flex-row sm:gap-4">
				<select
					class="focus:ring-blue cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 focus:ring-2 focus:outline-none sm:text-base"
				>
					<option value="all">All Guests</option>
					<option value="registered">Registered</option>
					<option value="pending">Pending</option>
				</select>
				<select
					class="focus:ring-blue cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 focus:ring-2 focus:outline-none sm:text-base"
				>
					<option value="name">Name, Email...</option>
					<option value="date">Registration Date</option>
					<option value="status">Status</option>
				</select>
			</div>
		</div>

		<!-- Guest List Items -->
		<div class="space-y-4">
			{#each guestList as guest (guest.id)}

				<div
					class="flex cursor-pointer flex-col justify-between gap-4 rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100 sm:flex-row sm:items-center"
				>
					<div class="flex items-center gap-4">
						<img src={guest.avatar} alt={guest.name} class="h-10 w-10 rounded-full" />
						<div class="flex-1">
							<h3 class="font-medium text-gray-900">{guest.name}</h3>
							<p class="text-sm text-gray-500">{guest.email}</p>
						</div>
					</div>
					<div class="flex flex-wrap items-center justify-between gap-2 sm:justify-end sm:gap-4">
						<span class="order-1 text-sm text-gray-500 sm:order-none">{guest.registrationDate}</span
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
									: 'cursor-pointer border-1 text-red-500 hover:border-red-600 hover:bg-red-200 hover:text-red-600'
							}`}
							disabled={guest.status === 'pending'}
						>
							<i class="fa-solid fa-location-arrow text-xl"></i>
							<span class="hidden sm:inline">Resend QR Code</span>
						</button>
					</div>
				</div>
			{/each}
			<div class="pb-5 sm:pb-0">
				<Pagination total={300} />
			</div>
		</div>
	</div>
</div>

