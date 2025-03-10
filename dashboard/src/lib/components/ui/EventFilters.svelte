<script lang="ts">
	export let searchQuery = '';
	export let selectedStatus = 'All Events';
	export let sortBy = 'Sort by Date';

	export let statusOptions: string[] = ['All Events', 'Live', 'Upcoming', 'Past', 'Draft'];
	export let sortOptions: string[] = ['Sort by Date', 'Newest First', 'Oldest First'];

	let isStatusOpen = false;
	let isSortOpen = false;

	const handleSearchInput = (event: Event) => {
		const target = event.target as HTMLInputElement;
		searchQuery = target.value;
	};

	const handleStatusSelect = (status: string) => {
		selectedStatus = status;
		isStatusOpen = false;
	};

	const handleSortSelect = (sort: string) => {
		sortBy = sort;
		isSortOpen = false;
	};

	const handleClickOutside = () => {
		isStatusOpen = false;
		isSortOpen = false;
	};
</script>

<div class="flex flex-col gap-4 md:flex-row md:items-center">
	<!-- Search -->
	<div class="relative flex-1 md:max-w-[300px]">
		<i class="ri-search-line absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" ></i>
		<input
			type="text"
			value={searchQuery}
			on:input={handleSearchInput}
			placeholder="Search events..."
			class="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
		/>
	</div>

	<!-- Filters -->
	<div class="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
		<!-- Status Dropdown -->
		<div class="relative inline-block text-left">
			<button
				type="button"
				class="inline-flex w-[200px] items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
				on:click={() => (isStatusOpen = !isStatusOpen)}
				aria-expanded={isStatusOpen}
				aria-haspopup="true"
			>
				{selectedStatus}
				<svg
					class="-mr-1 size-5 text-gray-400 transition-transform"
					class:rotate-180={isStatusOpen}
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>

			{#if isStatusOpen}
				<div
					class="ring-opacity-5 absolute right-0 z-10 mt-2 w-[200px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black transition-all"
					role="menu"
					aria-orientation="vertical"
					tabindex="-1"
				>
					<div class="py-1" role="none">
						{#each statusOptions as status}
							<button
								class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
								class:bg-gray-100={selectedStatus === status}
								role="menuitem"
								on:click={() => handleStatusSelect(status)}
							>
								{status}
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<!-- Sort Dropdown -->
		<div class="relative inline-block text-left">
			<button
				type="button"
				class="inline-flex w-[200px] items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
				on:click={() => (isSortOpen = !isSortOpen)}
				aria-expanded={isSortOpen}
				aria-haspopup="true"
			>
				{sortBy}
				<svg
					class="-mr-1 size-5 text-gray-400 transition-transform"
					class:rotate-180={isSortOpen}
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>

			{#if isSortOpen}
				<div
					class="ring-opacity-5 absolute right-0 z-10 mt-2 w-[200px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black transition-all"
					role="menu"
					aria-orientation="vertical"
					tabindex="-1"
				>
					<div class="py-1" role="none">
						{#each sortOptions as sort}
							<button
								class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
								class:bg-gray-100={sortBy === sort}
								role="menuitem"
								on:click={() => handleSortSelect(sort)}
							>
								{sort}
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
