<script>
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import RegistrantsRow from '$lib/components/dataDisplay/RegistrantRow.svelte';
	import Content from './modal/RegistrantContent.svelte';
	import EmailBlastForm from './modal/EmailBlastForm.svelte';
	import { registrantStore } from '$lib/stores';

	export let data;
	registrantStore.set(data.guestList);
</script>

<div class="space-y-8">
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<Card icon="fa-solid fa-users text-blue" iconText="Guests" content="250">
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
						<RegistrantsRow {guest} />
					{/snippet}
					{#snippet header()}
						<div class="mb-2 text-gray-500">Additional Info</div>
					{/snippet}
					{#snippet content()}
						<Content {guest} />
					{/snippet}
				</Modal>
			{/each}
			<div class="pb-5 sm:pb-0">
				<Pagination total={300} />
			</div>
		</div>
	</div>
</div>
