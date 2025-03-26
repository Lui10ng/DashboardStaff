<script lang="ts">
	import Button from './Button.svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	let isOpen = $state(true);

	const handleDrawer = () => {
		isOpen = !isOpen;
	};
</script>

{#if isOpen}
	<div class="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
		<div
			class="fixed inset-0 bg-opacity-30 backdrop-blur-[2.8px] transition-opacity"
			aria-hidden="true"
			transition:fade={{ duration: 500, easing: cubicInOut }}
		></div>

		<div class="fixed inset-0 overflow-hidden">
			<div class="absolute inset-0 overflow-hidden">
				<div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
					<div
						class="pointer-events-auto relative w-screen max-w-6xl"
						transition:fly={{ x: 400, duration: 500, easing: cubicInOut }}
					>
						<div
							class="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4"
							transition:fade={{ duration: 500, easing: cubicInOut }}
						>
							<Button
								onClick={handleDrawer}
								icon="fa-solid fa-xmark"
								className="bg-primary text-white rounded-lg px-2 py-1"
							/>
						</div>

						<div class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
							<div class="px-4 sm:px-6">
								<h2 class="text-base font-semibold text-gray-900" id="slide-over-title">
									Panel title
								</h2>
							</div>
							<div class="relative mt-6 flex-1 px-4 sm:px-6">
								<p>Hello</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
