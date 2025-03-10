<script lang="ts">
  export let name: string;
  export let price: number;
  export let sold: number;
  export let total: number;
  export let active: boolean = true;
</script>

<div class="bg-white rounded-lg border border-gray-200 p-4">
  <div class="flex space-x-3">
    <div class="w-12 h-16 bg-black rounded-lg"></div>
    <div class="flex-1 min-w-0">
      <div class="flex items-start justify-between">
        <div>
          <h3 class="text-sm font-medium text-gray-900">{name}</h3>
          <p class="text-sm font-bold mt-1">₱{price}</p>
        </div>
        <div class="flex items-center space-x-2">
          {#if active}
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          {/if}
          
          <button class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>
        </div>
      </div>
      <div class="mt-4">
        <div class="bg-gray-100 rounded-full h-1">
          <div 
            class="bg-green-500 rounded-full h-1" 
            style="width: {(sold / total) * 100}%"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">Sold {sold}/{total}</p>
      </div>
    </div>
  </div>
</div>