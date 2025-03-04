<script lang="ts">
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import '@fontsource/roboto/700.css';
	import 'animate.css';

	// Remove the features array and instead get it from the page data
	export let data;
	const { features } = data;

	let currentSection = 0;
	let sections: NodeListOf<HTMLElement>;

	onMount(() => {
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			orientation: 'vertical',
			gestureOrientation: 'vertical',
			smoothWheel: true,
			wheelMultiplier: 1,
			touchMultiplier: 2,
			infinite: false
		});

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		sections = document.querySelectorAll('section.content-section');

		// Create Intersection Observer for content sections
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const sectionIndex = parseInt(entry.target.getAttribute('data-index') || '0');
						currentSection = sectionIndex;

						// Add animation to the corresponding image
						const image = document.querySelector(`#feature-image-${sectionIndex} img`);
						if (image) {
							if (entry.boundingClientRect.y < 0) {
								image.classList.add('animate__animated', 'animate__fadeInDown');
								image.classList.remove('animate__fadeInUp');
							} else {
								image.classList.add('animate__animated', 'animate__fadeInUp');
								image.classList.remove('animate__fadeInDown');
							}
						}
					} else {
						const sectionIndex = parseInt(entry.target.getAttribute('data-index') || '0');
						const image = document.querySelector(`#feature-image-${sectionIndex} img`);
						if (image) {
							image.classList.remove(
								'animate__animated',
								'animate__fadeInDown',
								'animate__fadeInUp'
							);
						}
					}
				});
			},
			{ threshold: 0.5 }
		);

		// Observe all content sections
		sections.forEach((section) => observer.observe(section));

		// Handle section navigation
		window.addEventListener('wheel', (e) => {
			if (lenis.isScrolling) return;

			if (e.deltaY > 0 && currentSection < sections.length - 1) {
				currentSection++;
				lenis.scrollTo(sections[currentSection], {
					offset: 0,
					duration: 1.2
				});
			} else if (e.deltaY < 0 && currentSection > 0) {
				currentSection--;
				lenis.scrollTo(sections[currentSection], {
					offset: 0,
					duration: 1.2
				});
			}
		});
	});
</script>

<div class="flex min-h-screen flex-col">
	<!-- Mobile layout - Each section contains both image and content -->
	<div class="block lg:hidden">
		{#each features as feature, i}
			<div class="flex min-h-screen snap-start flex-col">
				<!-- Image Section -->
				<div class="relative h-[50vh] w-full bg-rose-50">
					<div class="absolute inset-0 flex items-center justify-center p-4">
						<img src={feature.image} alt={feature.title} class="h-full w-full object-contain p-8" />
					</div>
				</div>
				<!-- Content Section -->
				<section
					id="feature-mobile-{i}"
					data-index={i}
					class="content-section relative flex h-[50vh] items-center justify-center bg-white px-6 py-8"
				>
					<div class="feature-content w-full">
						<h2 class="mb-4 text-2xl font-bold tracking-tight">
							{feature.title}
						</h2>
						<p class="text-base leading-relaxed text-gray-700">
							{feature.description}
						</p>
					</div>
				</section>
			</div>
		{/each}
	</div>

	<!-- Desktop layout - Original split view -->
	<div class="hidden min-h-screen flex-row lg:flex">
		<!-- Fixed Left Side -->
		<div class="fixed h-screen w-1/2 bg-rose-50">
			{#each features as feature, i}
				<section
					id="feature-image-{i}"
					class="absolute inset-0 flex items-center justify-center p-8"
					style="opacity: {currentSection === i ? 1 : 0}; transition: opacity 0.5s ease-in-out;"
				>
					<div class="feature-image w-[80%]">
						<img
							src={feature.image}
							alt={feature.title}
							class="h-auto w-full rounded-lg object-contain"
						/>
					</div>
				</section>
			{/each}
		</div>

		<!-- Scrollable Right Side -->
		<div class="ml-[50%] w-1/2">
			{#each features as feature, i}
				<section
					id="feature-{i}"
					data-index={i}
					class="content-section relative flex min-h-screen snap-start items-center justify-center px-24 py-24"
				>
					<div class="feature-content w-full">
						<h2 class="mb-6 text-5xl font-bold tracking-tight">
							{feature.title}
						</h2>
						<p class="text-xl leading-relaxed text-gray-700">
							{feature.description}
						</p>
					</div>
				</section>
			{/each}
		</div>
	</div>
</div>

<style>
	:global(html) {
		overflow-x: hidden;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		overflow-x: hidden;
	}

	section {
		scroll-snap-align: start;
	}

	.feature-image img {
		opacity: 0;
		transition: opacity 0.5s ease-in-out;
	}

	/* Animation duration */
	:global(.animate__animated) {
		--animate-duration: 1s;
	}

	@media (max-width: 1024px) {
		.content-section {
			background: white;
			position: relative;
			z-index: 10;
		}
	}
</style>
