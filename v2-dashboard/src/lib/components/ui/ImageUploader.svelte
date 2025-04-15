<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';
	

	const { id } = $props<{id: string}>();

	let fileInput: HTMLInputElement;
	let selectedImageUrl = $state<string | null>(null);
	let uploadedImages = $state<string[]>([]);
	let isModalOpen = $state(false);
	let isLoading = $state(false);
	let isPreviewModalOpen = $state(false);
	let selectedDisplayImageUrl = $state<string | null>(null);

	async function selectImage() {
		isLoading = true;
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			if (selectedImageUrl) {
				selectedDisplayImageUrl = selectedImageUrl;
			}
		} finally {
			isLoading = false;
			isPreviewModalOpen = false;
			isModalOpen = false;
		}
	}

	function showImagePreview(imageUrl: string) {
		selectedImageUrl = imageUrl;
		isPreviewModalOpen = true;
	}

	async function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const files = input.files;

		if (files && files.length > 0) {
			isLoading = true;
			const file = files[0];
			const reader = new FileReader();

			try {
				await new Promise((resolve, reject) => {
					reader.onload = (e) => {
						if (e.target && e.target.result) {
							uploadedImages = [...uploadedImages, e.target.result as string];
							resolve(null);
						}
					};
					reader.onerror = reject;
					reader.readAsDataURL(file);
				});
				await new Promise((resolve) => setTimeout(resolve, 1000));
			} catch (error) {
				console.error('Error uploading file:', error);
			} finally {
				isLoading = false;
			}
		}

		if (fileInput) {
			fileInput.value = '';
		}
	}

	function removeImageFromList(index: number) {
		uploadedImages = uploadedImages.filter((_, i) => i !== index);
		if (selectedImageUrl && uploadedImages.includes(selectedImageUrl)) {
			// Keep selectedImageUrl if it's still in the list
		} else {
			selectedImageUrl = null; // Reset preview if deleted
		}
		if (selectedDisplayImageUrl === selectedImageUrl) {
			selectedDisplayImageUrl = null;
		} else if (selectedDisplayImageUrl && !uploadedImages.includes(selectedDisplayImageUrl)) {
			selectedDisplayImageUrl = null;
		}
	}
</script>

<div>
	<Modal bind:open={isModalOpen}>
		{#snippet button()}
			<div>
				<p class="flex text-start text-md">Image</p>
				<div
					class="relative block flex h-50 w-110 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#F7F8FA] p-12 text-center hover:bg-[#e9ecf3]"
					on:click={() => (isModalOpen = true)}
				>
					{#if selectedDisplayImageUrl}
						<img
							src={selectedDisplayImageUrl}
							alt="Selected"
							class="absolute inset-0 h-full w-full object-cover"
						/>
						<button
							type="button"
							on:click|stopPropagation={(e) => {
								e.preventDefault();
								selectedDisplayImageUrl = null;
							}}
							class="absolute top-2 right-2 z-10 rounded-full bg-red-500 p-1.5 text-white shadow-sm transition-colors hover:bg-red-600"
						>
							<i class="fa-solid fa-times" />
						</button>
						<div
							class="absolute inset-0 bg-black/40 opacity-0 transition-opacity hover:opacity-100"
							on:click|stopPropagation={() => (isModalOpen = true)}
						>
							<p class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-white">
								Change image
							</p>
						</div>
					{:else}
						<p class="text-sm text-gray-500">Select image</p>
					{/if}
				</div>
			</div>
		 {/snippet}

		{#snippet content()}
			{#if isLoading}
				<div class="flex flex-col items-center justify-center py-8">
					<div class="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
					<p class="mt-2 text-sm text-gray-500">Uploading image...</p>
				</div>
			{:else if uploadedImages.length > 0}
				<ul class="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
					{#each uploadedImages as imageUrl, index}
						<li class="relative">
							<img
								src={imageUrl}
								alt={`Uploaded image ${index + 1}`}
								class="h-32 w-full rounded-md object-cover shadow-md cursor-pointer"
								on:click={() => showImagePreview(imageUrl)}
							/>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="mb-4 text-gray-500">No images uploaded yet.</p>
			{/if}

			<div>
				<label
					class="block flex max-h-96 cursor-pointer items-center justify-center rounded-lg bg-[#F7F8FA] p-12 text-center hover:bg-[#e9ecf3]"
					for="imageUpload-{id}"
				>
					<p class="text-sm text-gray-500">Select image</p>
				</label>
				<input
					bind:this={fileInput}
					id="imageUpload-{id}"
					type="file"
					accept="image/*"
					class="hidden"
					on:change={handleFileUpload}
				/>
			</div>
		{/snippet}
	</Modal>

	<Modal bind:open={isPreviewModalOpen}>
		{#snippet button()}
			<div class="hidden">Preview</div>
		 {/snippet}

		 {#snippet header()}
			<div class="flex items-center justify-between">
				<h1 class="text-xl font-semibold">Image Preview</h1>
				<button class="text-gray-500 hover:text-gray-700" on:click={() => (isPreviewModalOpen = false)}>
					<i class="fa-solid fa-times" />
				</button>
			</div>
		{/snippet}

		 {#snippet content()}
			{#if selectedImageUrl}
				<div class="flex flex-col space-y-4">
					<div class="relative h-[60vh] w-full">
						{#if isLoading}
							<div class="absolute inset-0 flex items-center justify-center bg-white/50">
								<div class="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
							</div>
						{/if}
						<img
							src={selectedImageUrl}
							alt="Preview"
							class="h-full w-full rounded-lg object-contain"
						/>
					</div>
					<div class="flex justify-end space-x-3">
						<button
							class="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
							on:click={selectImage}
							disabled={isLoading}
						>
							{#if isLoading}
								<div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
							{:else}
								<i class="fa-solid fa-check" />
							{/if}
							Select Image
						</button>
						<button
							class="flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
							on:click={() => {
								if (selectedImageUrl) {
									removeImageFromList(uploadedImages.indexOf(selectedImageUrl));
								}
								isPreviewModalOpen = false;
							}}
							disabled={isLoading}
						>
							<i class="fa-solid fa-trash" />
							Delete
						</button>
					</div>
				</div>
			{/if}
		{/snippet}
	</Modal>
</div>