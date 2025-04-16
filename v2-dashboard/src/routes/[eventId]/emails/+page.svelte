<script lang="ts">
	import { fly } from 'svelte/transition';
	import Modal from '$lib/components/ui/Modal.svelte';
	import RichText from '$lib/components/ui/RichText.svelte';

	let emailData = $state({
		to: '',
		from: '',
		cc: '',
		bcc: '',
		subject: ' '
	});

	let availableInputs = $state([
		{ label: 'First name', key: ' First name' },
		{ label: 'Last name', key: 'first name' },
		{ label: 'Contact Number', key: 'Contact Number' },
		{ label: 'Email', key: 'Email' },
		{ label: 'Region', key: 'Region' },
		{ label: 'Qr Code', key: 'Qr Code' },
		{ label: 'Ticket Info', key: 'Ticket Info' },
		{ label: 'Payment Info', key: 'Payment Info' }
	]);

	let emailBody = $state(` `);

	function insertInput(key: string) {
		emailBody = emailBody + `{{${key}}}`;
	}

	function saveEmail() {
		let { to, from, cc, bcc, subject } = emailData;
		let body = $state.snapshot(emailBody);
		console.log('Saving Email:', { to, from, cc, bcc, subject, body });
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		try {
			const formData = {
				...emailData,
				body: emailBody
			};

			console.log('Form submitted:', formData);
		} catch (error) {
			console.error('Error submitting form:', error);
		}
	}
</script>

<div class="space-y-5" in:fly={{ y: -50, duration: 200 }}>
	<div class="space-y-1">
		<h1 class="text-xl font-semibold">Automated Email</h1>
		<p class="text-sm text-gray-500">
			(Automated emails will be sent to your registrants after each successful registration. The
			curly braces are the form inputs you added from the Registration Form Tab)
		</p>
	</div>

	<Modal dialogClass="max-w-[calc(100%-2rem)] sm:max-w-[800px] max-h-[90vh]">
		{#snippet button()}
			<div class="bg-primary rounded-md px-5 py-2 text-white">
				<i class="fa-solid fa-plus"></i>
				Create Email
			</div>
		{/snippet}

		{#snippet header()}
			<div class="space-y-1">
				<h1 class="text-xl font-semibold">Automated Email</h1>
				<p class="text-sm text-gray-500">Create and automated your email here</p>
			</div>
		{/snippet}

		{#snippet content()}
			<form
				class="modal-content mt-4 flex max-h-[calc(90vh-120px)] flex-col space-y-5 overflow-y-auto"
				action="?/createEmail"
				method="POST"
				on:submit={handleSubmit}
			>
				<div class="space-y-5 rounded-md border border-gray-300 p-5">
					<div class="grid grid-cols-[80px_1fr] items-center gap-x-4 gap-y-2">
						<label for="to" class="text-left font-semibold">To:</label>
						<input
							type="email"
							id="to"
							bind:value={emailData.to}
							class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 sm:text-sm"
						/>
					</div>

					<div class="grid grid-cols-[80px_1fr] items-center gap-x-4 gap-y-2">
						<label for="from" class="text-left font-semibold">From:</label>
						<input
							type="email"
							id="from"
							bind:value={emailData.from}
							class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 sm:text-sm"
						/>
					</div>

					<div class="grid grid-cols-[80px_1fr] items-center gap-x-4 gap-y-2">
						<label for="cc" class="text-left font-semibold">CC:</label>
						<input
							type="email"
							id="cc"
							bind:value={emailData.cc}
							class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 sm:text-sm"
						/>
					</div>

					<div class="grid grid-cols-[80px_1fr] items-center gap-x-4 gap-y-2">
						<label for="bcc" class="text-left font-semibold">BCC:</label>
						<input
							type="email"
							id="bcc"
							bind:value={emailData.bcc}
							class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 sm:text-sm"
						/>
					</div>

					<div class="grid grid-cols-[80px_1fr] items-center gap-x-4 gap-y-2">
						<label for="subject" class="text-left font-semibold">Subject:</label>
						<input
							type="text"
							id="subject"
							bind:value={emailData.subject}
							class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 sm:text-sm"
						/>
					</div>
					<RichText />
					<div class="mb-4 mt-3 flex flex-wrap gap-1">
						{#each availableInputs as input}
							<button
								class="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-300"
								on:click={() => insertInput(input.key)}
							>
								{input.label}
							</button>
						{/each}
					</div>
					<div class="mt-5 flex gap-2">
						<button
							class="rounded-md bg-red-500 px-4 py-2 font-bold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-200"
							on:click={saveEmail}
						>
							Save Email
						</button>
						<button
							class="rounded-md bg-gray-300 px-4 py-2 font-semibold text-gray-800 shadow-sm hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-200"
						>
							Cancel Edit
						</button>
						<button
							class="rounded-md bg-gray-300 px-4 py-2 font-semibold text-gray-800 shadow-sm hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-200"
						>
							Insert Image
						</button>
					</div>
				</div>
			</form>
		{/snippet}
	</Modal>
</div>
