<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<form class="flex flex-col space-y-2" method="POST" action="?/createEvent" use:enhance>
	<label class="font-semibold" for="Event">Event Name: </label>
	<input class="border px-2 outline-none" id="email" name="event" type="text" required />

	<label class="font-semibold" for="location">Location: </label>
	<input class="border px-2 outline-none" id="location" name="location" type="text" required />

	<button class="bg-primary cursor-pointer rounded-lg px-2 py-1 text-white" type="submit"
		>Submit</button
	>
</form>
