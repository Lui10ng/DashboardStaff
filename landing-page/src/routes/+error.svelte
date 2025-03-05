<script>
  import { page } from '$app/stores';
  
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-24 sm:py-32 lg:px-8">
  <div class="text-center">
    <p class="text-base font-semibold text-rose-600">{$page.status}</p>
    <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
      {$page.status === 404 ? 'Page not found' : 'Error'}
    </h1>
    <p class="mt-6 text-base leading-7 text-gray-600">
      {$page.error?.message || 'Sorry, we couldnt find the page youre looking for.'}
    </p>
    <div class="mt-10 flex items-center justify-center gap-x-6">
      <a href="/" class="rounded-md bg-rose-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-rose-600">
        Go back home
      </a>
    </div>
  </div>
</div>