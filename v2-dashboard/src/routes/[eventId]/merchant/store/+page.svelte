<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
</script>

<div>
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-xl font-semibold">Store</h2>
		<div class="flex gap-2">
			<Button
				onClick={() => {}}
				label="Add Product"
				icon="fa-solid fa-plus text-sm"
				className="bg-gray-200 px-4 py-2 rounded-md"
			/>
		</div>
	</div>

	<div class="rounded-lg border border-gray-200 bg-white p-6">
		<div class="flex flex-col items-center justify-center py-10">
			<i class="fa-solid fa-store mb-4 text-6xl text-gray-300"></i>
			<h3 class="mb-2 text-xl font-medium text-gray-700">No Products</h3>
			<p class="mb-6 max-w-md text-center text-gray-500">
				You haven't added any products to your store yet. Add some products to start selling!
			</p>
			<button class="flex items-center rounded-md bg-primary px-4 py-2 text-white hover:bg-red-500">
				<i class="fa-solid fa-plus mr-2"></i>
				Add First Product
			</button>
		</div>
	</div>
</div>
