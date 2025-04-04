<script lang="ts">
    import { seatGeneratorStore } from '$lib/stores/seat-generator.svelte';
    
    // Handle quantity change
    const handleQuantityChange = (event: Event) => {
        const input = event.target as HTMLInputElement;
        const newValue = Math.max(1, parseInt(input.value) || 1);
        
        console.log(`Changing ticket quantity to ${newValue}`);
        
        // Update ticket quantity
        seatGeneratorStore.setTicketQuantity(newValue);
        
        // Log the current state after update
        setTimeout(() => {
            console.log('Current ticket quantity:', seatGeneratorStore.ticketQuantity);
            console.log('Warning state:', seatGeneratorStore.showWarning);
        }, 0);
    };

    // Handle dimension change
    const handleDimensionChange = (dimension: 'rows' | 'seatsPerRow', event: Event) => {
        const input = event.target as HTMLInputElement;
        const newValue = Math.max(0, parseInt(input.value) || 0);
        
        console.log(`Changing ${dimension} to ${newValue}`);

        // Update the configuration
        if (dimension === 'rows') {
            // Update rows
            seatGeneratorStore.setSectionConfig({ rows: newValue });
        } else {
            // Update seats per row
            seatGeneratorStore.setSectionConfig({ seatsPerRow: newValue });
        }
        
        // Adding a small delay to ensure the state updates before regenerating
        setTimeout(() => {
            // Force regenerate seats
            seatGeneratorStore.regenerateSeats();
            
            // Log the current configuration
            console.log('Updated config:', {
                rows: seatGeneratorStore.section.seatConfig.rows,
                seatsPerRow: seatGeneratorStore.section.seatConfig.seatsPerRow,
                seatArray: seatGeneratorStore.section.seats.length
            });
        }, 0);
    };
    
    // Update the row order
    const handleRowOrderChange = (order: 'up' | 'down') => {
        seatGeneratorStore.setSectionConfig({ rowOrder: order });
    };
    
    // Update the seat order
    const handleSeatOrderChange = (order: 'left' | 'right') => {
        seatGeneratorStore.setSectionConfig({ seatOrder: order });
    };
    
    // Update row start character
    const handleRowStartCharChange = (value: string) => {
        const validValue = value.replace(/[^A-Za-z]/g, '').toUpperCase();
        if (validValue !== value) {
            seatGeneratorStore.setSectionConfig({ rowStartChar: validValue });
        }
    };
    
    // Update seat start number
    const handleSeatStartNumChange = (value: string) => {
        const numValue = parseInt(value);
        if (numValue < 1) {
            seatGeneratorStore.setSectionConfig({ seatStartNum: 1 });
        }
    };
    
    // Update row label
    const handleRowLabelChange = (value: string) => {
        seatGeneratorStore.setSectionConfig({ 
            rowLabel: value as "Show All" | "Left Side" | "Right Side" | "No Label" 
        });
    };
</script>

<div class="space-y-2 ">
    <label for="ticket-quantity" class="block font-medium">Ticket Quantity</label>
    <input
        type="number"
        value={seatGeneratorStore.ticketQuantity}
        on:change={handleQuantityChange}
        class="w-full rounded border border-gray-200 bg-gray-100 p-2"
        min="1"
        aria-label="Ticket quantity"
        tabindex="0"
        required
    />
</div>

<div class="space-y-3 rounded-lg bg-white ">
   
    
    <div class="grid grid-cols-2 gap-4">
        <div>
            <label for="number-of-rows" class="block font-medium">Number of rows</label>
            <input
                type="number"
                value={seatGeneratorStore.section.seatConfig.rows}
                on:change={(e) => handleDimensionChange('rows', e)}
                class="w-full rounded border border-gray-200 bg-gray-100 p-2"
                min="0"
                aria-label="Number of rows"
                tabindex="0"
                required
            />
        </div>

        <div>
            <label for="seats-per-row" class="block font-medium">Seats per row</label>
            <input
                type="number"
                value={seatGeneratorStore.section.seatConfig.seatsPerRow}
                on:change={(e) => handleDimensionChange('seatsPerRow', e)}
                class="w-full rounded border border-gray-200 bg-gray-100 p-2"
                min="0"
                aria-label="Seats per row"
                tabindex="0"
                required
            />
        </div>
    </div>

    <div class="mt-4 grid grid-cols-2 gap-4">
        <div>
            <label for="rows-starts-with" class="block font-medium">Rows starts with</label>
            <input
                type="text"
                value={seatGeneratorStore.section.seatConfig.rowStartChar}
                class="w-full rounded border border-gray-200 bg-gray-100 p-2"
                maxlength="1"
                aria-label="Row starting character"
                tabindex="0"
                on:input={(e) => {
                    const value = (e.target as HTMLInputElement).value;
                    handleRowStartCharChange(value);
                }}
            />
        </div>

        <div>
            <label for="row-level-orders" class="block font-medium">Row level order</label>
            <div class="flex rounded border border-gray-200 bg-gray-100">
                <button
                    class="flex-1 p-2 text-center"
                    class:bg-[#DF4D60]={seatGeneratorStore.section.seatConfig.rowOrder === 'down'}
                    class:text-white={seatGeneratorStore.section.seatConfig.rowOrder === 'down'}
                    on:click={() => handleRowOrderChange('down')}
                    aria-label="Set row order to down"
                    tabindex="0"
                    on:keydown={(e) => e.key === 'Enter' && handleRowOrderChange('down')}
                >
                    Down
                </button>

                <button
                    class="flex-1 p-2 text-center"
                    class:bg-[#DF4D60]={seatGeneratorStore.section.seatConfig.rowOrder === 'up'}
                    class:text-white={seatGeneratorStore.section.seatConfig.rowOrder === 'up'}
                    on:click={() => handleRowOrderChange('up')}
                    aria-label="Set row order to up"
                    tabindex="0"
                    on:keydown={(e) => e.key === 'Enter' && handleRowOrderChange('up')}
                >
                    Up
                </button>
            </div>
        </div>
    </div>

    <div class="mt-4 grid grid-cols-2 gap-4">
        <div>
            <label for="seats-starts-with" class="block font-medium">Seats starts with</label>
            <input
                type="number"
                value={seatGeneratorStore.section.seatConfig.seatStartNum}
                class="w-full rounded border border-gray-200 bg-gray-100 p-2"
                min="1"
                aria-label="Seat starting number"
                tabindex="0"
                on:input={(e) => {
                    const value = (e.target as HTMLInputElement).value;
                    handleSeatStartNumChange(value);
                }}
            />
        </div>

        <div>
            <label for="seat-level-order" class="block font-medium">Seat level order</label>
            <div class="flex rounded border border-gray-200 bg-gray-100">
                <button
                    class="flex-1 p-2 text-center"
                    class:bg-[#DF4D60]={seatGeneratorStore.section.seatConfig.seatOrder === 'left'}
                    class:text-white={seatGeneratorStore.section.seatConfig.seatOrder === 'left'}
                    on:click={() => handleSeatOrderChange('left')}
                    aria-label="Set seat order to left"
                    tabindex="0" 
                    on:keydown={(e) => e.key === 'Enter' && handleSeatOrderChange('left')}
                >
                    Left
                </button>

                <button
                    class="flex-1 p-2 text-center"
                    class:bg-[#DF4D60]={seatGeneratorStore.section.seatConfig.seatOrder === 'right'}
                    class:text-white={seatGeneratorStore.section.seatConfig.seatOrder === 'right'}
                    on:click={() => handleSeatOrderChange('right')}
                    aria-label="Set seat order to right"
                    tabindex="0"
                    on:keydown={(e) => e.key === 'Enter' && handleSeatOrderChange('right')}
                >
                    Right
                </button>
            </div>
        </div>
    </div>
    
    <div class="mt-4">
        <label for="row-label" class="block font-medium">Row label</label>
        <select 
            value={seatGeneratorStore.section.seatConfig.rowLabel}
            on:change={(e) => handleRowLabelChange((e.target as HTMLSelectElement).value)}
            class="w-full rounded border border-gray-200 bg-gray-100 p-2"
            aria-label="Row label display option"
            tabindex="0"
        >
            <option value="Show All">Show All</option>
            <option value="Left Side">Left Side</option>
            <option value="Right Side">Right Side</option>
            <option value="No Label">No Label</option>
        </select>
    </div>
</div> 