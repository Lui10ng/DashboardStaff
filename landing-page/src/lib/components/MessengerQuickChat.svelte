<script>
    export let fbMessengerUrl;
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<a
    href={fbMessengerUrl}
    target="_blank"
    rel="noopener noreferrer"
    class="fixed bottom-4 right-4 bg-white p-2 rounded-full shadow-lg transition duration-300 flex items-center justify-center w-16 h-16 hover:bg-blue-600 hover:scale-110 z-40"
>
    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 48 48">
        <radialGradient id="gradient" cx="11.087" cy="7.022" r="47.612" gradientTransform="matrix(1 0 0 -1 0 50)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#1292ff"></stop>
            <stop offset=".079" stop-color="#2982ff"></stop>
            <stop offset=".23" stop-color="#4e69ff"></stop>
            <stop offset=".351" stop-color="#6559ff"></stop>
            <stop offset=".428" stop-color="#6d53ff"></stop>
            <stop offset=".754" stop-color="#df47aa"></stop>
            <stop offset=".946" stop-color="#ff6257"></stop>
        </radialGradient>
        <path fill="url(#gradient)" d="M44,23.5C44,34.27,35.05,43,24,43c-1.651,0-3.25-0.194-4.784-0.564c-0.465-0.112-0.951-0.069-1.379,0.145L13.46,44.77C12.33,45.335,11,44.513,11,43.249v-4.025c0-0.575-0.257-1.111-0.681-1.499C6.425,34.165,4,29.11,4,23.5C4,12.73,12.95,4,24,4S44,12.73,44,23.5z"></path>
        <path d="M34.992,17.292c-0.428,0-0.843,0.142-1.2,0.411l-5.694,4.215c-0.133,0.1-0.28,0.15-0.435,0.15c-0.15,0-0.291-0.047-0.41-0.136l-3.972-2.99c-0.808-0.601-1.76-0.918-2.757-0.918c-1.576,0-3.025,0.791-3.876,2.116l-1.211,1.891l-4.12,6.695c-0.392,0.614-0.422,1.372-0.071,2.014c0.358,0.654,1.034,1.06,1.764,1.06c0.428,0,0.843-0.142,1.2-0.411l5.694-4.215c0.133-0.1,0.28-0.15,0.435-0.15c0.15,0,0.291,0.047,0.41,0.136l3.972,2.99c0.809,0.602,1.76,0.918,2.757,0.918c1.576,0,3.025-0.791,3.876-2.116l1.211-1.891l4.12-6.695c0.392-0.614,0.422-1.372,0.071-2.014C36.398,17.698,35.722,17.292,34.992,17.292L34.992,17.292z" opacity=".05"></path>
        <path fill="#fff" d="M34.394,18.501l-5.7,4.22c-0.61,0.46-1.44,0.46-2.04,0.01L22.68,19.74c-1.68-1.25-4.06-0.82-5.19,0.94l-1.21,1.89l-4.11,6.68c-0.6,0.94,0.55,2.01,1.44,1.34l5.7-4.22c0.61-0.46,1.44-0.46,2.04-0.01l3.974,2.991c1.68,1.25,4.06,0.82,5.19-0.94l1.21-1.89l4.11-6.68C36.434,18.901,35.284,17.831,34.394,18.501z"></path>
    </svg>
</a>
