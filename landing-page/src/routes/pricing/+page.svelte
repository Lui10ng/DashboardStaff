<script lang="ts">
	import { page } from '$app/stores';
	import type { Feature } from './+page.server';
	
	const { urlConfig, pageTitle, pageDescription, pricing } = $page.data;

	// Get the free plan data
	const freePlan = pricing[0];

	// Group features by category
	const coreFeatures = $state(freePlan.features.filter((feature: Feature) => feature.category === 'core'));
	const monetizeFeatures = $state(freePlan.features.filter((feature: Feature) => feature.category === 'monetize'));
	const feeFeatures = $state(freePlan.features.filter((feature: Feature) => feature.category === 'fees'));

	// SVG check icon component
	const CheckIcon = () => `
		<svg
			class="h-6 w-5 flex-none text-[#D1302C]"
			viewBox="0 0 20 20"
			fill="currentColor"
			aria-hidden="true"
			data-slot="icon"
		>
			<path
				fill-rule="evenodd"
				d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
				clip-rule="evenodd"
			/>
		</svg>
	`;
</script>

<div class="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
	<div
		class="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
		aria-hidden="true"
	>
		<!-- blobl -->
		<div class="floating-blob"></div>
		<div
			class="mx-auto aspect-1155/678 w-[72.1875rem] opacity-30"
			style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
		></div>
	</div>
	<div class="mx-auto max-w-4xl text-center">
		<p class="mt-2 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">
			{pageTitle}
		</p>
	</div>
	<p
		class="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-gray-600 sm:text-xl/8"
	>
		{pageDescription}
	</p>
	<div class="mx-auto mt-16 max-w-lg">
		<!-- Free -->
		<div class="rounded-3xl bg-white/60 p-8 ring-1 ring-gray-900/10 sm:p-10">
			<h3 id="tier-free" class="text-base/7 font-semibold text-[#D1302C]">
				{freePlan.title}
			</h3>
			<p class="mt-4 flex items-baseline gap-x-2">
				<span class="text-5xl font-semibold tracking-tight text-gray-900">
					{freePlan.price === 0 ? 'Free' : `$${freePlan.price}`}
				</span>
			</p>
			<p class="mt-6 text-base/7 text-gray-600">{freePlan.description}</p>

			<h4 class="mt-10 text-lg font-medium text-gray-600">Experience these features for free:</h4>
			<ul role="list" class="mt-4 space-y-3 text-sm/6 text-gray-600">
				{#each coreFeatures as feature}
					<li class="flex gap-x-3">
						{@html CheckIcon()}
						{feature.text}
					</li>
				{/each}
			</ul>

			<hr class="my-8 border-gray-200" />

			<h4 class="mt-6 text-lg font-medium text-gray-600">Monetize your events with Veent:</h4>
			<ul role="list" class="mt-4 space-y-3 text-sm/6 text-gray-600">
				{#each monetizeFeatures as feature}
					<li class="flex gap-x-3">
						{@html CheckIcon()}
						{feature.text}
					</li>
				{/each}
			</ul>

			<hr class="my-8 border-gray-200" />

			<h4 class="mt-6 text-lg font-medium text-gray-600">Collect fees with these features:</h4>
			<ul role="list" class="mt-4 space-y-3 text-sm/6 text-gray-600">
				{#each feeFeatures as feature, i}
					<li class="flex gap-x-3">
						{@html CheckIcon()}
						{#if i === 0}
							{feature.text}
						{:else}
							{feature.text}
						{/if}
					</li>
				{/each}
			</ul>

			<a
				href={urlConfig.signupUrl}
				aria-describedby="tier-free"
				class="mt-8 block rounded-md bg-[#D1302C] px-3.5 py-2.5 text-center text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:mt-10"
				tabindex="0"
				aria-label="Sign up now for free"
				onkeydown={(e: KeyboardEvent) => {
					if (e.key === 'Enter' && e.currentTarget) {
						(e.currentTarget as HTMLElement).click();
					}
				}}
			>
				{freePlan.buttonText}
			</a>
		</div>
	</div>
</div>

<style>
	.floating-blob {
		position: absolute;
		width: 500px;
		height: 500px;
		background: linear-gradient(to right, rgba(209, 48, 44, 0.1), rgba(209, 43, 122, 0.1));
		border-radius: 50%;
		filter: blur(80px);
		animation: float 20s ease-in-out infinite;
		transform-origin: center center;
	}

	@keyframes float {
		0% {
			transform: translate(20%, 20%) rotate(0deg);
		}
		25% {
			transform: translate(80%, 30%) rotate(90deg);
		}
		50% {
			transform: translate(70%, 70%) rotate(180deg);
		}
		75% {
			transform: translate(30%, 60%) rotate(270deg);
		}
		100% {
			transform: translate(20%, 20%) rotate(360deg);
		}
	}
</style>
