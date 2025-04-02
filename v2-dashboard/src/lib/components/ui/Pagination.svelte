<script lang="ts">
	import { Pagination } from 'bits-ui';
	import { createEventDispatcher } from 'svelte';
	
	// Props with defaults
	export let totalItems = 100;
	export let itemsPerPage = 10;
	export let currentPage = 1;
	
	// Create dispatch function for events
	const dispatch = createEventDispatcher<{
		pageChange: { page: number };
		pageSizeChange: { size: number };
	}>();
	
	// Handle page change
	const handlePageChange = (newPage: number) => {
		currentPage = newPage;
		dispatch('pageChange', { page: newPage });
	};
</script>

<Pagination.Root count={totalItems} perPage={itemsPerPage} page={currentPage} onPageChange={handlePageChange}>
	{#snippet children({ pages, range })}
		<div class="flex flex-col items-center justify-between gap-3 sm:flex-row">
			<p class="order-1 text-center text-sm text-gray-600 sm:order-none sm:text-base">
				Showing {range.start + 1} to {Math.min(range.end, totalItems)} of {totalItems} items
			</p>
			<div class="flex items-center">
				<Pagination.PrevButton
					class="mr-3 inline-flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-gray-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:text-gray-500 sm:size-10"
				>
					<i class="ri-arrow-left-s-line text-lg"></i>
				</Pagination.PrevButton>
				<div class="flex items-center gap-1 sm:gap-2">
					{#each pages as page (page.key)}
						{#if page.type === 'ellipsis'}
							<div class="select-none font-medium">...</div>
						{:else}
							<Pagination.Page
								{page}
								class="data-[selected]:bg-red-600 data-[selected]:text-white inline-flex size-8 cursor-pointer select-none items-center justify-center rounded-lg font-medium hover:bg-gray-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:size-10"
							>
								{page.value}
							</Pagination.Page>
						{/if}
					{/each}
				</div>
				<Pagination.NextButton
					class="ml-3 inline-flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-gray-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:text-gray-500 sm:size-10"
				>
					<i class="ri-arrow-right-s-line text-lg"></i>
				</Pagination.NextButton>
			</div>
		</div>
	{/snippet}
</Pagination.Root>
