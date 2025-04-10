<script lang="ts">
	import 'leaflet/dist/leaflet.css';
	import 'leaflet-geosearch/dist/geosearch.css';
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
	import { superForm } from 'sveltekit-superforms';
	import DatePicker from '$lib/components/ui/DatePicker.svelte';
	import RichText from '$lib/components/ui/RichText.svelte';

	let { data } = $props();

	const { form, errors, enhance, delayed, message } = superForm(data);

	let map = $state<any>();
	let locationSuggestions = $state<any[]>([]);
	let searchProvider = $state<any>();
	let isLoadingSuggestions = $state(false);
	let L: any;
	let searchTimeout: ReturnType<typeof setTimeout>;

	$effect(async () => {
		// Initialize map
		const leaflet = await import('leaflet');
		L = leaflet.default;
		const { OpenStreetMapProvider } = await import('leaflet-geosearch');

		searchProvider = new OpenStreetMapProvider();

		map = L.map('map').setView([12.8797, 121.774], 6);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors'
		}).addTo(map);

		return () => {
			map.remove();
			if (searchTimeout) {
				clearTimeout(searchTimeout);
			}
		};
	});

	function handleClearLocation() {
		$form.location = '';
		locationSuggestions = [];

		if (map) {
			// Clear existing markers
			map.eachLayer((layer: any) => {
				if (layer instanceof L.Marker) {
					map.removeLayer(layer);
				}
			});

			// Reset map view to default
			map.setView([12.8797, 121.774], 6);
		}
	}

	const handleLocationInput = async (event: Event) => {
		const input = (event.target as HTMLInputElement).value;
		$form.location = input;

		if (!input.trim()) {
			locationSuggestions = [];
			return;
		}

		// Clear any existing timeout
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		// Set loading state immediately for better UX
		isLoadingSuggestions = true;

		// Debounce the search
		searchTimeout = setTimeout(async () => {
			try {
				const results = await searchProvider.search({ query: input });
				locationSuggestions = results.slice(0, 5); // Limit to 5 suggestions
			} catch (error) {
				console.error('Error fetching location suggestions:', error);
				locationSuggestions = [];
			} finally {
				isLoadingSuggestions = false;
			}
		}, 300); // Wait 300ms after user stops typing
	};

	const handleLocationSelect = (location: any) => {
		$form.location = location.label;
		locationSuggestions = [];

		// Update map view
		if (map) {
			const { x, y } = location;
			map.setView([y, x], 15);

			// Clear existing markers
			map.eachLayer((layer: any) => {
				if (layer instanceof L.Marker) {
					map.removeLayer(layer);
				}
			});

			// Add new marker
			L.marker([y, x]).addTo(map);
		}
	};

	// Make sure to clear timeout on component destroy
	$effect(() => {
		return () => {
			if (searchTimeout) {
				clearTimeout(searchTimeout);
			}
		};
	});
</script>

<form
	action="?/createEvent"
	method="POST"
	use:enhance
	enctype="multipart/form-data"
	class=" grid grid-cols-1 gap-8 lg:grid-cols-2"
>
	<!-- Left Column -->
	<div class="space-y-6">
		<!-- Event Name -->
		<div class="space-y-2">
			<label for="event" class="block text-sm font-medium text-gray-700">Event Name</label>
			<input
				type="text"
				bind:value={$form.event}
				placeholder="Enter your event name"
				name="event"
				class="focus:border-blue w-full rounded-xl border border-gray-200 px-4 py-4 text-[16px] text-gray-500 placeholder-gray-500 transition-colors focus:outline-none"
			/>
			{#if $errors.event}
				<p class="text-primary text-sm">{$errors.event}</p>
			{/if}
		</div>

		<!-- Subdomain -->
		<div class="mt-8 space-y-2">
			<label for="subdomain" class="block text-sm font-medium text-gray-700">Subdomain</label>
			<div class="flex items-center overflow-hidden rounded-xl border border-gray-200">
				<span class="p-4">
					<i class="fa-solid fa-globe text-gray-400"></i>
				</span>
				<input
					type="text"
					name="subdomain"
					bind:value={$form.subdomain}
					placeholder="your-event"
					class="focus:border-blue flex-1 px-2 py-4 text-[16px] text-gray-500 transition-colors focus:border focus:outline-none"
				/>
				<span class="p-4 text-gray-500">.veent.co</span>
			</div>
			{#if $errors.subdomain}
				<p class="text-primary text-sm">{$errors.subdomain}</p>
			{/if}
		</div>

		<!-- Date/Time Section -->
		<div class="mt-8 space-y-6">
			<!-- Start Date/Time -->
			<div class="space-y-2">
				<div class="flex items-center gap-2">
					<i class="fa-regular fa-calendar-minus text-gray-400"></i>
					<label for="startDate" class="text-sm font-medium text-gray-700">Start</label>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<DatePicker name="startDate" />
					<div class="relative">
						<label for="startTime" class="sr-only">Start Time</label>
						<input
							id="startTime"
							type="time"
							name="startTime"
							value="08:00"
							placeholder="Select end time"
							class="w-full appearance-none rounded-xl border border-gray-200 px-4 py-3 text-gray-500 focus:outline-none"
						/>
					</div>
				</div>
				{#if $errors.startDate}
					<p class="text-primary text-sm">{$errors.startDate}</p>
				{/if}
			</div>

			<!-- End Date/Time -->
			<div class="space-y-2">
				<div class="flex items-center gap-2">
					<i class="ri-time-line text-lg text-gray-400"></i>
					<label for="endDate" class="text-sm font-medium text-gray-700">End</label>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<DatePicker name="endDate" />
					<div class="relative">
						<label for="endTime" class="sr-only">End Time</label>
						<input
							id="endTime"
							type="time"
							name="endTime"
							value="17:00"
							placeholder="Select end time"
							class="w-full appearance-none rounded-xl border border-gray-200 px-4 py-4 text-gray-500 focus:outline-none"
						/>
					</div>
				</div>
				{#if $errors.endDate}
					<p class="text-primary text-sm">{$errors.endDate}</p>
				{/if}
			</div>

			<!-- Location (Keep existing map implementation) -->
			<div class="space-y-2">
				<!-- Location -->
				<div class="space-y-2">
					<div class="flex items-center gap-2">
						<label for="location" class="text-sm font-medium text-gray-700">Location</label>
					</div>
					<!-- Search container with fixed positioning context -->
					<div class="relative">
						<!-- Input and suggestions wrapper -->
						<div class="relative">
							<div class="relative flex items-center">
								<span class="absolute left-3 text-gray-400">
									<i class="fa-solid fa-location-dot text-xl"></i>
								</span>
								<input
									type="text"
									placeholder="Search for a location..."
									bind:value={$form.location}
									name="location"
									oninput={handleLocationInput}
									autocomplete="off"
									class="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-10"
								/>

								{#if $form.location}
									<button
										aria-label="Clear location"
										class="absolute right-2 rounded-full p-1 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700"
										onclick={handleClearLocation}
									>
										<i class="fa-solid fa-xmark"></i>
									</button>
								{/if}

								{#if isLoadingSuggestions}
									<div class="absolute right-10">
										<div
											class="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-500"
										></div>
									</div>
								{/if}
							</div>
							{#if $errors.location}
								<p class="text-primary mt-2 text-sm">{$errors.location}</p>
							{/if}

							<!-- Location Suggestions Dropdown -->
							{#if locationSuggestions.length > 0}
								<div
									class="absolute left-0 right-0 z-[90] mt-1 rounded-lg border border-gray-200 bg-white shadow-lg"
								>
									{#each locationSuggestions as suggestion}
										<button
											class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
											onclick={() => handleLocationSelect(suggestion)}
										>
											{suggestion.label}
										</button>
									{/each}
								</div>
							{/if}
						</div>
					</div>

					<div id="map" class="relative z-0 h-64 w-full rounded-lg border border-gray-200"></div>
				</div>
			</div>

			<div class="space-y-2">
				<label for="description" class="text-gray-700">Description</label>
				<RichText />
				{#if $errors.richText}
					<p class="text-primary mt-2 text-sm">{$errors.richText}</p>
				{/if}
			</div>
		</div>
	</div>

	<!-- Right Column -->
	<div class="space-y-6">
		<div class="shadow-xs space-y-5 rounded-lg border border-gray-200 p-6">
			<div class="flex justify-end pb-1">
				<button class="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900">
					<i class="ri-eye-line"></i>
					<span>Preview</span>
				</button>
			</div>

			<div class="space-y-2">
				<label for="logo" class="mb-2 block text-sm font-medium text-gray-700">Company Logo</label>

				<FileUpload
					label="Upload a file or drag here"
					interfaceText="text-primary text-center"
					subtext="PNG, JPG, GIF up to 10MB"
					interfaceSubtext="text-sm text-gray-500"
					name="logo"
					accept="image/*"
					maxFiles={2}
					onFileChange={console.log}
					onFileReject={console.error}
					classes="cursor-pointer rounded-lg border-2 border-dashed"
				>
					{#snippet iconInterface()}
						<i class="fa-solid fa-image text-4xl text-gray-300"></i>
					{/snippet}
				</FileUpload>
				{#if $errors.logo}
					<p class="text-primary text-sm">{$errors.logo}</p>
				{/if}
			</div>

			<div class="space-y-2">
				<label for="poster" class="mb-2 block text-sm font-medium text-gray-700">
					Event Poster
				</label>

				<FileUpload
					label="Upload a file or drag here"
					interfaceText="text-primary text-center"
					subtext="PNG, JPG, GIF up to 10MB"
					interfaceSubtext="text-sm text-gray-500"
					name="poster"
					accept="image/*"
					maxFiles={2}
					onFileChange={console.log}
					onFileReject={console.error}
					classes="cursor-pointer rounded-lg border-2 border-dashed"
				>
					{#snippet iconInterface()}
						<i class="fa-solid fa-image text-4xl text-gray-300"></i>
					{/snippet}
				</FileUpload>
				{#if $errors.poster}
					<p class="text-primary text-sm">{$errors.poster}</p>
				{/if}
			</div>

			<div class="space-y-2">
				<label for="background" class="mb-2 block text-sm font-medium text-gray-700">
					Background Image
				</label>

				<FileUpload
					label="Upload a file or drag here"
					interfaceText="text-primary text-center"
					subtext="PNG, JPG, GIF up to 10MB"
					interfaceSubtext="text-sm text-gray-500"
					name="background"
					accept="image/*"
					maxFiles={2}
					onFileChange={console.log}
					onFileReject={console.error}
					classes="cursor-pointer rounded-lg border-2 border-dashed"
				>
					{#snippet iconInterface()}
						<i class="fa-solid fa-image text-4xl text-gray-300"></i>
					{/snippet}
				</FileUpload>
				{#if $errors.background}
					<p class="text-primary text-sm">{$errors.background}</p>
				{/if}
			</div>

			<button type="submit" class="bg-primary w-full rounded-lg py-4 text-white transition-colors">
				Create Event
			</button>
		</div>
	</div>
</form>
