<script lang="ts">
  import '@fontsource/poppins';
  import SearchBar from '$lib/components/ui/SearchBar.svelte';
  import FilterTabs from '$lib/components/ui/FilterTabs.svelte';
  import AttendeeList from '$lib/components/features/AttendeeList.svelte';
  import ScanButton from '$lib/components/ui/ScanButton.svelte';
  import Header from '$lib/components/layout/Header.svelte';
  import ToggleButtons from '$lib/components/ui/ToggleButtons.svelte';
  import StatusCards from '$lib/components/layout/StatusCards.svelte';
  import { page } from '$app/stores';
  import QRScanner from '$lib/components/features/QRScanner.svelte';
  
  


  let showScanner = false;
  let showAttendeeList = false;

  $: showAttendeeList = $page.url.searchParams.get('view') === 'attendees';

  function toggleScanner() {
      showScanner = !showScanner;
  }

  function toggleView() {
      showAttendeeList = !showAttendeeList;
  }
</script>

<div class="container mx-auto">
  
 
  <div class="md:hidden">
    <div class="flex items-center justify-between py-2">
        <div>
            <Header />
        </div>
        <div class="flex justify-end mb-4">
            <ScanButton onClick={toggleView} />
        </div>
    </div>

    {#if !showAttendeeList}
    <div class="fixed inset-0 z-50 bg-white p-4">
        <div class="flex-1 min-h-[60vh]"> 
            <QRScanner />
        </div>
        <div class="flex items-center rounded-full p-1 mt-4">
            <ToggleButtons />
        </div>
        <StatusCards />
    </div>
    {:else}
        <div class="max-w-md mx-auto p-4">
            <SearchBar />
            <FilterTabs />
            <AttendeeList />
        </div>
    {/if}
</div>

<!-- Desktop Layout -->
<div class="hidden md:grid md:grid-cols-2 gap-8 p-8">
    <div class="bg-white rounded-lg p-6 border border-black-900">
        <div class="flex-1 min-h-[60vh]">
            <QRScanner />
        </div>
        <div class="mt-4">
        
            <StatusCards />
        </div>
    </div>
    <div class="bg-white rounded-lg p-6 border border-black-900">
        <SearchBar />
        <FilterTabs />
        <AttendeeList />
    </div>
</div>
</div>