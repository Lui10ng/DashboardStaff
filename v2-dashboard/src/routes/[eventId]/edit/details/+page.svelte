<script>
	import { enhance } from '$app/forms';
	import DatePicker from '$lib/components/ui/DatePicker.svelte';
	import LocationMap from '$lib/components/ui/LocationMap.svelte';
	import RichText from '$lib/components/ui/RichText.svelte';

	let { data } = $props();
	let isRecurring = $state(false);

	const event = $derived(data.eventDetails);
</script>

<form action="/?/updateEventDetails" method="POST" use:enhance>
	<div class="mb-6">
		<h2 class="mb-2 text-xl font-semibold text-gray-900">Basic information</h2>
		<p class="text-sm text-gray-500">
			Edit your event details below. Changes update automatically on your website.
		</p>
	</div>
	<hr class="mb-6 border-t border-gray-300" />
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr]">
		<div class="max-w-xl space-y-6">
			<div>
				<label for="event-name" class="block text-sm font-medium">Event name</label>
				<input
					type="text"
					id="event-name"
					name="Event Name"
					value={event.title}
					class="mt-1 block w-full rounded-md border border-gray-200 px-3 py-3 pl-5 text-sm"
					placeholder="Enter Event name"
				/>
			</div>
			<!-- Subdomain -->
			<div>
				<label for="subdomain" class="block text-sm font-medium text-gray-700">
					Subdomain (Subdomain.veent.co)
				</label>

				<!-- Wrapper that changes background on focus -->
				<div class="group mt-1 flex items-center rounded-lg border border-gray-200 px-3 py-3">
					<i class="fa-solid fa-globe h-4 w-4 text-gray-500"></i>

					<!-- Input Field -->
					<input
						type="text"
						id="subdomain"
						name="Subdomain"
						value={event.slug}
						class="ml-2 block w-full border border-transparent bg-transparent px-3 text-sm focus:border-transparent focus:outline-none"
						placeholder="Enter Subdomain"
					/>

					<!-- Domain Extension -->
					<span class="text-[13px] text-[#3E3E3F]"> .veent.co </span>
				</div>
			</div>
			<div>
				<label for="event-address" class="block text-sm font-medium text-gray-700"
					>Event address</label
				>
				<div class="relative mt-1">
					<span class="absolute inset-y-0 left-3 flex items-center">
						<i class="fa-solid fa-location-dot h-4 w-4 text-gray-500"></i>
					</span>
					<LocationMap text="text-sm" />
				</div>
			</div>
			<div class="space-y-4">
				<h3 class="text-sm font-medium text-gray-700">Event date</h3>
				<div class="mt-4">
					<label class="inline-flex">
						<input
							type="checkbox"
							class="rounded border-gray-300 text-blue-600"
							name="Is Recurring?"
							bind:checked={isRecurring}
						/>
						<span class="ml-2 text-sm text-gray-700">This is a recurring event</span>
					</label>
				</div>
				{#if !isRecurring}
					<div class="flex items-center gap-4">
						<h3 class="w-12 text-sm font-medium text-gray-700">Start</h3>
						<div class="flex w-full flex-col gap-2 sm:flex-row">
							<DatePicker
								name="startDate"
								className="flex items-center w-full rounded-lg border-gray-200 py-3 text-sm border px-3"
							/>
							<input
								type="time"
								class="w-full rounded-lg border border-gray-200 px-3 py-3 tracking-wider sm:w-32"
								name="Start Time"
							/>
						</div>
					</div>
					<div class="flex items-center gap-4">
						<h3 class="w-12 text-sm font-medium text-gray-700">End</h3>
						<div class="flex w-full flex-col gap-2 sm:flex-row">
							<DatePicker
								name="endDate"
								className="flex items-center w-full rounded-lg border-gray-200 py-3 text-sm border px-3"
							/>
							<input
								type="time"
								class="w-full rounded-lg border border-gray-200 px-3 py-3 tracking-wider sm:w-32"
								name="End Time"
							/>
						</div>
					</div>
				{/if}
			</div>
		</div>
		<div class="mb-30 h-80 lg:col-span-1 lg:w-full">
			<label for="event-description" class="mb-2 block text-sm font-medium text-gray-700"
				>Event description</label
			>
			<RichText />
		</div>
	</div>
	<!-- Footer (Responsive Buttons) -->
	<div class="flex flex-col justify-end space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
		<button
			type="button"
			class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:text-base"
		>
			Cancel
		</button>
		<button
			class="w-full rounded-md bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-red-700 sm:w-auto sm:text-base"
		>
			Save changes
		</button>
	</div>
</form>
