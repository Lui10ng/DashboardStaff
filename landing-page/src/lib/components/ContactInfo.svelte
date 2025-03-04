<script>
	export let icon;
	export let title;
	export let description;
	export let info;
</script>

<div>
	<span class="inline-block rounded-full bg-gray-100/80 p-3 text-gray-500">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="h-5 w-5"
		>
			{@html icon}
		</svg>
	</span>

	<h2 class="mt-4 text-xl font-medium text-gray-800">{title}</h2>
	<p class="mt-2 text-base text-gray-500">{description}</p>
	<p class="mt-2 text-base text-[#D1302C]">{@html info}</p>
</div>
