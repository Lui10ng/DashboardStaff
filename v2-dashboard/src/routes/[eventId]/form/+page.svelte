<script lang="ts">
	import { dndzone } from 'svelte-dnd-action';
	import type { FormData, FormField, FieldType } from './types';
	import FormFieldComponent from './components/FormField.svelte';
	import { formStore } from '$lib/stores/form.svelte.ts';
	import { fly } from 'svelte/transition';

	const { data } = $props();

	let isEditMode = $state(false);
	let formResponses = $state<Record<string, any>>({});
	let validationErrors = $state<Record<string, string>>({});
	let fieldTypes: { fieldType: FieldType; label: string; icon: string }[] = [
		{ fieldType: 'firstName', label: 'First Name', icon: 'fa-user' },
		{ fieldType: 'lastName', label: 'Last Name', icon: 'fa-user' },
		{ fieldType: 'shortText', label: 'Short Text', icon: 'fa-font' },
		{ fieldType: 'longText', label: 'Long Text', icon: 'fa-paragraph' },
		{ fieldType: 'email', label: 'Email', icon: 'fa-envelope' },
		{ fieldType: 'phone', label: 'Phone', icon: 'fa-phone' },
		{ fieldType: 'number', label: 'Number', icon: 'fa-hashtag' },
		{ fieldType: 'date', label: 'Date', icon: 'fa-calendar' },
		{ fieldType: 'multipleChoice', label: 'Multiple Choice', icon: 'fa-list-ul' },
		{ fieldType: 'checkbox', label: 'Checkbox', icon: 'fa-check-square' },
		{ fieldType: 'dropdown', label: 'Dropdown', icon: 'fa-chevron-down' },
		{ fieldType: 'file', label: 'File Upload', icon: 'fa-upload' },
		{ fieldType: 'time', label: 'Time', icon: 'fa-clock' },
		{ fieldType: 'region', label: 'Region & City', icon: 'fa-map-marker-alt' }
	];

	$effect(() => {
		formStore.setFormData(
			data?.formData || {
				title: 'Registration Form',
				description: 'Please fill out this registration form',
				formBuilder: []
			}
		);
	});

	let formData = $derived(formStore.getFormData());

	interface Region {
		id: string;
		name: string;
		code: any;
	}

	interface City {
		id: string;
		name: string;
		code: any;
	}

	let regions: Region[] = [];
	let cities: Record<string, City[]> = {};
	let selectedRegion = '';

	let dragging = $state(false);
	let dragDisabled = $derived(!dragging);

	async function fetchRegions() {
		try {
			const response = await fetch('https://psgc.gitlab.io/api/regions/');
			regions = await response.json();
		} catch (error) {
			console.error('Error fetching regions:', error);
		}
	}

	async function fetchCities(regionCode: string) {
		try {
			const response = await fetch(
				`https://psgc.gitlab.io/api/regions/${regionCode}/cities-municipalities/`
			);
			cities[regionCode] = await response.json();
			console.log('Fetched cities:', cities[regionCode]);
		} catch (error) {
			console.error('Error fetching cities:', error);
		}
	}

	function addField(fieldType: FieldType) {
		if (fieldType === 'region') {
			formData.formBuilder = [
				...formData.formBuilder,
				{
					id: crypto.randomUUID(),
					name: 'region',
					fieldType: 'region',
					label: 'Region',
					required: true,
					options: regions.map((region) => region.name)
				},
				{
					id: crypto.randomUUID(),
					name: 'city',
					fieldType: 'city',
					label: 'City/Municipality',
					required: true,
					options: []
				},
				{
					id: crypto.randomUUID(),
					name: 'street',
					fieldType: 'shortText',
					label: 'Street/Barangay',
					required: true
				}
			];

			fieldTypes = fieldTypes.filter((ft) => ft.fieldType !== 'region');
		} else {
			const newField: FormField = {
				id: crypto.randomUUID(),
				name: fieldType.toLowerCase(),
				fieldType,
				label: `New ${fieldType} field`,
				required: false,
				options:
					fieldType === 'multipleChoice' || fieldType === 'checkbox' || fieldType === 'dropdown'
						? ['Option 1']
						: undefined
			};
			formData.formBuilder = [...formData.formBuilder, newField];
		}
	}

	function handleDnd(e: CustomEvent<{ items: FormField[] }>) {
		formData.formBuilder = e.detail.items;
		if (e.type === 'finalize') {
			dragging = false;
		}
	}

	function deleteField(id: string) {
		formData.formBuilder = formData.formBuilder.filter((field) => field.id !== id);
	}

	function updateField(updatedField: FormField) {
		formData.formBuilder = formData.formBuilder.map((field) =>
			field.id === updatedField.id ? updatedField : field
		);
	}

	function toggleEditMode() {
		isEditMode = !isEditMode;
	}

	function handleSaveChanges() {
		formData.formBuilder = formData.formBuilder.map((field) => ({
			...field,
			id: field.id || crypto.randomUUID()
		}));

		isEditMode = false;
	}

	function handleCancel() {
		isEditMode = false;
	}

	function validateField(field: FormField, value: any): string | null {
		if (field.required && !value) {
			return `${field.label} is required`;
		}

		switch (field.fieldType) {
			case 'email':
				if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
					return 'Please enter a valid email address';
				}
				break;
			case 'phone':
				const phoneNumber = value?.replace(/[^0-9]/g, '');
				if (value && !/^[0-9]{10}$/.test(phoneNumber)) {
					return 'Please enter a valid 10-digit phone number';
				}
				break;
			case 'number':
				if (value && isNaN(Number(value))) {
					return 'Please enter a valid number';
				}
				break;
		}

		return null;
	}

	function validateForm(): boolean {
		validationErrors = {};
		let isValid = true;

		formData.formBuilder.forEach((field) => {
			const value = formResponses[field.id];
			const error = validateField(field, value);
			if (error) {
				validationErrors[field.id] = error;
				isValid = false;
			}
		});

		return isValid;
	}

	async function handleSubmit() {
		if (!validateForm()) {
			return;
		}

		try {
			const formDataToSubmit = new FormData();
			formDataToSubmit.append('formData', JSON.stringify(formData));
			formDataToSubmit.append('responses', JSON.stringify(formResponses));

			const response = await fetch('?/createForm', {
				method: 'POST',
				body: formDataToSubmit
			});

			if (!response.ok) {
				throw new Error('Failed to submit form');
			}

			alert('Form submitted successfully!');
		} catch (error) {
			console.error('Error submitting form:', error);
			alert('Failed to submit form. Please try again.');
		}
	}

	import { onMount } from 'svelte';
	onMount(() => {
		fetchRegions();
	});

	async function handleRegionChange(event: Event, fieldId: string) {
		const regionName = (event.target as HTMLSelectElement).value;
		const region = regions.find((r) => r.name === regionName);
		if (region) {
			console.log(region);
			await fetchCities(region.code);
			formData.formBuilder = formData.formBuilder.map((f) => {
				if (f.fieldType === 'city') {
					return {
						...f,
						options: cities[region.code]?.map((city) => city.name) || []
					};
				}
				return f;
			});

			console.log('Updated form fields:', formData.formBuilder);
		}
	}

	function getInputType(fieldType: FieldType): string {
		switch (fieldType) {
			case 'email':
				return 'email';
			case 'number':
				return 'number';
			case 'date':
				return 'date';
			case 'file':
				return 'file';
			default:
				return 'text';
		}
	}
</script>

<div in:fly={{ y: -50, duration: 200 }}>
	<div>
		<h1 class="text-2xl font-bold">Registration Form</h1>
		<div class="text-sm text-gray-500">
			<p>(Customize what data you need to collect from your attendees here.)</p>
		</div>
		<button class="mt-6 rounded-lg bg-[#d32f2f] px-6 py-2 text-white">Create Pre-filled Form</button
		>
	</div>
	<div class="mx-auto mt-10 max-w-xl p-4">
		<div class="rounded-lg bg-[#f6f7fa] p-6 {isEditMode ? 'pt-1' : ''} shadow-lg">
			<div class="relative mb-8">
				{#if !isEditMode}
					<h1 class="text-2xl font-bold">{formData.title}</h1>
					<div class="mt-1 text-sm text-gray-500">
						{formData.description}
					</div>
					<button
						class="absolute right-0 top-0 flex items-center gap-2 rounded-lg border border-[#d32f2f] px-4 py-2 text-[#d32f2f]"
						on:click={toggleEditMode}
					>
						<span>Edit Form</span>
						<i class="fas fa-edit"></i>
					</button>
				{/if}
			</div>
			{#if isEditMode}
				<!-- Edit Mode Header -->
				<div class="mb-6 flex justify-between">
					<button
						class="rounded-lg border border-[#d32f2f] px-6 py-2 text-[#d32f2f]"
						on:click={handleCancel}
					>
						Cancel
					</button>
					<button class="rounded-lg bg-[#d32f2f] px-6 py-2 text-white" on:click={handleSaveChanges}>
						Save Changes
					</button>
				</div>

				<!-- Builder Mode -->
				<input
					class="mb-2 w-full border-b-2 border-transparent p-2 text-3xl font-bold text-[#818692] focus:border-blue-500 focus:outline-none"
					placeholder="Form Title"
					bind:value={formData.title}
				/>
				<textarea
					class="mb-6 w-full border-b-2 border-transparent p-2 text-[#818692] focus:border-blue-500 focus:outline-none"
					placeholder="Form Description"
					bind:value={formData.description}
				></textarea>

				<div
					use:dndzone={{
						items: formData.formBuilder,
						flipDurationMs: 200,
						dragDisabled
					}}
					on:consider={handleDnd}
					on:finalize={handleDnd}
					class="mb-6 space-y-4"
				>
					{#each formData.formBuilder as field (field.id)}
						<FormFieldComponent
							{field}
							on:delete={() => deleteField(field.id)}
							on:update={(e) => updateField(e.detail)}
							on:startdrag={() => (dragging = true)}
							on:stopdrag={() => (dragging = false)}
						/>
					{/each}
				</div>

				<div class="mt-6">
					<h3 class="mb-4 text-lg font-semibold">Add Field</h3>
					<div class="grid grid-cols-3 gap-4 md:grid-cols-4">
						{#each fieldTypes as { fieldType, label, icon }}
							<button
								class="flex cursor-pointer flex-col items-center rounded-lg border p-4 transition-colors hover:bg-gray-50"
								on:click={() => addField(fieldType)}
							>
								<i class="fas {icon} mb-2 text-2xl"></i>
								<span class="text-sm">{label}</span>
							</button>
						{/each}
					</div>
				</div>
			{:else}
				<!-- Preview Mode -->
				<form on:submit|preventDefault={handleSubmit} class="space-y-6">
					{#each formData.formBuilder as field (field.id)}
						<div class="space-y-2">
							<label for={field.id} class="block text-sm font-medium text-gray-700">
								{field.label}
								{#if field.required}
									<span class="text-red-500">*</span>
								{/if}
							</label>

							{#if validationErrors[field.id]}
								<p class="text-sm text-red-500">{validationErrors[field.id]}</p>
							{/if}

							{#if field.fieldType === 'firstName' || field.fieldType === 'lastName'}
								<input
									type="text"
									id={field.id}
									class="w-full rounded-md border p-2"
									placeholder={field.fieldType === 'firstName' ? 'First name' : 'Last name'}
									required={field.required}
									bind:value={formResponses[field.id]}
								/>
							{:else if field.fieldType === 'phone'}
								<div class="relative">
									<span class="absolute left-3 top-2">+63</span>
									<input
										type="tel"
										id={field.id}
										class="w-full rounded-md border p-2 pl-12"
										maxlength="10"
										placeholder="9XX XXX XXXX"
										required={field.required}
										bind:value={formResponses[field.id]}
									/>
								</div>
							{:else if field.fieldType === 'number'}
								<div class="relative">
									<span class="absolute left-3 top-2">₱</span>
									<input
										type="number"
										id={field.id}
										class="w-full rounded-md border p-2 pl-8"
										placeholder="0.00"
										step="0.01"
										required={field.required}
										bind:value={formResponses[field.id]}
									/>
								</div>
							{:else if field.fieldType === 'multipleChoice'}
								<div class="flex flex-wrap gap-4">
									{#each field.options || [] as option, i}
										<label class="inline-flex cursor-pointer items-center">
											<input
												type="radio"
												id={`${field.id}_${i}`}
												name={field.id}
												value={option}
												required={field.required}
												bind:group={formResponses[field.id]}
												class="mr-2 cursor-pointer"
											/>
											<span>{option}</span>
										</label>
									{/each}
								</div>
							{:else if field.fieldType === 'checkbox'}
								<div class="flex flex-wrap gap-4">
									{#each field.options || [] as option, i}
										<label class="inline-flex cursor-pointer items-center">
											<input
												type="checkbox"
												id={`${field.id}_${i}`}
												value={option}
												bind:group={formResponses[field.id]}
												class="mr-2 cursor-pointer"
											/>
											<span>{option}</span>
										</label>
									{/each}
								</div>
							{:else if field.fieldType === 'dropdown'}
								<select
									id={field.id}
									class="w-full rounded-md border p-2"
									required={field.required}
									bind:value={formResponses[field.id]}
								>
									{#each field.options || [] as option}
										<option value={option}>{option}</option>
									{/each}
								</select>
							{:else if field.fieldType === 'region'}
								<select
									id={field.id}
									class="w-full cursor-pointer rounded-md border p-2"
									required={field.required}
									bind:value={formResponses[field.id]}
									on:change={(e) => handleRegionChange(e, field.id)}
								>
									<option value="">Select Region</option>
									{#each regions as region}
										<option value={region.name}>{region.name}</option>
									{/each}
								</select>
							{:else if field.fieldType === 'city'}
								<select
									id={field.id}
									class="w-full cursor-pointer rounded-md border p-2"
									required={field.required}
									bind:value={formResponses[field.id]}
								>
									<option value="">Select City/Municipality</option>
									{#each field.options || [] as city}
										<option value={city}>{city}</option>
									{/each}
								</select>
							{:else if field.fieldType === 'shortText'}
								<input
									id={field.id}
									type="text"
									maxlength="50"
									class="w-full rounded-md border p-2"
									required={field.required}
									bind:value={formResponses[field.id]}
									placeholder={field.description}
								/>
							{:else if field.fieldType === 'longText'}
								<textarea
									id={field.id}
									class="w-full rounded-md border p-2"
									required={field.required}
									bind:value={formResponses[field.id]}
									placeholder={field.description}
									rows="4"
								></textarea>
							{:else if field.fieldType === 'time'}
								<input
									id={field.id}
									type="time"
									class="w-full rounded-md border p-2"
									required={field.required}
									bind:value={formResponses[field.id]}
								/>
							{:else}
								<input
									id={field.id}
									type={getInputType(field.fieldType)}
									class="w-full rounded-md border p-2"
									required={field.required}
									bind:value={formResponses[field.id]}
									placeholder={field.description}
								/>
							{/if}
						</div>
					{/each}

					<div class="mt-6 flex justify-end space-x-4">
						<button
							type="submit"
							class="w-full cursor-pointer rounded-md bg-[#0ca777] px-4 py-2 text-white hover:bg-[#36c294]"
						>
							Submit
						</button>
					</div>
				</form>
			{/if}
		</div>
	</div>
</div>

<style>
	:global(.dndzone) {
		min-height: 60px;
	}
</style>
