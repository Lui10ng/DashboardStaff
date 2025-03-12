<script lang="ts">
    import { isCheckingIn } from '../../stores/attendees';
  
    export let showLabel = true;  // Optional prop to control label visibility
    export let containerClass = ""; // Optional prop for additional container classes
  </script>
  
  <div class="flex items-center bg-gray-200 rounded-full p-1 w-32 {containerClass}">
    <button
      class="flex-1 py-1 px-3 rounded-full text-sm font-medium transition-all duration-200 text-center"
      class:bg-green-500={$isCheckingIn}
      class:text-white={$isCheckingIn}
      class:text-gray-600={!$isCheckingIn}
      on:click={() => isCheckingIn.set(true)}
    >
      {#if showLabel}IN{/if}
    </button>
    <button
      class="flex-1 py-1 px-3 rounded-full text-sm font-medium transition-all duration-200 text-center"
      class:bg-red-500={!$isCheckingIn}
      class:text-white={!$isCheckingIn}
      class:text-gray-600={$isCheckingIn}
      on:click={() => isCheckingIn.set(false)}
    >
      {#if showLabel}OUT{/if}
    </button>
  </div>