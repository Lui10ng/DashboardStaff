<script lang="ts">
	import { event } from '$lib/types/data/eventData';
	import { eventDetails } from '$lib/stores/store';
	import EditEventModal from './EditEventModal.svelte';
	import { writable } from 'svelte/store';
	// console.log("event",event);

	const isModalOpen = writable(false);
	let selectedImage: string | null = null;
	let fileInput: HTMLInputElement | null = null;

	function removeImage(event: Event) {
		event.stopPropagation();
		selectedImage = null;
		if (fileInput) {
			fileInput.value = '';
		}
	}

	function handleFileUpload(event: Event) {
		const fileInput = event.target as HTMLInputElement;
		if (fileInput.files && fileInput.files.length > 0) {
			const file = fileInput.files[0];
			selectedImage = URL.createObjectURL(file);
		}
	}
	$eventDetails = null;
	function editThis() {
		$eventDetails = event;
		$isModalOpen = true;
	}
</script>

<div class="event-card">
	<button on:click={editThis} class="edit-button">
		<span class="text-sm font-medium text-red-500 md:text-base">Edit Event</span>
		<img src="/staff/icons/edit-icon.png" alt="Edit" class="h-6 w-auto md:h-7" />
	</button>
	<EditEventModal isOpen={isModalOpen} />

	<div class="event-details">
		<img src="/staff/event-photo.png" alt="Event" class="event-image" />
		<div class="event-info">
			<h1>{event.title}</h1>
			<div class="space-y-2 text-gray-600">
				<p class="flex items-center space-x-2">
					<img src="/staff/icons/date-icon.png" alt="Calendar" />
					<span>{event.date}</span>
				</p>
				<p class="flex items-center space-x-2">
					<img src="/staff/icons/pin-icon.png" alt="Location" />
					<span>{event.location}</span>
				</p>
				<p class="flex items-center space-x-2">
					<img src="/staff/icons/Copy-icon.png" alt="Link" />
					<a href={event.url} class="bg-gray-200 text-gray-400">{event.url}</a>
				</p>
			</div>
		</div>
	</div>
</div>
