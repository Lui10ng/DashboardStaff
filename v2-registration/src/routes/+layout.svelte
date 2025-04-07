<script lang="ts">
	import { ToastProvider } from '@skeletonlabs/skeleton-svelte';
	import '../app.css';

	let { children } = $props();

	import { goto } from '$app/navigation';
  
  function goToBooking() {
    goto('/booking');
  }
</script>

<ToastProvider
	placement="top-end"
	stateSuccess="bg-green-500 text-white text-base p-2"
	stateError="bg-red-500 text-white text-base p-2"
>
	{@render children()}
</ToastProvider>

<style>
	.container {
	  height: 100vh;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	  text-align: center;
	  padding: 20px;
	}
	
	h1 {
	  font-size: 2rem;
	  margin-bottom: 2rem;
	}
	
	button {
	  background-color: #E53935;
	  color: white;
	  border: none;
	  border-radius: 4px;
	  padding: 12px 24px;
	  font-size: 1rem;
	  font-weight: bold;
	  cursor: pointer;
	  transition: background-color 0.2s;
	}
	
	button:hover {
	  background-color: #D32F2F;
	}
  </style>