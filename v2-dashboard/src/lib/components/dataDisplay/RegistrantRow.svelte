<script lang="ts">
	import type { GuestProps } from '$lib/types';

	let { guest }: GuestProps = $props();
</script>

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
	<div class="flex flex-wrap items-center justify-between gap-2 sm:justify-end sm:gap-4">
		<span class="order-1 text-sm text-gray-500 sm:order-none">{guest.registrationDate}</span>
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
