<script lang="ts">
    export let label: string;
    export let value: string;
    export let required = false;
    export let placeholder = '';
    export let className = '';
  </script>
  
  <div class={className}>
    <label class="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      bind:value
      {placeholder}
      {required}
      class="text-black w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
    />
  </div>