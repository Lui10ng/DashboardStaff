<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import gsap from 'gsap';
	import DualMarquee from '$lib/components/DualMarquee.svelte';
	import { page } from '$app/stores';

	let mounted = false;
	let isMobile = false;
	let blobContainer: SVGGElement;
	let floatingElements: HTMLElement[] = [];

	const urlConfig = $page.data.urlConfig;

	// Define all 8 blob shapes based on the SVG files
	const blobShapes = [
		// Blob 1
		[
			{ cx: '226.5', cy: '231.5', r: '135.5' },
			{ cx: '424', cy: '333', r: '86' },
			{ cx: '282', cy: '109', r: '56' },
			{ cx: '235.5', cy: '347.5', r: '126.5' },
			{ cx: '393', cy: '436', r: '111' },
			{ cx: '362.5', cy: '206.5', r: '131.5' },
			{ cx: '272.5', cy: '448.5', r: '65.5' }
		],
		// Blob 2
		[
			{ cx: '212.5', cy: '212.5', r: '135.5' },
			{ cx: '408', cy: '334', r: '86' },
			{ cx: '306', cy: '96', r: '56' },
			{ cx: '203.5', cy: '358.5', r: '126.5' },
			{ cx: '404', cy: '449', r: '111' },
			{ cx: '383.5', cy: '227.5', r: '131.5' },
			{ cx: '256.5', cy: '463.5', r: '65.5' }
		],
		// Blob 3 (with rotation 17.8801)
		[
			{ cx: '248.558', cy: '161.558', r: '135.5' },
			{ cx: '384.251', cy: '349.251', r: '86' },
			{ cx: '369.373', cy: '91.3913', r: '56' },
			{ cx: '185.229', cy: '310.229', r: '126.5' },
			{ cx: '343.719', cy: '468.719', r: '111' },
			{ cx: '414.523', cy: '240.523', r: '131.5' },
			{ cx: '206.447', cy: '411.447', r: '65.5' }
		],
		// Blob 4 (with rotation 32.5276)
		[
			{ cx: '300.104', cy: '172.104', r: '135.5' },
			{ cx: '369.085', cy: '368.181', r: '86' },
			{ cx: '437.327', cy: '135.327', r: '56' },
			{ cx: '194.676', cy: '248.676', r: '126.5' },
			{ cx: '300.273', cy: '440.273', r: '111' },
			{ cx: '401.58', cy: '273.58', r: '131.5' },
			{ cx: '195.445', cy: '379.445', r: '65.5' }
		],
		// Blob 5 (with rotation 46.3549)
		[
			{ cx: '332.452', cy: '166.789', r: '135.5' },
			{ cx: '360.303', cy: '382.644', r: '92.9893' },
			{ cx: '473.771', cy: '166.787', r: '56' },
			{ cx: '213.857', cy: '212.097', r: '133.813' },
			{ cx: '264.268', cy: '444.781', r: '124.081' },
			{ cx: '410.918', cy: '306.055', r: '131.5' },
			{ cx: '168.709', cy: '356.494', r: '65.5' }
		],
		// Blob 6 (with rotation 57.2175)
		[
			{ cx: '342.952', cy: '161.952', r: '128.024' },
			{ cx: '343.41', cy: '390.46', r: '92.9893' },
			{ cx: '467.402', cy: '211.402', r: '56' },
			{ cx: '214.551', cy: '185.551', r: '127.01' },
			{ cx: '246.502', cy: '409.502', r: '124.081' },
			{ cx: '409.757', cy: '324.757', r: '131.5' },
			{ cx: '169.114', cy: '325.114', r: '56.5148' }
		],
		// Blob 7 (with rotation 103.749)
		[
			{ cx: '439.523', cy: '233.523', r: '122.019' },
			{ cx: '223.426', cy: '439.426', r: '92.9893' },
			{ cx: '448.705', cy: '370.705', r: '56' },
			{ cx: '314.304', cy: '164.304', r: '133.417' },
			{ cx: '162.035', cy: '323.035', r: '140.639' },
			{ cx: '363.537', cy: '412.537', r: '142.018' },
			{ cx: '162.327', cy: '200.327', r: '56.5148' }
		],
		// Blob 8 (with rotation 73.7492)
		[
			{ cx: '373.29', cy: '195.29', r: '122.019' },
			{ cx: '319.296', cy: '452.296', r: '92.9893' },
			{ cx: '456.434', cy: '284.434', r: '56' },
			{ cx: '242.298', cy: '181.534', r: '133.417' },
			{ cx: '216.109', cy: '392.733', r: '140.639' },
			{ cx: '405.045', cy: '389.045', r: '131.5' },
			{ cx: '141.072', cy: '292.072', r: '56.5148' }
		]
	];

	function animateBlob() {
		const circles = blobContainer.querySelectorAll('circle');
		let currentShape = 0;

		// Create a container rotation animation
		gsap.to(blobContainer, {
			rotation: 360,
			duration: 40, // Slower rotation
			repeat: -1,
			ease: 'none',
			transformOrigin: 'center center'
		});

		function morphToNextShape() {
			currentShape = (currentShape + 1) % blobShapes.length;

			circles.forEach((circle, index) => {
				gsap.to(circle, {
					attr: blobShapes[currentShape][index],
					duration: 6, // Slower morphing
					ease: 'sine.inOut',
					onComplete: () => {
						if (index === 0) {
							setTimeout(morphToNextShape, 2000); // Pause between morphs
						}
					}
				});
			});
		}

		morphToNextShape();
	}

	function animateFloatingElements() {
		floatingElements.forEach((el, index) => {
			// Create random animation parameters for each element
			const xOffset = Math.random() * 30 - 15; // -15 to 15
			const yOffset = Math.random() * 30 - 15; // -15 to 15
			const duration = 8 + Math.random() * 12; // 8 to 20 seconds
			const delay = index * 0.3; // Staggered start
			
			gsap.to(el, {
				x: xOffset,
				y: yOffset,
				duration: duration,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
				delay: delay
			});
		});
	}
	
	function handleButtonHover(e: MouseEvent & { currentTarget: HTMLButtonElement }) {
		const button = e.currentTarget;
		const rect = button.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / button.offsetWidth) * 100;
		const y = ((e.clientY - rect.top) / button.offsetHeight) * 100;
		button.style.setProperty('--x', `${x}%`);
		button.style.setProperty('--y', `${y}%`);
	}

	onMount(() => {
		mounted = true;
		setTimeout(() => {
			animateBlob();
			// Collect references to floating elements
			floatingElements = Array.from(document.querySelectorAll('.floating-element'));
			animateFloatingElements();
		}, 100);
	});
</script>

<div class="relative min-h-screen overflow-hidden">
	{#if mounted}
		<!-- Blob SVG -->
		<div
			class="absolute top-[30%] left-1/2 -z-0 hidden h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 md:block"
		>
			<svg
				width="800"
				height="800"
				viewBox="0 0 600 600"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				style="overflow: visible; filter: blur(1.5px);"
			>
				<defs>
					<linearGradient id="blob-gradient" x1="0" y1="0" x2="100%" y2="100%">
						<stop offset="0%" stop-color="#FFF1F2" />
						<stop offset="50%" stop-color="#FDA4AF" />
						<stop offset="100%" stop-color="#FB7185" />
					</linearGradient>
					<mask id="blobMask1">
						<g bind:this={blobContainer} transform-origin="center">
							<circle cx="226.5" cy="231.5" r="135.5" fill="white" />
							<circle cx="424" cy="333" r="86" fill="white" />
							<circle cx="282" cy="109" r="56" fill="white" />
							<circle cx="235.5" cy="347.5" r="126.5" fill="white" />
							<circle cx="393" cy="436" r="111" fill="white" />
							<circle cx="362.5" cy="206.5" r="131.5" fill="white" />
							<circle cx="272.5" cy="448.5" r="65.5" fill="white" />
						</g>
					</mask>
				</defs>
				<rect
					width="100%"
					height="100%"
					mask="url(#blobMask1)"
					fill="url(#blob-gradient)"
					opacity="0.8"
				/>
			</svg>
		</div>

		<!-- Floating elements -->
		<div
			in:fly={{ y: 100, duration: 1000, delay: 400, easing: cubicOut }}
			class="floating-element absolute top-1/4 left-1/4 h-4 w-4 rounded-full bg-rose-400 opacity-60"
		></div>
		<div
			in:fly={{ y: -100, duration: 1000, delay: 600, easing: cubicOut }}
			class="floating-element absolute top-1/3 right-1/4 h-6 w-6 rounded-full bg-yellow-400 opacity-60"
		></div>
		<div
			in:fly={{ x: 100, duration: 1000, delay: 800, easing: cubicOut }}
			class="floating-element absolute bottom-1/4 left-1/3 h-3 w-3 rounded-full bg-rose-300 opacity-60"
		></div>
		<div
			in:fly={{ x: -100, duration: 1000, delay: 1000, easing: cubicOut }}
			class="floating-element absolute top-2/3 right-1/3 h-5 w-5 rounded-full bg-yellow-300 opacity-60"
		></div>
	{/if}
	<div class="relative isolate px-6 lg:px-8">
		<div
			class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
			aria-hidden="true"
		>
			<div
				class="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#D1302C] to-[#D12B7A] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
				style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
			></div>
		</div>
		<div class="mx-auto max-w-2xl py-16 sm:py-24 lg:py-32">
			<div class=" mt-16 flex justify-center sm:mb-8 lg:mt-3">
				<img
					src="/assets/images/veent.png"
					alt="Veent Logo"
					class="h-[77px] w-[200px] sm:h-[97px] sm:w-[250px] md:h-[110px] md:w-[285px] lg:h-[123px] lg:w-[317px]"
				/>
			</div>
			<div class="text-center">
				<h1
					class="text-5xl font-semibold tracking-tight text-balance text-[#D12F2B] drop-shadow-md sm:text-7xl"
				>
					Events, simplified.
				</h1>
				<p class="mt-8 text-lg font-medium text-pretty text-[#3E3C3D] sm:text-xl/8">
					Streamline event registration with Veent. Our user-friendly web app makes creating events
					a breeze. Packed with features and affordable pricing, Veent simplifies event management
					for everyone.
				</p>
				<div class="mt-5 flex items-center justify-center gap-x-6">
					<button
						class="relative overflow-hidden rounded-full bg-gradient-to-r from-rose-500 to-rose-600 px-8 py-3 text-lg font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/30 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 active:scale-[0.98] sm:text-1xl cursor-pointer"
						on:mousemove={handleButtonHover}
						on:click={() => (window.location.href = urlConfig.signupUrl)}
						aria-label="Sign up for free"
						tabindex="0"
						on:keydown={(e) => e.key === 'Enter' && (window.location.href = urlConfig.signupUrl)}
					>
						Sign up for free!
					</button>
				</div>
				<div class="py-16 sm:py-24">
					<h2
						class="shadow-base relative mx-auto mb-2 inline-block px-8 py-1 text-center text-sm font-bold tracking-tight text-[#3E3C3D] sm:text-xl"
					>
						PARTNERS
					</h2>

					<!-- Mobile view -->
					<div class="block sm:hidden">
						{#if mounted}
							<DualMarquee />
						{/if}
					</div>

					<!-- Desktop view -->
					<div class="hidden sm:block">
						{#if mounted}
							<DualMarquee />
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div
			class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
			aria-hidden="true"
		>
			<div
				class="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#D12B7A] to-[#D1302C] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
				style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
			></div>
		</div>
	</div>
</div>

<style>
	/* Only keep styles we can't implement with Tailwind */
	button {
		--x: 50%;
		--y: 50%;
		position: relative;
		background: linear-gradient(to right, #e11d48, #be123c);
	}
	
	button::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: radial-gradient(circle at var(--x) var(--y), rgba(255, 255, 255, 0.8) 0%, transparent 50%);
		opacity: 0;
		transition: opacity 0.3s;
		border-radius: 9999px;
	}
	
	button:hover::before {
		opacity: 0.4;
	}
</style>
