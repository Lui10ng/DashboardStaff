<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { fly } from 'svelte/transition';
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
				<label for="" class="space-y-1">
					<h1>Heading</h1>
					<input
						class="w-full rounded-md border border-gray-500 p-2 outline-none focus:outline-none"
						type="text"
						name="heading"
						placeholder="Add heading"
					/>
				</label>
				<div class="flex justify-center">
					<Button
						type="submit"
						onClick={() => {}}
						label="Save"
						className="bg-primary text-white py-2 px-5 rounded-md w-40"
					/>
				</div>
			</form>
		{/snippet}
	</Modal>
</div>
