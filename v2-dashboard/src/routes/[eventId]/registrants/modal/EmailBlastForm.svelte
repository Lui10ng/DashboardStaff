
<script lang="ts">
	import { Dialog } from "bits-ui";
</script>

<div>
    <div class="flex w-full items-center justify-center text-lg font-semibold tracking-tight">
        <div class="flex items-start justify-between mb-4 sm:mb-6">
            <div class="flex items-center gap-2 sm:gap-3">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <i class="fa-solid fa-envelope text-gray-500"></i>
            </div>
            <div>
                <h2 class="text-lg sm:text-xl font-semibold text-gray-800">Send Blast</h2>
                <p class="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                Guests will receive the blast via email, SMS or in-app notification.
                </p>
            </div>
            </div>
            <Dialog.Close
                class="p-2 cursor-pointer text-gray-500"
            >
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
                
                class="w-full p-2 sm:p-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm outline-none pl-9 sm:pl-10"
            />
            <i class="fa-solid fa-magnifying-glass text-gray-400 absolute left-2.5 sm:left-3 top-2.5 sm:top-3"></i>
            </div>
        </div>
        <div class="space-y-2">
            <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
            <textarea
            rows="4"
            class="w-full p-2 sm:p-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type your message..."
            ></textarea>
        </div>
        <div class="flex w-full justify-between">
            <div>
                <Dialog.Close
                    class="bg-gray-400 px-4 py-2 rounded-lg cursor-pointer"
                >
                    Cancel
                </Dialog.Close>
            </div>
            <div class="flex gap-3">
                <Dialog.Close
                    class="bg-primary w-32 py-2 text-white rounded-lg cursor-pointer"
                >
                    Schedule
                </Dialog.Close>
                <Dialog.Close
                    class="bg-blue w-32 py-2 text-white rounded-lg cursor-pointer"
                >
                    Schedule Blast
                </Dialog.Close>
            </div>
        </div>
    </form>
</div>