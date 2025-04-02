<script lang="ts">
    import { goto } from '$app/navigation';
    import Button from '$lib/components/ui/Button.svelte';
    import { currentEvent, navItems } from '$lib/stores/data';
    import { page } from '$app/stores';
    import { eventHeaderStore } from '$lib/stores';
   

    let isModalOpen: boolean = false;
    let selectedImage: string | null = null;
    let fileInput: HTMLInputElement | null = null;
    let activeTab: string = "Registration Instructions";

    function removeImage(event: Event) {
        event.stopPropagation();
        selectedImage = null;
        if (fileInput) {
            fileInput.value = "";
        }
    }

    function handleFileUpload(event: Event) {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            selectedImage = URL.createObjectURL(file);
        }
    }

    function setTab(tab: string) {
        activeTab = tab;
    }

    const handleActiveNav = (path: string) => {
        return $page.url.pathname.includes(path) ? 'bg-primary text-white' : '';
    };
</script>

<div>
    <div class="flex flex-col items-start gap-4 sm:mb-8 sm:flex-row sm:items-center sm:gap-6">
        <img
            src={$eventHeaderStore.imageUrl}
            alt={$eventHeaderStore.title}
            class="h-48 w-full rounded-lg object-cover shadow-lg sm:h-32 sm:w-32"
        />
        <div class="w-full flex-1">
            <div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
                <h1 class="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">{$eventHeaderStore.title}</h1>
                <button
                    class="flex items-center gap-2 text-red-600 transition-colors hover:text-red-700"
                    on:click={() => (isModalOpen = true)}
                >
                    Edit Event
                    <i class="fa-solid fa-pen"></i>
                </button>
            </div>
            <div class="flex flex-col gap-2 text-gray-600">
                <div class="flex items-center gap-2">
                    <i class="fa-regular fa-calendar-minus text-red"></i>
                    <span>{$eventHeaderStore.date}</span>
                </div>
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-location-dot text-red"></i>
                    <span class="text-sm sm:text-base">{$eventHeaderStore.location}</span>
                </div>
            </div>

            <div class="mt-2 flex items-center gap-2">
                <a
                    href={$eventHeaderStore.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue break-all text-sm transition-colors sm:text-base"
                >
                    {$eventHeaderStore.url}
                </a>
                <div class="flex items-center gap-2 text-gray-500">
                    <i class="fa-solid fa-link"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="-mx-4 mb-6 overflow-x-auto rounded-lg px-4 py-3 sm:mx-0 sm:mb-8 sm:px-0">
        <nav class="flex min-w-max space-x-4">
            {#each navItems as item}
                <Button
                    label={item.label}
                    className="rounded-lg border border-gray-200 py-2 shadow-sm transition-colors w-35 capitalize {handleActiveNav(
                        item.label
                    )}"
                    onClick={() => {
                        goto(item.path);
                    }}
                />
            {/each}
        </nav>
    </div>

    {#if isModalOpen}
        <div class="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 overflow-auto z-50">
            <div class="bg-white border rounded-lg w-full max-w-4xl h-[90vh] sm:h-[80vh] flex flex-col">
                <div class="overflow-x-auto p-2 sm:p-4">
                    <div class="flex min-w-max gap-2">
                        <button
                            on:click={() => setTab("Edit Details")}
                            class="attendance py-2 px-3 sm:px-4 rounded-md transition-colors sm:w-auto cursor-pointer h-10 text-xs whitespace-nowrap flex-shrink-0"
                            class:attendance2={activeTab === "Edit Details"}
                        >
                            Edit Details
                        </button>
                        <button
                            on:click={() => setTab("Visual")}
                            class="attendance py-2 px-3 sm:px-4 rounded-md transition-colors sm:w-auto cursor-pointer h-10 text-xs whitespace-nowrap flex-shrink-0"
                            class:attendance2={activeTab === "Visual"}
                        >
                            Visual
                        </button>
                        <button
                            on:click={() => setTab("Contacts")}
                            class="attendance py-2 px-3 sm:px-4 rounded-md transition-colors sm:w-auto cursor-pointer h-10 text-xs whitespace-nowrap flex-shrink-0"
                            class:attendance2={activeTab === "Contacts"}
                        >
                            Contacts
                        </button>
                        <button
                            on:click={() => setTab("Registration Instructions")}
                            class="attendance py-2 px-3 sm:px-4 rounded-md transition-colors sm:w-auto cursor-pointer h-10 text-xs whitespace-nowrap flex-shrink-0"
                            class:attendance2={activeTab === "Registration Instructions"}
                        >
                            Registration Instructions
                        </button>
                    </div>
                </div>

                <div class="p-4 sm:p-6 overflow-y-auto flex-grow">
                    <h2 class="text-xl font-semibold mb-4">{activeTab}</h2>
                    
                </div>

                <div class="flex justify-end gap-3 p-4 mt-auto">
                    <button on:click={() => (isModalOpen = false)} class="px-4 py-2 cancel rounded cursor-pointer">
                        Cancel
                    </button>
                    <button class="px-4 py-2 attendance2 cursor-pointer">Save changes</button>
                </div>
            </div>
        </div>
    {/if}
</div>