<script lang="ts">
    import { goto } from '$app/navigation';
    import Button from '$lib/components/ui/Button.svelte';
    import { currentEvent, navItems } from '$lib/stores/data';
    import { page } from '$app/stores';
    import { eventHeaderStore } from '$lib/stores';
    import '@fortawesome/fontawesome-free/css/all.min.css';
   
    let isModalOpen: boolean = false;
    let selectedImage: string | null = null;
    let fileInput: HTMLInputElement | null = null;
    let activeTab: string = "Registration Instructions";
    let heading: string = "";
    let editorContent: string = "";
    let editorRef: HTMLDivElement;
    let isTabMenuOpen: boolean = false;
    
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
        isTabMenuOpen = false; // Close the burger menu after selection
    }

    function focusEditor() {
        if (editorRef) {
            editorRef.focus();
        }
    }

    function toggleTabMenu() {
        isTabMenuOpen = !isTabMenuOpen;
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
    <div class="fixed inset-0 flex items-center justify-center p-2 sm:p-4 overflow-auto z-50 backdrop-blur-sm bg-black/10">
        <div class="bg-white border rounded-lg w-full md:w-4/5 lg:w-3/4 xl:w-2/3 flex flex-col border-gray-400 max-h-[90vh] md:max-h-[85vh] lg:max-h-[80vh] overflow-auto">
                <!-- Modal Header with Responsive Tabs -->
                <div class="p-3 sm:p-4 border-b border-gray-300">
                    <!-- Desktop Tabs View -->
                    <div class="hidden sm:flex space-x-2">
                        <button
                            on:click={() => setTab("Edit Details")}
                            class="px-4 py-1 text-sm border rounded-md border-gray-500"
                            class:bg-red-500={activeTab === "Edit Details"}
                            class:text-white={activeTab === "Edit Details"}
                        >
                            Edit details
                        </button>
                        <button
                            on:click={() => setTab("Visual")}
                            class="px-4 py-1 text-sm border rounded-md border-gray-500"
                            class:bg-red-500={activeTab === "Visual"}
                            class:text-white={activeTab === "Visual"}
                        >
                            Visual
                        </button>
                        <button
                            on:click={() => setTab("Contacts")}
                            class="px-4 py-1 text-sm border rounded-md border-gray-500"
                            class:bg-red-500={activeTab === "Contacts"}
                            class:text-white={activeTab === "Contacts"}
                        >
                            Contacts
                        </button>
                        <button
                            on:click={() => setTab("Registration Instructions")}
                            class="px-4 py-1 text-sm border rounded-md border-gray-500"
                            class:bg-red-500={activeTab === "Registration Instructions"}
                            class:text-white={activeTab === "Registration Instructions"}
                        >
                            Registration instructions
                        </button>
                        <div class="flex-grow"></div>
                        <button on:click={() => (isModalOpen = false)} class="text-gray-600">
                            ✕
                        </button>
                    </div>
                    
                    <!-- Mobile Burger Menu View -->
                    <div class="flex sm:hidden items-center justify-between">
                        <div class="relative">
                            <button 
                                on:click={toggleTabMenu} 
                                class="flex items-center space-x-2 px-3 py-1 text-sm border rounded-md border-gray-500"
                                class:bg-red-500={isTabMenuOpen}
                                class:text-white={isTabMenuOpen}
                            >
                                <span>{activeTab}</span>
                                <i class="fa-solid fa-chevron-down text-xs"></i>
                            </button>
                            
                            {#if isTabMenuOpen}
                                <div class="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 w-64">
                                    <button
                                        on:click={() => setTab("Edit Details")}
                                        class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                        class:bg-red-100={activeTab === "Edit Details"}
                                    >
                                        Edit details
                                    </button>
                                    <button
                                        on:click={() => setTab("Visual")}
                                        class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                        class:bg-red-100={activeTab === "Visual"}
                                    >
                                        Visual
                                    </button>
                                    <button
                                        on:click={() => setTab("Contacts")}
                                        class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                        class:bg-red-100={activeTab === "Contacts"}
                                    >
                                        Contacts
                                    </button>
                                    <button
                                        on:click={() => setTab("Registration Instructions")}
                                        class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                        class:bg-red-100={activeTab === "Registration Instructions"}
                                    >
                                        Registration instructions
                                    </button>
                                </div>
                            {/if}
                        </div>
                        <button on:click={() => (isModalOpen = false)} class="text-gray-600">
                            ✕
                        </button>
                    </div>
                </div>

                {#if activeTab === "Registration Instructions"}
                    <!-- Registration Instructions Content -->
                    <div>
                        <div class="px-3 sm:px-4 pt-3 sm:pt-4">
                            <h2 class="text-lg font-semibold">Registration instruction</h2>
                            <p class="text-sm text-gray-600 mt-1">Edit your registration instruction below. Changes update automatically on your website.</p>
                        </div>
                        
                        <div class="border-t mt-3 sm:mt-4 border-gray-400"></div>
                        
                        <div class="p-3 sm:p-4">
                            <!-- Responsive layout -->
                            <div class="flex flex-col lg:flex-row">
                                <!-- Left Column - Takes full width on mobile, 1/3 on larger screens -->
                                <div class="w-full lg:w-1/3 lg:pr-4 mb-4 lg:mb-0">
                                    <!-- Heading input -->
                                    <div class="mb-4 sm:mb-6">
                                        <label for="heading" class="block text-sm font-medium mb-2">Heading</label>
                                        <input 
                                            type="text" 
                                            id="heading" 
                                            placeholder="Add heading" 
                                            bind:value={heading} 
                                            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                                        />
                                    </div>
                                    
                                    <!-- Images section -->
                                    <div class="mb-4">
                                        <label class="block text-sm font-medium mb-2">Images</label>
                                        <div class="flex justify-center items-center bg-gray-50 border border-gray-200 rounded-md h-32">
                                            {#if selectedImage}
                                                <div class="relative">
                                                    <img src={selectedImage} alt="Selected image" class="h-28 object-contain" />
                                                    <button 
                                                        on:click={removeImage} 
                                                        class="absolute top-0 right-0 bg-white rounded-full p-1 shadow-md"
                                                    >
                                                        <i class="fa-solid fa-times"></i>
                                                    </button>
                                                </div>
                                            {:else}
                                                <div class="text-center">
                                                    <button 
                                                        on:click={() => fileInput?.click()}
                                                        class="text-gray-500 hover:text-gray-700"
                                                    >
                                                        Select image
                                                    </button>
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        on:change={handleFileUpload} 
                                                        bind:this={fileInput} 
                                                        class="hidden"
                                                    />
                                                </div>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Right Column (Rich Text Editor) - Takes full width on mobile, 2/3 on larger screens -->
                                <div class="w-full lg:w-2/3">
                                    <div class="border border-gray-200 rounded-md">
                                        <!-- Toolbar with responsive design -->
                                        <div class="flex flex-wrap items-center p-2 border-b bg-white border-gray-400">
                                            <!-- Formatting buttons -->
                                            <div class="flex items-center mr-2">
                                                <button class="p-1 mx-1 text-gray-600" title="Bold">
                                                    <span class="font-bold">B</span>
                                                </button>
                                                <button class="p-1 mx-1 text-gray-600" title="Italic">
                                                    <span class="italic">I</span>
                                                </button>
                                                <button class="p-1 mx-1 text-gray-600" title="Underline">
                                                    <span class="underline">U</span>
                                                </button>
                                            </div>
                                            
                                            <!-- Divider -->
                                            <div class="mx-1 h-4 border-r border-gray-300 hidden sm:block"></div>
                                            
                                            <!-- List buttons -->
                                            <div class="flex items-center mr-2">
                                                <button class="p-1 mx-1 text-gray-600" title="Bullet List">
                                                    <i class="fa-solid fa-bars"></i>
                                                </button>
                                                <button class="p-1 mx-1 text-gray-600" title="Numbered List">
                                                    <i class="fa-solid fa-list"></i>
                                                </button>
                                            </div>
                                            
                                            <!-- Divider -->
                                            <div class="mx-1 h-4 border-r border-gray-300 hidden sm:block"></div>
                                            
                                            <!-- Link and Formula buttons -->
                                            <div class="flex items-center mr-2">
                                                <button class="p-1 mx-1 text-gray-600" title="Link">
                                                    <span>🔗</span>
                                                </button>
                                                <button class="p-1 mx-1 text-gray-600" title="Formula">
                                                    <i class="fa-solid fa-strikethrough"></i>
                                                </button>
                                            </div>
                                            
                                            <!-- Line break for small screens -->
                                            <div class="w-full h-0 sm:hidden my-1"></div>
                                            
                                            <!-- Divider -->
                                            <div class="mx-1 h-4 border-r border-gray-300 hidden sm:block"></div>
                                            
                                            <!-- Text style dropdown -->
                                            <div class="flex items-center mr-2">
                                                <select class="text-sm border-0 focus:ring-0 text-gray-600 bg-transparent">
                                                    <option>Normal</option>
                                                    <option>Heading 1</option>
                                                    <option>Heading 2</option>
                                                    <option>Heading 3</option>
                                                </select>
                                            </div>
                                            
                                            <!-- Divider -->
                                            <div class="mx-1 h-4 border-r border-gray-300 hidden sm:block"></div>
                                            
                                            <!-- Font family dropdown -->
                                            <div class="flex items-center">
                                                <select class="text-sm border-0 focus:ring-0 text-gray-600 bg-transparent">
                                                    <option>Sans Serif</option>
                                                    <option>Serif</option>
                                                    <option>Monospace</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <!-- Content Area - Responsive -->
                                        <div 
                                            class="min-h-40 sm:min-h-64 p-3 sm:p-4 bg-gray-50 cursor-text"
                                            on:click={focusEditor}
                                        >
                                            <div 
                                                contenteditable="true"
                                                class="w-full h-full min-h-36 sm:min-h-52 outline-none" 
                                                bind:this={editorRef}
                                                bind:innerHTML={editorContent}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Footer Buttons -->
                    <div class="flex justify-end gap-2 p-3 sm:p-4 mt-auto border-t border-gray-300">
                        <button 
                            on:click={() => (isModalOpen = false)}
                            class="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-md bg-white"
                        >
                            Cancel
                        </button>
                        <button class="px-3 sm:px-4 py-2 text-sm bg-red-500 text-white rounded-md">
                            Save changes
                        </button>
                    </div>
                {:else}
                    <div class="p-3 sm:p-4">
                        <h2 class="text-lg font-semibold mb-4">{activeTab}</h2>
                        <p class="text-gray-500">This tab is under development.</p>
                    </div>
                    <div class="flex justify-end gap-2 p-3 sm:p-4 mt-auto border-t border-gray-300">
                        <button 
                            on:click={() => (isModalOpen = false)}
                            class="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-md bg-white"
                        >
                            Cancel
                        </button>
                        <button class="px-3 sm:px-4 py-2 text-sm bg-red-500 text-white rounded-md">
                            Save changes
                        </button>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>