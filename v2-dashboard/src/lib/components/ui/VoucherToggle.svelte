<script lang="ts">
    export let showVouchers: boolean; // Receive the state from the parent
    export let toggleVouchers: () => void; // Receive the toggle function
  
    const toggleText = showVouchers ? 'Hide Vouchers' : 'Show Vouchers';
  </script>
  
  <button
    aria-label={toggleText}
    type="button"
    class="toggle-button relative h-6 w-10 rounded-full bg-gray-400 p-0.5 transition-colors"
    Onclick={toggleVouchers}
  >
    <span
      class="pointer-events-none absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300"
      style={showVouchers ? 'transform: translateX(100%);' : 'transform: translateX(0);'}
    ></span>
    <span
      class="absolute left-1.5 top-1.5 text-xs font-medium text-gray-700 transition-opacity duration-100"
      style={showVouchers ? 'opacity: 0;' : 'opacity: 1;'}
    >
    </span>
    <span
      class="absolute right-1.5 top-1.5 text-xs font-medium text-gray-700 transition-opacity duration-100"
      style={showVouchers ? 'opacity: 1;' : 'opacity: 0;'}
    >
    </span>
  </button>
  
  <style>
    .toggle-button {
      /* Base styles for the toggle */
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  
    /* Specific styles for the indicator (the circle) */
    .toggle-button span:first-child {
      /* Position the indicator */
    }
  
    /* Styles for the "Show" text */
    .toggle-button span:nth-child(2) {
      /* Position and style the "Show" text */
    }
  
    /* Styles for the "Hide" text */
    .toggle-button span:nth-child(3) {
      /* Position and style the "Hide" text */
    }
  </style>