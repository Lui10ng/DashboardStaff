<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { FormField } from '../types';

	export let field: FormField;

	const dispatch = createEventDispatcher();

	function updateField(updates: Partial<FormField>) {
		dispatch('update', { ...field, ...updates });
	}

	function addOption() {
		if (field.options) {
			updateField({
				options: [...field.options, `Option ${field.options.length + 1}`]
			});
		}
	}

	function updateOption(index: number, value: string) {
		if (field.options) {
			const newOptions = [...field.options];
			newOptions[index] = value;
			updateField({ options: newOptions });
		}
	}

	function deleteOption(index: number) {
		if (field.options && field.options.length > 1) {
			updateField({
				options: field.options.filter((_, i) => i !== index)
			});
		}
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
				<i class="fas {field.required ? 'fa-exclamation-circle text-red-500' : 'fa-exclamation-circle text-gray-400'}"></i>
			</button>
			<button
				class="cursor-pointer p-2 text-gray-500 hover:text-red-500"
				on:click={() => dispatch('delete')}
			>
				<i class="fas fa-trash-alt"></i>
			</button>
			<div
				class="cursor-grab p-2 text-gray-400 hover:text-gray-600"
				on:mousedown={() => dispatch('startdrag')}
				on:mouseup={() => dispatch('stopdrag')}
				on:mouseleave={() => dispatch('stopdrag')}
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
					<i class="fas {field.fieldType === 'multipleChoice' ? 'fa-circle' : field.fieldType === 'checkbox' ? 'fa-square' : 'fa-chevron-down'} text-gray-400"></i>
					<input
						class="flex-1 rounded-md border p-2"
						value={option}
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
	{:else}
		<div class="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
			<div class="text-gray-500">
				{#if field.fieldType === 'shortText'}
					<input
						type="text"
						class="w-full rounded-md p-2"
						placeholder="Short answer text"
						disabled
					/>
				{:else if field.fieldType === 'longText'}
					<textarea class="w-full rounded-md p-2" placeholder="Long answer text" disabled></textarea>
				{:else if field.fieldType === 'email'}
					<input type="email" class="w-full rounded-md p-2" placeholder="Email" disabled />
				{:else if field.fieldType === 'phone'}
					<input type="tel" class="w-full rounded-md p-2" placeholder="Phone number" disabled />
				{:else if field.fieldType === 'number'}
					<input type="number" class="w-full rounded-md p-2" placeholder="Number" disabled />
				{:else if field.fieldType === 'date'}
					<input type="date" class="w-full rounded-md p-2" disabled />
				{:else if field.fieldType === 'file'}
					<input type="file" class="w-full rounded-md p-2" disabled />
				{:else if field.fieldType === 'firstName' || field.fieldType === 'lastName'}
					<div class="grid grid-cols-2 gap-4">
						<input
							type="text"
							class="rounded-md border-2 border-gray-200 p-2"
							placeholder={field.fieldType === 'firstName' ? 'First name' : 'Last name'}
							disabled
						/>
					</div>
				{:else if field.fieldType === 'region'}
					<select class="w-full rounded-md p-2" disabled>
						<option>Select Region</option>
					</select>
				{:else if field.fieldType === 'city'}
					<select class="w-full rounded-md p-2" disabled>
						<option>Select City/Municipality</option>
					</select>
				{/if}
			</div>
		</div>
	{/if}
</div>

<slot></slot>
