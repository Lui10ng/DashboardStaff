<script lang="ts">
	import { dndzone } from 'svelte-dnd-action';
	import Icon from '@iconify/svelte';
	import type { FormData, FormFieldTypes, FieldType } from '../types';
	import FormField from './FormField.svelte';

	let isPreviewMode = false;
	let formResponses: Record<string, any> = {};

	let formData: FormData = {
		title: 'Form Title',
		description: 'Form Description',
		fields: [
			{
				id: crypto.randomUUID(),
				type: 'name',
				label: 'Name',
				required: true
			},
			{
				id: crypto.randomUUID(),
				type: 'email',
				label: 'Email Address',
				required: true
			},
			{
				id: crypto.randomUUID(),
				type: 'phone',
				label: 'Contact Number',
				required: true
			}
		]
	};

	let fieldTypes: { type: FieldType; label: string; icon: string }[] = [
		{ type: 'shortText', label: 'Short Text', icon: 'material-symbols:short-text' },
		{ type: 'longText', label: 'Long Text', icon: 'material-symbols:text-fields' },
		{ type: 'email', label: 'Email', icon: 'material-symbols:mail-outline' },
		{ type: 'phone', label: 'Phone', icon: 'material-symbols:call' },
		{ type: 'number', label: 'Number', icon: 'material-symbols:numbers' },
		{ type: 'date', label: 'Date', icon: 'material-symbols:calendar-month' },
		{
			type: 'multipleChoice',
			label: 'Multiple Choice',
			icon: 'material-symbols:radio-button-checked'
		},
		{ type: 'checkbox', label: 'Checkbox', icon: 'material-symbols:check-box' },
		{ type: 'dropdown', label: 'Dropdown', icon: 'material-symbols:arrow-drop-down-circle' },
		{ type: 'file', label: 'File Upload', icon: 'material-symbols:upload-file' },
		{ type: 'name', label: 'Name', icon: 'material-symbols:person' },

		{ type: 'time', label: 'Time', icon: 'material-symbols:schedule' },
		{ type: 'region', label: 'Region & City', icon: 'material-symbols:location-on' }
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

	function addField(type: FieldType) {
		if (type === 'region') {
			formData.fields = [
				...formData.fields,
				{
					id: crypto.randomUUID(),
					type: 'region',
					label: 'Region',
					required: true,
					options: regions.map((region) => region.name)
				},
				{
					id: crypto.randomUUID(),
					type: 'city',
					label: 'City/Municipality',
					required: true,
					options: []
				},
				{
					id: crypto.randomUUID(),
					type: 'shortText',
					label: 'Street/Barangay',
					required: true
				}
			];

			fieldTypes = fieldTypes.filter((ft) => ft.type !== 'region');
		} else {
			const newField: FormFieldTypes = {
				id: crypto.randomUUID(),
				type,
				label: `New ${type} field`,
				required: false,
				options:
					type === 'multipleChoice' || type === 'checkbox' || type === 'dropdown'
						? ['Option 1']
						: undefined
			};
			formData.fields = [...formData.fields, newField];
		}
	}

	function handleDnd(e: CustomEvent<{ items: FormFieldTypes[] }>) {
		formData.fields = e.detail.items;
		if (e.type === 'finalize') {
			dragging = false;
		}
	}

	function deleteField(id: string) {
		formData.fields = formData.fields.filter((field) => field.id !== id);
	}

	function updateField(updatedField: FormFieldTypes) {
		formData.fields = formData.fields.map((field) =>
			field.id === updatedField.id ? updatedField : field
		);
	}

	function togglePreview() {
		isPreviewMode = !isPreviewMode;
		if (isPreviewMode) {
			formResponses = {};
		}
	}

	function handleSubmit() {
		console.log('Form responses:', formResponses);
		alert('submitted');
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
				if (f.type === 'city') {
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
</script>

<div class="mx-auto mt-20 max-w-4xl p-4">
	<div class="rounded-lg bg-[#f6f7fa] p-6 shadow-lg">
		{#if !isPreviewMode}
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
					<FormField
						{field}
						on:delete={() => deleteField(field.id)}
						on:update={(e) => updateField(e.detail)}
						on:startdrag={() => dragging = true}
						on:stopdrag={() => dragging = false}
					/>
				{/each}
			</div>

			<div class="mt-6">
				<h3 class="mb-4 text-lg font-semibold">Add Field</h3>
				<div class="grid grid-cols-3 gap-4 md:grid-cols-4">
					{#each fieldTypes as { type, label, icon }}
						<button
							class="flex cursor-pointer flex-col items-center rounded-lg border p-4 transition-colors hover:bg-gray-50"
							on:click={() => addField(type)}
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
				<h1 class="mb-2 text-3xl font-bold">{formData.title}</h1>
				<p class="mb-6 text-gray-600">{formData.description}</p>

				{#each formData.fields as field (field.id)}
					<div class="space-y-2">
						<label for={field.id} class="block text-sm font-medium text-gray-700">
							{field.label}
							{#if field.required}
								<span class="text-red-500">*</span>
							{/if}
						</label>

						{#if field.type === 'name'}
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
						{:else if field.type === 'phone'}
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
						{:else if field.type === 'price'}
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
						{:else if field.type === 'multipleChoice'}
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
						{:else if field.type === 'checkbox'}
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
						{:else if field.type === 'dropdown'}
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
						{:else if field.type === 'region'}
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
						{:else if field.type === 'city'}
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
						{:else if field.type === 'shortText'}
							<input
								id={field.id}
								type="text"
								maxlength="50"
								class="w-full rounded-md border p-2"
								required={field.required}
								bind:value={formResponses[field.id]}
								placeholder={field.description}
							/>
						{:else if field.type === 'longText'}
							<textarea
								id={field.id}
								class="w-full rounded-md border p-2"
								required={field.required}
								bind:value={formResponses[field.id]}
								placeholder={field.description}
								rows="4"
							></textarea>
						{:else if field.type === 'time'}
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
								type={field.type === 'email'
									? 'email'
									: field.type === 'number'
										? 'number'
										: field.type === 'date'
											? 'date'
											: field.type === 'file'
												? 'file'
												: 'text'}
								class="w-full rounded-md border p-2"
								required={field.required}
								bind:value={formResponses[field.id]}
								placeholder={field.description}
							/>
						{/if}
					</div>
				{/each}

				<div class="mt-6 flex justify-end space-x-4 bg-gray-500">
					<button
						type="submit"
						class="w-full cursor-pointer rounded-md bg-[#0ca777] px-4 py-2 text-white hover:bg-[#36c294]"
					>
						Submit
					</button>
				</div>
			</form>
		{/if}

		<!-- Toggle Button -->
		<div class="mt-6 flex justify-end">
			<button
				class="w-full cursor-pointer rounded-md bg-[#6c727f] px-4 py-2 text-white hover:bg-[#a62421]"
				on:click={togglePreview}
			>
				{isPreviewMode ? 'Back to Editor' : 'Preview Form'}
			</button>
		</div>
	</div>
</div>

<style>
	:global(.dndzone) {
		min-height: 60px;
	}
</style>
