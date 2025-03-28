<script lang="ts">
  import { Pagination } from "bits-ui";
  import { Select } from "bits-ui";
  
  export let totalItems: number;
  export let itemsPerPage: number = 10;
  export let currentPage: number = 1;
  
  const pageSizeOptions = [
    { label: "5", value: "5" },
    { label: "8", value: "8" },
    { label: "10", value: "10" },
    { label: "15", value: "15" },
    { label: "20", value: "20" },
  ];
  
  // Create function to handle page changes and dispatch event
  const handlePageChange = (newPage: number) => {
    currentPage = newPage;
    dispatch('pageChange', { page: newPage });
  };
  
  // Handle page size change
  const handlePageSizeChange = (newSize: string) => {
    itemsPerPage = parseInt(newSize);
    dispatch('pageSizeChange', { size: parseInt(newSize) });
  };
  
  // Create dispatch function for events
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher<{
    pageChange: { page: number };
    pageSizeChange: { size: number };
  }>();
</script>

<Pagination.Root 
  count={totalItems} 
  perPage={itemsPerPage}
  page={currentPage}
  onPageChange={handlePageChange}>
  {#snippet children({ pages, range })}
    <div class="flex items-center justify-between py-2">
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">Show rows per page</span>
        <Select.Root 
          type="single" 
          items={pageSizeOptions} 
          value={String(itemsPerPage)} 
          onValueChange={(value) => handlePageSizeChange(value)}>
          <Select.Trigger class="inline-flex h-8 w-16 items-center justify-between rounded border border-gray-300 bg-white px-2 text-sm">
            <span>{itemsPerPage}</span>
            <i class="ri-arrow-down-s-line text-gray-500"></i>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content class="z-50 min-w-[6rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-md">
              <Select.Viewport class="p-1">
                {#each pageSizeOptions as option}
                  <Select.Item 
                    value={option.value} 
                    label={option.label}
                    class="flex cursor-pointer items-center rounded px-2 py-1.5 text-sm outline-none hover:bg-gray-100 data-[selected]:bg-gray-100"
                  >
                    {#snippet children({ selected })}
                      <span>{option.label}</span>
                      {#if selected}
                        <span class="ml-auto"><i class="ri-check-line text-gray-600"></i></span>
                      {/if}
                    {/snippet}
                  </Select.Item>
                {/each}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
      
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">
          {range.start + 1}-{Math.min(range.end, totalItems)} of {totalItems}
        </span>
        
        <div class="flex items-center gap-1">
          <Pagination.PrevButton class="flex h-8 w-8 items-center justify-center rounded text-gray-600 hover:bg-gray-100">
            <i class="ri-arrow-left-s-line"></i>
          </Pagination.PrevButton>
          
          <Pagination.NextButton class="flex h-8 w-8 items-center justify-center rounded text-gray-600 hover:bg-gray-100">
            <i class="ri-arrow-right-s-line"></i>
          </Pagination.NextButton>
        </div>
      </div>
    </div>
  {/snippet}
</Pagination.Root>