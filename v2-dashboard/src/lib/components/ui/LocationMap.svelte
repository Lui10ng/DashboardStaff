<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';
	import 'leaflet-geosearch/dist/geosearch.css';

	// Props
	export let selectedLocation = '';
	export let text = '';

	// Internal state
	let map: any;
	let locationSuggestions: any[] = [];
	let searchProvider: any;
	let isLoadingSuggestions = false;
	let L: any;
	let searchTimeout: ReturnType<typeof setTimeout>;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		locationChange: string;
		locationSelect: string;
	}>();

	onMount(() => {
		// Initialize map asynchronously
		initMap();
		
		// Return cleanup function directly (not wrapped in a Promise)
		return () => {
			if (map) map.remove();
			if (searchTimeout) clearTimeout(searchTimeout);
		};
	});
	
	// Separate async initialization function
	const initMap = async () => {
		const leaflet = await import('leaflet');
		L = leaflet.default;
		const { OpenStreetMapProvider } = await import('leaflet-geosearch');

		searchProvider = new OpenStreetMapProvider();

		map = L.map('map').setView([12.8797, 121.774], 6);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors'
		}).addTo(map);

		// If location is already set, add a marker
		if (selectedLocation) {
			handleSearchLocation(selectedLocation);
		}
	};

	const handleLocationInput = async (event: Event) => {
		const input = (event.target as HTMLInputElement).value;
		selectedLocation = input;
		dispatch('locationChange', selectedLocation);

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
				const results = await searchProvider.search({ 
					query: input,
					country: 'PH'
				});
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
		dispatch('locationSelect', selectedLocation);

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

	const handleClearLocation = () => {
		selectedLocation = '';
		locationSuggestions = [];
		dispatch('locationChange', selectedLocation);

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
	};

	// Function to search location and update map when component is initialized with a location
	const handleSearchLocation = async (locationText: string) => {
		if (!searchProvider || !locationText) return;
		
		try {
			const results = await searchProvider.search({ query: locationText, countryCode: 'PH' });
			if (results.length > 0) {
				const location = results[0];
				const { x, y } = location;
				
				if (map) {
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
			}
		} catch (error) {
			console.error('Error searching for location:', error);
		}
	};
</script>

<div class="space-y-2">
	<div class="relative">
		<div class="relative flex items-center">
			<span class="absolute left-3 text-gray-400">
				<i class="fa-solid fa-location-dot text-xl"></i>
			</span>
			<input
				type="text"
				placeholder="Search for a location..."
				name="location"
				bind:value={selectedLocation}
				on:input={handleLocationInput}
				class={`prose max-w-none w-full rounded-lg border border-gray-200 py-3 pr-10 pl-10 ${text}`}
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
					<div class="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-500"></div>
				</div>
			{/if}
		</div>

		<!-- Location Suggestions Dropdown -->
		{#if locationSuggestions.length > 0}
			<div class="absolute right-0 left-0 z-[90] mt-1 rounded-lg border border-gray-200 shadow-lg bg-white">
				{#each locationSuggestions as suggestion}
					<button
						class="prose w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
						on:click={() => handleLocationSelect(suggestion)}
					>
						{suggestion.label}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<div id="map" class="relative z-0 h-64 w-full rounded-lg border border-gray-200"></div>
</div> 