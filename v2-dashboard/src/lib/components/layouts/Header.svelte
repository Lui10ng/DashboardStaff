<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import DropdownMenu from '../ui/DropdownMenu.svelte';
	import { page } from '$app/stores';

	const home = () => {
		goto('/');
	};

	const wallet = () => {
		goto('/wallet');
	};
</script>

<div
	class="sticky left-0 top-0 z-10 flex items-center justify-between border border-gray-200 bg-white p-6"
>
	<div class="sm:gap-13 flex gap-5">
		<Button onClick={home}>
			<img src="/images/veent-logo.svg" alt="veent" width="64" height="50" />
		</Button>
		<div class="flex items-center gap-5 font-semibold">
			<Button
				label="Home"
				onClick={home}
				type="button"
				icon="fa-solid fa-house"
				className="flex items-center gap-2 hover:text-primary text-gray-600 font-semibold
				{!$page.url.pathname.includes('wallet') ? 'text-primary' : ''}"
			/>
			<Button
				label="Wallet"
				onClick={wallet}
				type="button"
				icon="fa-solid fa-wallet"
				className="flex items-center gap-2 hover:text-primary text-gray-600 font-semibold 
				{$page.url.pathname.includes('wallet') ? 'text-primary' : ''}"
			/>
		</div>
	</div>
	<DropdownMenu
		className="bg-primary h-10 w-10 rounded-full border text-white"
		classMenu="mt-3"
		alignContent="end"
		buttonText="AD"
		items={['option 1', 'option 2', 'option 3']}
	/>
</div>
