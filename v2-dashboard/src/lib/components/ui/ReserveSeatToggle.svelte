<script lang="ts">
    export let value = false;
    export let OnChange = (newValue: boolean) => {};

    function toggleValue() {
        value = !value;
        OnChange(value);
    }
</script>

<button
    type="button"
    class="relative inline-flex h-6 w-11 items-center rounded-full"
    class:bg-gray-400={!value}
    class:bg-[#DF4D60]={value}
    on:click={toggleValue}
    aria-checked={value}
    role="switch"
    aria-labelledby="reserveSeatingLabel"
>
    <span
        class="inline-block h-4 w-4 transform rounded-full bg-white transition"
        class:translate-x-1={!value}
        class:translate-x-6={value}
    ></span>
</button> 