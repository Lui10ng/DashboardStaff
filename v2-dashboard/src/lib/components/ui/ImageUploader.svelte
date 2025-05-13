<script lang="ts">
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
	import { createEventDispatcher } from 'svelte';

	export let urls: string[] = [];
	export let loading: boolean = false;

	const dispatch = createEventDispatcher();

	async function handleFileChange(event: any) {
		loading = true;
		console.log('Files changed:', event);

		if (event.acceptedFiles && event.acceptedFiles.length > 0) {
			const uploadPromises = event.acceptedFiles.map(async (file: File) => {
				console.log('Uploading file:', file.name, file.type, file.size);

				const formData = new FormData();
				formData.append('file', file);

				try {
					const response = await fetch('/api/uploadImage', {
						method: 'POST',
						body: formData
					});

					console.log('Upload response status:', response.status);
					console.log('resulta sa image uploader', response);
					if (response.ok) {
						const data = await response.json();
						// console.log('Upload successful:', data);
						// return data.url;
					} else {
						const errorData = await response.json();
						console.error('Upload failed:', errorData);
						dispatch('error', errorData);
						return null;
					}
				} catch (error) {
					console.error('Upload error:', error);
					dispatch('error', { error });
					return null;
				}
			});

			try {
				const results = await Promise.all(uploadPromises);
				// Filter out any failed uploads (null values)
				const successfulUrls = results.filter((url) => url !== null) as string[];

				// Add new URLs to existing array
				urls = [...urls, ...successfulUrls];

				dispatch('success', { urls });
			} catch (error) {
				console.error('Error processing uploads:', error);
				dispatch('error', { error });
			} finally {
				loading = false;
			}
		}
	}

	function removeImage(index: number) {
		urls = urls.filter((_, i) => i !== index);
		dispatch('remove', { index, urls });
	}
</script>

<FileUpload
	label="Upload files or drag here"
	interfaceText="text-primary text-center"
	subtext="PNG, JPG, GIF up to 10MB"
	interfaceSubtext="text-sm text-gray-500"
	name="file"
	accept="image/*"
	maxFiles={2}
	onFileChange={handleFileChange}
	onFileReject={(e) => console.error('File rejected:', e)}
	classes="cursor-pointer rounded-lg border-2 border-dashed"
/>
