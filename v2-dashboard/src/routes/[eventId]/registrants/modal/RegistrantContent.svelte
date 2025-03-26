<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';

	let { guest } = $props();
</script>

<div class="grid grid-cols-1 gap-5">
	<div>
		<p class="font-medium">First Name</p>
		<p>{guest.name}</p>
	</div>
	<div>
		<p class="font-medium">Email</p>
		<p>{guest.email}</p>
	</div>
	<div>
		<p class="font-medium">Date Registered</p>
		<p>{guest.registrationDate}</p>
	</div>
	<div>
		<p class="font-medium">Status</p>
		<p>{guest.status}</p>
	</div>
	<div class="flex justify-between gap-5">
		<Button onClick={() => {}} label="Resend Email" className="bg-gray-300 w-full p-2 rounded-lg" />
		<Button
			onClick={() => {}}
			label="Check-In"
			className="bg-primary w-full p-2 text-white rounded-lg"
		/>
	</div>
</div>
