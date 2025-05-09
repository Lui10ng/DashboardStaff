<script lang="ts">
  import { enhance } from '$app/forms';
  import { createEventDispatcher } from 'svelte';
  import type { SeatMapConfig, Seat } from '$lib/types/seatMap';
  import Button from './ui/Button.svelte';
  import { toast } from '$lib/stores/toast';
  import { seatLayoutDataSchema } from '$lib/schema/seat-map';
  import type { SubmitFunction } from '@sveltejs/kit';

  export let name = '';
  export let config: SeatMapConfig;
  export let seats: Record<string, Seat>;
  export let customSeatNames: Record<string, string> | null = null;
  export let isSubmitting = false;
  export let venueImage: string | null = null;
  export let eventId: string | undefined = undefined;

  // Calculate summary based on seats data
  $: totalSeats = Object.keys(seats).length;
  $: availableSeats = Object.values(seats).filter(seat => seat.seatType !== 'unavailable' && seat.isPurchasable).length;
  $: unavailableSeats = Object.values(seats).filter(seat => seat.seatType === 'unavailable' || !seat.isPurchasable).length;
  $: soldSeats = 0; // This will be updated when tickets are sold

  const dispatch = createEventDispatcher<{
    success: { seatMapId: string };
    error: { message: string };
  }>();

  let formEl: HTMLFormElement;

  const handleSubmit: SubmitFunction = async ({ form, data, action, cancel }) => {
    try {
      const layoutData = {
        name,
        config,
        seats,
        customSeatNames,
        summary: {
          totalSeats,
          availableSeats,
          unavailableSeats,
          soldSeats
        },
        venueImage
      };

      if (eventId) {
        layoutData.event = {
          relationTo: 'events',
          value: eventId
        };
      }

      // Validate the data
      const validatedData = seatLayoutDataSchema.parse(layoutData);
      
      isSubmitting = true;
      return async ({ result }) => {
        isSubmitting = false;
        if (result.type === 'success') {
          const { seatMapId } = result.data as { seatMapId: string };
          dispatch('success', { seatMapId });
          toast.show({
            message: 'Seat map saved successfully!',
            type: 'success'
          });
        } else {
          const error = result.error as { message: string };
          dispatch('error', { message: error.message || 'Failed to save seat map' });
          toast.show({
            message: error.message || 'Failed to save seat map',
            type: 'error'
          });
        }
      };
    } catch (error) {
      isSubmitting = false;
      const message = error instanceof Error ? error.message : 'Invalid seat map data';
      dispatch('error', { message });
      toast.show({
        message,
        type: 'error'
      });
      cancel();
    }
  };
</script>

<form method="POST" action="?/saveLayout" use:enhance={handleSubmit} bind:this={formEl}>
  <input type="hidden" name="layoutData" value={JSON.stringify({
    name,
    config,
    seats,
    customSeatNames,
    summary: {
      totalSeats,
      availableSeats,
      unavailableSeats,
      soldSeats
    },
    venueImage,
    ...(eventId ? { event: { relationTo: 'events', value: eventId } } : {})
  })} />
  
  <!-- Config -->
  <input type="hidden" name="ticketQuantity" value={config.ticketQuantity} />
  <input type="hidden" name="rows" value={config.seatConfig.rows} />
  <input type="hidden" name="seatsPerRow" value={config.seatConfig.seatsPerRow} />
  <input type="hidden" name="rowStartChar" value={config.seatConfig.rowStartChar} />
  <input type="hidden" name="seatStartNum" value={config.seatConfig.seatStartNum} />
  <input type="hidden" name="rowOrder" value={config.seatConfig.rowOrder} />
  <input type="hidden" name="seatOrder" value={config.seatConfig.seatOrder} />
  <input type="hidden" name="rowLabel" value={config.seatConfig.rowLabel} />
  
  <!-- Seats and Custom Names -->
  <input type="hidden" name="seats" value={JSON.stringify(seats)} />
  {#if customSeatNames}
    <input type="hidden" name="customSeatNames" value={JSON.stringify(customSeatNames)} />
  {/if}
  
  <!-- Venue Image -->
  {#if venueImage}
    <input type="hidden" name="venueImage" value={venueImage} />
  {/if}

  <!-- Summary -->
  <input type="hidden" name="totalSeats" value={totalSeats} />
  <input type="hidden" name="availableSeats" value={availableSeats} />
  <input type="hidden" name="unavailableSeats" value={unavailableSeats} />
  <input type="hidden" name="soldSeats" value={soldSeats} />

  <div class="flex justify-end">
    <Button
      type="submit"
      disabled={isSubmitting}
      isLoading={isSubmitting}
    >
      {isSubmitting ? 'Saving...' : 'Save Layout'}
    </Button>
  </div>
</form> 