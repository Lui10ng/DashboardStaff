 <script lang="ts">
  import { Html5QrcodeScanner } from 'html5-qrcode';
  import { onMount, onDestroy } from 'svelte';
  import { format } from 'date-fns';
  import { attendees, isCheckingIn } from '../../stores/attendees';
  import type { Attendee } from '../../types/attendee';
  import ToggleButtons from '../ui/ToggleButtons.svelte';
  import Header from '../layout/Header.svelte';
  import AttendeeModel from '../ui/AttendeeModel.svelte';
  import { createEventDispatcher } from 'svelte';
  import { Toaster, toast } from 'svelte-sonner';

  let scanner: Html5QrcodeScanner;
  let scannerId = "qr-reader-" + Math.random().toString(36).substring(7);
  let lastResult = "";
  let isScanning = false;
  let showAttendeeModel = false;
  let currentAttendee: Attendee | null = null;

  onMount(() => {
    initializeScanner();
  });

  onDestroy(() => {
    stopScanning();
  });

  async function initializeScanner() {
    try {
      scanner = new Html5QrcodeScanner(
        scannerId,
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250
          },
          // videoConstraints: {
          //   facingMode: "environment",
          //   width: { min: 640, ideal: 1280, max: 1920 },
          //   height: { min: 480, ideal: 720, max: 1080 }
          // }
        },
        false
      );
      await startScanning();
    } catch (error) {
      console.error("Scanner initialization failed:", error);
    }
  }

  async function startScanning() {
    if (!isScanning) {
      isScanning = true;
      try {
        await scanner.render(onScanSuccess, onScanFailure);
      } catch (err) {
        console.error("Failed to start scanner:", err);
      }
    }
  }

  async function stopScanning() {
    if (isScanning && scanner) {
      isScanning = false;
      try {
        await scanner.clear();
      } catch (err) {
        console.error("Failed to clear scanner:", err);
      }
    }
  }

  function onScanSuccess(decodedText: string) {
    try {
      if (lastResult === decodedText) return;

      console.log('QR Code Scanned Successfully!');
      
      let qrData: { id?: string; name?: string };
      try {
        qrData = JSON.parse(decodedText);
      } catch {
        qrData = {
          id: crypto.randomUUID(),
          name: decodedText
        };
      }

      const scannedAttendee: Attendee = {
        id: qrData.id || crypto.randomUUID(),
        name: qrData.name || "Unknown",
        date: format(new Date(), "MMM dd, yyyy"),
        time: format(new Date(), "h:mm a"),
        status: $isCheckingIn ? "IN" : "OUT"
      };

      currentAttendee = scannedAttendee;
      showAttendeeModel = true;
      lastResult = decodedText;
      playSuccessSound();
      
      setTimeout(() => {
        lastResult = "";
      }, 2000);

    } catch (error) {
      console.error("Error processing QR code:", error);
      playErrorSound();
    }
  }

  function onScanFailure(error: string) {
    if (error !== "No QR code found") {
      console.error('QR Scan Error:', error);
    }
  }

  function playSuccessSound() {
    const audio = new Audio('/success.mp3');
    audio.play().catch(() => {});
  }

  function playErrorSound() {
    const audio = new Audio('/error.mp3');
    audio.play().catch(() => {});
  }
</script>

<Toaster richColors position="top-center" />

<div class="md:hidden">
  <Header />
</div>

<div class="bg-white rounded-lg p-4 md:p-6 ">
  <div class="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 space-y-4 md:space-y-0">
    <h2 class="hidden md:block text-lg md:text-xl font-semibold text-gray-800">FunRun</h2>
    <div class="flex items-center rounded-full p-1 hidden md:block">
      <ToggleButtons />
    </div>
  </div>

  <div class="qr-scanner-container w-full h-full flex flex-col items-center justify-center">
    <div id={scannerId} class="qr-scanner-wrapper w-full"></div>
  </div>

  {#if showAttendeeModel && currentAttendee}
    <AttendeeModel
      attendee={currentAttendee}
      on:close={() => {
        showAttendeeModel = false;
        currentAttendee = null;
      }}
      on:checkIn={() => {
        if (currentAttendee) {
          toast.success(`${currentAttendee.name} has been checked ${$isCheckingIn ? 'in' : 'out'} successfully!`, {
            duration: 3000
          });

          attendees.update((currentAttendees) =>  {
            const existingIndex = currentAttendees.findIndex(attendees => attendees.name === currentAttendee?.name);
            
            if (existingIndex !== -1) {
              const updatedAttendees = [...currentAttendees];
              updatedAttendees[existingIndex] = {
                ...updatedAttendees[existingIndex],
                ...currentAttendee,
                status: $isCheckingIn ? "IN" : "OUT"
              };
              return updatedAttendees;
            }
            
            return [currentAttendee, ...currentAttendees];
          });
        }
        showAttendeeModel = false;
        currentAttendee = null;
      }}
    />
  {/if}
</div>

<style>
  .qr-scanner-container {
    min-height: 400px;
    background: #f8f9fa;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .qr-scanner-wrapper {
    max-width: 600px;
    margin: 0 auto;
  }

  :global(#reader__scan_region) {
    background: white !important;
    min-height: 300px !important;
  }

  :global(#reader__scan_region video) {
    max-width: 100% !important;
    height: auto !important;
    border-radius: 0.5rem !important;
  }

  :global(#html5-qrcode-button-camera-permission) {
    background-color: rgba(175, 172, 172, 0.39) !important;
    color: black !important;
    padding: 0.5rem 1rem !important;
    border-radius: 0.375rem !important;
    margin: 1rem auto !important;
    display: block !important;
    border: none !important;
    cursor: pointer !important;
  }

  :global(#html5-qrcode-button-camera-permission:hover) {
    background-color: rgb(82, 85, 87) !important;
  }

  :global(#reader__dashboard_section_fileselection),
  :global(#reader__file_selection),
  :global(#reader__filescan),
  :global(#reader__filescan_input),
  :global(#reader__dashboard_section_swaplink),
  :global(#reader__status_span),
  :global(#reader__dashboard_section_csr > div:last-child),
  :global(#reader__dashboard_section_csr > span),
  :global(#reader__dashboard_section div > span),
  :global(#reader__image_footer) {
    display: none !important;
  }

  @media (max-width: 768px) {
    .qr-scanner-wrapper {
      max-width: 100%;
    }
  }
</style>
