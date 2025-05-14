<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Drawer from '$lib/components/ui/Drawer.svelte';
	import { themes } from '$lib/static/constant.js';
	import { themeDrawer, themeState } from '$lib/stores/state.svelte';
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	let themeImgSrc: string | null = $state(null);
	let logoImgSrc: string | null = $state(null);
	let eventLogoImgSrc: string | null = $state(null);
	let posterImgSrc: string | null = $state(null);
	let backgroundImgSrc: string | null = $state(null);
	const themeDrawerState = $derived(themeDrawer.open);

	const themeStore = themeState();

	const { form, errors, enhance, delayed, message } = superForm(data.form);

	message.subscribe(async (msg) => {
		if (msg && msg.success) {
			themeDrawer.open = false;
		}
	});

	$effect(() => {
		themeStore.themes = [
			{
				theme: data.eventTheme.theme,
				themeMode: data.eventTheme.light
			}
		];
	});

	let selectedTheme = $derived(themeStore.themes);

	function handleClick(inputClick: string) {
		document.getElementById(inputClick)?.click();
	}

	const handleOpenThemeDrawer = () => {
		themeDrawer.open = true;
	};

	function removeImageVar(imgVar: string, event: Event) {
		event.stopPropagation();
		if (imgVar === 'themeImg') themeImgSrc = null;
		if (imgVar === 'logoImg') logoImgSrc = null;
		if (imgVar === 'eventLogoImg') eventLogoImgSrc = null;
		if (imgVar === 'posterImg') posterImgSrc = null;
		if (imgVar === 'backgroundImg') backgroundImgSrc = null;
	}

	function displayImage(event: Event, imgVar: string) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (imgVar === 'themeImg') themeImgSrc = e.target?.result as string;
				if (imgVar === 'logoImg') logoImgSrc = e.target?.result as string;
				if (imgVar === 'eventLogoImg') eventLogoImgSrc = e.target?.result as string;
				if (imgVar === 'posterImg') posterImgSrc = e.target?.result as string;
				if (imgVar === 'backgroundImg') backgroundImgSrc = e.target?.result as string;
			};
			reader.readAsDataURL(input.files[0]);
		}
	}

	const handleThemeSelection = (selectedTheme: string) => {
		themeStore.themes.theme = selectedTheme;
	};

	const handleCloseThemeDrawer = () => {
		themeDrawer.open = false;
	};
</script>

<form action="/?/updateVisuals" method="POST" use:enhance enctype="multipart/form-data">
	<div class="pb-4">
		<h2 class="mb-2 text-xl font-semibold">Website Visual</h2>
		<p class="mb-6 text-sm text-gray-500">
			Edit your website visual below. Changes update automatically on your website.
		</p>
		<hr class="mb-6 border-t border-gray-300" />

		<!-- Theme Image Upload -->
		<div class="grid grid-cols-2 gap-6 md:grid-cols-3">
			<div class="mb-4">
				<h3 class="mb-2 block text-sm font-medium">Theme</h3>
				<Button
					label="Select Theme"
					className="text-sm text-gray-500 h-[10rem] w-full rounded-lg border-4  border-gray-200 text-center hover:border-gray-400"
					onClick={() => handleOpenThemeDrawer()}
				/>
				<Drawer
					isOpen={themeDrawerState}
					contentBaseClass="bg-white p-10 space-y-4 shadow-xl w-full h-[90svh] overflow-y-auto"
					justify="justify-end"
					alignment="items-end"
					positionIn={{ y: 600, duration: 200 }}
					positionOut={{ y: 600, duration: 200 }}
				>
					<div>
						<div class="flex justify-between">
							<div class="flex items-center gap-3">
								<h2 class="text-sm">{selectedTheme?.themeMode ? 'Light' : 'Dark'} Mode</h2>
								<Switch
									name="example"
									checked={selectedTheme?.themeMode}
									onCheckedChange={(e) => (themeStore.themes.themeMode = e.checked)}
								/>
							</div>
							<form action="?/saveTheme" method="POST" use:enhance>
								<input type="text" name="theme" value={selectedTheme?.theme} hidden />
								<input type="text" name="modeTheme" value={selectedTheme?.themeMode} hidden />
								<div class="flex gap-3">
									<button
										type="button"
										onclick={() => handleCloseThemeDrawer()}
										class="min-w-32 rounded-lg border p-2">Cancel</button
									>
									<button type="submit" class="bg-primary min-w-32 rounded-lg p-2 text-white"
										>Save Theme</button
									>
								</div>
							</form>
						</div>
						<div
							class="flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto scroll-smooth sm:gap-5"
						>
							{#each themes as themeOption}
								<div class="my-5 shrink-0 snap-start px-1 text-center">
									<button
										onclick={() => handleThemeSelection(themeOption)}
										class="flex min-w-24 flex-col rounded-md border p-2 {themeOption ==
										selectedTheme?.theme
											? 'border-primary'
											: ''}"
									>
										<p class="mt-1 capitalize">{themeOption}</p>
									</button>
								</div>
							{/each}
						</div>
						<iframe
							id="myIframe"
							title="themeSelector"
							src={`${data.siteUrl}/?theme=${selectedTheme?.theme}&mode=${selectedTheme?.themeMode ? 'light' : 'dark'}`}
							class="h-[70svh] w-full"
						></iframe>
					</div>
				</Drawer>
			</div>

			<!-- Logo Image Upload -->

			<div class="mb-4">
				<h3 class="mb-2 block text-sm font-medium">Logo</h3>
				<div
					role="button"
					tabindex="0"
					aria-label="uploader"
					class="relative flex h-40 min-h-[10rem] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-4 border-dashed border-gray-200 text-center hover:border-gray-400"
					onclick={() => handleClick('logoInput')}
					onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick('logoInput')}
				>
					{#if logoImgSrc}
						<img src={logoImgSrc} alt="Logo" class="h-full w-full object-cover" />
						<button
							aria-label="Remove image"
							class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-white"
							onclick={(e) => removeImageVar('logoImg', e)}
						>
							<i class="fa-solid fa-xmark"></i>
						</button>
					{:else}
						<p class="text-sm text-gray-500">Select Logo</p>
					{/if}
					<input
						name="Logo Input"
						type="file"
						id="logoInput"
						class="hidden"
						accept="image/*"
						onchange={(e) => displayImage(e, 'logoImg')}
					/>
				</div>
			</div>

			<!-- Event Logo Image Upload -->
			<div class="mb-4">
				<h3 class="mb-2 block text-sm font-medium">Event Logo</h3>
				<div
					role="button"
					tabindex="0"
					aria-label="uploader"
					class="relative flex h-40 min-h-[10rem] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-4 border-dashed border-gray-200 text-center hover:border-gray-400"
					onclick={() => handleClick('eventLogoInput')}
					onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick('eventLogoInput')}
				>
					{#if eventLogoImgSrc}
						<img src={eventLogoImgSrc} alt="Event" class="h-full w-full object-cover" />
						<button
							aria-label="Remove image"
							class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-white"
							onclick={(e) => removeImageVar('eventLogoImg', e)}
						>
							<i class="fa-solid fa-xmark"></i>
						</button>
					{:else}
						<p class="text-sm text-gray-500">Select Event Logo</p>
					{/if}
					<input
						name="Event Logo Input"
						type="file"
						id="eventLogoInput"
						class="hidden"
						accept="image/*"
						onchange={(e) => displayImage(e, 'eventLogoImg')}
					/>
				</div>
			</div>

			<!-- Poster Image Upload -->
			<div class="mb-4">
				<h3 class="mb-2 block text-sm font-medium">Poster</h3>
				<div
					role="button"
					tabindex="0"
					aria-label="uploader"
					class="relative flex h-40 min-h-[10rem] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-4 border-dashed border-gray-200 text-center hover:border-gray-400"
					onclick={() => handleClick('posterInput')}
					onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick('posterInput')}
				>
					{#if posterImgSrc}
						<img src={posterImgSrc} alt="Poster" class="h-full w-full object-cover" />
						<button
							aria-label="Remove image"
							class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-white"
							onclick={(e) => removeImageVar('posterImg', e)}
						>
							<i class="fa-solid fa-xmark"></i>
						</button>
					{:else}
						<p class="text-sm text-gray-500">Select Poster</p>
					{/if}
					<input
						name="Poster Input"
						type="file"
						id="posterInput"
						class="hidden"
						accept="image/*"
						onchange={(e) => displayImage(e, 'posterImg')}
					/>
				</div>
			</div>

			<!-- Background Image Upload -->
			<div class="mb-4">
				<h3 class="mb-2 block text-sm font-medium">Background Image</h3>
				<div
					role="button"
					tabindex="0"
					aria-label="uploader"
					class="relative flex h-40 min-h-[10rem] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-4 border-dashed border-gray-200 text-center hover:border-gray-400"
					onclick={() => handleClick('backgroundInput')}
					onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick('backgroundInput')}
				>
					{#if backgroundImgSrc}
						<img src={backgroundImgSrc} alt="Background" class="h-full w-full object-cover" />
						<button
							aria-label="Remove image"
							class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-white"
							onclick={(e) => removeImageVar('backgroundImg', e)}
						>
							<i class="fa-solid fa-xmark"></i>
						</button>
					{:else}
						<p class="text-sm text-gray-500">Select Background Image</p>
					{/if}
					<input
						name="Background Input"
						type="file"
						id="backgroundInput"
						class="hidden"
						accept="image/*"
						onchange={(e) => displayImage(e, 'backgroundImg')}
					/>
				</div>
			</div>

			<!-- YouTube Link Input -->
			<div class="mb-4">
				<label class="mb-2 block text-sm font-medium"
					>Embed Link
					<input
						type="text"
						name="Youtube Link"
						placeholder="Insert YouTube link here"
						class="w-full rounded-lg border p-2 px-3 py-3"
					/>
				</label>
			</div>
		</div>
	</div>

	<!-- Footer (Responsive Buttons) -->
	<div class="flex flex-col justify-end space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
		<button
			type="button"
			class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:text-base"
		>
			Cancel
		</button>
		<button
			class="bg-primary w-full rounded-md px-5 py-2 text-sm font-medium text-white hover:bg-red-700 sm:w-auto sm:text-base"
		>
			Save changes
		</button>
	</div>
</form>
