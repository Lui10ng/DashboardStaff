<script lang="ts">
	import DatePicker from '$lib/components/ui/DatePicker.svelte';
	import LocationMap from '$lib/components/ui/LocationMap.svelte';
	import RichText from '$lib/components/ui/RichText.svelte';
	import { formatDateMMDDYYYY, formatTimeForPicker } from '$lib/utils/formatTime.js';
	import { editEventStore } from '$lib/stores/editEvent.svelte.js';
	import { superForm } from 'sveltekit-superforms';
	import { stateEditEvent } from '$lib/stores/state.svelte';
	import { goto } from '$app/navigation';

	// Access data from props
	let { data } = $props();
	let isRecurring = $state(false);

	// Initialize the edit store with event data from props
	$effect(() => {
		console.log('edit events details', data.eventDetails);
		if (data.eventDetails) {
			editEventStore.initializeEdit(data.eventDetails);
		}
	});

	// Access store data using $derived
	const event = $derived(editEventStore.event);

	// Initialize the form with SuperForm
	const { form, errors, enhance, message } = superForm(data.form);

	message.subscribe(async (msg) => {
		if (msg && msg.success) {
			//add toast here
		}
	});

	function handleCancel() {
		stateEditEvent.open = false;
		goto(`/${data.eventId}/registrants`);
	}

	// Populate form with event data when event changes
	$effect(() => {
		console.log(event.startTime);
		if (event) {
			// Update form with event data
			form.update(($form) => {
				$form.title = event.title;
				$form.subdomain = event.slug;
				$form.location = event.location;

				// Format dates for form inputs (MM-DD-YYYY format)
				$form.startDate = formatDateMMDDYYYY(event.startTime);
				$form.endDate = formatDateMMDDYYYY(event.endTime);

				console.log('startDate', $form.startDate);
				console.log('endDate', $form.endDate);

				// Format times for time inputs (HH:MM format)
				$form.startTime = formatTimeForPicker(event.startTime);
				$form.endTime = formatTimeForPicker(event.endTime);

				return $form;
			});
		}
	});

	// Handle location change
	function handleLocationChange(newLocation: string) {
		editEventStore.updateLocation(newLocation);
		$form.location = newLocation;
	}
</script>

<form action="?/updateEventDetails" method="POST" use:enhance>
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
				<label for="title" class="block text-sm font-medium">Event name</label>
				<input
					type="text"
					id="title"
					name="title"
					bind:value={$form.title}
					class="mt-1 block w-full rounded-md border border-gray-200 px-3 py-3 pl-5 text-sm"
					placeholder="Enter Event name"
				/>
				{#if $errors.title}
					<p class="mt-1 text-sm text-red-500">{$errors.title}</p>
				{/if}
			</div>
			<!-- Subdomain -->
			<div>
				<label for="subdomain" class="block text-sm font-medium text-gray-700"> Subdomain </label>

				<!-- Wrapper that changes background on focus -->
				<div class="group mt-1 flex items-center rounded-lg border border-gray-200 px-3 py-3">
					<i class="fa-solid fa-globe h-4 w-4 text-gray-500"></i>

					<!-- Input Field -->
					<input
						type="text"
						id="subdomain"
						name="subdomain"
						bind:value={$form.subdomain}
						class="ml-2 block w-full border border-transparent bg-transparent px-3 text-sm focus:border-transparent focus:outline-none"
						placeholder="Enter Subdomain"
					/>

					<!-- Domain Extension -->
					<span class="text-[13px] text-[#3E3E3F]"> .veent.co </span>
				</div>
				{#if $errors.subdomain}
					<p class="mt-1 text-sm text-red-500">{$errors.subdomain}</p>
				{/if}
			</div>
			<div>
				<label for="event-address" class="block text-sm font-medium text-gray-700"
					>Event address</label
				>
				<div class="relative mt-1">
					<span class="absolute inset-y-0 left-3 flex items-center">
						<i class="fa-solid fa-location-dot h-4 w-4 text-gray-500"></i>
					</span>

					<input type="hidden" name="location" bind:value={$form.location} />
					<LocationMap
						on:locationChange={(e) => handleLocationChange(e.detail)}
						selectedLocation={$form.location}
						text="text-sm"
					/>
				</div>
				{#if $errors.location}
					<p class="mt-1 text-sm text-red-500">{$errors.location}</p>
				{/if}
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
							<DatePicker name="startDate" label="Start Date" value={$form.startDate} />
							<input
								type="time"
								class="w-full rounded-lg border border-gray-200 px-3 py-3 tracking-wider sm:w-32"
								name="startTime"
								bind:value={$form.startTime}
							/>
						</div>
					</div>
					<div class="flex items-center gap-4">
						<h3 class="w-12 text-sm font-medium text-gray-700">End</h3>
						<div class="flex w-full flex-col gap-2 sm:flex-row">
							<DatePicker name="endDate" label="End Date" value={$form.endDate} />
							<input
								type="time"
								class="w-full rounded-lg border border-gray-200 px-3 py-3 tracking-wider sm:w-32"
								name="endTime"
								bind:value={$form.endTime}
							/>
						</div>
					</div>
				{/if}
				{#if $errors.startDate || $errors.startTime || $errors.endDate || $errors.endTime}
					<p class="mt-1 text-sm text-red-500">
						{$errors.startDate || $errors.startTime || $errors.endDate || $errors.endTime}
					</p>
				{/if}
			</div>
		</div>
		<div class="mb-30 h-80 lg:col-span-1 lg:w-full">
			<label for="event-description" class="mb-2 block text-sm font-medium text-gray-700"
				>Event description</label
			>

			<RichText name="description" description={event.description ?? ''} />
			{#if $errors.description}
				<p class="mt-1 text-sm text-red-500">{$errors.description}</p>
			{/if}
		</div>
	</div>
	<!-- Footer (Responsive Buttons) -->
	<div class="mt-6 flex flex-col justify-end space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
		<button
			type="button"
			class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:text-base"
			onclick={handleCancel}
		>
			Cancel
		</button>
		<button
			type="submit"
			class="bg-primary w-full rounded-md px-5 py-2 text-sm font-medium text-white hover:bg-red-700 sm:w-auto sm:text-base"
			disabled={editEventStore.isLoading}
		>
			{editEventStore.isLoading ? 'Saving...' : 'Save changes'}
		</button>
	</div>

	{#if $message}
		<div
			class="mt-4 rounded-md p-4 {$message.success
				? 'bg-green-100 text-green-800'
				: 'bg-red-100 text-red-800'}"
		>
			{$message.text}
		</div>
	{/if}
</form>
