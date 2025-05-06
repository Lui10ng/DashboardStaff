<script lang="ts">
	import { goto } from '$app/navigation';
	import { Tabs } from 'bits-ui';

	let { children, data } = $props();

	let activeMainTab = $state('ticket');

	const handleTabChange = (tab: string) => {
		goto(`/${data.eventId}/merchant/${tab}`);
	};

	$effect(() => {
		if (data.pathname.includes('ticket')) {
			activeMainTab = 'ticket';
		} else if (data.pathname.includes('donation')) {
			activeMainTab = 'donation';
		} else {
			activeMainTab = 'store';
		}
	});
</script>

<div
	class="flex flex-col items-start justify-between border border-gray-200 bg-white px-4 py-4 md:flex-row md:items-center md:px-6"
>
	<div class="mb-4 flex flex-col md:mb-0 md:flex-row md:items-center">
		<div class="mb-2 font-medium text-gray-800 md:mb-0">Merchant</div>
		<div class="flex items-center md:ml-2">
			<span class="mr-1 inline-block h-2 w-2 rounded-full bg-green-500"></span>
			<span class="text-xs text-gray-500">Test Mode Active</span>
		</div>
		<div class="mt-2 text-xs text-gray-500 md:ml-2 md:mt-0">
			Transactions will be logged as "test transaction".
			<a href="#contactus" class="text-blue-600 hover:underline">Contact us here</a> to enable receiving
			live payments.
		</div>
	</div>
	<button
		class="flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-red-500 md:w-auto"
	>
		<i class="fa-solid fa-phone mr-2"></i>
		Contact Us Here
	</button>
</div>

<Tabs.Root
	value={activeMainTab}
	onValueChange={(value) => (activeMainTab = value)}
	class="my-8 w-full "
>
	<Tabs.List class="flex space-x-4 border-b border-gray-200">
		<Tabs.Trigger
			onclick={() => handleTabChange('ticket')}
			value="ticket"
			class="border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none data-[state=active]:border-[#DF4D60] data-[state=inactive]:border-transparent data-[state=active]:text-[#DF4D60] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:border-gray-300 data-[state=inactive]:hover:text-gray-700"
			aria-label="Switch to Tickets tab"
		>
			<div class="flex items-center">
				<i class="fa-solid fa-ticket-simple pe-2"></i>
				Tickets
			</div>
		</Tabs.Trigger>

		<Tabs.Trigger
			onclick={() => handleTabChange('donation')}
			value="donation"
			class="border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none data-[state=active]:border-[#DF4D60] data-[state=inactive]:border-transparent data-[state=active]:text-[#DF4D60] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:border-gray-300 data-[state=inactive]:hover:text-gray-700"
			aria-label="Switch to Donations tab"
		>
			<div class="flex items-center">
				<i class="fa-solid fa-hand-holding-heart pe-2"></i>
				Donations
			</div>
		</Tabs.Trigger>

		<Tabs.Trigger
			onclick={() => handleTabChange('store')}
			value="store"
			class="border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none data-[state=active]:border-[#DF4D60] data-[state=inactive]:border-transparent data-[state=active]:text-[#DF4D60] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:border-gray-300 data-[state=inactive]:hover:text-gray-700"
			aria-label="Switch to Store tab"
		>
			<div class="flex items-center">
				<i class="fa-solid fa-store pe-2"></i>
				Store
			</div>
		</Tabs.Trigger>
	</Tabs.List>
</Tabs.Root>
{@render children()}
