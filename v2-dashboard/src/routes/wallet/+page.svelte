<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { walletTransactionStore } from '$lib/stores';

	let { data } = $props();

	$effect(() => {
		walletTransactionStore.set(data.walletTransactions);
	});
</script>

<div class="space-y-8">
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<Card icon="fa-solid fa-dollar-sign text-green" iconText="Wallet Balance" content="₱32,550.00">
			<Modal>
				{#snippet button()}
					<h1 class="text-green cursor-pointer text-sm">Wallet Balance</h1>
				{/snippet}
				{#snippet header()}
					<div>Wallet Balance Header</div>
				{/snippet}
				{#snippet content()}
					<div>Wallet content</div>
				{/snippet}
			</Modal>
		</Card>
		<Card icon="fa-solid fa-dollar-sign text-green" iconText="Gross Income" content="₱92,550.00">
			<Modal>
				{#snippet button()}
					<h1 class="text-green cursor-pointer text-sm">Gross Income</h1>
				{/snippet}
				{#snippet header()}
					<div>Gross Income Header</div>
				{/snippet}
				{#snippet content()}
					<div>List the gross income here</div>
				{/snippet}
			</Modal>
		</Card>
	</div>

	<div class="rounded-xl border border-gray-200 shadow-sm sm:p-6">
		<div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
			<h2 class="text-xl font-semibold text-gray-900">Wallet History</h2>
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
					placeholder="Search transaction..."
					class="placeh w-full rounded-lg border border-gray-200 px-10 py-2 text-gray-900 focus:outline-none"
				/>

				<i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 h-5 w-5 text-gray-400"></i>
			</div>
			<div class="flex flex-col gap-2 sm:flex-row sm:gap-4">
				<select
					class="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 focus:outline-none"
				>
					<option value="all">All Transaction</option>
					<option value="registered">Registered</option>
					<option value="pending">Pending</option>
				</select>
				<select
					class="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 focus:outline-none"
				>
					<option value="name">All Events</option>
					<option value="date">Soldanze</option>
					<option value="status">RUN4ME 2025</option>
				</select>
				<select
					class="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 focus:outline-none"
				>
					<option value="name">Date</option>
					<option value="date">March 24, 2025</option>
					<option value="status">March 25, 2025</option>
				</select>
			</div>
		</div>

		<!-- Guest List Items -->
		<div class="space-y-4">
			{#each $walletTransactionStore as transaction (transaction.id)}
				<div
					class="flex flex-col justify-between gap-4 rounded-lg bg-gray-50 p-4 hover:bg-gray-300 sm:flex-row sm:items-center"
				>
					<div class="flex items-center gap-4">
						<img src={transaction.avatar} alt={transaction.name} class="h-10 w-10 rounded-full" />
						<div class="flex-1">
							<h3 class="font-medium text-gray-900">{transaction.name}</h3>
							<p class="text-sm text-gray-500">{transaction.email} | {transaction.phone}</p>
						</div>
					</div>
					<div class="flex flex-wrap items-center justify-between gap-2 sm:justify-end sm:gap-10">
						<div>
							<h3 class="font-medium text-gray-900">{transaction.event}</h3>
							<p class="text-sm text-gray-500 sm:text-end">event</p>
						</div>
						<div>
							<h3 class="font-medium text-gray-900">₱{transaction.amount}</h3>
							<Tooltip
								text={transaction.paymentMethod}
								classText="sm:w-11 truncate text-sm text-gray-500"
								content={transaction.paymentMethod}
								classContent="border bg-white px-2 py-1 rounded-lg text-primary"
							/>
						</div>
						<div>
							<h3 class="text-green font-medium">₱{transaction.netIncome}</h3>
							<p class="text-sm text-gray-500">Net Income</p>
						</div>
						<div>
							<h3 class="font-medium text-gray-900">{transaction.registrationDate}</h3>
							<p class="text-sm text-gray-500">Ref #: {transaction.referenceNo}</p>
						</div>
					</div>
				</div>
			{/each}
			<div class="pb-5 sm:pb-0">
				<Pagination total={70} />
			</div>
		</div>
	</div>
</div>
