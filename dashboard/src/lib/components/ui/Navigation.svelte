<script lang="ts">
	import { fade } from 'svelte/transition';

	const navItems = [
		{ href: '/', icon: 'ri-home-smile-2-line', label: 'Home' },
		{ href: '/wallet', icon: 'ri-wallet-3-line', label: 'Wallet' }
	];

	let isMenuOpen = false;

	const handleToggleMenu = () => {
		isMenuOpen = !isMenuOpen;
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			handleToggleMenu();
		}
	};
</script>

<header class="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white">
	<div class="px-6 py-3">
		<div class="flex items-center justify-between">
			<div class="flex w-full items-center justify-between lg:w-auto">
				<!-- Logo and Brand -->
				<div class="flex items-center gap-2">
					<img src="/images/veent-logo.svg" alt="Veent" class=" h-16 w-16" />
				</div>

				<!-- Desktop Navigation -->
				<div class="mx-14 hidden items-center gap-8 lg:flex">
					{#each navItems as item}
						<a
							href={item.href}
							class="flex items-center gap-2 text-gray-700 hover:text-gray-900"
							aria-label={item.label}
						>
							<i class="{item.icon} text-xl"></i>
							<span class="text-sm font-bold text-gray-500">{item.label}</span>
						</a>
					{/each}
				</div>

				<!-- Mobile Menu Button -->
				<button
					class="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 active:bg-gray-100 lg:hidden"
					aria-label="Toggle menu"
					aria-expanded={isMenuOpen}
					on:click={handleToggleMenu}
					on:keydown={handleKeyDown}
					style="-webkit-tap-highlight-color: transparent;"
				>
					<div class="relative h-5 w-6">
						<span
							class="absolute block h-0.5 w-full rounded-sm bg-current transition-all duration-300"
							class:rotate-45={isMenuOpen}
							class:translate-y-2={isMenuOpen}
						></span>
						<span
							class="absolute top-2 block h-0.5 w-full rounded-sm bg-current transition-all duration-300"
							class:opacity-0={isMenuOpen}
						></span>
						<span
							class="absolute top-4 block h-0.5 w-full rounded-sm bg-current transition-all duration-300"
							class:-rotate-45={isMenuOpen}
							class:-translate-y-2={isMenuOpen}
						></span>
					</div>
				</button>

				<!-- Mobile Menu Overlay -->
				{#if isMenuOpen}
					<div
						transition:fade={{ duration: 200 }}
						class="fixed inset-0 top-[64px] z-50 bg-white lg:hidden"
					>
						<div class="flex flex-col p-4">
							{#each navItems as item}
								<a
									href={item.href}
									class="flex touch-none items-center gap-4 rounded-lg p-4 text-gray-500 active:bg-gray-100"
									aria-label={item.label}
									on:click={handleToggleMenu}
									style="-webkit-tap-highlight-color: transparent;"
								>
									<i class="{item.icon} text-2xl"></i>
									<span class="text-base font-medium">{item.label}</span>
								</a>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<button
				class="hidden h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white lg:flex"
				aria-label="Profile"
			>
				JT
			</button>
		</div>
	</div>
</header>
