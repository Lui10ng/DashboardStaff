<script lang="ts">
    export let value = false;
    export let name = "status";
    export let OnChange: (value: boolean) => void;
</script>

<button
    type="button"
    class="relative inline-flex h-6 w-11 items-center rounded-full"
    class:bg-green-500={value}
    class:bg-gray-400={!value}
    on:click={() => OnChange(!value)}
    aria-checked={value}
    role="switch"
    aria-labelledby="toggle-label"
>
    <input type="hidden" {name} value={value ? "active" : "inactive"} />
    <span
        class="inline-block h-4 w-4 transform rounded-full bg-white transition"
        class:translate-x-6={value}
        class:translate-x-1={!value}
    ></span>
</button>