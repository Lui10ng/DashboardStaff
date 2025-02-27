<script lang="ts">
  let youtubeLink = "";

  let themeImgSrc: string | null = null;
  let logoImgSrc: string | null = null;
  let eventLogoImgSrc: string | null = null;
  let posterImgSrc: string | null = null;
  let backgroundImgSrc: string | null = null;

  function uploadImage(id: string) {
    const element = document.getElementById(id) as HTMLInputElement;
    if (element) {
      element.click();
    }
  }

  function displayImage(event: Event, imgVar: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (imgVar === "themeImg") themeImgSrc = e.target?.result as string;
        if (imgVar === "logoImg") logoImgSrc = e.target?.result as string;
        if (imgVar === "eventLogoImg") eventLogoImgSrc = e.target?.result as string;
        if (imgVar === "posterImg") posterImgSrc = e.target?.result as string;
        if (imgVar === "backgroundImg") backgroundImgSrc = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
</script>

<div class="pb-4">
  <h2 class="text-xl font-semibold mb-2">Website visual</h2>
  <p class="text-gray-600 mb-6 text-sm">Edit your website visual below. Changes update automatically on your website.</p>

  <hr class="border-t border-gray-300 mb-6">

  <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
    <!-- Reusable Image Upload Blocks -->
    {#each [
      { id: "themeInput", label: "Theme", imgSrc: themeImgSrc, bindVar: "themeImg" },
      { id: "logoInput", label: "Logo", imgSrc: logoImgSrc, bindVar: "logoImg" },
      { id: "eventLogoInput", label: "Event logo", imgSrc: eventLogoImgSrc, bindVar: "eventLogoImg" },
      { id: "posterInput", label: "Poster", imgSrc: posterImgSrc, bindVar: "posterImg" },
      { id: "backgroundInput", label: "Background", imgSrc: backgroundImgSrc, bindVar: "backgroundImg" }
    ] as item}
    <div class="relative bg-[#F1F2F6] p-4 rounded-lg text-center cursor-pointer flex items-center justify-center h-50 pt-9"
      on:click={() => uploadImage(item.id)}>
      <p class="text-sm font-medium absolute top-2 left-2">{item.label}</p>

      {#if item.imgSrc}
        <img src={item.imgSrc} alt={item.label} class="w-full h-full object-cover">
      {:else}
        <p class="text-gray-500 text-sm">Select Image</p>
      {/if}

      <input type="file" id={item.id} class="hidden" on:change={(e) => displayImage(e, item.bindVar)}>
    </div>
    {/each}

    <!-- Embed Link -->
    <div class="col-span-2 md:col-span-1">
      <p class="text-sm font-medium mb-2">Embed link</p>
      <p class="text-gray-600 mb-2 text-sm mb-4">You may provide a YouTube link for your event to include on your website.</p>
      <input type="text" bind:value={youtubeLink} placeholder="Insert Youtube link here" class="placeholder:text-[13px] w-full p-2 bg-[#F1F2F6] rounded focus:outline-none focus:bg-[#e9ecf3]">
    </div>
  </div>
</div>
