<script lang="ts">
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
	
	async function handleFileChange(uploadDretso: FileList | File[]) {
		console.log('File changed:', uploadDretso);
		if(uploadDretso.acceptedFiles && uploadDretso.acceptedFiles.length>0){
			const formData = new FormData();
			uploadDretso.acceptedFiles.forEach((image, index) => {
				formData.append(`file${index+1}`, image);
			});
			try {
				const response = await fetch('/api/uploadImage', {
				method: 'POST',
				body: formData,
				});

				if (response.ok) {
				let temp = await response.json();
				// console.log("temp",temp);
				
				}
			} catch (error) {
				console.error('Error:', error);
			}
			location.reload();
		}
	}
</script>
<FileUpload
	label="Upload a file or drag here"
	interfaceText="text-primary text-center"
	subtext="PNG, JPG, GIF up to 10MB"
	interfaceSubtext="text-sm text-gray-500"
	name="logo"
	accept="image/*"
	maxFiles={2}
	onFileChange={handleFileChange}
	onFileReject={console.error}
	classes="cursor-pointer rounded-lg border-2 border-dashed"
>
</FileUpload>