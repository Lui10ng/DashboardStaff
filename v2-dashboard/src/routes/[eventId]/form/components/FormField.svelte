<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { FormField } from '../types';

	export let field: FormField;

	const dispatch = createEventDispatcher<{
		update: FormField;
		delete: { id: string };
		startdrag: void;
		stopdrag: void;
	}>();

	function updateField(updates: Partial<FormField>) {
		const updatedField = { ...field, ...updates };
		console.log('Updating field:', updatedField);
		dispatch('update', updatedField);
	}

	function addOption() {
		if (field.options) {
			const newOptions = [...field.options, { value: `Option ${field.options.length + 1}` }];
			updateField({ options: newOptions });
		}
	}

	function updateOption(index: number, value: string) {
		if (field.options) {
			const newOptions = [...field.options];
			newOptions[index] = { value };
			updateField({ options: newOptions });
		}
	}

	function deleteOption(index: number) {
		if (field.options && field.options.length > 1) {
			const newOptions = field.options.filter((_, i) => i !== index);
			updateField({ options: newOptions });
		}
	}

	function handleDelete() {
		dispatch('delete', { id: field.id });
	}

	function startDrag() {
		dispatch('startdrag');
	}

	function stopDrag() {
		dispatch('stopdrag');
	}
</script>

<div class="rounded-lg border-2 border-gray-200 bg-white p-6">
	<div class="mb-4 flex items-start justify-between">
		<div class="flex-1">
			<input
				class="w-full border-b-2 border-transparent p-2 text-xl font-semibold focus:border-blue-500 focus:outline-none"
				bind:value={field.label}
				placeholder="Question"
				on:input={() => updateField({ label: field.label })}
			/>
			<input
				class="w-full border-b-2 border-transparent p-2 text-gray-600 focus:border-blue-500 focus:outline-none"
				bind:value={field.description}
				placeholder="Description (optional)"
				on:input={() => updateField({ description: field.description })}
			/>
		</div>
		<div class="flex space-x-2">
			<button
				class="group relative cursor-pointer p-2 text-gray-500 hover:text-gray-700"
				on:click={() => updateField({ required: !field.required })}
				title={field.required ? 'Required field' : 'Optional field'}
			>
				<i
					class="fas {field.required
						? 'fa-exclamation-circle text-red-500'
						: 'fa-exclamation-circle text-gray-400'}"
				></i>
			</button>
			<button class="cursor-pointer p-2 text-gray-500 hover:text-red-500" on:click={handleDelete}>
				<i class="fas fa-trash-alt"></i>
			</button>
			<div
				class="cursor-grab p-2 text-gray-400 hover:text-gray-600"
				on:mousedown={startDrag}
				on:mouseup={stopDrag}
				on:mouseleave={stopDrag}
				data-dnd-handle
			>
				<i class="fas fa-grip-vertical"></i>
			</div>
		</div>
	</div>

	{#if field.fieldType === 'multipleChoice' || field.fieldType === 'checkbox' || field.fieldType === 'dropdown'}
		<div class="space-y-2">
			{#each field.options || [] as option, i}
				<div class="flex items-center space-x-2">
					<i
						class="fas {field.fieldType === 'multipleChoice'
							? 'fa-circle'
							: field.fieldType === 'checkbox'
								? 'fa-square'
								: 'fa-chevron-down'} text-gray-400"
					></i>
					<input
						class="flex-1 rounded-md border p-2"
						value={option.value}
						on:input={(e) => updateOption(i, e.currentTarget.value)}
					/>
					<button
						class="p-2 text-gray-500 hover:text-red-500"
						on:click={() => deleteOption(i)}
						disabled={field.options?.length === 1}
					>
						<i class="fas fa-trash-alt"></i>
					</button>
				</div>
			{/each}
			<button
				class="flex cursor-pointer items-center space-x-2 text-blue-500 hover:text-blue-600"
				on:click={addOption}
			>
				<i class="fas fa-plus-circle"></i>
				<span>Add Option</span>
			</button>
		</div>
	{/if}

	<div class="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
		<div class="text-gray-500">
			{#if field.fieldType === 'longText'}
				<textarea class="w-full rounded-md p-2" placeholder="Long answer text" disabled></textarea>
			{:else if field.fieldType === 'multipleChoice'}
				<div class="space-y-2">
					{#each field.options || [] as option}
						<div class="flex items-center gap-2">
							<input type="radio" disabled />
							<span>{option.value}</span>
						</div>
					{/each}
				</div>
			{:else if field.fieldType === 'checkbox'}
				<div class="space-y-2">
					{#each field.options || [] as option}
						<div class="flex items-center gap-2">
							<input type="checkbox" disabled />
							<span>{option.value}</span>
						</div>
					{/each}
				</div>
			{:else if field.fieldType === 'dropdown'}
				<select class="w-full rounded-md p-2" disabled>
					{#each field.options || [] as option}
						<option>{option.value}</option>
					{/each}
				</select>
			{:else if field.fieldType === 'region'}
				<select class="w-full rounded-md p-2" disabled>
					<option>Select Region</option>
				</select>
			{:else if field.fieldType === 'city'}
				<select class="w-full rounded-md p-2" disabled>
					<option>Select City/Municipality</option>
				</select>
			{:else}
				<input
					type={field.fieldType === 'email'
						? 'email'
						: field.fieldType === 'phone'
							? 'tel'
							: field.fieldType === 'number'
								? 'number'
								: field.fieldType === 'date'
									? 'date'
									: field.fieldType === 'time'
										? 'time'
										: field.fieldType === 'file'
											? 'file'
											: 'text'}
					class="w-full rounded-md p-2"
					placeholder={field.label}
					disabled
				/>
			{/if}
		</div>
	</div>
</div>

<slot></slot>
