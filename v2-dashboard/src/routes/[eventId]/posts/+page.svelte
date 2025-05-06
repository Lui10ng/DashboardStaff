<script lang="ts">
	import { enhance } from '$app/forms';
	import RichTextEditor from '$lib/components/ui/RichText.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { fly } from 'svelte/transition';
	import { Dialog } from 'bits-ui';
	import ImageUploader from '$lib/components/ui/ImageUploader.svelte';
	import { awsURL } from '$lib/stores/data.js';
	
	let { data } = $props();
	let posts = data.posts && data.posts.docs && data.posts.docs.length>0?data.posts.docs:[];
	
	console.log("posts",posts);
	// const currentImage = $state(null);

	// $effect(() => {
	// 	console.log('currentImage', currentImage);
	// });

	let isMoving = $state(false);
	let movingIndex = $state<number | null>(null);

	async function moveImage(currentIndex: number, direction: 'left' | 'right') {
		const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;

		// Check if the move is valid
		if (newIndex >= 0 && newIndex < posts.length) {
			isMoving = true;
			movingIndex = currentIndex;

			try {
				// await new Promise((resolve) => setTimeout(resolve, 500));
				// posts = [];
				const newImages = [...posts];
				[newImages[currentIndex], newImages[newIndex]] = [
					newImages[newIndex],
					newImages[currentIndex]
				];
				posts = [...newImages];
				console.log("posts",posts);
				const response = await fetch(`/${data.eventId}?/updateContacts`, {
					method: 'POST',
					body: formData
				});
			} finally {
				isMoving = false;
				movingIndex = null;
			}
		}
		
	}
</script>

<div class="space-y-5" in:fly={{ y: -50, duration: 200 }}>
	<div class="space-y-1">
		<h1 class="text-xl font-semibold">Posts</h1>
		<p class="text-sm text-gray-500">
			(Create and publish posts to be displayed at https://aero.veent.co)
		</p>
	</div>
	<Modal>
		{#snippet button()}
			<div class="bg-primary rounded-md px-5 py-2 text-white">
				<i class="fa-solid fa-plus"></i>
				Create Post
			</div>
		{/snippet}
		{#snippet header()}
			<div class="space-y-1">
				<h1 class="text-xl font-semibold">Create Post</h1>
				<p class="text-sm text-gray-500">Create and publish your Post here</p>
			</div>
		{/snippet}
		{#snippet content()}
			<form class="mt-4 flex flex-col space-y-5" action="?/createPost" method="POST" use:enhance>
				<ImageUploader />
				<label for="" class="space-y-1">
					<h1>Heading</h1>
					<input
						class="w-full rounded-md border border-gray-500 p-2 outline-none focus:outline-none"
						type="text"
						name="heading"
						placeholder="Add heading"
					/>
				</label>
				<RichTextEditor />
				<div class="mt-5 flex gap-4">
					<Dialog.Close class="w-full rounded-md border border-gray-400 bg-gray-300 py-2"
						>Cancel</Dialog.Close
					>
					<Button
						type="submit"
						onClick={() => {}}
						label="Save"
						className="bg-primary text-white py-2 rounded-md w-full"
					/>
				</div>
			</form>
		{/snippet}
	</Modal>
	{#if posts.length>0}
	<div class="mt-6 flex gap-2" in:fly={{ x: 0, duration: 200 }}>
		{#each posts as image, index (image.id)}
			<div
				class="relative h-80 w-80 overflow-hidden rounded-md border border-black"
				transition:fly={{ x: 0, duration: 200 }}
			>
				{#if posts.length-1>0}
					{#if index > 0 && index < posts.length - 1}
						<button
							class="absolute left-1 top-1 flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-white transition-colors hover:bg-red-300 disabled:opacity-50"
							onclick={() => moveImage(index, 'left')}
							disabled={isMoving}
						>
							{#if isMoving && movingIndex === index}
								<div
									class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
								/>
							{:else}
								<i class="fa-solid fa-arrow-left" />
							{/if}
						</button>
						<button
							class="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-white transition-colors hover:bg-red-300 disabled:opacity-50"
							onclick={() => moveImage(index, 'right')}
							disabled={isMoving}
						>
							{#if isMoving && movingIndex === index}
								<div
									class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
								/>
							{:else}
								<i class="fa-solid fa-arrow-right" />
							{/if}
						</button>
					{:else}
						<button
							class={`absolute top-1 ${index === posts.length - 1 ? 'left-1' : 'right-1'}
							flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-white transition-colors hover:bg-red-300 disabled:opacity-50`}
							onclick={() => moveImage(index, index === posts.length - 1 ? 'left' : 'right')}
							disabled={isMoving}
						>
							{#if isMoving && movingIndex === index}
								<div
									class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
								/>
							{:else}
								<i
									class={`fa-solid ${
										index === posts.length - 1 ? 'fa-arrow-left' : 'fa-arrow-right'
									}`}
								/>
							{/if}
						</button>
					{/if}
				{/if}
				<div class="flex h-full w-full items-center justify-center bg-gray-100">
					<img
						src={awsURL+image.url}
						alt={image.name || 'Image'}
						onerror={(e: Event) => {
							const target = e.target as HTMLImageElement;
							if (target && image.fallback) target.src = image.fallback;
						}}
						class="h-full w-full object-cover"
					/>
					<p class="text-sm text-gray-600">{image.name}</p>
				</div>
			</div>
		{/each}
	</div>
	{/if}
</div>
