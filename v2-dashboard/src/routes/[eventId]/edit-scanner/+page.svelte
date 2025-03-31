<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import NotificationPopup from './copy-popUp/NotificationPopup.svelte';

	let scannerName = $state('Sample Name');
	let qrScannerLink = $state('https://veent.co/scanner/');
	let selectedAttendanceType = $state('');
	let showOthersInput = $state(false);
	let otherAttendanceValue = $state('');
	let showCopyPopup = $state(false);

	function selectAttendanceType(type: string) {
		selectedAttendanceType = type;
		showOthersInput = type === 'Others';
	}

	function saveScanner() {
		console.log('Scanner saved with name:', scannerName);
		console.log('QR Scanner link:', qrScannerLink);
		console.log('Attendance type:', selectedAttendanceType);
		
		if (showOthersInput) {
			console.log('Custom attendance value:', otherAttendanceValue);
		}
		
		window.history.back();
	}

	function cancelEdit() {
		console.log('Edit canceled');
		window.history.back();
	}

	function copyLink() {
		navigator.clipboard.writeText(qrScannerLink).then(() => {
			showCopyPopup = true;
		}).catch(err => {
			console.error("Failed to copy: ", err);
		});
	}
	
	function handleClosePopup() {
		showCopyPopup = false;
	}
</script>

<NotificationPopup 
	show={showCopyPopup}
	message="Link copied to clipboard!"
	on:close={handleClosePopup}
/>

<div class="min-h-screen bg-white">
	<main class="px-4 md:px-8 max-w-4xl mx-auto">
		<div class="py-6">
			<div class="border-b border-gray-200 pb-3 mb-6">
				<h1 class="text-xl font-medium">Edit Scanner</h1>
			</div>
			
			<div class="mt-8 space-y-6">
				<div>
					<label for="scannerName" class="block text-sm font-medium text-gray-700 mb-2.5 2xl:mb-0">Scanner Name</label>
					<input 
						type="text" 
						id="scannerName" 
						bind:value={scannerName}
						class="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm mb-2 2xl:mb-0"
					/>
				</div>
				
				<div>
					<label for="qrScannerLink" class="block text-sm font-medium text-gray-700 mb-2.5 2xl:mb-0">QR Scanner Link</label>
					<div class="relative">
						<input 
							type="text" 
							id="qrScannerLink" 
							bind:value={qrScannerLink}
							class="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm mb-1 2xl:mb-0"
						/>
						<button class="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" on:click={copyLink}>
							<i class="fa-solid fa-copy h-4 w-4" style="color: #a6aba9;"></i>
						</button>
					</div>
				</div>
				
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2.5 2xl:mb-0">Select Attendance Type</label>
					<div class="grid grid-cols-3 gap-4">
						{#each ['In / Out', 'On Duty', 'Training', 'Approve', 'Present', 'Others'] as type}
						<button 
						class={`p-2 border rounded-md text-center text-sm cursor-pointer ${
						  selectedAttendanceType === type 
						  ? 'text-white bg-[#DF4D60] font-sans hover:bg-[#dc3c51]' 
						  : 'bg-white text-[#DF4D60] border border-[#DF4D60] font-sans hover:bg-[#DF4D60] hover:text-white'
						}`}
						on:click={() => selectAttendanceType(type)}
					  >
						{type}
					  </button>
						{/each}
					</div>
				</div>
				
				{#if showOthersInput}
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Others</label>
						<input 
							type="text" 
							placeholder="Input Attendance name" 
							bind:value={otherAttendanceValue}
							class="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
						/>
					</div>
				{/if}
				
				<div class="flex space-x-4 pt-4">
					<button 
						class="px-4 py-2 text-white bg-[#DF4D60] font-sans hover:bg-[#dc3c51] rounded-md w-50 cursor-pointer"
						on:click={saveScanner}
					>
						Save Scanner
					</button>
					
					<button 
						class="px-4 py-2 border text-[#6C727F] bg-white border-[#B4B4B4] hover:bg-[#d9d9d9] rounded-md w-42 cursor-pointer "
						on:click={cancelEdit}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</main>
</div>