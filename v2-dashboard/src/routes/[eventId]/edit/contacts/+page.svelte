<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	const { form, errors, enhance, delayed, message } = superForm(data.form);

	let eventContacts = $derived(data.contacts);

	let imagePreview: string | null = $state(null);
	let imageFile: File | null = $state(null);

	function removeImage(event: Event) {
		event.stopPropagation();
		imagePreview = null;
		imageFile = null;
	}

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

	const handleContactSubmit = async () => {
		const formData = new FormData();

		const contactData = [...eventContacts, $form];

		formData.append('formData', JSON.stringify({ eventContacts: contactData }));

		const response = await fetch('?/updateContacts', {
			method: 'POST',
			body: formData
		});

		if (response.ok && response.status === 200) {
			console.log('Contact form submitted successfully');
		}
	};
</script>

<form onsubmit={handleContactSubmit}>
	<div class="mb-6">
		<h2 class="mb-2 text-xl font-semibold text-gray-900">Basic Information</h2>
		<p class="text-sm text-gray-500">
			Edit your contact details below. Changes update automatically on your website.
		</p>
	</div>
	<hr class="mb-6 border-t border-gray-300" />
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		<div class="relative flex flex-col md:col-span-1 lg:col-span-1">
			<p class="mb-2 text-sm text-black">Image (Optional)</p>
			<label
				class="relative flex h-40 w-full cursor-pointer items-center justify-center rounded-lg border-4 border-dashed border-gray-200 text-gray-500 hover:border-gray-400"
			>
				{#if imagePreview}
					<div class="relative h-full w-full">
						<img src={imagePreview} class="h-full w-full rounded-lg object-cover" alt="preview" />
						<button
							aria-label="Remove image"
							onclick={removeImage}
							class="absolute right-2 top-2 z-10 h-6 w-6 rounded-full bg-gray-400 pb-3 text-white shadow-sm hover:bg-gray-600"
						>
							<i class="fa-solid fa-xmark"></i>
						</button>
					</div>
				{:else}
					<span class="text-sm">Select image</span>
				{/if}
				<input type="file" accept="image/*" class="hidden" onchange={handleImageUpload} />
			</label>
		</div>
		<div class="space-y-5 text-sm md:col-span-1 lg:col-span-1">
			<label class="block"
				>Name
				<input
					type="text"
					placeholder="Enter name"
					name="contactName"
					bind:value={$form.contactName}
					class="mt-1 w-full rounded-md border border-gray-200 p-2 px-3 py-3"
				/>
				{#if $errors.contactName}
					<p class="text-primary text-sm">{$errors.contactName}</p>
				{/if}
			</label>

			<div>
				Email Address
				<div class="relative mt-1">
					<span class="absolute inset-y-0 left-3 flex items-center">
						<i class="fa-regular fa-envelope text-gray-500"></i>
					</span>
					<input
						name="contactEmail"
						bind:value={$form.contactEmail}
						type="tel"
						placeholder="Enter Email Address"
						class="w-full rounded-md border border-gray-200 p-2 px-3 py-3 pl-10"
					/>
					{#if $errors.contactEmail}
						<p class="text-primary text-sm">{$errors.contactEmail}</p>
					{/if}
				</div>
			</div>
			<div>
				Mobile Number
				<div class="relative mt-1">
					<span class="absolute inset-y-0 left-3 flex items-center">
						<i class="fa-solid fa-phone text-gray-500"></i>
					</span>
					<input
						name="contactPhone"
						bind:value={$form.contactPhone}
						type="tel"
						placeholder="Enter mobile number"
						class="w-full rounded-md border border-gray-200 p-2 px-3 py-3 pl-10"
					/>
				</div>
				{#if $errors.contactPhone}
					<p class="text-primary text-sm">{$errors.contactPhone}</p>
				{/if}
			</div>
		</div>
		<div class="mb-4 md:col-span-1 lg:col-span-1">
			<label class="block"
				>Role
				<input
					type="text"
					name="contactRole"
					bind:value={$form.contactRole}
					placeholder="Enter role"
					class="mt-1 w-full rounded-md border border-gray-200 p-2 px-3 py-3 pl-10"
				/>
				{#if $errors.contactRole}
					<p class="text-primary text-sm">{$errors.contactRole}</p>
				{/if}
			</label>
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
			class="w-full rounded-md bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-red-700 sm:w-auto sm:text-base"
		>
			Save changes
		</button>
	</div>
</form>
