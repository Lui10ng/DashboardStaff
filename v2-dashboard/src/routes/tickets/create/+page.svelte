<script lang="ts">
  import { enhance } from '$app/forms';
  import { superForm } from 'sveltekit-superforms/client';
  import SaveLayout from '$lib/components/SaveLayout.svelte';
  import type { SeatMapConfig } from '$lib/types/seatMap';
  import { toast } from '$lib/stores/toast';

  export let data;

  const { form, errors, enhance: enhanceForm } = superForm(data.form);

  let seatMapConfig: SeatMapConfig = {
    ticketQuantity: 100, // Default value, should be updated based on your needs
    seatConfig: {
      rows: 10,
      seatsPerRow: 10,
      rowStartChar: 'A',
      seatStartNum: 1,
      rowOrder: 'down',
      seatOrder: 'left',
      rowLabel: 'Row'
    }
  };

  let seats: Record<string, any> = {};
  let customSeatNames: Record<string, string> | null = null;
  let seatMapId: string | null = null;
  let venueImage: string | null = null;

  const handleSeatMapSuccess = (event: CustomEvent<{ seatMapId: string }>) => {
    seatMapId = event.detail.seatMapId;
    toast.show({
      message: 'Seat map saved successfully! You can now create the ticket type.',
      type: 'success'
    });
  };

  const handleSeatMapError = (event: CustomEvent<{ message: string }>) => {
    toast.show({
      message: event.detail.message,
      type: 'error'
    });
  };

  const handleSubmit = async () => {
    if (!seatMapId) {
      toast.show({
        message: 'Please save the seat map first',
        type: 'error'
      });
      return;
    }

    // Your ticket type creation logic here
    // Make sure to include the seatMapId in the form data
    $form.seatMapId = seatMapId;
  };
</script>

<div class="container mx-auto p-6 space-y-8">
  <h1 class="text-2xl font-bold">Create Ticket Type</h1>

  <form
    method="POST"
    action="?/createTicketType"
    use:enhance={enhanceForm}
    class="space-y-6"
    on:submit|preventDefault={handleSubmit}
  >
    <!-- Basic ticket information -->
    <div class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Ticket Name</label>
        <input
          type="text"
          id="name"
          name="name"
          bind:value={$form.name}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          required
        />
        {#if $errors.name}
          <p class="mt-1 text-sm text-red-600">{$errors.name}</p>
        {/if}
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          bind:value={$form.description}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          rows="3"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            bind:value={$form.price}
            min="0"
            step="0.01"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <div>
          <label for="currency" class="block text-sm font-medium text-gray-700">Currency</label>
          <select
            id="currency"
            name="currency"
            bind:value={$form.currency}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          >
            <option value="USD">USD</option>
            <option value="PHP">PHP</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Seat map configuration -->
    <div class="space-y-4 border-t pt-6">
      <h2 class="text-lg font-medium">Seat Map Configuration</h2>
      
      <!-- Your seat map editor UI components here -->
      <!-- These components should update seatMapConfig and seats -->
      
      <SaveLayout
        name={$form.name || 'Event Seating'}
        config={seatMapConfig}
        {seats}
        {customSeatNames}
        {venueImage}
        on:success={handleSeatMapSuccess}
        on:error={handleSeatMapError}
      />
    </div>

    <input type="hidden" name="seatMapId" value={seatMapId || ''} />

    <div class="flex justify-end">
      <button
        type="submit"
        class="rounded-md bg-primary px-4 py-2 text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        disabled={!seatMapId}
      >
        Create Ticket Type
      </button>
    </div>
  </form>
</div> 