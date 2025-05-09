<script lang="ts">
    import { DatePicker } from 'bits-ui';
    import {
        getLocalTimeZone,
        today,
        type DateValue,
        parseAbsoluteToLocal,
        CalendarDate
    } from '@internationalized/date';

    type Props = {
        value?: string | Date | DateValue | null;
        name: string;
        className?: string;
        disabledPastDates?: boolean;
    };

    let {
        value: initialValue = undefined,
        name,
        className,
        disabledPastDates = true
    }: Props = $props();

    let internalValue: DateValue | undefined = $state();

    function convertToDateValue(dateInput: string | Date | DateValue | null | undefined): DateValue | undefined {
        if (!dateInput) return undefined;
        if (typeof (dateInput as any).calendar === 'object') return dateInput as DateValue;

        try {
            if (typeof dateInput === 'string') {
                return parseAbsoluteToLocal(dateInput);
            } else if (dateInput instanceof Date) {
                return parseAbsoluteToLocal(dateInput.toISOString());
            }
        } catch (e) {
            console.error("Failed to parse date input:", dateInput, e);
            return undefined;
        }
        return undefined;
    }

    function isDateInvalid(date: DateValue) {
        if (!disabledPastDates) return false;
        return date.compare(today(getLocalTimeZone())) < 0;
    }

    $effect(() => {
        internalValue = convertToDateValue(initialValue);
    });

    $effect(() => {
        if (disabledPastDates && internalValue && isDateInvalid(internalValue)) {
            console.warn("Attempted to select a past date. Resetting to today as 'disabledPastDates' is true.");
            internalValue = today(getLocalTimeZone());
        }
    });
</script>

<DatePicker.Root
    weekdayFormat="short"
    fixedWeeks={true}
    isDateDisabled={isDateInvalid}
    bind:value={internalValue}
>
    <div class="flex w-full flex-col gap-1.5">
        <DatePicker.Input {name} class={className}>
            {#snippet children({ segments })}
                {#each segments.filter(s => ['day', 'month', 'year', 'literal'].includes(s.part)).slice(0, 5) as { part, value: segValue }, index}
                    <div class="inline-block select-none">
                        {#if part === 'day'}
                            <DatePicker.Segment {part} class="rounded-5px hover:bg-muted focus:bg-muted focus:text-foreground aria-[valuetext=Empty]:text-muted-foreground focus-visible:ring-0! focus-visible:ring-offset-0! px-1 py-1">
                                {String(segValue).padStart(2, '0')}
                            </DatePicker.Segment>
                        {:else if part === 'month'}
                            <DatePicker.Segment {part} class="rounded-5px hover:bg-muted focus:bg-muted focus:text-foreground aria-[valuetext=Empty]:text-muted-foreground focus-visible:ring-0! focus-visible:ring-offset-0! px-1 py-1">
                                {String(segValue).padStart(2, '0')}
                                
                            </DatePicker.Segment>
                        {:else if part === 'year'}
                                 /
                            <DatePicker.Segment {part} class="rounded-5px hover:bg-muted focus:bg-muted focus:text-foreground aria-[valuetext=Empty]:text-muted-foreground focus-visible:ring-0! focus-visible:ring-offset-0! px-1 py-1">
                                {segValue}
                                
                            </DatePicker.Segment>
                        {:else if part === 'literal' && index < 2}
                            <DatePicker.Segment {part} class="text-muted-foreground p-1 date-segment-literal">
                                /
                            </DatePicker.Segment>
                        {/if}
                    </div>
                {/each}
                <DatePicker.Trigger
                    class="text-foreground/60 hover:bg-muted active:bg-dark-10 ml-auto inline-flex size-8 items-center justify-center rounded-[5px] transition-all"
                >
                    <i class="fa-regular fa-calendar-minus hover:text-primary text-gray-400"></i>
                </DatePicker.Trigger>
            {/snippet}
        </DatePicker.Input>
        
        <DatePicker.Content sideOffset={6} class="z-50" preventScroll>
            <DatePicker.Calendar
            >
                <DatePicker.Calendar
                    class="border-dark-10 bg-background-alt shadow-popover rounded-[15px] border p-[22px]"
                >
                    {#snippet children({ months, weekdays })}
                        <DatePicker.Header class=" flex items-center justify-between">
                            <DatePicker.PrevButton
                                class="rounded-9px bg-background-alt hover:bg-muted hover:text-primary inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
                            >
                                <i class="fa-solid fa-chevron-left"></i>
                            </DatePicker.PrevButton>
                            <DatePicker.Heading class="text-[15px] font-medium" />
                            <DatePicker.NextButton
                                class="rounded-9px bg-background-alt hover:bg-muted hover:text-primary inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
                            >
                                <i class="fa-solid fa-chevron-right"></i>
                            </DatePicker.NextButton>
                        </DatePicker.Header>
                        <div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                            {#each months as month}
                                <DatePicker.Grid class="w-full border-collapse select-none space-y-1">
                                    <DatePicker.GridHead>
                                        <DatePicker.GridRow class="mb-1 flex w-full justify-between">
                                            {#each weekdays as day}
                                                <DatePicker.HeadCell
                                                    class="font-normal! text-primary w-10 rounded-md text-xs"
                                                >
                                                    <div>{day.slice(0, 2)}</div>
                                                </DatePicker.HeadCell>
                                            {/each}
                                        </DatePicker.GridRow>
                                    </DatePicker.GridHead>
                                    <DatePicker.GridBody>
                                        {#each month.weeks as weekDates}
                                            <DatePicker.GridRow class="flex w-full">
                                                {#each weekDates as date}
                                                    <DatePicker.Cell
                                                        {date}
                                                        month={month.value}
                                                        class="p-0! relative size-10 text-center text-sm"
                                                    >
                                                        <DatePicker.Day
                                                            class="rounded-9px text-foreground hover:border-foreground data-selected:bg-primary data-disabled:text-foreground/30 data-selected:text-background data-unavailable:text-muted-foreground data-disabled:cursor-not-allowed data-disabled:border-none data-outside-month:pointer-events-none data-selected:font-medium data-unavailable:line-through group relative inline-flex size-10 cursor-pointer items-center justify-center whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal transition-all"
                                                        >
                                                            <div
                                                                class="bg-foreground group-data-selected:bg-background group-data-today:block absolute top-[5px] hidden size-1 rounded-full transition-all"
                                                            ></div>
                                                            {date.day}
                                                        </DatePicker.Day>
                                                    </DatePicker.Cell>
                                                {/each}
                                            </DatePicker.GridRow>
                                        {/each}
                                    </DatePicker.GridBody>
                                </DatePicker.Grid>
                            {/each}
                        </div>
                    {/snippet}
                </DatePicker.Calendar>
            </DatePicker.Calendar>
        </DatePicker.Content>
    </div>
</DatePicker.Root>