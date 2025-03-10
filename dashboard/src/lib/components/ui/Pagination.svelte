<script lang="ts">
	export let currentPage = 1;
	export let totalItems = 0;
	export let itemsPerPage = 3;
	export let onPageChange: (page: number) => void;

	$: totalPages = Math.ceil(totalItems / itemsPerPage);
	$: startItem = (currentPage - 1) * itemsPerPage + 1;
	$: endItem = Math.min(currentPage * itemsPerPage, totalItems);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			onPageChange(page);
		}
	};

	$: visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1)
		.filter((page) => {
			// Always show first and last pages
			if (page === 1 || page === totalPages) return true;
			// Show pages around current page
			return Math.abs(page - currentPage) <= 1;
		})
		.reduce(
			(acc, page, i, arr) => {
				if (i > 0 && page - arr[i - 1] > 1) {
					// Add ellipsis between non-consecutive pages
					acc.push('...');
				}
				acc.push(page);
				return acc;
			},
			[] as (number | string)[]
		);
</script>

<div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
	<!-- Mobile pagination -->
	<div class="flex flex-1 justify-between sm:hidden">
		<button
			class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
			on:click={() => handlePageChange(currentPage - 1)}
			disabled={currentPage === 1}
		>
			Previous
		</button>
		<button
			class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
			on:click={() => handlePageChange(currentPage + 1)}
			disabled={currentPage === totalPages}
		>
			Next
		</button>
	</div>

	<!-- Desktop pagination -->
	<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
		<div>
			<p class="text-sm text-gray-700">
				Showing
				<span class="font-medium">{startItem}</span>
				to
				<span class="font-medium">{endItem}</span>
				of
				<span class="font-medium">{totalItems}</span>
				results
			</p>
		</div>
		<div>
			<nav class="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
				<!-- Previous button -->
				<button
					class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
					on:click={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					<span class="sr-only">Previous</span>
					<svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path
							fill-rule="evenodd"
							d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>

				<!-- Page numbers -->
				{#each visiblePages as page}
					{#if typeof page === 'string'}
						<span
							class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0"
						>
							{page}
						</span>
					{:else}
						<button
							class="relative inline-flex items-center px-4 py-2 text-sm font-semibold {currentPage ===
							page
								? 'z-10 bg-red-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'
								: 'text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50'} focus:z-20 focus:outline-offset-0"
							on:click={() => handlePageChange(page)}
							aria-current={currentPage === page ? 'page' : undefined}
						>
							{page}
						</button>
					{/if}
				{/each}

				<!-- Next button -->
				<button
					class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
					on:click={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					<span class="sr-only">Next</span>
					<svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path
							fill-rule="evenodd"
							d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</nav>
		</div>
	</div>
</div>
