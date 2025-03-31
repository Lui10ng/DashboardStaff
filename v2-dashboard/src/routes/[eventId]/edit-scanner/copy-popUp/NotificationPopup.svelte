<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    export let show: boolean;
    export let message: string = "Link copied to clipboard!";
    export let logo: string = "/images/veent-logo.svg";
    export let logoAlt: string = "Veent Logo";
    export let autoDismiss: boolean = true;
    export let dismissTime: number = 3000;
    
    const dispatch = createEventDispatcher();
    
    function close() {
      dispatch('close');
    }
    
    import { onDestroy } from 'svelte';

    let timer;
    $: if (show && autoDismiss) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        dispatch('close');
      }, dismissTime);
    }

    onDestroy(() => {
      clearTimeout(timer);
    });
  </script>
  
  {#if show}
      <div class="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-4 flex items-center space-x-3 z-50 border border-gray-200">
          <img src={logo} alt={logoAlt} class="h-6 w-6">
          <span class="text-sm font-medium">{message}</span>
          <button on:click={close} class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
          </button>
      </div>
  {/if}