<script lang="ts">
	import { dndzone } from 'svelte-dnd-action';
	import Icon from '@iconify/svelte';
	import type { FormData, FormField, FieldType } from './types';
	import FormFieldComponent from './components/FormField.svelte';

	let isEditMode = false;
	let formResponses: Record<string, any> = {};
	let validationErrors: Record<string, string> = {};

	let formData: FormData = {
		title: 'test',
		description: 'Registration prompt text',
		fields: [
			{
				id: crypto.randomUUID(),
				name: 'name',
				fieldType: 'name',
				label: 'Name',
				required: true
			},
			{
				id: crypto.randomUUID(),
				name: 'email',
				fieldType: 'email',
				label: 'Email Address',
				required: true
			},
			{
				id: crypto.randomUUID(),
				name: 'phone',
				fieldType: 'phone',
				label: 'Contact Number',
				required: true
			}
		]
	};

	let fieldTypes: { fieldType: FieldType; label: string; icon: string }[] = [
		{ fieldType: 'shortText', label: 'Short Text', icon: 'material-symbols:short-text' },
		{ fieldType: 'longText', label: 'Long Text', icon: 'material-symbols:text-fields' },
		{ fieldType: 'email', label: 'Email', icon: 'material-symbols:mail-outline' },
		{ fieldType: 'phone', label: 'Phone', icon: 'material-symbols:call' },
		{ fieldType: 'number', label: 'Number', icon: 'material-symbols:numbers' },
		{ fieldType: 'date', label: 'Date', icon: 'material-symbols:calendar-month' },
		{
			fieldType: 'multipleChoice',
			label: 'Multiple Choice',
			icon: 'material-symbols:radio-button-checked'
		},
		{ fieldType: 'checkbox', label: 'Checkbox', icon: 'material-symbols:check-box' },
		{ fieldType: 'dropdown', label: 'Dropdown', icon: 'material-symbols:arrow-drop-down-circle' },
		{ fieldType: 'file', label: 'File Upload', icon: 'material-symbols:upload-file' },
		{ fieldType: 'name', label: 'Name', icon: 'material-symbols:person' },
		{ fieldType: 'time', label: 'Time', icon: 'material-symbols:schedule' },
		{ fieldType: 'region', label: 'Region & City', icon: 'material-symbols:location-on' }
	];

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

	let dragging = false;
	$: dragDisabled = !dragging;

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
			formData.fields = [
				...formData.fields,
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
			formData.fields = [...formData.fields, newField];
		}
	}

	function handleDnd(e: CustomEvent<{ items: FormField[] }>) {
		formData.fields = e.detail.items;
		if (e.type === 'finalize') {
			dragging = false;
		}
	}

	function deleteField(id: string) {
		formData.fields = formData.fields.filter((field) => field.id !== id);
	}

	function updateField(updatedField: FormField) {
		formData.fields = formData.fields.map((field) =>
			field.id === updatedField.id ? updatedField : field
		);
	}

	function toggleEditMode() {
		isEditMode = !isEditMode;
	}

	function handleSaveChanges() {
		// Here you would typically save the form changes to your backend
		isEditMode = false;
	}

	function handleCancel() {
		// Here you might want to reset any unsaved changes
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
				if (value && !/^[0-9]{10}$/.test(value.replace(/[^0-9]/g, ''))) {
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

		formData.fields.forEach((field) => {
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

			// Handle successful submission
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
			formData.fields = formData.fields.map((f) => {
				if (f.fieldType === 'city') {
					return {
						...f,
						options: cities[region.code]?.map((city) => city.name) || []
					};
				}
				return f;
			});

			console.log('Updated form fields:', formData.fields);
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

<div>
	<h1 class="text-2xl font-bold">Registration Form</h1>
	<div class="text-sm text-gray-500">
		<p>(Customize what data you need to collect from your attendees here.)</p>
	</div>
	<button class="mt-6 rounded-lg bg-[#d32f2f] px-6 py-2 text-white">Create Pre-filled Form</button>
</div>
<div class="mx-auto mt-10 max-w-4xl p-4">
	<div class="rounded-lg bg-[#f6f7fa] p-6 {isEditMode ? 'pt-1' : ''} shadow-lg">
		<div class="relative mb-8">
			{#if !isEditMode}
				<h1 class="text-2xl font-bold">{formData.title}</h1>
				<div class="mt-1 text-sm text-gray-500">
					{formData.description}
				</div>
				<button
					class="absolute top-0 right-0 flex items-center gap-2 rounded-lg border border-[#d32f2f] px-4 py-2 text-[#d32f2f]"
					on:click={toggleEditMode}
				>
					<span>Edit Form</span>
					<Icon icon="material-symbols:edit" />
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
					items: formData.fields,
					flipDurationMs: 200,
					dragDisabled
				}}
				on:consider={handleDnd}
				on:finalize={handleDnd}
				class="mb-6 space-y-4"
			>
				{#each formData.fields as field (field.id)}
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
							<Icon {icon} class="mb-2 text-2xl" />
							<span class="text-sm">{label}</span>
						</button>
					{/each}
				</div>
			</div>
		{:else}
			<!-- Preview Mode -->
			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				{#each formData.fields as field (field.id)}
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

						{#if field.fieldType === 'name'}
							<div class="grid grid-cols-2 gap-4">
								<input
									type="text"
									id={`${field.id}_first`}
									class="w-full rounded-md border p-2"
									placeholder="First name"
									required={field.required}
									bind:value={formResponses[`${field.id}_first`]}
								/>
								<input
									type="text"
									id={`${field.id}_last`}
									class="w-full rounded-md border p-2"
									placeholder="Last name"
									required={field.required}
									bind:value={formResponses[`${field.id}_last`]}
								/>
							</div>
						{:else if field.fieldType === 'phone'}
							<div class="relative">
								<span class="absolute top-2 left-3">+63</span>
								<input
									type="tel"
									id={field.id}
									class="w-full rounded-md border p-2 pl-12"
									pattern="[0-9]{10}"
									placeholder="9XX XXX XXXX"
									required={field.required}
									bind:value={formResponses[field.id]}
								/>
							</div>
						{:else if field.fieldType === 'number'}
							<div class="relative">
								<span class="absolute top-2 left-3">₱</span>
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

<style>
	:global(.dndzone) {
		min-height: 60px;
	}
</style>
