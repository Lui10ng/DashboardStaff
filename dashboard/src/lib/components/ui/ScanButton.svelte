<script lang="ts">
    export let onClick: () => void = () => {};
    export let containerClass = "";
  </script>
  
  <button
    class="flex items-center gap-2 bg-white rounded-full px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 border border-gray-200 {containerClass}"
    on:click={onClick}
  >
    <svg 
      class="w-4 h-4 text-red-500" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2"
    >
      <path 
        d="M7 3H5C3.89543 3 3 3.89543 3 5V7M17 3H19C20.1046 3 21 3.89543 21 5V7M7 21H5C3.89543 21 3 20.1046 3 19V17M17 21H19C20.1046 21 21 20.1046 21 19V17" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      />
    </svg>
    <span>Scan</span>
  </button>
  
  <style>
    button {
      transition: all 0.2s ease-in-out;
    }
  
    button:hover {
      transform: translateY(-1px);
    }
  
    button:active {
      transform: translateY(0px);
    }
  </style>