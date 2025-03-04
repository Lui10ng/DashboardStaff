<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
</script>

<div
	in:fly={{ y: 100, duration: 1000, delay: 400, easing: cubicOut }}
	class="float-1 absolute top-[20%] right-[15%] hidden h-4 w-4 rounded-full bg-rose-400 opacity-60 md:block"
></div>
<div
	in:fly={{ y: -100, duration: 1000, delay: 600, easing: cubicOut }}
	class="float-2 absolute top-[35%] right-[25%] hidden h-6 w-6 rounded-full bg-yellow-400 opacity-60 md:block"
></div>
<div
	in:fly={{ x: 100, duration: 1000, delay: 800, easing: cubicOut }}
	class="float-3 absolute bottom-[30%] left-[35%] hidden h-3 w-3 rounded-full bg-rose-300 opacity-60 md:block"
></div>

<style>
	:global(.float-1) {
		animation: float1 12s ease-in-out infinite;
	}

	:global(.float-2) {
		animation: float2 15s ease-in-out infinite;
	}

	:global(.float-3) {
		animation: float3 18s ease-in-out infinite;
	}

	@keyframes float1 {
		0%,
		100% {
			transform: translate(0, 0);
		}
		50% {
			transform: translate(-20px, -15px);
		}
	}

	@keyframes float2 {
		0%,
		100% {
			transform: translate(0, 0);
		}
		50% {
			transform: translate(15px, -20px);
		}
	}

	@keyframes float3 {
		0%,
		100% {
			transform: translate(0, 0);
		}
		50% {
			transform: translate(-15px, 20px);
		}
	}
</style>
