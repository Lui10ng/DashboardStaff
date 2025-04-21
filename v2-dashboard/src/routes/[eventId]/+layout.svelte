<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import { navItems } from '$lib/stores/data';
	import { page } from '$app/stores';
	import Drawer from '$lib/components/ui/Drawer.svelte';
	import { stateDrawer, themeDrawer } from '$lib/stores/state.svelte.ts';
	import { writable } from 'svelte/store';
	import RichText from '$lib/components/ui/RichText.svelte';
	import DatePicker from '$lib/components/ui/DatePicker.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { enhance } from '$app/forms';

	let { children, data } = $props();

	let event = $derived(data.currentEvent);
	let isRecurring = $state(false);
	let activeTab = writable('edit');

	const drawerState = $derived(stateDrawer.open);
	const themeDrawerState = $derived(themeDrawer.open);

	const handleActiveNav = (path: string) => {
		return $page.url.pathname.includes(path) ? 'bg-primary text-white' : '';
	};

	let imagePreview: string | null = $state(null);
	let imageFile: File | null = $state(null);

	// Variables for Registration Instructions
	let selectedImage: string | null = $state(null);
	let fileInput: string | HTMLInputElement = $state('');

	let themeImgSrc: string | null = $state(null);
	let logoImgSrc: string | null = $state(null);
	let eventLogoImgSrc: string | null = $state(null);
	let posterImgSrc: string | null = $state(null);
	let backgroundImgSrc: string | null = $state(null);

	const {
		form: contactForm,
		errors: contactFormErrors,
		enhance: contactFormEnhance,
		delayed: contactFormDelayed,
		message: contactFormMessage
	} = superForm(data.contactForm);

	// Functions
	function handleImageUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			imageFile = file;
			const reader = new FileReader();
			reader.onload = () => {
				imagePreview = reader.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	function removeImage(event: Event) {
		event.stopPropagation();
		imagePreview = null;
		imageFile = null;
	}

	function handleFileUpload(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			selectedImage = URL.createObjectURL(file);
		}
	}

	function removeSelectedImage() {
		selectedImage = null;
		if (fileInput) (fileInput as HTMLInputElement).value = '';
	}

	function uploadImage(id: string) {
		const element = document.getElementById(id) as HTMLInputElement;
		if (element) {
			element.click();
		}
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

	function removeImageVar(imgVar: string, event: Event) {
		event.stopPropagation();
		if (imgVar === 'themeImg') themeImgSrc = null;
		if (imgVar === 'logoImg') logoImgSrc = null;
		if (imgVar === 'eventLogoImg') eventLogoImgSrc = null;
		if (imgVar === 'posterImg') posterImgSrc = null;
		if (imgVar === 'backgroundImg') backgroundImgSrc = null;
	}

	function handleClick(inputClick: string) {
		document.getElementById(inputClick)?.click();
	}

	const handleCloseDrawer = () => {
		stateDrawer.open = false;
	};

	const handleOpenDrawer = () => {
		stateDrawer.open = true;
	};

	const handleOpenThemeDrawer = () => {
		themeDrawer.open = true;
	};

	const handleContactSubmit = async () => {
		const formData = new FormData();

		const contactData = [...data.contactDetails, $contactForm];

		formData.append('formData', JSON.stringify({ eventContacts: contactData }));

		const response = await fetch(`/${data.eventId}?/updateContacts`, {
			method: 'POST',
			body: formData
		});

		if (response.ok && response.status === 200) {
			console.log('Contact form submitted successfully');
		}
	};
</script>

<div>
	<div class="flex flex-col justify-between sm:flex-row">
		<div class="flex flex-col items-start gap-4 sm:mb-8 sm:flex-row sm:items-center sm:gap-6">
			<img
				src={event.imageUrl}
				alt={event.title}
				class="h-48 w-full rounded-lg object-cover shadow-lg sm:h-32 sm:w-32"
			/>
			<div>
				<div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
					<h1 class="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">{event.title}</h1>
				</div>
				<div class="flex flex-col gap-2 text-gray-600">
					<div class="flex items-center gap-2">
						<i class="fa-regular fa-calendar-minus text-red"></i>
						<span>{event.date}</span>
					</div>
					<div class="flex items-center gap-2">
						<i class="fa-solid fa-location-dot text-red"></i>
						<span class="text-sm sm:text-base">{event.location}</span>
					</div>
				</div>

				<div class="mt-2 flex items-center gap-2">
					<a
						href={event.url}
						target="_blank"
						rel="noopener noreferrer"
						class="text-blue break-all text-sm transition-colors sm:text-base"
					>
						{event.url}
					</a>
					<div class="flex items-center gap-2 text-gray-500">
						<i class="fa-solid fa-link"></i>
					</div>
				</div>
			</div>
		</div>
		<div>
			<Button
				label="Edit Event"
				icon="fa-solid fa-pen"
				className=" text-primary rounded-lg px-4 py-2"
				onClick={() => handleOpenDrawer()}
			/>

			<Drawer
				isOpen={drawerState}
				contentBaseClass="bg-white p-10 space-y-4 shadow-xl w-full h-[90svh] overflow-y-auto "
				justify="justify-end"
				alignment="items-end"
				positionIn={{ y: 600, duration: 200 }}
				positionOut={{ y: 600, duration: 200 }}
			>
				<div>
					<!-- Navigation -->
					<div class="w-full overflow-x-auto">
						<div class="mb-4 flex space-x-2 overflow-x-auto whitespace-nowrap py-2 pt-0">
							{#each [{ name: 'Edit Details', key: 'edit' }, { name: 'Visual', key: 'visual' }, { name: 'Contacts', key: 'contacts' }, { name: 'Registration Instructions', key: 'registration' }] as item}
								<button
									class="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition
			{$activeTab === item.key
										? 'bg-red-600 text-white'
										: 'border border-gray-300 text-gray-900 hover:bg-gray-100'}"
									onclick={() => activeTab.set(item.key)}
								>
									{item.name}
								</button>
							{/each}
						</div>
					</div>

					<!-- Dynamic Content -->

					<div class="">
						{#if $activeTab === 'edit'}
							<form action="/?/updateEventDetails" method="POST" use:enhance>
								<div class="mb-6">
									<h2 class="mb-2 text-xl font-semibold text-gray-900">Basic information</h2>
									<p class="text-sm text-gray-500">
										Edit your event details below. Changes update automatically on your website.
									</p>
								</div>
								<hr class="mb-6 border-t border-gray-300" />
								<div class="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr]">
									<div class="max-w-xl space-y-6">
										<div>
											<label for="event-name" class="block text-sm font-medium">Event name</label>
											<input
												type="text"
												id="event-name"
												name="Event Name"
												value={event.title}
												class="mt-1 block w-full rounded-md border border-transparent bg-gray-100 px-3 py-2 placeholder:text-[13px] placeholder:text-[#3E3E3F] focus:bg-[#e9ecf3] focus:outline-none"
												placeholder="Enter Event name"
											/>
										</div>
										<!-- Subdomain -->
										<div>
											<label for="subdomain" class="block text-sm font-medium text-gray-700">
												Subdomain (Subdomain.veent.co)
											</label>

											<!-- Wrapper that changes background on focus -->
											<div
												class="group mt-1 flex items-center rounded-md bg-gray-100 px-3 py-2 focus-within:bg-[#e9ecf3]"
											>
												<i class="fa-solid fa-globe h-4 w-4 text-gray-500"></i>

												<!-- Input Field -->
												<input
													type="text"
													id="subdomain"
													name="Subdomain"
													value={event.slug}
													class="ml-2 block w-full border border-transparent bg-transparent placeholder:text-[13px] placeholder:text-[#3E3E3F] focus:border-transparent focus:outline-none"
													placeholder="Enter Subdomain"
												/>

												<!-- Domain Extension -->
												<span class="text-[13px] text-[#3E3E3F]"> .veent.co </span>
											</div>
										</div>
										<div>
											<label for="event-address" class="block text-sm font-medium text-gray-700"
												>Event address</label
											>
											<div class="relative mt-1">
												<span class="absolute inset-y-0 left-3 flex items-center">
													<i class="fa-solid fa-location-dot h-4 w-4 text-gray-500"></i>
												</span>
												<input
													Name="Event Address"
													type="text"
													id="event-address"
													value={event.location}
													class="block w-full rounded-md bg-gray-100 px-3 py-2 pl-10 placeholder:text-[13px] placeholder:text-[#3E3E3F] focus:bg-[#e9ecf3] focus:outline-none"
													placeholder="Enter Event address"
												/>
											</div>
										</div>
										<div class="space-y-4">
											<h3 class="text-sm font-medium text-gray-700">Event date</h3>
											<div class="mt-4">
												<label class="inline-flex">
													<input
														type="checkbox"
														class="rounded border-gray-300 text-blue-600"
														name="Is Recurring?"
														bind:checked={isRecurring}
													/>
													<span class="ml-2 text-sm text-gray-700">This is a recurring event</span>
												</label>
											</div>
											<div class="flex items-center gap-4">
												<h3 class="w-12 text-sm font-medium text-gray-700">Start</h3>
												<div class="flex w-full flex-col gap-2 sm:flex-row">
													<DatePicker
														name="startDate"
														className="flex items-center w-full rounded-md bg-gray-100 px-3 py-2 text-sm  focus:outline-none h-10"
													/>
													<input
														type="time"
														class="w-full rounded-md bg-gray-100 px-3 py-2 text-sm tracking-wider focus:bg-[#e9ecf3] focus:outline-none sm:w-32"
														name="Start Time"
													/>
												</div>
											</div>
											<div class="flex items-center gap-4">
												<h3 class="w-12 text-sm font-medium text-gray-700">End</h3>
												<div class="flex w-full flex-col gap-2 sm:flex-row">
													<DatePicker
														name="endDate"
														className="flex items-center w-full rounded-md bg-gray-100 px-3 py-2 text-sm  focus:outline-none h-10"
													/>
													<input
														type="time"
														class="w-full rounded-md bg-gray-100 px-3 py-2 text-sm tracking-wider focus:bg-[#e9ecf3] focus:outline-none sm:w-32"
														name="End Time"
													/>
												</div>
											</div>
										</div>
									</div>
									<div class="mb-30 h-80 lg:col-span-1 lg:w-full">
										<label
											for="event-description"
											class="mb-2 block text-sm font-medium text-gray-700">Event description</label
										>
										<RichText />
									</div>
								</div>
								<!-- Footer (Responsive Buttons) -->
								<div
									class="flex flex-col justify-end space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0"
								>
									<button
										type="button"
										class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:text-base"
										onclick={handleCloseDrawer}
									>
										Cancel
									</button>
									<button
										class="w-full rounded-md bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 sm:w-auto sm:text-base"
									>
										Save changes
									</button>
								</div>
							</form>
						{:else if $activeTab === 'visual'}
							<form
								action="/?/updateVisuals"
								method="POST"
								use:enhance
								enctype="multipart/form-data"
							>
								<div class="pb-4">
									<h2 class="mb-2 text-xl font-semibold">Website Visual</h2>
									<p class="mb-6 text-sm text-gray-600">
										Edit your website visual below. Changes update automatically on your website.
									</p>
									<hr class="mb-6 border-t border-gray-300" />

									<!-- Theme Image Upload -->
									<div class="grid grid-cols-2 gap-6 md:grid-cols-3">
										<div class="mb-4">
											<h3 class="mb-2 block text-sm font-medium">Theme</h3>
											<Button
												label="Select Theme"
												className=" text-gray-500 h-[10rem] w-full bg-[#F1F2F6]"
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
													<iframe
														id="myIframe"
														title="themeSelector"
														src={data.siteUrl}
														class="h-[70svh] w-full"
													></iframe>
												</div></Drawer
											>
										</div>

										<!-- Logo Image Upload -->

										<div class="mb-4">
											<h3 class="mb-2 block text-sm font-medium">Logo Image</h3>
											<div
												role="button"
												tabindex="0"
												aria-label="uploader"
												class="relative flex h-40 min-h-[10rem] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#F1F2F6] text-center"
												onclick={() => handleClick('logoInput')}
												onkeydown={(e) =>
													(e.key === 'Enter' || e.key === ' ') && handleClick('logoInput')}
											>
												{#if logoImgSrc}
													<img src={logoImgSrc} alt="Logo" class="h-full w-full object-cover" />
													<button
														class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-white"
														onclick={(e) => removeImageVar('logoImg', e)}
													>
														&times;
													</button>
												{:else}
													<p class="text-sm text-gray-500">Select Logo Image</p>
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
											<h3 class="mb-2 block text-sm font-medium">Event Logo Image</h3>
											<div
												role="button"
												tabindex="0"
												aria-label="uploader"
												class="relative flex h-40 min-h-[10rem] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#F1F2F6] text-center"
												onclick={() => handleClick('eventLogoInput')}
												onkeydown={(e) =>
													(e.key === 'Enter' || e.key === ' ') && handleClick('eventLogoInput')}
											>
												{#if eventLogoImgSrc}
													<img
														src={eventLogoImgSrc}
														alt="Event"
														class="h-full w-full object-cover"
													/>
													<button
														class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-white"
														onclick={(e) => removeImageVar('eventLogoImg', e)}
													>
														&times;
													</button>
												{:else}
													<p class="text-sm text-gray-500">Select Event Logo Image</p>
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
											<h3 class="mb-2 block text-sm font-medium">Poster Image</h3>
											<div
												role="button"
												tabindex="0"
												aria-label="uploader"
												class="relative flex h-40 min-h-[10rem] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#F1F2F6] text-center"
												onclick={() => handleClick('posterInput')}
												onkeydown={(e) =>
													(e.key === 'Enter' || e.key === ' ') && handleClick('posterInput')}
											>
												{#if posterImgSrc}
													<img src={posterImgSrc} alt="Poster" class="h-full w-full object-cover" />
													<button
														class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-white"
														onclick={(e) => removeImageVar('posterImg', e)}
													>
														&times;
													</button>
												{:else}
													<p class="text-sm text-gray-500">Select Poster Image</p>
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
												class="relative flex h-40 min-h-[10rem] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#F1F2F6] text-center"
												onclick={() => handleClick('backgroundInput')}
												onkeydown={(e) =>
													(e.key === 'Enter' || e.key === ' ') && handleClick('backgroundInput')}
											>
												{#if backgroundImgSrc}
													<img
														src={backgroundImgSrc}
														alt="Background"
														class="h-full w-full object-cover"
													/>
													<button
														class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-white"
														onclick={(e) => removeImageVar('backgroundImg', e)}
													>
														&times;
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
													class="w-full rounded bg-[#F1F2F6] p-2 placeholder:text-[13px] focus:bg-[#e9ecf3] focus:outline-none"
												/>
											</label>
										</div>
									</div>
								</div>

								<!-- Footer (Responsive Buttons) -->
								<div
									class="flex flex-col justify-end space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0"
								>
									<button
										type="button"
										class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:text-base"
										onclick={handleCloseDrawer}
									>
										Cancel
									</button>
									<button
										class="w-full rounded-md bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 sm:w-auto sm:text-base"
									>
										Save changes
									</button>
								</div>
							</form>
						{:else if $activeTab === 'contacts'}
							<form onsubmit={handleContactSubmit}>
								<div class="mb-6">
									<h2 class="mb-2 text-xl font-semibold text-gray-900">Basic Information</h2>
									<p class="text-sm text-gray-500">
										Edit your event details below. Changes update automatically on your website.
									</p>
								</div>
								<hr class="mb-6 border-t border-gray-300" />
								<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
									<div class="relative flex flex-col md:col-span-1 lg:col-span-1">
										<p class="mb-2 text-black">Image (Optional)</p>
										<label
											class="relative flex h-40 w-full cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-gray-100 text-gray-500"
										>
											{#if imagePreview}
												<div class="relative h-full w-full">
													<img
														src={imagePreview}
														class="h-full w-full rounded-lg object-cover"
														alt="preview"
													/>
													<button
														onclick={removeImage}
														class="absolute right-2 top-2 h-6 w-6 rounded-full bg-gray-400 pb-3 text-white shadow-sm hover:bg-gray-600"
													>
														&times;
													</button>
												</div>
											{:else}
												<span>Select image</span>
											{/if}
											<input
												type="file"
												accept="image/*"
												class="hidden"
												onchange={handleImageUpload}
											/>
										</label>
									</div>
									<div class="space-y-5 text-sm md:col-span-1 lg:col-span-1">
										<label class="block"
											>Name
											<input
												type="text"
												placeholder="Enter name"
												name="contactName"
												bind:value={$contactForm.contactName}
												class="mt-1 w-full rounded-md bg-gray-100 p-2 focus:bg-[#e9ecf3] focus:outline-none"
											/>
											{#if $contactFormErrors.contactName}
												<p class="text-primary text-sm">{$contactFormErrors.contactName}</p>
											{/if}
										</label>

										<div>
											Email Address
											<div class="relative mt-1">
												<span class="absolute inset-y-0 left-3 flex items-center">
													<i class="fa-regular fa-envelope"></i>
												</span>
												<input
													name="contactEmail"
													bind:value={$contactForm.contactEmail}
													type="tel"
													placeholder="Enter mobile number"
													class="w-full rounded-md bg-gray-100 p-2 pl-10 focus:bg-[#e9ecf3] focus:outline-none"
												/>
												{#if $contactFormErrors.contactEmail}
													<p class="text-primary text-sm">{$contactFormErrors.contactEmail}</p>
												{/if}
											</div>
										</div>
										<div>
											Mobile Number
											<div class="relative mt-1">
												<span class="absolute inset-y-0 left-3 flex items-center">
													<i class="fa-solid fa-phone"></i>
												</span>
												<input
													name="contactPhone"
													bind:value={$contactForm.contactPhone}
													type="tel"
													placeholder="Enter mobile number"
													class="w-full rounded-md bg-gray-100 p-2 pl-10 focus:bg-[#e9ecf3] focus:outline-none"
												/>
											</div>
											{#if $contactFormErrors.contactPhone}
												<p class="text-primary text-sm">{$contactFormErrors.contactPhone}</p>
											{/if}
										</div>
									</div>
									<div class="mb-4 md:col-span-1 lg:col-span-1">
										<label class="block"
											>Role
											<input
												type="text"
												name="contactRole"
												bind:value={$contactForm.contactRole}
												placeholder="Enter role"
												class="mt-1 w-full rounded-md bg-gray-100 p-2 focus:bg-[#e9ecf3] focus:outline-none"
											/>
											{#if $contactFormErrors.contactRole}
												<p class="text-primary text-sm">{$contactFormErrors.contactRole}</p>
											{/if}
										</label>
									</div>
								</div>
								<!-- Footer (Responsive Buttons) -->
								<div
									class="flex flex-col justify-end space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0"
								>
									<button
										type="button"
										class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:text-base"
										onclick={handleCloseDrawer}
									>
										Cancel
									</button>
									<button
										class="w-full rounded-md bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 sm:w-auto sm:text-base"
									>
										Save changes
									</button>
								</div>
							</form>
						{:else if $activeTab === 'registration'}
							<form
								action="/?/updateRegistrationInstruction"
								method="POST"
								use:enhance
								enctype="multipart/form-data"
							>
								<div>
									<div class="mb-6">
										<h2 class="mb-2 text-xl font-semibold text-gray-900">
											Registration instruction
										</h2>
										<p class="mb-4 text-sm text-gray-500">
											Edit your registration instruction below. Changes update automatically on your
											website.
										</p>
									</div>
									<hr class="mb-6 border-t border-gray-300" />
									<div class="flex flex-col gap-8 lg:flex-row">
										<div class="w-full space-y-6 lg:w-2/5">
											<div>
												<h3 class="mb-1 font-medium">Heading</h3>
												<input
													name="Heading"
													type="text"
													placeholder="Add heading"
													class="mt-1 w-full rounded-lg bg-gray-100 p-2 px-3 py-2 text-sm placeholder:text-gray-500 focus:bg-[#e9ecf3] focus:outline-none"
												/>
											</div>
											<div>
												<h3 class="mb-2 font-medium">Image</h3>
												{#if selectedImage}
													<div class="relative w-full">
														<img
															src={selectedImage}
															alt="Registration instruction preview"
															class="h-50 w-full rounded-lg object-cover"
														/>
														<button
															aria-label="Remove image"
															onclick={removeSelectedImage}
															class="absolute right-2 top-2 rounded-full bg-gray-400 p-1 text-white shadow-sm hover:bg-gray-600"
														>
															<i class="fa-solid fa-xmark"></i>
														</button>
													</div>
												{:else}
													<label
														class="h-50 flex cursor-pointer items-center justify-center rounded-lg bg-gray-100 p-12 text-center hover:bg-[#e9ecf3]"
														for="imageUpload"
													>
														<p class="text-sm text-gray-500">Select image</p>
													</label>
												{/if}
												<input
													name="Registration Instruction IMG"
													id="imageUpload"
													type="file"
													accept="image/*"
													class="hidden"
													onchange={handleFileUpload}
												/>
											</div>
										</div>
										<div class="mb-30 h-80 w-full lg:w-3/5">
											<label
												for="event-description"
												class="mb-2 block text-sm font-medium text-gray-700"
												>Event description</label
											>
											<RichText />
										</div>
									</div>
								</div>
								<!-- Footer (Responsive Buttons) -->
								<div
									class="flex flex-col justify-end space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0"
								>
									<button
										type="button"
										class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:text-base"
										onclick={handleCloseDrawer}
									>
										Cancel
									</button>
									<button
										class="w-full rounded-md bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 sm:w-auto sm:text-base"
									>
										Save changes
									</button>
								</div>
							</form>
						{/if}
					</div>
				</div>
			</Drawer>
		</div>
	</div>
	<div class="-mx-4 mb-6 overflow-x-auto rounded-lg px-4 py-3 sm:mx-0 sm:mb-8 sm:px-0">
		<nav class="flex min-w-max space-x-4">
			{#each navItems(event.id) as item}
				<Button
					label={item.label}
					className="rounded-lg border border-gray-200 py-2 shadow-sm transition-colors w-35 capitalize {handleActiveNav(
						item.label
					)}"
					onClick={() => {
						goto(item.path);
					}}
				/>
			{/each}
		</nav>
	</div>
</div>

{@render children()}
