<script lang="ts">
	import '../../app.css';
	import { page } from '$app/stores';

	// animation: slide in and quintOut
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	export let loginUrl;

	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<header class="fixed z-50 w-full bg-white">
	<nav class="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
		<div class="flex lg:flex-1">
			<a href="/" class="-m-1.5 p-1.5">
				<span class="sr-only">Veent</span>
				<img src="/assets/icons/Veent-red-logo.svg" alt="Veent Logo" class="h-16 w-16" />
			</a>
		</div>
		<div class="flex lg:hidden">
			<button
				type="button"
				class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
				on:click={toggleMenu}
			>
				<span class="sr-only">Open main menu</span>
				<svg
					class="size-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					aria-hidden="true"
					data-slot="icon"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
					/>
				</svg>
			</button>
		</div>
		<div class="hidden lg:flex lg:gap-x-12">
			<a
				href="/"
				class="nav-link text-base font-bold"
				class:text-gray-900={$page.url.pathname === '/'}
				class:text-gray-500={$page.url.pathname !== '/'}>Home</a
			>
			<a
				href="/about-us"
				class="nav-link text-base font-bold"
				class:text-gray-900={$page.url.pathname === '/about-us'}
				class:text-gray-500={$page.url.pathname !== '/about-us'}>About Us</a
			>
			<a
				href="/features"
				class="nav-link text-base font-bold"
				class:text-gray-900={$page.url.pathname === '/features'}
				class:text-gray-500={$page.url.pathname !== '/features'}>Features</a
			>
			<a
				href="/pricing"
				class="nav-link text-base font-bold"
				class:text-gray-900={$page.url.pathname === '/pricing'}
				class:text-gray-500={$page.url.pathname !== '/pricing'}>Pricing</a
			>
			<a
				href="/contact-us"
				class="nav-link text-base font-bold"
				class:text-gray-900={$page.url.pathname === '/contact-us'}
				class:text-gray-500={$page.url.pathname !== '/contact-us'}>Contact Us</a
			>
		</div>
		<div class="hidden lg:flex lg:flex-1 lg:justify-end">
			<a
				href={loginUrl}
				class="rounded-full border-2 border-[#D1302C] px-6 py-2 text-sm/6 font-semibold text-gray-900 transition-all duration-300 ease-in-out hover:bg-[#D1302C] hover:text-white"
				>Log in <span aria-hidden="true">&rarr;</span></a
			>
		</div>
	</nav>
	<!-- Mobile menu, show/hide based on menu open state. -->
	{#if isMenuOpen}
		<div class="lg:hidden" role="dialog" aria-modal="true">
			<!-- purpose: para ma close ang menu by clicking outside (tablet view) -->
			<div
				aria-label="Close menu"
				aria-labelledby="mobile-menu"
				role="button"
				tabindex="0"
				class="fixed inset-0 z-10 bg-gray-500/75 transition-opacity"
				on:keydown={(e) => e.key === 'Enter' && toggleMenu()}
				transition:fade={{ duration: 200 }}
			></div>
			<div
				class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
				transition:slide={{ duration: 300, easing: quintOut, axis: 'x' }}
			>
				<div class="flex items-center justify-between">
					<a href="/" class="-m-1.5 p-1.5" on:click={toggleMenu}>
						<span class="sr-only">Veent</span>
						<img src="/assets/icons/Veent-red-logo.svg" alt="Veent Logo" class="h-16 w-16" />		
					</a>
					<button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" on:click={toggleMenu}>
						<span class="sr-only">Close menu</span>
						<svg
							class="size-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
							data-slot="icon"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<div class="mt-6 flow-root">
					<div class="-my-6 divide-y divide-gray-500/10">
						<div class="space-y-2 py-6">
							<a
								href="/"
								class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
								on:click={toggleMenu}>Home</a
							>
							<a
								href="/about-us"
								class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
								on:click={toggleMenu}>About Us</a
							>
							<a
								href="/features"
								class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
								on:click={toggleMenu}>Features</a
							>
							<a
								href="/pricing"
								class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
								on:click={toggleMenu}>Pricing</a
							>
							<a
								href="/contact-us"
								class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
								on:click={toggleMenu}>Contact Us</a
							>
						</div>
						<div class="py-6">
							<a
								href={loginUrl}
								class="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
								>Log in</a
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</header>

<style>
	.nav-link {
		position: relative;
		padding-bottom: 2px;
	}

	.nav-link::after {
		content: '';
		position: absolute;
		width: 0;
		height: 2px;
		bottom: 0;
		left: 0;
		background-color: #fb7185; /* rose-400 color */
		transition: width 0.3s ease-in-out;
	}

	.nav-link:hover::after {
		width: 100%;
	}
</style>
