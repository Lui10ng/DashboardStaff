<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import 'leaflet/dist/leaflet.css';
	import 'leaflet-geosearch/dist/geosearch.css';

	// date picker
	import AirDatepicker, {
		type AirDatepickerOptions,
		type AirDatepickerPosition
	} from 'air-datepicker';
	import 'air-datepicker/air-datepicker.css';
	import localeEn from 'air-datepicker/locale/en';

	import { DEFAULT_DATE_FORMAT } from '$lib/utils/datetime';


	let map: any;
	let eventName = '';
	let subdomain = '';
	let selectedLocation = '';
	let description = '';
	let saveAsDraft = false;
	let locationSuggestions: any[] = [];
	let searchProvider: any;
	let isLoadingSuggestions = false;
	let L: any;
	let searchTimeout: ReturnType<typeof setTimeout>;

	// errors for form validation
	let errors = {
		eventName: '',
		subdomain: '',
		dateTime: '',
		location: '',
		description: ''
	};

	let touched = {
		eventName: false,
		subdomain: false,
		dateTime: false,
		location: false,
		description: false
	};

	let isFormValid = false;

	// Add validation function
	const validateForm = () => {
		// Reset errors
		errors = {
			eventName: '',
			subdomain: '',
			dateTime: '',
			location: '',
			description: ''
		};

		// Validate event name
		if (!eventName.trim()) {
			errors.eventName = 'Event name is required';
		}

		// Validate subdomain
		if (!subdomain.trim()) {
			errors.subdomain = 'Subdomain is required';
		} else if (!/^[a-z0-9-]+$/.test(subdomain)) {
			errors.subdomain = 'Subdomain can only contain lowercase letters, numbers, and hyphens';
		}

		// Validate date/time
		if (!startDate || !endDate || !startTime || !endTime) {
			errors.dateTime = 'Start and end date/time are required';
		} else {
			const startDateTime = new Date(`${startDate}T${startTime}`);
			const endDateTime = new Date(`${endDate}T${endTime}`);

			if (endDateTime <= startDateTime) {
				errors.dateTime = 'End date/time must be after start date/time';
			}
		}

		// Validate location
		if (!selectedLocation.trim()) {
			errors.location = 'Location is required';
		}

		// Validate description
		if (!description.trim()) {
			errors.description = 'Description is required';
		}

		// Update form validity
		isFormValid = Object.values(errors).every((error) => !error);
	};

	// Add reactive statement to validate form when values change
	$: {
		eventName, subdomain, startDate, endDate, startTime, endTime, selectedLocation, description;
		validateForm();
	}

	export let startDate = '';
	export let endDate = '';
	export let startTime = '09:00';
	export let endTime = '17:00';

	let startDatePicker: AirDatepicker<HTMLElement> | undefined;
	let endDatePicker: AirDatepicker<HTMLElement> | undefined;

	// logo and poster
	let logoFile: File | null = null;
	let posterFile: File | null = null;
	let backgroundImageFile: File | null = null;
	let isDraggingLogo = false;
	let isDraggingPoster = false;
	let isDraggingBackgroundImage = false;

	function handleStartDateSelect({ date }: { date: Date | Date[] }) {
		if (endDatePicker && date) {
			const singleDate = Array.isArray(date) ? date[0] : date;
			endDatePicker.update({
				minDate: singleDate
			});

			const currentEndDate = endDatePicker.selectedDates[0];
			if (currentEndDate && currentEndDate < singleDate) {
				endDatePicker.selectDate(singleDate);
			}
		}
	}

	async function handleSubmit() {
		// Mark all fields as touched
		touched.eventName = true;
		touched.subdomain = true;
		touched.dateTime = true;
		touched.location = true;
		touched.description = true;

		validateForm();

		if (!isFormValid) {
			// toast.error('Please fix the errors before submitting');
			return;
		}

		// Create form data object with all fields
		const formData = {
			// Basic Information
			eventName,
			subdomain,
			description,
			saveAsDraft,

			// Date and Time
			dateTime: {
				startDate,
				startTime,
				endDate,
				endTime
			},

			// Location
			location: selectedLocation,

			// Files
			files: {
				logo: logoFile
					? {
							name: logoFile.name,
							type: logoFile.type,
							size: `${(logoFile.size / 1024 / 1024).toFixed(2)}MB`
						}
					: null,
				poster: posterFile
					? {
							name: posterFile.name,
							type: posterFile.type,
							size: `${(posterFile.size / 1024 / 1024).toFixed(2)}MB`
						}
					: null,
				background: backgroundImageFile
					? {
							name: backgroundImageFile.name,
							type: backgroundImageFile.type,
							size: `${(backgroundImageFile.size / 1024 / 1024).toFixed(2)}MB`
						}
					: null
			}
		};

		// Send the form data to the backend
		try {
			const response = await fetch('create/api/saveEvent', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				const responseData = await response.json();
				// toast.success('Event created successfully');

				setTimeout(() => {
					goto('/');
				}, 2000); // Delay redirect for 2 seconds
			} else {
				const errorData = await response.json();
				// toast.error(`Error: ${errorData.error}`);
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			// toast.error('Failed to submit the form');
		}
	}

	onMount(async () => {
		// Initialize map
		const leaflet = await import('leaflet');
		L = leaflet.default;
		const { OpenStreetMapProvider } = await import('leaflet-geosearch');

		searchProvider = new OpenStreetMapProvider();

		map = L.map('map').setView([12.8797, 121.774], 6);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors'
		}).addTo(map);

		// Initialize datepickers
		const commonOptions: AirDatepickerOptions = {
			locale: localeEn,
			dateFormat: DEFAULT_DATE_FORMAT,
			isMobile: true,
			autoClose: true,
			position: 'bottom left' as AirDatepickerPosition,
			classes: 'custom-datepicker',
			buttons: [
				{
					content: 'Today',
					onClick: (dp) => {
						const today = new Date();
						dp.selectDate(today);
						dp.setViewDate(today);
					}
				},
				{
					content: 'Clear',
					onClick: (dp) => {
						dp.clear();
						if (dp.$el.id === 'start-date') {
							startDate = '';
						} else if (dp.$el.id === 'end-date') {
							endDate = '';
						}
						dp.hide();
					}
				}
			],
			minDate: new Date(),
			onSelect: ({ date }) => {
				if (!date) return;
				const formattedDate = date instanceof Date ? date.toISOString().split('T')[0] : '';
				if (startDatePicker && date === startDatePicker.selectedDates[0]) {
					startDate = formattedDate;
				} else if (endDatePicker && date === endDatePicker.selectedDates[0]) {
					endDate = formattedDate;
				}
			}
		};

		// Initialize start date picker
		startDatePicker = new AirDatepicker('#start-date', {
			...commonOptions,
			onSelect: ({ date }) => {
				if (!date) return;
				const selectedDate = date instanceof Date ? date : date[0];
				startDate = selectedDate.toISOString().split('T')[0];

				// Update end date picker min date
				if (endDatePicker) {
					endDatePicker.update({
						minDate: selectedDate
					});

					// If end date is before start date, update it
					const endSelectedDate = endDatePicker.selectedDates[0];
					if (endSelectedDate && endSelectedDate < selectedDate) {
						endDatePicker.selectDate(selectedDate);
					}
				}
			}
		});

		// Initialize end date picker
		endDatePicker = new AirDatepicker('#end-date', {
			...commonOptions,
			onSelect: ({ date }) => {
				if (!date) return;
				const selectedDate = date instanceof Date ? date : date[0];
				endDate = selectedDate.toISOString().split('T')[0];
			}
		});

		// Set initial dates if needed
		if (startDate) {
			startDatePicker.selectDate(new Date(startDate));
		}
		if (endDate) {
			endDatePicker.selectDate(new Date(endDate));
		}

		return () => {
			map.remove();
			if (searchTimeout) {
				clearTimeout(searchTimeout);
			}
			// Cleanup datepickers
			startDatePicker?.destroy();
			endDatePicker?.destroy();
		};
	});

	function handleClearLocation() {
		selectedLocation = '';
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

	let logoPreview: string | null = null;
	let backgroundPreview: string | null = null;
	let posterPreview: string | null = null;

	function handleFileUpload(event: Event, type: 'logo' | 'poster' | 'background') {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const file = input.files[0];
			switch (type) {
				case 'logo':
					logoFile = file;
					logoPreview = URL.createObjectURL(file); // Create a preview URL

					break;
				case 'poster':
					posterFile = file;
					posterPreview = URL.createObjectURL(file); // Create a preview URL

					break;
				case 'background':
					backgroundImageFile = file;
					backgroundPreview = URL.createObjectURL(file); // Create a preview URL

					break;
			}
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		const target = event.currentTarget as HTMLDivElement;
		switch (target.dataset.type) {
			case 'logo':
				isDraggingLogo = true;
				break;
			case 'poster':
				isDraggingPoster = true;
				break;
			case 'background':
				isDraggingBackgroundImage = true;
				break;
		}
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		const target = event.currentTarget as HTMLDivElement;
		switch (target.dataset.type) {
			case 'logo':
				isDraggingLogo = false;
				break;
			case 'poster':
				isDraggingPoster = false;
				break;
			case 'background':
				isDraggingBackgroundImage = false;
				break;
		}
	}

	function handleDrop(event: DragEvent, type: 'logo' | 'poster' | 'background') {
		event.preventDefault();
		isDraggingLogo = false;
		isDraggingPoster = false;
		isDraggingBackgroundImage = false;

		const files = event.dataTransfer?.files;
		if (files && files[0] && files[0].type.startsWith('image/')) {
			const file = files[0];

			switch (type) {
				case 'logo':
					logoFile = file;
					logoPreview = URL.createObjectURL(file);
					break;
				case 'poster':
					posterFile = file;
					posterPreview = URL.createObjectURL(file);
					break;
				case 'background':
					backgroundImageFile = file;
					backgroundPreview = URL.createObjectURL(file);
					break;
			}
		}
	}

	function removeLogo() {
		logoFile = null;
		logoPreview = null;
	}

	const handleLocationInput = async (event: Event) => {
		const input = (event.target as HTMLInputElement).value;
		selectedLocation = input;

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
		selectedLocation = location.label;
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
	onMount(() => {
		return () => {
			if (searchTimeout) {
				clearTimeout(searchTimeout);
			}
		};
	});
</script>

<!-- Add margin-top to account for fixed header -->
<div>
	<form on:submit|preventDefault={handleSubmit} class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<!-- Left Column -->
		<div class="space-y-6">
			<!-- Event Name -->
			<div class="space-y-2">
				<label for="subdomain" class="block text-sm font-medium text-gray-700">Event Name</label>
				<input
					type="text"
					placeholder="Enter your event name"
					bind:value={eventName}
					on:focus={() => (touched.eventName = true)}
					class="focus:border-blue w-full rounded-xl border border-gray-200 px-4 py-4 text-[16px] text-gray-500 placeholder-gray-500 transition-colors focus:outline-none"
				/>
				{#if touched.eventName && errors.eventName}
					<!-- Show error if touched -->
					<p class="text-primary text-sm">{errors.eventName}</p>
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
						placeholder="your-event"
						bind:value={subdomain}
						on:focus={() => (touched.subdomain = true)}
						class="focus:border-blue flex-1 px-2 py-4 text-[16px] text-gray-500 transition-colors focus:border focus:outline-none"
					/>
					<span class="p-4 text-gray-500">.veent.co</span>
				</div>
				{#if touched.subdomain && errors.subdomain}
					<!-- Show error if touched -->
					<p class="text-primary text-sm">{errors.subdomain}</p>
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
						<div class="relative">
							<input
								id="start-date"
								type="text"
								readonly
								placeholder="Select start date"
								class="focus:border-blue w-full cursor-pointer appearance-none rounded-xl border border-gray-200 px-4 py-4 text-gray-500 focus:border focus:outline-none"
							/>
						</div>
						<div class="relative">
							<label for="startTime" class="sr-only">Start Time</label>

							<input
								id="startTime"
								type="time"
								bind:value={startTime}
								on:focus={() => (touched.dateTime = true)}
								placeholder="Select end time"
								class="w-full appearance-none rounded-xl border border-gray-200 px-4 py-4 text-gray-500 focus:outline-none"
							/>
						</div>
					</div>
				</div>

				<!-- End Date/Time -->
				<div class="space-y-2">
					<div class="flex items-center gap-2">
						<i class="ri-time-line text-lg text-gray-400"></i>
						<label for="endDate" class="text-sm font-medium text-gray-700">End</label>
					</div>
					<div class="grid grid-cols-2 gap-4">
						<div class="relative">
							<input
								id="end-date"
								type="text"
								readonly
								placeholder="Select end date"
								class="focus:border-blue w-full cursor-pointer appearance-none rounded-xl border border-gray-200 px-4 py-4 text-gray-500 focus:border focus:outline-none"
							/>
						</div>
						<div class="relative">
							<label for="endTime" class="sr-only">End Time</label>

							<input
								id="endTime"
								type="time"
								bind:value={endTime}
								on:focus={() => (touched.dateTime = true)}
								placeholder="Select end time"
								class="w-full appearance-none rounded-xl border border-gray-200 px-4 py-4 text-gray-500 focus:outline-none"
							/>
						</div>
					</div>
					{#if touched.dateTime && errors.dateTime}
						<!-- Show error if touched -->
						<p class="text-primary text-sm">{errors.dateTime}</p>
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
										bind:value={selectedLocation}
										on:input={handleLocationInput}
										on:focus={() => (touched.location = true)}
										class="w-full rounded-lg border border-gray-200 py-3 pr-10 pl-10"
									/>
									{#if selectedLocation}
										<button
											aria-label="Clear location"
											class="absolute right-2 rounded-full p-1 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700"
											on:click={handleClearLocation}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fill-rule="evenodd"
													d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
													clip-rule="evenodd"
												/>
											</svg>
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

								<!-- Location Suggestions Dropdown -->
								{#if locationSuggestions.length > 0}
									<div
										class="absolute right-0 left-0 z-[90] mt-1 rounded-lg border border-gray-200 shadow-lg"
									>
										{#each locationSuggestions as suggestion}
											<button
												class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
												on:click={() => handleLocationSelect(suggestion)}
											>
												{suggestion.label}
											</button>
										{/each}
									</div>
								{/if}
							</div>

							{#if touched.location && errors.location}
								<!-- Show error if touched -->
								<p class="text-primary text-sm">{errors.location}</p>
							{/if}
						</div>

						<div id="map" class="relative z-0 h-64 w-full rounded-lg border border-gray-200"></div>
					</div>
				</div>

				<!-- Description -->
				<div class="space-y-2">
					<label for="description" class="text-gray-700">Description</label>
					<div class="overflow-hidden">
						<!-- Textarea -->
						<textarea
							bind:value={description}
							on:focus={() => (touched.description = true)}
							placeholder="Describe your event..."
							class="focus:border-blue min-h-[200px] w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-gray-600 placeholder-gray-400 focus:outline-none"
						></textarea>
					</div>
					{#if touched.description && errors.description}
						<!-- Show error if touched -->
						<p class="text-primary text-sm">{errors.description}</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Right Column -->
		<div class="space-y-6">
			<div class="rounded-lg border border-gray-200 p-6 shadow-xs">
				<!-- Preview Button -->
				<div class="mb-6 flex justify-end">
					<button
						class="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
					>
						<i class="ri-eye-line"></i>
						<span>Preview</span>
					</button>
				</div>

				<!-- Company Logo -->
				<div class="mb-2 space-y-2">
					<label for="logo" class="mb-2 block text-sm font-medium text-gray-700">Company Logo</label
					>
					<div
						role="button"
						tabindex="0"
						class="rounded-lg border-2 border-dashed {isDraggingLogo
							? 'border-red-500 bg-red-50'
							: 'border-gray-200'} p-8 transition-colors hover:border-gray-500"
						data-type="logo"
						on:dragover={handleDragOver}
						on:dragleave={handleDragLeave}
						on:drop={(e) => handleDrop(e, 'logo')}
					>
						<div class="flex flex-col items-center">
							{#if logoFile}
								<div class="flex items-center">
									<img
										src={logoPreview}
										alt="Logo Preview"
										class="h-24 w-24 rounded-lg object-cover"
									/>
									<div class="mt-2 flex items-center gap-2"></div>
									<span
										class="m-2 block max-w-[30px] truncate overflow-hidden text-sm whitespace-nowrap text-gray-600 sm:max-w-[350px]"
									>
										{logoFile.name}
									</span>
									<!-- remove logo -->
									<button
										aria-labelledby="remove-logo"
										class="text-primary cursor-pointer p-3 hover:text-red-700"
										on:click={() => ((logoFile = null), (logoPreview = ''))}
									>
										<i class="fa-solid fa-xmark"></i>
									</button>
								</div>
							{:else}
								<i class="fa-solid fa-image text-4xl text-gray-400"></i>
								<p class="mt-4">
									<label class="text-primary cursor-pointer">
										Upload a file
										<input
											type="file"
											class="hidden"
											accept="image/*"
											on:change={(e) => handleFileUpload(e, 'logo')}
										/>
									</label>
									or drag and drop
								</p>
								<p class="mt-2 text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
							{/if}
						</div>
					</div>
				</div>

				<!-- Event Poster -->
				<div class="space-y-2">
					<label for="poster" class="mb-2 block text-sm font-medium text-gray-700"
						>Event Poster</label
					>
					<div
						role="button"
						tabindex="0"
						data-type="poster"
						class="rounded-lg border-2 border-dashed {isDraggingPoster
							? 'border-red-500 bg-red-50'
							: 'border-gray-200'} p-8 transition-colors hover:border-gray-500"
						on:dragover={handleDragOver}
						on:dragleave={handleDragLeave}
						on:drop={(e) => handleDrop(e, 'poster')}
					>
						<div class="flex flex-col items-center">
							{#if posterFile}
								<div class="flex items-center">
									<img
										src={posterPreview}
										alt="Logo Preview"
										class="h-24 w-24 rounded-lg object-cover"
									/>
									<div class="mt-2 flex items-center gap-2"></div>
									<span
										class="m-2 block max-w-[30px] truncate overflow-hidden text-sm whitespace-nowrap text-gray-600 sm:max-w-[350px]"
									>
										{posterFile.name}
									</span>
									<!-- remove poster -->
									<button
										aria-labelledby="remove-poster"
										class="text-primary cursor-pointer p-3 hover:text-red-700"
										on:click={() => ((posterFile = null), (posterPreview = ''))}
									>
										<i class="fa-solid fa-xmark"></i>
									</button>
								</div>
							{:else}
								<i class="fa-solid fa-image text-4xl text-gray-300"></i>
								<p class="mt-4">
									<label class="text-primary cursor-pointer">
										Upload a file
										<input
											type="file"
											class="hidden"
											accept="image/*"
											on:change={(e) => handleFileUpload(e, 'poster')}
										/>
									</label>
									or drag and drop
								</p>
								<p class="mt-2 text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
							{/if}
						</div>
					</div>
				</div>
				<!-- Background Image -->
				<div class="mt-2 space-y-2">
					<label for="background" class="mb-2 block text-sm font-medium text-gray-700">
						Background Image
					</label>
					<div
						role="button"
						tabindex="0"
						data-type="background"
						class="relative rounded-lg border-2 border-dashed {isDraggingBackgroundImage
							? 'border-red-500 bg-red-50'
							: 'border-gray-200'} p-8 transition-colors hover:border-gray-500"
						on:dragover={handleDragOver}
						on:dragleave={handleDragLeave}
						on:drop={(e) => handleDrop(e, 'background')}
					>
						<div class="flex flex-col items-center">
							{#if backgroundImageFile}
								<div class="flex items-center">
									<img
										src={backgroundPreview}
										alt="Logo Preview"
										class=" h-24 w-24 rounded-lg object-cover"
									/>
									<div class="mt-2 flex items-center gap-2"></div>

									<span
										class="m-2 block max-w-[30px] truncate overflow-hidden text-sm whitespace-nowrap text-gray-600 sm:max-w-[350px]"
									>
										{backgroundImageFile.name}
									</span>
									<button
										aria-labelledby="remove-background"
										class="text-primary cursor-pointer p-3 hover:text-red-700"
										on:click={() => ((backgroundImageFile = null), (backgroundPreview = ''))}
									>
										<i class="fa-solid fa-xmark"></i>
									</button>
								</div>
							{:else}
								<i class="fa-solid fa-image text-4xl text-gray-300"></i>
								<p class="mt-4">
									<label class="text-primary cursor-pointer">
										Upload a file
										<input
											type="file"
											class="hidden"
											accept="image/*"
											on:change={(e) => handleFileUpload(e, 'background')}
										/>
									</label>
									or drag and drop
								</p>
								<p class="mt-2 text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
							{/if}
						</div>
					</div>
				</div>

				<!-- Event Options -->
				<div class="mt-5 space-y-4">
					<div class="flex items-center">
						<input
							type="checkbox"
							id="saveAsDraft"
							bind:checked={saveAsDraft}
							class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
						/>
						<label for="saveAsDraft" class="ml-2 block text-sm text-gray-700">Save as Draft</label>
					</div>
				</div>

				<!-- Create Button -->
				<div class="mt-8">
					<button
						type="submit"
						class="w-full rounded-lg bg-red-500 py-4 text-white transition-colors {isFormValid
							? 'hover:bg-red-600'
							: 'cursor-not-allowed opacity-50'}"
					>
						Create Event
					</button>
				</div>
			</div>
		</div>
	</form>
</div>
