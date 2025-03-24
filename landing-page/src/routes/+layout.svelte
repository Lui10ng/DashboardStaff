<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import MessengerQuickChat from '$lib/components/MessengerQuickChat.svelte';
	import Lenis from 'lenis';
	import 'lenis/dist/lenis.css';
	import { browser } from '$app/environment';
	import { lenisInstance } from '$lib/stores/lenis';

	export let data;

	// Function to handle Lenis scroll updates
	const raf = (time: number) => {
		$lenisInstance?.raf(time);
		requestAnimationFrame(raf);
	};
	
	let rafId: number;

	onMount(() => {
		// Only initialize Lenis in the browser
		if (browser) {
			const lenis = new Lenis({
				duration: 1.2,
				easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
				smoothWheel: true,
				wheelMultiplier: 1,
				touchMultiplier: 1.5, // Better touch response
				syncTouch: true, // Enable touch synchronization for more natural mobile scrolling
				autoResize: true, // Ensure Lenis updates when window resizes
				lerp: 0.1, // Linear interpolation - helps with smoother scrolling
				infinite: false,
				orientation: 'vertical',
				gestureOrientation: 'vertical',
				anchors: true // Enable anchor links to work properly
			});

			// Update the store with our instance
			lenisInstance.set(lenis);

			// Start the RAF loop
			rafId = requestAnimationFrame(raf);
			
			// Add scroll event listener to track scroll position
			lenis.on('scroll', (e: any) => {
				// You can add any scroll-based functionality here
				// For example, updating scroll-based animations
			});
		}
	});

	onDestroy(() => {
		// Clean up Lenis instance and animation frame on component destruction
		if ($lenisInstance) {
			$lenisInstance.destroy();
			lenisInstance.set(null);
		}
		
		// Clean up the animation frame
		if (rafId) {
			cancelAnimationFrame(rafId);
		}
	});
</script>


<div class="min-h-screen flex flex-col">
<Nav loginUrl={data.urlConfig.loginUrl} />
<slot />
<MessengerQuickChat fbMessengerUrl={data.urlConfig.fbMessengerUrl} />
<Footer />
</div>