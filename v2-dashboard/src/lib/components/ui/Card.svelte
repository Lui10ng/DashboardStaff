<script lang="ts">
    let {
		icon = '',
		iconText = '',
        content=''
	} = $props();
</script>


<div class="rounded-xl border border-gray-200 p-4 shadow-sm sm:p-6">
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
            <i class="{icon}"></i>
            <span class="text-gray-900">{iconText}</span>
        </div>
        <slot />
    </div>
    <p class="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">{content}</p>
</div>