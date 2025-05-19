<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { ProgressRing } from '@skeletonlabs/skeleton-svelte';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	import { browser } from '$app/environment';
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { regions } from '$lib/static/constant.js';
	import { formatDateTime, getTimeRemaining } from '$lib/utils';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import type { TicketDetail } from '$lib/types';

	let { data } = $props();

	const event = $derived(data.eventDetails);
	const buttonText = $derived(data.buttonText);
	let currentTab = $state('tab-0');
	let openState = $state(false);
	let timeRemaining = $state({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0
	});

	let bgImage = $state('/images/dummy-bg1.jpg');

	let cities: string[] = $state([]);
	let ticketDetails = $state<TicketDetail[]>([]);
	let quantity = $state(1);
	let convenienceFee = $state(20);

	const { form, errors, enhance, delayed, message } = superForm(data.form, {
		dataType: 'json'
	});

	let dataForms = $derived(data.form);
	let serverTime = $derived(data.serverTime);
	let formBuilder = $derived(data.formBuilder);

	$effect(() => {
		document.title = event.title;
		document.documentElement.setAttribute('data-theme', data.theme ?? event.theme);
		document.documentElement.setAttribute(
			'data-mode',
			data.mode || (event.themeMode ? 'light' : 'dark')
		);
	});

	message.subscribe(async (msg) => {
		if (msg) {
		}
	});

	const copyToClipboard = (contact: any) => {
		navigator.clipboard.writeText(contact);
	};

	let tabData = $derived.by(() => {
		const formFields = Object.keys(dataForms.constraints?.tabs ?? {});
		const newTab = formFields.reduce((acc: any, field) => {
			acc[field] = '';
			return acc;
		}, {});

		return newTab;
	});

	const addFormTab = () => {
		$form.tabs = [...$form.tabs, tabData];
		currentTab = `tab-${$form.tabs.length - 1}`;
	};

	$form.tabs = [...$form.tabs, tabData];

	//countdown =====================

	const removeTab = (tabIndex: number) => {
		$form.tabs.splice(tabIndex, 1);
		$form.tabs = [...$form.tabs];

		if (tabIndex == 0) {
			currentTab = `tab-0`;
		} else {
			currentTab = `tab-${tabIndex - 1}`;
		}
		modalClose();
	};

	const modalClose = () => {
		openState = false;
	};

	const updateCities = (selectedregion: string) => {
		const selectedRegionObj = regions.find((region) => region.name === selectedregion);
		cities = selectedRegionObj ? selectedRegionObj.cities : [];
	};

	const getInputType = (fieldType: string) => {
		switch (fieldType) {
			case 'email':
				return 'email';
			case 'time':
				return 'time';
			case 'file':
				return 'file';
			case 'number':
				return 'number';
			default:
				return 'text';
		}
	};

	let formatTime = new Date(event.startTime).toLocaleDateString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true
	});

	timeRemaining = getTimeRemaining(formatTime);

	setInterval(() => {
		timeRemaining = getTimeRemaining(formatTime);
	}, 1000);

	const selectTicket = (ticket: any, index: number) => {
		ticketDetails[index] = ticket;
	};

	const checkTicketValid = (payment: any) => {
		const from = new Date(payment.salesStart).setHours(0, 0, 0, 0);
		let to = new Date(payment.salesEnd).setHours(0, 0, 0, 0);
		const currentDate = serverTime.setHours(0, 0, 0, 0);

		if (to < 0) {
			to = currentDate + 86400000;
		}

		if (currentDate >= from && currentDate <= to) {
			return true;
		} else {
			return false;
		}
	};

	const adjustQuantity = (amount: number) => {
		const newQuantity = quantity + amount;
		if (newQuantity) {
			quantity = newQuantity;
		}
	};
</script>

<!-- prevent hydration browser -->
{#if browser}
	<div class="">
		<header class="bg-secondary-200 dark:bg-surface-900 sticky left-0 right-0 top-0 z-10">
			<nav class="shadow-xl">
				<div class="mx-auto flex w-[90%] items-center justify-between py-5 lg:w-[75%] 2xl:w-[60%]">
					<div class="flex items-center">
						<a href="/" class="text-xl font-semibold"
							><img class="max-h-[50px] max-w-[80px]" src="/favicon.png" alt="logo" /></a
						>
					</div>
					<div class="">
						<ul class="flex items-center space-x-8">
							<li>
								<a href="#announcement" class="hover:text-surface-500 hidden font-bold md:block"
									>POSTS</a
								>
							</li>
							<li>
								<a href="#contact" class="hover:text-surface-500 hidden font-bold md:block"
									>CONTACT</a
								>
							</li>

							<li>
								<a
									href="#registration"
									class="btn bg-primary-500 rounded-md p-2 font-bold uppercase"
								>
									REGISTER
								</a>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</header>
		<div class="relative min-h-screen pt-20">
			<div
				class="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[2px]"
				style="background-image: url({bgImage}); ;"
			>
				<div class="absolute inset-0 bg-[#000000]/80"></div>
			</div>
			<div class="relative mb-5 mt-7 sm:mb-12">
				<div class="mx-auto grid w-[90%] grid-cols-12 gap-y-8 sm:gap-x-8 lg:w-[75%] 2xl:w-[60%]">
					<div
						class="animated-poster order-last col-span-12 flex flex-col justify-between transition-transform
								delay-100 duration-500 ease-in-out lg:order-first lg:col-span-6"
					>
						<div class="text-surface-100">
							<h2 class="h2 mb-8 text-3xl capitalize 2xl:text-4xl">
								{event.title}
							</h2>

							<p class="text-xl">
								{#if event.description}
									{@html event.description}
								{:else}
									Go to your dashboard and add your content here!
								{/if}
							</p>
							<div class="flex max-w-[500px] items-center justify-between gap-3 py-5"></div>
						</div>

						<div
							class="card bg-secondary-100 dark:bg-surface-900 w-full px-5 py-5 sm:px-10 sm:py-7"
						>
							<h6 class="font-medium">Date</h6>
							<h4 class="h4">
								{formatDateTime(event.startTime, event.endTime).date}
							</h4>
							<h6 class="font-medium">Time</h6>
							<h4 class="h4">
								{formatDateTime(event.startTime, event.endTime).time}
							</h4>

							<h6 class="font-medium">Venue</h6>
							<h4 class="h4">{event.location}</h4>
						</div>
					</div>
					<div class="col-span-12 lg:col-span-6">
						{#if event.eventImages.length > 0}
							<img
								class="border-primary-500 min-w-[100%] rounded-md border-2"
								src={awsUrl + event.poster.url}
								alt={event.poster.alt}
							/>
						{:else}
							<img class="min-w-[100%]" src="/defaultPoster.jpg" alt="bg" />
						{/if}
					</div>
				</div>

				<div class="mt-12 sm:mt-16">
					<div class="grid grid-cols-12">
						{#if timeRemaining['days'] == 0 && timeRemaining['hours'] == 0 && timeRemaining['minutes'] == 0 && timeRemaining['seconds'] == 0}
							<div
								class="card bg-secondary-100 dark:bg-tertiary-950 col-span-12 mx-auto inline-flex w-[90%] justify-between rounded-md p-5 px-[10%] text-center text-lg font-bold shadow-2xl sm:py-10 lg:w-[75%] 2xl:w-[60%]"
							>
								<h2 class="h2 w-full">Event has started!</h2>
							</div>
						{:else}
							<div
								class="bg-secondary-100 dark:bg-tertiary-950 card animated-countdown col-span-12 mx-auto inline-flex w-[90%] justify-between p-5 text-center text-lg font-bold shadow-2xl transition-transform delay-100 duration-500 ease-in-out
										sm:py-10 md:px-[10%] lg:w-[75%] 2xl:w-[60%] 2xl:px-[5%]"
							>
								<div class="col-span-4 hidden self-center sm:block">Event starts in</div>
								<div class="col-span-2">
									DAYS
									<div
										class="bg-primary-500 text-surface-50 mx-auto mt-1 w-[60px] rounded-md px-2 py-2 text-4xl"
									>
										{timeRemaining['days']}
									</div>
								</div>
								<div class="col-span-2">
									HOURS
									<div
										class="bg-primary-500 text-surface-50 mx-auto mt-1 w-[60px] rounded-md px-2 py-2 text-4xl"
									>
										{timeRemaining['hours']}
									</div>
								</div>
								<div class="col-span-2">
									MINUTES
									<div
										class="bg-primary-500 text-surface-50 mx-auto mt-1 w-[60px] rounded-md px-2 py-2 text-4xl"
									>
										{timeRemaining['minutes']}
									</div>
								</div>
								<div class="col-span-2">
									SECONDS
									<div
										class="bg-primary-500 text-surface-50 mx-auto mt-1 w-[60px] rounded-md px-2 py-2 text-4xl"
									>
										{timeRemaining['seconds']}
									</div>
								</div>
							</div>
						{/if}

						<div
							class="animated-description col-span-12 mx-auto mt-10 w-full px-[10%] transition-opacity delay-100
							duration-1000 ease-in-out md:w-[80%] lg:w-[75%] 2xl:w-[55%]"
						>
							{#if event.eventDescription2}
								<!-- <div class="flex w-full items-center justify-center">
									{@html event.eventDescription2}
								</div> -->
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="mx-auto w-[90%] lg:w-[75%] 2xl:w-[60%]">
			<p class="py-4 text-center text-2xl font-bold sm:text-3xl"></p>
			{#if event.eventAnnouncement.docs.length > 0}
				<section class="grid grid-cols-1 gap-4 md:grid-cols-2">
					{#each event.eventAnnouncement.docs[0].eventAnnouncement as announcementCards, index}
						<div class="grid gap-2">
							{#if index % 2 === 0}
								<div
									class="bg-primary-500 {event.light == 'true'
										? ''
										: 'text-primary-50'} mb-5 rounded-xl p-5"
								>
									{#if announcementCards.image}
										<!-- image here -->
									{/if}
									<p class="py-4 text-2xl font-bold">{@html announcementCards.title}</p>
									{#if announcementCards.content}
										<p class="text-md font-medium">
											{@html announcementCards.content}
										</p>
									{/if}
								</div>
							{:else}
								<div
									class="bg-[#FDFDFD] {event.light == 'true'
										? ''
										: 'text-primary-50'} text-surface-900 mb-5 rounded-xl p-5"
								>
									{#if announcementCards.image}
										<!-- image here -->
									{/if}
									<p class="py-4 text-2xl font-bold">{@html announcementCards.title}</p>
									{#if announcementCards.content}
										<p class="text-md font-medium">
											{@html announcementCards.content}
										</p>
									{/if}
								</div>
							{/if}
						</div>
					{/each}
				</section>
			{:else}
				<div class="grid gap-2">
					<div class="mx-auto w-full pb-4 text-center sm:w-[35rem]">
						<div class="card m-12 rounded-xl px-5 py-8 shadow-sm">
							<p class="pb-2 text-2xl font-bold">No posts yet!</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
		<div id="registration" class="min-h-svh">
			<p class="pb-[3rem] text-center text-3xl font-bold">Register</p>
			<form
				class="bg-secondary-300 dark:bg-surface-700 mx-auto max-w-lg space-y-5 rounded-xl p-5 text-white sm:p-10"
				action="?/register"
				method="POST"
				use:enhance
			>
				<Tabs
					defaultValue={currentTab}
					value={currentTab}
					onValueChange={(e) => (currentTab = e.value)}
					listClasses="overflow-x-auto hide-scrollbar"
					listGap="space-x-0 mb-5"
				>
					{#snippet list()}
						{#each $form.tabs as _, i}
							<Tabs.Control
								value={`tab-${i}`}
								stateLabelActive="bg-primary-500 rounded-b-none"
								stateLabelInactive="w-[4rem] border-none"
								padding="p-0"
							>
								<span>
									{i + 1}

									{#if currentTab === `tab-${i}`}
										<Modal
											open={openState}
											onOpenChange={(e) => (openState = e.open)}
											triggerBase="pl-3 py-1"
											contentBase="card bg-surface-100-900 p-5 space-y-4 shadow-xl sm:w-[30rem]"
											backdropClasses="backdrop-blur-sm"
										>
											{#snippet trigger()}
												<p
													class="flex h-2 w-2 items-center justify-center rounded-full bg-red-800 p-3 font-semibold"
												>
													x
												</p>
											{/snippet}
											{#snippet content()}
												<header class="flex justify-between">
													<h4 class="h4">Remove Entry</h4>
												</header>
												<article>
													<p class="opacity-60">Are you sure you wish to remove this entry?</p>
												</article>
												<footer class="flex justify-end gap-4">
													<button
														type="button"
														class="btn border-surface-500 foc border"
														onclick={modalClose}>No</button
													>
													<button
														aria-label="Remove entry"
														type="button"
														class="btn text-surface-950 bg-white"
														onclick={() => removeTab(i)}>Yes</button
													>
												</footer>
											{/snippet}
										</Modal>
									{/if}
								</span>
							</Tabs.Control>
						{/each}

						<button
							class="bg-surface-50 text-surface-950 relative ml-3 flex-row items-center rounded-md text-sm"
							type="button"
							onclick={() => addFormTab()}
						>
							<p class="w-30">Add Registrant</p>
						</button>
					{/snippet}

					{#snippet content()}
						{#each $form.tabs as _, i}
							<Tabs.Panel value={`tab-${i}`}>
								<div class="space-y-5">
									{#each formBuilder as field, index}
										<div class="flex flex-col">
											{#if index > 0}
												<hr class="border-surface-800" />
											{/if}

											<label for={field.id} class="captialize font-medium">
												{field.label}
												{#if field.required}
													<span class="text-red-500">*</span>
												{/if}
											</label>

											{#if field.name == 'region'}
												<select
													id={field.id}
													name={field.name}
													bind:value={$form.tabs[i][field.id]}
													onchange={() => {
														updateCities($form.tabs[i][field.id]);
													}}
													class="bg-surface-50 text-surface-900 mt-1 w-full rounded-md border p-2"
												>
													{#each regions as { number, name }}
														<option value={name}>{`Region ${number} - ${name}`}</option>
													{/each}
												</select>
											{:else if field.name == 'city'}
												<select
													id={field.id}
													name={field.name}
													bind:value={$form.tabs[i][field.id]}
													class="bg-surface-50 text-surface-900 mt-1 w-full rounded-md border p-2"
												>
													{#each cities as city}
														<option value={city}>{city}</option>
													{/each}
												</select>
											{:else if field.fieldType == 'checkbox'}
												{#each field.options as checkInput}
													<label class="flex items-center gap-2">
														<input
															class="size-4 cursor-pointer"
															type="checkbox"
															name={field.name}
															value={checkInput.value}
															data-invalid={$errors.tabs?.[i]?.[field.id]}
															bind:group={$form.tabs[i][field.id]}
														/>
														{checkInput.value}
													</label>
												{/each}
											{:else if field.fieldType == 'multipleChoice'}
												<div class="grid grid-cols-2 gap-2">
													{#each field.options as radioInput}
														<label class="flex items-center gap-2">
															<input
																class="size-4 cursor-pointer"
																type="radio"
																name={field.name}
																value={radioInput.value}
																data-invalid={$errors.tabs?.[i]?.[field.id]}
																bind:group={$form.tabs[i][field.id]}
															/>
															{radioInput.value}
														</label>
													{/each}
												</div>
											{:else if field.fieldType === 'dropdown'}
												<select
													id={field.id}
													name={field.name}
													class="bg-surface-50 text-surface-900 mt-1 w-full rounded-md border p-2"
													bind:value={$form.tabs[i][field.id]}
												>
													<option value="">Select an option</option>
													{#each field.options as dropdownOption}
														<option value={dropdownOption.value}>{dropdownOption.value}</option>
													{/each}
												</select>
											{:else if field.fieldType == 'longText'}
												<textarea
													bind:value={$form.tabs[i][field.name]}
													id={field.name}
													name={field.name}
													class="bg-surface-50 text-surface-900 mt-1 w-full rounded-lg border p-2"
													placeholder={field.label}
												></textarea>
											{:else if field.fieldType == 'date'}
												<input
													bind:value={$form.tabs[i][field.id]}
													type="date"
													id={field.id}
													name={field.name}
													class="bg-surface-50 text-surface-900 mt-1 w-full rounded-lg border p-2"
													placeholder={field.label}
												/>
											{:else if field.fieldType === 'phone'}
												<div class="relative">
													<span class="text-surface-900 absolute left-3 top-2">+63</span>
													<input
														type="tel"
														id={field.id}
														name={field.name}
														class="bg-surface-50 text-surface-900 w-full rounded-md p-2 pl-12"
														maxlength="10"
														placeholder="9XX XXX XXXX"
														bind:value={$form.tabs[i][field.id]}
													/>
												</div>
											{:else if field.fieldType == 'json'}
												<div class="my-3 space-y-1">
													<div class="grid grid-cols-2 gap-3">
														{#each field.ticketData as ticket}
															<button
																onclick={() => {
																	selectTicket(ticket, i);
																	$form.tabs[i][field.name] = ticket.id;
																}}
																type="button"
																disabled={!ticket.quantityAvailable || !checkTicketValid(ticket)}
																style="border-color:{ticket.color}; border-left-width: 11px"
																class="text-tertiary-950 relative transform rounded-md bg-white p-2 text-left transition hover:-translate-y-0.5
																{!ticket.quantityAvailable || !checkTicketValid(ticket) ? 'cursor-not-allowed' : ''}"
															>
																<div class="flex items-center justify-between">
																	<div>
																		<span class="text-sm">{ticket.name}</span><br />
																		<span class="font-bold">₱{ticket.price}</span>
																	</div>

																	{#if $form.tabs[i][field.name] == ticket.id}
																		<input
																			class="mr-1 size-6 accent-white checked:bg-transparent"
																			type="checkbox"
																			name={field.name}
																			bind:checked={$form.tabs[i][field.name]}
																		/>
																	{/if}
																</div>

																{#if !ticket.quantityAvailable}
																	<div
																		class="absolute inset-0 m-2 flex items-center justify-center bg-red-500 text-center font-bold text-white opacity-80 sm:m-3"
																	>
																		SOLD OUT
																	</div>
																{:else if !checkTicketValid(ticket)}
																	<div
																		class="text-surface-50 absolute inset-0 m-2 flex items-center justify-center bg-red-500 text-center text-xs font-bold opacity-80 sm:m-3 sm:text-sm"
																	>
																		{#if ticket.salesStart != ticket.salesEnd}
																			Only available between {`${String(new Date(ticket.salesStart).getMonth() + 1).padStart(2, '0')}/${String(new Date(ticket.salesStart).getDate()).padStart(2, '0')}/${String(new Date(ticket.salesStart).getFullYear()).slice(2)}`}
																			and {`${String(new Date(ticket.salesEnd).getMonth() + 1).padStart(2, '0')}/${String(new Date(ticket.salesEnd).getDate()).padStart(2, '0')}/${String(new Date(ticket.salesEnd).getFullYear()).slice(2)}`}
																		{:else}
																			Only available on {`${String(new Date(ticket.salesEnd).getMonth() + 1).padStart(2, '0')}/${String(new Date(ticket.salesEnd).getDate()).padStart(2, '0')}/${String(new Date(ticket.salesEnd).getFullYear()).slice(2)}`}
																		{/if}
																	</div>
																{/if}
															</button>
														{/each}
													</div>
												</div>
												{#if ticketDetails[i]}
													<div class="mb-3 space-y-1">
														<h2>Voucher (Optional)</h2>
														<form action="">
															<div class="flex gap-2">
																<input
																	type="text"
																	name="voucher"
																	placeholder="Enter voucher code"
																	class="flex-1 rounded border-none bg-gray-300 p-3 text-base text-gray-800"
																/>

																<button
																	type="button"
																	class="cursor-pointer rounded border-none bg-gray-400 px-5 font-bold text-white transition"
																>
																	Apply
																</button>
															</div>
														</form>
													</div>
													<div class="bg-surface-800 space-y-4 rounded p-5">
														<div class=" flex items-center justify-between">
															<span>Quantity</span>
															<div class="bg-surface-600 flex items-center rounded-full">
																<button
																	type="button"
																	class="h-9 w-9 cursor-pointer rounded-full bg-transparent text-lg text-white disabled:cursor-not-allowed disabled:opacity-50"
																	onclick={() => adjustQuantity(-1)}
																	disabled={quantity <= 1}>−</button
																>
																<span class="w-10 text-center">{quantity}</span>
																<button
																	type="button"
																	class="h-9 w-9 cursor-pointer rounded-full bg-transparent text-lg text-white disabled:cursor-not-allowed disabled:opacity-50"
																	onclick={() => adjustQuantity(1)}>+</button
																>
															</div>
														</div>

														<p class="text-xs text-gray-500">Single registration will be used</p>

														<div class="flex items-center justify-between">
															<Tooltip
																text="*Convenience Fee"
																content="This small fee helps us keep things running smoothly, ensuring you have a seamless and
																 secure experience every time. Thanks for supporting us!"
															/>
															<div class="text-right">₱{convenienceFee}</div>
														</div>

														<div class="flex items-center justify-between">
															<span>Total:</span>
															<span class="text-2xl font-bold"
																>₱ {ticketDetails[i].price * quantity - convenienceFee}</span
															>
														</div>
													</div>
												{/if}
											{:else}
												<input
													class="text-surface-950 bg-surface-50 rounded-lg border px-4 py-2 outline-none {$errors
														.tabs?.[i]?.[field.name]
														? 'border-primary text-red-500'
														: ''}"
													type={getInputType(field.fieldType)}
													id={field.id}
													name={field.name}
													data-invalid={$errors.tabs?.[i]?.[field.id]}
													bind:value={$form.tabs[i][field.id]}
												/>
											{/if}

											{#if $errors.tabs?.[i]?.[field.id]}
												<div class="mt-1">
													<span class="bg-surface-200 rounded-md p-2 text-xs text-red-800"
														>{$errors.tabs[i][field.id]}</span
													>
												</div>
											{/if}
										</div>
									{/each}
								</div>
							</Tabs.Panel>
						{/each}
					{/snippet}
				</Tabs>

				<button
					type="submit"
					class="bg-primary-500 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-white"
					>{#if $delayed}
						<ProgressRing
							size="size-4"
							meterStroke="stroke-tertiary-600-400"
							trackStroke="stroke-tertiary-50-950"
						/>
					{/if}{buttonText ?? 'Submit'}</button
				>

				<div class="space-y-1">
					<div class="text-center">Accepts the following payments</div>
					<div class="flex flex-wrap justify-center gap-1">
						<img src="/images/payments/visa.png" class="h-[30px] rounded-xl" alt="visa" />
						<img
							src="/images/payments/mastercard.png"
							class="h-[30px] rounded-xl"
							alt="mastercard"
						/>
						<img src="/images/payments/gcash.png" class="h-[30px] rounded-xl" alt="gcash" />
						<img src="/images/payments/maya.png" class="h-[30px] rounded-xl" alt="maya" />
						<img src="/images/payments/grabpay.png" class="h-[30px] rounded-xl" alt="grabpay" />
						<img src="/images/payments/billease.png" class="h-[30px] rounded-xl" alt="billease" />
						<img
							src="/images/payments/bank-transfer.png"
							class="h-[30px] rounded-xl"
							alt="bank-transfer"
						/>
					</div>
				</div>
			</form>
		</div>
		<div id="contact" class="contactPage py-10">
			<p class="mb-[3rem] text-center text-2xl font-bold sm:text-3xl">NEED HELP? CONTACT US</p>
			{#if event.eventContacts.length}
				<div class="mx-auto grid w-[75%] grid-cols-12 gap-y-5 sm:gap-5 lg:w-[75%] 2xl:w-[60%]">
					{#each event.eventContacts as contactCard, index}
						<div
							class="bg-secondary-100 dark:bg-tertiary-950 contact col-span-12 rounded-xl p-5 {event
								.eventContacts.length == 1
								? 'mx-auto w-full sm:w-[22rem]'
								: event.eventContacts.length == 2
									? 'sm:col-span-6'
									: 'sm:col-span-6 lg:col-span-4'} 
					
					 delay-{index == 0
								? '100'
								: index *
									500} animated-contact overflow-auto transition-opacity duration-500 ease-in-out"
						>
							<div>
								{#if contactCard.contactName}
									<h3 class="h3">{contactCard.contactName}</h3>
								{/if}
								{#if contactCard.contactEmail}
									<p>
										<span>Email: </span>
										<button
											onclick={() => {
												copyToClipboard(contactCard.contactEmail);
											}}
											class="cursor-pointer font-bold"
											>{contactCard.contactEmail}
										</button>
									</p>
								{/if}
								{#if contactCard.contactPhone}
									<p>
										<span>Phone: </span>
										<button
											onclick={() => {
												copyToClipboard(contactCard.contactPhone);
											}}
											class="cursor-pointer font-bold"
											>{contactCard.contactPhone}
										</button>
									</p>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="mx-auto w-full text-center sm:w-[35rem]">
					<div class="card m-12 rounded-xl px-5 py-8 shadow-sm">
						<p class="pb-2 text-xl font-medium">You have no Contact Cards Yet!</p>
						<p class="text-md">Go to your dashboard and add contact info</p>
					</div>
				</div>
			{/if}
		</div>
		<footer class="bg-secondary-200 dark:bg-surface-900 py-10">
			<div class="flex justify-center gap-[5%] font-bold sm:gap-[10%]">
				<div
					class="animated-footer
		
					 text-center transition-transform delay-100 duration-500 ease-in-out"
				>
					Powered by
					<div class="mx-auto mt-2 max-w-[6rem]">
						<img src="/images/veent-logo.svg" alt="veent" />
					</div>
				</div>
			</div>
		</footer>
	</div>
{/if}
