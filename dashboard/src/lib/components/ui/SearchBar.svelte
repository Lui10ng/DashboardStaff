<script lang="ts">
    import { searchQuery } from '../../stores/attendees';
  </script>
  
  <div class="bg-gray-50 rounded-md px-4 py-2 flex items-center space-x-2 mb-4">
    <svg
      class="w-4 h-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
    <input
      type="text"
      bind:value={$searchQuery}
      placeholder="Search guest"
      class="bg-transparent w-full outline-none text-sm text-gray-600 placeholder-gray-400"
    />
  </div>