<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import gsap from 'gsap';
	let mounted = false;
	let blobContainer: SVGGElement;

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
			class="float-1 absolute top-1/4 left-1/4 h-4 w-4 rounded-full bg-rose-400 opacity-60"
		></div>
		<div
			in:fly={{ y: -100, duration: 1000, delay: 600, easing: cubicOut }}
			class="float-2 absolute top-1/3 right-1/4 h-6 w-6 rounded-full bg-yellow-400 opacity-60"
		></div>
		<div
			in:fly={{ x: 100, duration: 1000, delay: 800, easing: cubicOut }}
			class="float-3 absolute bottom-1/4 left-1/3 h-3 w-3 rounded-full bg-rose-300 opacity-60"
		></div>
		<div
			in:fly={{ x: -100, duration: 1000, delay: 1000, easing: cubicOut }}
			class="float-4 absolute top-2/3 right-1/3 h-5 w-5 rounded-full bg-yellow-300 opacity-60"
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
						class="animated-border-button rounded-full px-8 py-3 text-lg font-medium sm:text-2xl"
						on:mousemove={handleButtonHover}
						on:click={() => (window.location.href = 'https://veent.io/signup/')}
					>
						Sign up for free!
					</button>
				</div>
				<div class="py-16 sm:py-24">
					<h2
						class="shadow-base relative mx-auto mb-2 inline-block px-8 py-1 text-center text-sm font-bold tracking-tight text-[#3E3C3D] sm:text-xl"
					>
						PARTNERS WHO TRUST US
					</h2>

					<div class="mb-8 flex w-full items-center justify-center overflow-hidden">
						<div class="h-px flex-grow bg-gray-300"></div>
						<div class="mx-2 flex-shrink-0">
							<span class="inline-block h-2 w-2 rounded-full bg-rose-400"></span>
						</div>
						<div class="h-px w-24 flex-shrink-0 bg-gray-300"></div>
						<div class="mx-2 flex-shrink-0">
							<span class="inline-block h-2 w-2 rounded-full bg-rose-400"></span>
						</div>
						<div class="h-px flex-grow bg-gray-300"></div>
					</div>

					<div
						class="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-gray-50/50 py-8 shadow-sm"
					>
						<!-- Mobile view - Horizontal marquee -->
						<div class="block sm:hidden">
							<div class="marquee-wrapper flex w-full overflow-hidden">
								<div class="animate-marquee-fast flex gap-4 px-4 py-2">
									{#if mounted}
										<div
											class="partner-logo-wrapper flex h-20 w-40 flex-shrink-0 items-center justify-center rounded-lg p-3 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 100 }}
										>
											<a
												href="https://www.figo.org/philippine-obstetrical-gynecological-society-inc"
											>
												<img
													class="h-auto max-h-14 w-auto max-w-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/pogs.png"
													alt="Philippine Obstetrical & Gynecological Society, INC"
													width="120"
													height="40"
													loading="lazy"
												/>
											</a>
										</div>
										<div
											class="partner-logo-wrapper flex h-20 w-40 flex-shrink-0 items-center justify-center rounded-lg p-3 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 150 }}
										>
											<a href="https://www.facebook.com/DICTRegion10">
												<img
													class="h-auto max-h-14 w-auto max-w-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/dict.png"
													alt="Department of Information and Communications Technology"
													width="120"
													height="40"
													loading="lazy"
												/>
											</a>
										</div>
										<div
											class="partner-logo-wrapper flex h-20 w-40 flex-shrink-0 items-center justify-center rounded-lg p-3 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 200 }}
										>
											<a href="https://www.facebook.com/samdhana.institute">
												<img
													class="h-auto max-h-14 w-auto max-w-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/tsi.png"
													alt="The Samdhana Institute"
													width="120"
													height="40"
													loading="lazy"
												/>
											</a>
										</div>
										<div
											class="partner-logo-wrapper flex h-20 w-40 flex-shrink-0 items-center justify-center rounded-lg p-3 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 250 }}
										>
											<a href="https://www.facebook.com/artrunningph">
												<img
													class="h-auto max-h-14 w-auto max-w-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/ar.png"
													alt="Art Running"
													width="120"
													height="40"
													loading="lazy"
												/>
											</a>
										</div>
										<div
											class="partner-logo-wrapper flex h-20 w-40 flex-shrink-0 items-center justify-center rounded-lg p-3 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 300 }}
										>
											<a href="https://feastconference.com/">
												<img
													class="h-auto max-h-14 w-auto max-w-full rounded-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/feastcon.jpg"
													alt="SavvyCal"
													width="120"
													height="40"
													loading="lazy"
												/>
											</a>
										</div>
									{/if}
								</div>
								<div class="animate-marquee-fast flex gap-4 px-4 py-2" aria-hidden="true">
									{#if mounted}
										<div
											class="partner-logo-wrapper flex h-20 w-40 flex-shrink-0 items-center justify-center rounded-lg p-3 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 350 }}
										>
											<a href="https://www.facebook.com/dauntlessoutdoorsph">
												<img
													class="h-auto max-h-14 w-auto max-w-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/dauntless.png"
													alt="Statamic"
													width="120"
													height="40"
													loading="lazy"
												/>
											</a>
										</div>
										<div
											class="partner-logo-wrapper flex h-20 w-40 flex-shrink-0 items-center justify-center rounded-lg p-3 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 400 }}
										>
											<a href="https://www.facebook.com/CircleProductionsCdO">
												<img
													class="h-auto max-h-14 w-auto max-w-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/circle.png"
													alt="Circle Productions Inc."
													width="120"
													height="40"
													loading="lazy"
												/>
											</a>
										</div>
										<div
											class="partner-logo-wrapper flex h-20 w-40 flex-shrink-0 items-center justify-center rounded-lg p-3 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 450 }}
										>
											<a href="https://www.facebook.com/sub30">
												<img
													class="h-auto max-h-14 w-auto max-w-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/sub30.png"
													alt="SUB30 Events and Prints"
													width="120"
													height="40"
													loading="lazy"
												/>
											</a>
										</div>
										<div
											class="partner-logo-wrapper flex h-20 w-40 flex-shrink-0 items-center justify-center rounded-lg p-3 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 500 }}
										>
											<a href="https://www.facebook.com/legendscdo">
												<img
													class="h-auto max-h-14 w-auto max-w-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/legends.png"
													alt="Legends Events CDO"
													width="120"
													height="40"
													loading="lazy"
												/>
											</a>
										</div>
										<div
											class="partner-logo-wrapper flex h-20 w-40 flex-shrink-0 items-center justify-center rounded-lg p-3 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 550 }}
										>
											<a href="https://www.facebook.com/profile.php?id=61566745691172">
												<img
													class="h-auto max-h-14 w-auto max-w-full rounded-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/eventspro.jpg"
													alt="Events Pro Live"
													width="120"
													height="40"
													loading="lazy"
												/>
											</a>
										</div>
									{/if}
								</div>
							</div>
						</div>

						<!-- Desktop view - Horizontal marquee -->
						<div class="hidden sm:block">
							<div class="marquee-wrapper flex w-full overflow-hidden">
								<div class="animate-marquee-slow flex gap-8 px-6 py-2">
									{#if mounted}
										<div
											class="partner-logo-wrapper flex h-28 w-56 flex-shrink-0 items-center justify-center rounded-lg p-4 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 100 }}
										>
											<a
												href="https://www.figo.org/philippine-obstetrical-gynecological-society-inc"
											>
												<img
													class="h-auto max-h-20 w-auto max-w-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/pogs.png"
													alt="Philippine Obstetrical & Gynecological Society, INC"
													width="158"
													height="48"
													loading="lazy"
												/>
											</a>
										</div>
										<div
											class="partner-logo-wrapper flex h-28 w-56 flex-shrink-0 items-center justify-center rounded-lg p-4 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 150 }}
										>
											<a href="https://www.facebook.com/DICTRegion10">
												<img
													class="h-auto max-h-20 w-auto max-w-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/dict.png"
													alt="Department of Information and Communications Technology"
													width="158"
													height="48"
													loading="lazy"
												/>
											</a>
										</div>
										<div
											class="partner-logo-wrapper flex h-28 w-56 flex-shrink-0 items-center justify-center rounded-lg p-4 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 200 }}
										>
											<a href="https://www.facebook.com/samdhana.institute">
												<img
													class="h-auto max-h-20 w-auto max-w-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/tsi.png"
													alt="The Samdhana Institute"
													width="158"
													height="48"
													loading="lazy"
												/>
											</a>
										</div>
										<div
											class="partner-logo-wrapper flex h-28 w-56 flex-shrink-0 items-center justify-center rounded-lg p-4 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 250 }}
										>
											<a href="https://www.facebook.com/artrunningph">
												<img
													class="h-auto max-h-20 w-auto max-w-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/ar.png"
													alt="Art Running"
													width="158"
													height="48"
													loading="lazy"
												/>
											</a>
										</div>
										<div
											class="partner-logo-wrapper flex h-28 w-56 flex-shrink-0 items-center justify-center rounded-lg p-4 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 300 }}
										>
											<a href="https://feastconference.com/">
												<img
													class="h-auto max-h-20 w-auto max-w-full rounded-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/feastcon.jpg"
													alt="SavvyCal"
													width="158"
													height="48"
													loading="lazy"
												/>
											</a>
										</div>
										<div
											class="partner-logo-wrapper flex h-28 w-56 flex-shrink-0 items-center justify-center rounded-lg p-4 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 350 }}
										>
											<a href="https://www.facebook.com/dauntlessoutdoorsph">
												<img
													class="h-auto max-h-20 w-auto max-w-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/dauntless.png"
													alt="Statamic"
													width="158"
													height="48"
													loading="lazy"
												/>
											</a>
										</div>
									{/if}
								</div>
								<div class="animate-marquee-slow flex gap-8 px-6 py-2" aria-hidden="true">
									{#if mounted}
										<div
											class="partner-logo-wrapper flex h-28 w-56 flex-shrink-0 items-center justify-center rounded-lg p-4 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 400 }}
										>
											<a href="https://www.facebook.com/CircleProductionsCdO">
												<img
													class="h-auto max-h-20 w-auto max-w-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/circle.png"
													alt="Circle Productions Inc."
													width="158"
													height="48"
													loading="lazy"
												/>
											</a>
										</div>
										<div
											class="partner-logo-wrapper flex h-28 w-56 flex-shrink-0 items-center justify-center rounded-lg p-4 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 450 }}
										>
											<a href="https://www.facebook.com/sub30">
												<img
													class="h-auto max-h-20 w-auto max-w-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/sub30.png"
													alt="SUB30 Events and Prints"
													width="158"
													height="48"
													loading="lazy"
												/>
											</a>
										</div>
										<div
											class="partner-logo-wrapper flex h-28 w-56 flex-shrink-0 items-center justify-center rounded-lg p-4 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 500 }}
										>
											<a href="https://www.facebook.com/legendscdo">
												<img
													class="h-auto max-h-20 w-auto max-w-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/legends.png"
													alt="Legends Events CDO"
													width="158"
													height="48"
													loading="lazy"
												/>
											</a>
										</div>
										<div
											class="partner-logo-wrapper flex h-28 w-56 flex-shrink-0 items-center justify-center rounded-lg p-4 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 550 }}
										>
											<a href="https://www.facebook.com/profile.php?id=61566745691172">
												<img
													class="h-auto max-h-20 w-auto max-w-full rounded-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/eventspro.jpg"
													alt="Events Pro Live"
													width="158"
													height="48"
													loading="lazy"
												/>
											</a>
										</div>
										<div
											class="partner-logo-wrapper flex h-28 w-56 flex-shrink-0 items-center justify-center rounded-lg p-4 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 600 }}
										>
											<a href="https://www.facebook.com/cagayandeorobasketballfederation">
												<img
													class="h-auto max-h-20 w-auto max-w-full rounded-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/cdobasketball.png"
													alt="Cagayan de Oro Basketball Federation - CDOBF"
													width="158"
													height="48"
													loading="lazy"
												/>
											</a>
										</div>
										<div
											class="partner-logo-wrapper flex h-28 w-56 flex-shrink-0 items-center justify-center rounded-lg p-4 transition-all duration-300 hover:bg-white hover:shadow-md"
											in:fade={{ duration: 300, delay: 100 }}
										>
											<a
												href="https://www.figo.org/philippine-obstetrical-gynecological-society-inc"
											>
												<img
													class="h-auto max-h-20 w-auto max-w-full object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
													src="/assets/images/pogs.png"
													alt="Philippine Obstetrical & Gynecological Society, INC"
													width="158"
													height="48"
													loading="lazy"
												/>
											</a>
										</div>
									{/if}
								</div>
							</div>
						</div>
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

	@keyframes gradientShift {
		0%,
		100% {
			filter: hue-rotate(0deg);
		}
		50% {
			filter: hue-rotate(10deg);
		}
	}

	:global(.float-1) {
		animation: float1 12s ease-in-out infinite;
	}
	:global(.float-2) {
		animation: float2 15s ease-in-out infinite;
	}
	:global(.float-3) {
		animation: float3 18s ease-in-out infinite;
	}
	:global(.float-4) {
		animation: float2 20s ease-in-out infinite;
	}
	:global(#blob-gradient) {
		animation: gradientShift 10s ease-in-out infinite;
	}

	/* Custom animations for marquee */
	@keyframes marquee-fast {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-100%);
		}
	}

	@keyframes marquee-slow {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-100%);
		}
	}

	:global(.animate-marquee-fast) {
		animation: marquee-fast 25s linear infinite;
	}

	:global(.animate-marquee-slow) {
		animation: marquee-slow 45s linear infinite;
	}

	:global(.marquee-wrapper:hover .animate-marquee-fast),
	:global(.marquee-wrapper:hover .animate-marquee-slow) {
		animation-play-state: paused;
	}

	@keyframes marquee {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-100%);
		}
	}

	/* Hover effects for partner logos */
	.partner-logo-wrapper {
		position: relative;
		overflow: hidden;
	}

	.partner-logo-wrapper::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(circle at center, rgba(251, 113, 133, 0.1) 0%, transparent 70%);
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
	}

	.partner-logo-wrapper:hover::after {
		opacity: 1;
	}
</style>
