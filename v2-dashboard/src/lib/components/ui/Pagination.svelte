<script lang="ts">
	import { Pagination } from 'bits-ui';
	export let total = 100;
</script>

<Pagination.Root count={total} perPage={10}>
	{#snippet children({ pages, range })}
		<div class="flex flex-col sm:flex-row items-center justify-between gap-3">
			<p class="text-center text-gray-600 text-sm sm:text-base order-1 sm:order-none">
				Showing {range.start + 1} to {range.end} of {total} items
			</p>
			<div class="flex items-center">
				<Pagination.PrevButton
					class="mr-3 inline-flex size-8 sm:size-10 cursor-pointer items-center justify-center rounded-lg hover:bg-gray-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:text-gray-500"
				>
					<i class="fa-solid fa-chevron-left text-lg"></i>
				</Pagination.PrevButton>
				<div class="flex items-center gap-1 sm:gap-2">
					{#each pages as page (page.key)}
						{#if page.type === 'ellipsis'}
							<div class="font-medium select-none">...</div>
						{:else}
							<Pagination.Page
								{page}
								class="hover:bg-dark-10 data-selected:bg-primary inline-flex size-8 sm:size-10 cursor-pointer items-center justify-center rounded-lg font-medium select-none hover:bg-gray-200 active:scale-[0.98]  disabled:cursor-not-allowed disabled:opacity-50 data-selected:text-white"
							>
								{page.value}
							</Pagination.Page>
						{/if}
					{/each}
				</div>
				<Pagination.NextButton
					class="ml-3 inline-flex size-8 sm:size-10 cursor-pointer items-center justify-center rounded-lg  hover:bg-gray-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:text-gray-500"
				>
					<i class="fa-solid fa-chevron-right text-lg"></i>
				</Pagination.NextButton>
			</div>
		</div>
	{/snippet}
</Pagination.Root>
