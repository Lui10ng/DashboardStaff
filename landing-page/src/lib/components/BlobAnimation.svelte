<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { blobShapes } from '$lib/types/data';
	let blobContainer: SVGGElement;

	function animateBlob() {
		const circles = blobContainer.querySelectorAll('circle');
		let currentShape = 0;

		gsap.to(blobContainer, {
			rotation: 360,
			duration: 40,
			repeat: -1,
			ease: 'none',
			transformOrigin: 'center center'
		});

		function morphToNextShape() {
			currentShape = (currentShape + 1) % blobShapes.length;

			circles.forEach((circle, index) => {
				gsap.to(circle, {
					attr: blobShapes[currentShape][index],
					duration: 6,
					ease: 'sine.inOut',
					onComplete: () => {
						if (index === 0) {
							setTimeout(morphToNextShape, 2000);
						}
					}
				});
			});
		}

		morphToNextShape();
	}

	onMount(() => {
		setTimeout(animateBlob, 100);
	});
</script>

<div
	class="animate__animated animate__fadeInRight animate__duration-1s absolute top-[40%] -right-[300px] -z-0 hidden h-[900px] w-[900px] -translate-y-1/2 lg:block"
>
	<svg
		width="900"
		height="900"
		viewBox="0 0 600 600"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		style="overflow: visible;"
	>
		<defs>
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
		<image
			href="\assets\images\venue.png"
			width="150%"
			height="150%"
			x="-25%"
			y="-25%"
			preserveAspectRatio="xMidYMid slice"
			mask="url(#blobMask1)"
		/>
	</svg>
</div>
