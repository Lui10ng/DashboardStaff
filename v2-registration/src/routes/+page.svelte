<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { ProgressRing, type ToastContext } from '@skeletonlabs/skeleton-svelte';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	import { getContext } from 'svelte';
	import { formatDateTime, getTimeRemaining } from '$lib/utils';
	import { browser } from '$app/environment';
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { regions } from '$lib/static/constant.js';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import type { TicketDetail } from '$lib/types';

	let { data } = $props();
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

	const { form, errors, enhance, delayed, message } = superForm(data.form, {
		dataType: 'json'
	});

	let dataForms = $derived(data.form);
	let eventDetails = $derived(data.eventDetails);
	let formBuilder = $derived(data.formBuilder);
	let awsUrl = $derived(data.AWS_URL);
	let serverTime = $derived(data.serverTime);
	let ticketDetails = $state<TicketDetail[]>([]);

	$effect(() => {
		const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;

		if (favicon) {
			favicon.href = `${awsUrl}${eventDetails.logo.url}`;
		}
		document.title = eventDetails.fullEventName;
	});

	message.subscribe(async (msg) => {
		if (msg) {
			if (!msg.errors) {
				triggerSuccess(msg.message);
			}
		}
	});

	export const toast: ToastContext = getContext('toast');

	const triggerSuccess = (message: string) => {
		toast.create({
			title: 'Success',
			description: message,
			type: 'success'
		});
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

	let formatTime = new Date(eventDetails.dateTime).toLocaleDateString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true
	});

	timeRemaining = getTimeRemaining(formatTime);

	const copyToClipboard = (contact: any) => {
		navigator.clipboard.writeText(contact);
	};

	const endOfEvent = (givenDateString: any) => {
		const givenDate = new Date(givenDateString);
		const currentDate = new Date();
		if (currentDate > givenDate) {
			return true;
		} else {
			return false;
		}
	};

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

	const checkTicketValid = (payment: any) => {
		const from = new Date(payment.from).setHours(0, 0, 0, 0);
		let to = new Date(payment.to).setHours(0, 0, 0, 0);
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

	const selectTicket = (ticket: any, index: number) => {
		ticketDetails[index] = ticket;
	};

	setInterval(() => {
		timeRemaining = getTimeRemaining(formatTime);
	}, 1000);
</script>

<!-- prevent hydration browser -->
{#if browser}
	<div class="light:bg-surface-50">
		<header class="bg-secondary-200 dark:bg-surface-900 sticky left-0 right-0 top-0 z-10">
			<nav class="shadow-xl">
				<div class="mx-auto flex w-[90%] items-center justify-between py-5 lg:w-[75%] 2xl:w-[60%]">
					<div class="flex items-center">
						<a href="/" class="text-xl font-semibold"
							><img
								class="max-h-[50px] max-w-[80px]"
								src={awsUrl + eventDetails.logo.url}
								alt="logo"
							/></a
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

							{#if !eventDetails.disableRegistration}
								<li>
									<a
										href="#registration"
										class="btn bg-primary-500 rounded-md p-2 font-bold uppercase"
									>
										{eventDetails.registerButtonLabel}
									</a>
								</li>
							{/if}
						</ul>
					</div>
				</div>
			</nav>
		</header>

		<div class= "relative min-h-screen pt-20">

					<div
						class="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[2px]"
						style="background-image: url({bgImage}); ;"
					>
						<div class="absolute inset-0 bg-[#000000]/80"></div>
					</div>
			<div class="relative  mb-5 mt-7 sm:mb-12">
				<div class="mx-auto grid w-[90%] grid-cols-12 gap-y-8 sm:gap-x-8 lg:w-[75%] 2xl:w-[60%]">
					<div
						class="animated-poster order-last col-span-12 flex flex-col justify-between transition-transform
					delay-100 duration-500 ease-in-out lg:order-first lg:col-span-6"
					>
						<div>
							{#if eventDetails.eventLogo}
								<img
									class="w-[270px] py-5"
									src={awsUrl + eventDetails.eventLogo.url}
									alt={eventDetails.eventLogo.alt}
								/>
							{:else}
								<h2 class="h2 mb-8 text-3xl 2xl:text-4xl">
									{eventDetails.fullEventName}
								</h2>
							{/if}
							<p class="text-xl">
								{#if eventDetails.eventDescription}
									{@html eventDetails.eventDescription}
								{:else}
									Go to your dashboard and add your content here!
								{/if}
							</p>
							<div class="flex max-w-[500px] items-center justify-between gap-3 py-5">
								{#if eventDetails.disableRegistration}
									<button class="bg-surface-500 text-surface-50 btn rounded border p-2 px-5 text-2xl">
										{eventDetails.registerButtonLabel}
									</button>
								{/if}
								{#if eventDetails.donations}
									{#if eventDetails.disableRegistration}
										<div>OR</div>
									{/if}

									<button
										class="bg-surface-500 text-surface-50 w-full max-w-xs whitespace-normal break-words rounded border p-2 px-5 text-center text-2xl"
									>
										{eventDetails.forms.donateButtonText
											? eventDetails.forms.donateButtonText
											: 'Donate Now'}
									</button>
								{/if}
							</div>
						</div>

						<div class="card bg-secondary-100 dark:bg-surface-900 w-full px-5 py-5 sm:px-10 sm:py-7">
							{#if !eventDetails.noExpiryEvent}
								<h6 class="font-medium">Date</h6>
								<h4 class="h4">
									{formatDateTime(eventDetails.dateTime, eventDetails.dateTimeEnd).date}
								</h4>
								<h6 class="font-medium">Time</h6>
								<h4 class="h4">
									{formatDateTime(eventDetails.dateTime, eventDetails.dateTimeEnd).time}
								</h4>
							{/if}
							<h6 class="font-medium">Venue</h6>
							<h4 class="h4">{eventDetails.fullEventAddress}</h4>
						</div>
					</div>
					<div class="col-span-12 lg:col-span-6">
						{#if eventDetails.poster}
							<img
								class="border-primary-500 min-w-[100%] rounded-md border-2"
								src={awsUrl + eventDetails.poster.url}
								alt={eventDetails.poster.alt}
							/>
						{:else}
							<img class="min-w-[100%]" src="/defaultPoster.jpg" alt="bg" />
						{/if}
					</div>
				</div>

				<div class="mt-12 sm:mt-16">
					<div class="grid grid-cols-12">
						{#if !eventDetails.noExpiryEvent}
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
						{/if}
						<div
							class="animated-description col-span-12 mx-auto mt-10 w-full px-[10%] transition-opacity delay-100
							
					duration-1000 ease-in-out md:w-[80%] lg:w-[75%] 2xl:w-[55%]"
						>
							{#if eventDetails.eventDescription2}
								<div class="flex w-full items-center justify-center">
									{@html eventDetails.eventDescription2}
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
	</div>

		<!-- last ni -->

		<div id="announcement" class="postPage">
			<div class="mx-auto w-[90%] lg:w-[75%] 2xl:w-[60%]">
				<p class="py-4 text-center text-2xl font-bold sm:text-3xl"></p>

				{#if eventDetails.announcementCards.length > 0}
					<section class="grid grid-cols-1 gap-4 md:grid-cols-2">
						{#each eventDetails.announcementCards as announcementCards, index}
							<div class="grid gap-2">
								{#if index % 2 === 0}
									<div
										class="bg-primary-500 mb-5 rounded-xl p-5
									
									 delay-{index * 500} animated-announcement transition-transform duration-500 ease-in-out"
									>
										{#if announcementCards.sliderImage}
											<img
												class="w-full"
												src={awsUrl + announcementCards.sliderImage.url}
												alt={announcementCards.title}
											/>
										{/if}
										<p class="py-4 text-2xl font-bold">{announcementCards.title}</p>
										{#if announcementCards.content}
											<p class="text-md font-medium">
												{@html announcementCards.content}
											</p>
										{/if}
									</div>
								{:else}
									<div
										class="text-surface-900 bg-surface-100 mb-5 rounded-xl p-5 delay-{index *
											500} animated-announcement transition-transform duration-500"
									>
										{#if announcementCards.sliderImage}
											<img
												class="w-full"
												src={awsUrl + announcementCards.sliderImage.url}
												alt={announcementCards.title}
											/>
										{/if}
										<p class="py-4 text-2xl font-bold">{announcementCards.title}</p>

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
		</div>
		{#if !eventDetails.disableRegistration || eventDetails.register}
			<div id="registration" class="mx-auto w-[90%] lg:w-[75%] 2xl:w-[60%]">
				{#if (!eventDetails.done && !endOfEvent(eventDetails.dateTimeEnd)) || eventDetails.noExpiryEvent}
					<p class="py-[3rem] text-center text-3xl font-bold">
						{eventDetails.registerButtonLabel}
					</p>

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
													{#if field.name == 'region'}
														<div>
															<label for={field.name} class="block">{field.label}</label>
															<select
																id={field.name}
																bind:value={$form.tabs[i][field.name]}
																onchange={() => {
																	updateCities($form.tabs[i][field.name]);
																}}
																class="bg-surface-50 text-surface-900 mt-1 w-full rounded-md border p-2"
															>
																{#each regions as { number, name }}
																	<option value={name}>{`Region ${number} - ${name}`}</option>
																{/each}
															</select>
														</div>
													{:else if field.name == 'city'}
														<div class="mb-4">
															<label for={field.name} class="block">{field.label}</label>
															<select
																id={field.name}
																bind:value={$form.tabs[i][field.name]}
																class="bg-surface-50 text-surface-900 mt-1 w-full rounded-md border p-2"
															>
																{#each cities as city}
																	<option value={city}>{city}</option>
																{/each}
															</select>
														</div>
													{:else if field.fieldType == 'checkbox'}
														<label class="flex items-center gap-2 capitalize" for={field.name}>
															<input
																class="size-4 cursor-pointer rounded-lg border px-4 py-2 outline-none {$errors
																	.tabs?.[i]?.[field.name]
																	? 'border-primary text-red-500'
																	: ''}"
																type="checkbox"
																data-invalid={$errors.tabs?.[i]?.[field.name]}
																bind:checked={$form.tabs[i][field.name]}
															/>
															{field.label}
														</label>
													{:else if field.fieldType == 'radio'}
														<div>
															<label for={field.name} class="font-bold capitalize"
																>{field.label}</label
															>
															<div class="grid grid-cols-2 gap-2">
																{#each JSON.parse(field.radioInputs) as radioInput}
																	<label class="flex items-center gap-2">
																		<input
																			class="size-4 cursor-pointer"
																			type="radio"
																			value={radioInput}
																			data-invalid={$errors.tabs?.[i]?.[field.name]}
																			bind:group={$form.tabs[i][field.name]}
																		/>
																		{radioInput}
																	</label>
																{/each}
															</div>
														</div>
													{:else if field.fieldType == 'dropdown'}
														<div>
															<label for={field.name} class="font-bold">{field.label}</label>
															<select
																name={field.name}
																bind:value={$form.tabs[i][field.name]}
																class="bg-surface-50 text-surface-900 mt-1 w-full rounded-md border p-2"
															>
																{#each JSON.parse(field.radioInputs) as radioInput}
																	<option value={radioInput}>{radioInput}</option>
																{/each}
															</select>
														</div>
													{:else if field.fieldType == 'textArea'}
														<div>
															<label for={field.name} class="block"
																>{field.label}
																<textarea
																	bind:value={$form.tabs[i][field.name]}
																	id={field.name}
																	name={field.name}
																	class="bg-surface-50 text-surface-900 mt-1 w-full rounded-lg border p-2"
																	placeholder={field.label}
																></textarea>
															</label>
														</div>
													{:else if field.fieldType == 'date'}
														<div>
															<label for={field.name} class="block"
																>{field.label}
																<input
																	bind:value={$form.tabs[i][field.name]}
																	type="date"
																	id={field.name}
																	name={field.name}
																	class="bg-surface-50 text-surface-900 mt-1 w-full rounded-lg border p-2"
																	placeholder={field.label}
																/>
															</label>
														</div>
													{:else if field.fieldType == 'json'}
														{#if eventDetails.paymentType.length > 0}
															<div class="mb-3 space-y-1">
																<h1>Select Ticket</h1>
																<div class="grid grid-cols-2 gap-3">
																	{#each field.ticketData as ticket}
																		<button
																			onclick={() => {
																				selectTicket(ticket, i);
																				$form.tabs[i][field.name] = ticket.id;
																			}}
																			disabled={!ticket.quantity || !checkTicketValid(ticket)}
																			type="button"
																			style="border-color:{ticket.color}; border-left-width: 11px"
																			class="text-tertiary-950 relative rounded-md bg-white p-2 text-left transition-transform duration-150 hover:scale-105 hover:transform {!ticket.quantity ||
																			!checkTicketValid(ticket)
																				? 'cursor-not-allowed'
																				: ''}"
																		>
																			<div class="flex items-center justify-between">
																				<div>
																					<span class="text-sm">{ticket.label}</span><br />
																					<span class="font-bold">₱{ticket.price}</span>
																				</div>
																				{#if $form.tabs[i][field.name] && $form.tabs[i][field.name].includes(ticket.id)}
																					<input
																						class="mr-1 size-6 accent-white checked:bg-transparent"
																						type="checkbox"
																						name={field.name}
																						value={ticket.id}
																						bind:checked={$form.tabs[i][field.name]}
																					/>
																				{/if}
																			</div>

																			{#if !ticket.quantity}
																				<div
																					class="absolute inset-0 m-2 flex items-center justify-center bg-red-500 text-center font-bold text-white opacity-80 sm:m-3"
																				>
																					SOLD OUT
																				</div>
																			{:else if !checkTicketValid(ticket)}
																				<div
																					class="text-surface-50 absolute inset-0 m-2 flex items-center justify-center bg-red-500 text-center text-xs font-bold opacity-80 sm:m-3 sm:text-sm"
																				>
																					{#if ticket.from != ticket.to}
																						Only available between {`${String(new Date(ticket.from).getMonth() + 1).padStart(2, '0')}/${String(new Date(ticket.from).getDate()).padStart(2, '0')}/${String(new Date(ticket.from).getFullYear()).slice(2)}`}
																						and {`${String(new Date(ticket.to).getMonth() + 1).padStart(2, '0')}/${String(new Date(ticket.to).getDate()).padStart(2, '0')}/${String(new Date(ticket.to).getFullYear()).slice(2)}`}
																					{:else}
																						Only available on {`${String(new Date(ticket.to).getMonth() + 1).padStart(2, '0')}/${String(new Date(ticket.to).getDate()).padStart(2, '0')}/${String(new Date(ticket.to).getFullYear()).slice(2)}`}
																					{/if}
																				</div>
																			{/if}
																		</button>
																	{/each}
																</div>
															</div>
															{#if ticketDetails[i]}
																<div
																	class="text-surface-950 bg-surface-50 rounded-t-lg p-5 text-center text-sm"
																>
																	<div class="grid grid-cols-3">
																		<div></div>
																		<div class="text-left font-semibold">Voucher</div>
																		<div class="text-right font-semibold">Price</div>
																	</div>
																	<div class="grid grid-cols-3 gap-20">
																		<div
																			class="rounded-sm bg-white p-1"
																			style="border-color:{ticketDetails[i]
																				.color}; border-left-width: 7px"
																		>
																			{ticketDetails[i]?.label}
																		</div>
																		<div></div>
																		<div class="text-right">₱{ticketDetails[i].price}</div>
																	</div>
																	<div class="grid grid-cols-3">
																		<div></div>
																		<div class="text-left text-xs">
																			<Tooltip
																				text="*Convenience Fee"
																				content="This small fee helps us keep things running smoothly, ensuring you have a seamless and
																		 secure experience every time. Thanks for supporting us!"
																			/>
																		</div>
																		<div class="text-right">₱20</div>
																	</div>
																	<div class="grid grid-cols-3">
																		<div></div>
																		<div class="text-left">Total</div>
																		<div class="text-right font-semibold">
																			₱{ticketDetails[i].price - 20}
																		</div>
																	</div>
																</div>
															{/if}
														{/if}
													{:else}
														{field.label}
														<input
															class="text-surface-950 bg-surface-50 rounded-lg border px-4 py-2 outline-none {$errors
																.tabs?.[i]?.[field.name]
																? 'border-primary text-red-500'
																: ''}"
															type="text"
															data-invalid={$errors.tabs?.[i]?.[field.name]}
															bind:value={$form.tabs[i][field.name]}
														/>
													{/if}

													{#if $errors.tabs?.[i]?.[field.name]}
														<div class="mt-1">
															<span class="bg-surface-200 rounded-md p-2 text-xs text-red-800"
																>{$errors.tabs[i][field.name]}</span
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
									value={null}
									size="size-4"
									meterStroke="stroke-tertiary-600-400"
									trackStroke="stroke-tertiary-50-950"
								/>
							{/if}Submit</button
						>

						{#if eventDetails.paymentType.length > 0}
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
									<img
										src="/images/payments/grabpay.png"
										class="h-[30px] rounded-xl"
										alt="grabpay"
									/>
									<img
										src="/images/payments/billease.png"
										class="h-[30px] rounded-xl"
										alt="billease"
									/>
									<img
										src="/images/payments/bank-transfer.png"
										class="h-[30px] rounded-xl"
										alt="bank-transfer"
									/>
								</div>
							</div>
						{/if}
					</form>
				{:else}
					<h1 class="py-12 text-center text-5xl font-bold">
						Registration<br />has ended!
					</h1>
				{/if}
			</div>
		{/if}

		<div id="contact" class="contactPage py-10">
			<p class="mb-[3rem] text-center text-2xl font-bold sm:text-3xl">NEED HELP? CONTACT US</p>
			{#if eventDetails.contactCards.length}
				<div class="mx-auto grid w-[75%] grid-cols-12 gap-y-5 sm:gap-5 lg:w-[75%] 2xl:w-[60%]">
					{#each eventDetails.contactCards as contactCard, index}
						<div
							class="bg-secondary-100 dark:bg-tertiary-950 contact col-span-12 rounded-xl p-5 {eventDetails
								.contactCards.length == 1
								? 'mx-auto w-full sm:w-[22rem]'
								: eventDetails.contactCards.length == 2
									? 'sm:col-span-6'
									: 'sm:col-span-6 lg:col-span-4'} 
							
							 delay-{index == 0
								? '100'
								: index *
									500} animated-contact overflow-auto transition-opacity duration-500 ease-in-out"
						>
							{#if contactCard.contactLogo}
								<div class="h-[11.5rem] content-center pb-5">
									<img
										class="mx-auto max-h-[10rem] max-w-full"
										src={awsUrl + contactCard.contactLogo.url}
										alt="veent"
									/>
								</div>
							{/if}
							<div>
								{#if contactCard.name}
									<h3 class="h3">{contactCard.name}</h3>
								{/if}
								{#if contactCard.email}
									<p>
										<span>Email: </span>
										<button
											onclick={() => {
												copyToClipboard(contactCard.email);
											}}
											class="cursor-pointer font-bold"
											>{contactCard.email}
										</button>
									</p>
								{/if}
								{#if contactCard.website}
									<p>
										<span>Website: </span><a
											class="cursor-pointer font-bold"
											href={contactCard.website}
											target="_blank">{contactCard.website}</a
										>
									</p>
								{/if}
								{#if contactCard.phone}
									<p>
										<span>Phone: </span>
										<button
											onclick={() => {
												copyToClipboard(contactCard.phone);
											}}
											class="cursor-pointer font-bold"
											>{contactCard.phone}
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
		<footer class="bg-secondary-200 dark:bg-surface-900 py-5">
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
