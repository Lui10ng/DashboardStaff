<script lang="ts">
    export let label: string;
    export let date: string;
    export let time: string;
    export let required = false;
  </script>
  
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div class="grid grid-cols-2 gap-2">
      <input
        type="date"
        bind:value={date}
        class="text-black border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-red-500 focus:border-red-500"
        {required}
      />
      <input
        type="time"
        bind:value={time}
        class="text-black border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-red-500 focus:border-red-500"
        {required}
      />
    </div>
  </div>