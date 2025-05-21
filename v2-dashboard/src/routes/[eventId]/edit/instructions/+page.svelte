<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Drawer from '$lib/components/ui/Drawer.svelte';
	import RichText from '$lib/components/ui/RichText.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { instructionDrawer } from '$lib/stores/state.svelte';
	import { instructionState } from '$lib/stores/state.svelte.ts';
	import { toaster } from '$lib/utils/toaster-svelte.ts';

	let { data } = $props();
	let selectedImage: string | null = $state(null);
	let fileInput: string | HTMLInputElement = $state('');
	const instructionDrawerState = $derived(instructionDrawer.open);
	const instructionsStore = instructionState();

	const { form, errors, enhance, delayed, message } = superForm(data.form);

	message.subscribe(async (msg) => {
		if (msg && msg.success) {
			handleCloseDrawer();
			toaster.create({
				type: 'success',
				title: 'Success',
				description: msg.message
			});
		}
	});

	$effect(() => {
		if (data.instructions.docs.length > 0) {
			instructionsStore.instructionData = data.instructions.docs[0].eventInstructions;
		}
	});

	let instructions = $derived(instructionsStore.instructionData || []);

	function removeSelectedImage() {
		selectedImage = null;
		if (fileInput) (fileInput as HTMLInputElement).value = '';
	}

	function handleFileUpload(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			selectedImage = URL.createObjectURL(file);
		}
	}

	const handleCloseDrawer = () => {
		instructionDrawer.open = false;
	};

	const handleOpenDrawer = () => {
		instructionDrawer.open = true;
	};
</script>

<div class="space-y-6">
	<div>
		<h2 class="mb-2 text-xl font-semibold text-gray-900">Registration Instructions</h2>
		<p class="text-sm text-gray-500">Add Specific Instructions for your registrants.</p>
	</div>
	<Button
		onClick={() => {
			handleOpenDrawer();
		}}
		label="Add Instruction"
		icon="fa-solid fa-plus text-sm"
		className="bg-primary rounded-md px-5 py-2 text-white"
	/>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
		{#if instructions && instructions.length > 0}
			{#each instructions as instruction}
				<div class="rounded-md border p-5">
					<h3 class="text-lg font-semibold">{instruction.title}</h3>
					<div class="text-gray-500">{@html instruction.content}</div>
				</div>
			{/each}
		{/if}
	</div>

	<Drawer
		isOpen={instructionDrawerState}
		contentBaseClass="bg-white p-10 space-y-4 shadow-xl w-full h-[90svh] overflow-y-auto"
		justify="justify-end"
		alignment="items-end"
		positionIn={{ y: 600, duration: 200 }}
		positionOut={{ y: 600, duration: 200 }}
	>
		<form
			class="mt-6"
			action={data.instructions.docs.length > 0 ? '?/updateInstruction' : '?/createInstruction'}
			method="POST"
			enctype="multipart/form-data"
			use:enhance
		>
			<div>
				<div class="flex flex-col gap-8 lg:flex-row">
					<div class="w-full space-y-6 lg:w-2/5">
						<div>
							<h3 class="mb-1 text-sm font-medium">Heading</h3>
							<input
								name="title"
								type="text"
								bind:value={$form.title}
								placeholder="Add heading"
								class="mt-1 w-full rounded-lg border border-gray-200 p-2 px-3 py-3 text-sm placeholder:text-gray-500"
							/>
							{#if $errors.title}
								<p class="text-primary text-sm">{$errors.title}</p>
							{/if}
						</div>
						<div>
							<h3 class="mb-2 text-sm font-medium">Image</h3>
							<label
								class="h-50 relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-4 border-dashed border-gray-200 p-12 text-center hover:border-gray-400"
								for="imageUpload"
							>
								{#if selectedImage}
									<img
										src={selectedImage}
										alt="Registration instruction preview"
										class="absolute inset-0 h-full w-full object-cover"
									/>
									<button
										aria-label="Remove image"
										onclick={removeSelectedImage}
										class="absolute right-2 top-2 z-10 h-6 w-6 rounded-full bg-gray-400 text-white shadow-sm hover:bg-gray-600"
									>
										<i class="fa-solid fa-xmark"></i>
									</button>
								{:else}
									<p class="z-10 text-sm text-gray-500">Select image</p>
								{/if}
								<input
									name="Registration Instruction IMG"
									id="imageUpload"
									type="file"
									accept="image/*"
									class="hidden"
									onchange={handleFileUpload}
								/>
							</label>
						</div>
					</div>
					<div class="mb-30 h-80 w-full lg:w-3/5">
						<label for="event-description" class="mb-2 block text-sm font-medium text-gray-700"
							>Event description</label
						>
						<RichText name="content" />

						{#if $errors.content}
							<p class="prose text-primary mt-2 text-sm">
								{$errors.content}
							</p>
						{/if}
					</div>
				</div>
			</div>
			<!-- Footer (Responsive Buttons) -->
			<div class="flex flex-col justify-end space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
				<button
					onclick={() => handleCloseDrawer()}
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
	</Drawer>
</div>
