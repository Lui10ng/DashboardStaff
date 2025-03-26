<script lang="ts">
	import { Dialog } from 'bits-ui';
</script>

<div>
	<div class="flex w-full items-center justify-center text-lg font-semibold tracking-tight">
		<div class="mb-4 flex items-start justify-between sm:mb-6">
			<div class="flex items-center gap-2 sm:gap-3">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 sm:h-10 sm:w-10"
				>
					<i class="fa-solid fa-envelope text-gray-500"></i>
				</div>
				<div>
					<h2 class="text-lg font-semibold text-gray-800 sm:text-xl">Send Blast</h2>
					<p class="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">
						Guests will receive the blast via email, SMS or in-app notification.
					</p>
				</div>
			</div>
			<Dialog.Close class="cursor-pointer p-2 text-gray-500">
				<i class="fa-solid fa-xmark"></i>
			</Dialog.Close>
		</div>
	</div>

	<form class="space-y-5">
		<div class="space-y-2">
			<label for="name" class="block text-sm font-medium text-gray-700">Recipients</label>
			<div class="relative">
				<input
					type="text"
					placeholder="Search guests..."
					class="w-full rounded-lg border border-gray-300 bg-white p-2 pl-9 text-sm shadow-sm outline-none sm:p-2.5 sm:pl-10"
				/>
				<i
					class="fa-solid fa-magnifying-glass absolute left-2.5 top-2.5 text-gray-400 sm:left-3 sm:top-3"
				></i>
			</div>
		</div>
		<div class="space-y-2">
			<label for="message" class="block text-sm font-medium text-gray-700">Message</label>
			<textarea
				rows="4"
				class="w-full resize-none rounded-lg border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:p-2.5"
				placeholder="Type your message..."
			></textarea>
		</div>
		<div class="flex w-full justify-between">
			<div>
				<Dialog.Close class="cursor-pointer rounded-lg bg-gray-400 px-4 py-2">Cancel</Dialog.Close>
			</div>
			<div class="flex gap-3">
				<Dialog.Close class="bg-primary w-32 cursor-pointer rounded-lg py-2 text-white">
					Schedule
				</Dialog.Close>
				<Dialog.Close class="bg-blue w-32 cursor-pointer rounded-lg py-2 text-white">
					Schedule Blast
				</Dialog.Close>
			</div>
		</div>
	</form>
</div>
