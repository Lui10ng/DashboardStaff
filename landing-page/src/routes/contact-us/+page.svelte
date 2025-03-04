<script lang="ts">
	import ContactInfo from '$lib/components/ContactInfo.svelte';

	export let data;
</script>

<section class="bg-white py-24">
	<div class="container mx-auto px-8 py-12">
		<div>
			<h1 class="mt-2 text-2xl font-semibold text-gray-800 md:text-5xl">{data.headerInfo.title}</h1>
			<p class="mt-3 text-gray-500">{data.headerInfo.description}</p>
		</div>

		<div class="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
			<div class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-1">
				{#each data.contactDetails as { icon, title, description, info }}
					<ContactInfo {icon} {title} {description} {info} />
				{/each}
			</div>

			<div class="h-96 overflow-hidden rounded-lg lg:col-span-2 lg:h-auto">
				<iframe
					width="100%"
					height="100%"
					src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1079.9908506005547!2d124.64456074745017!3d8.476459937301666!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32fff2d6f0091681%3A0xd9a0d9027249d616!2sSweet%20Leaf!5e0!3m2!1sen!2sph!4v1741056674625!5m2!1sen!2sph"
					style="border:0"
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					title="map"
				></iframe>
			</div>
		</div>
	</div>
</section>
