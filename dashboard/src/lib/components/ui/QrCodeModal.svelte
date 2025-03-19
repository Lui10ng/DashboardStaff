<script lang="ts">
    export let isOpen: boolean = false;
    export let guest: { email: string } | null = null;
    export let onClose: () => void;
    export let onResend: () => void;

    // Track click counts and timestamps for rate limiting
    let clickCounter = 0;
    let lastClickTime = 0;
    const CLICK_THRESHOLD = 3; // Show warning after 3 clicks
    const RESET_TIMEOUT = 5000; // Reset counter after 5 seconds
    
    // Track time for timeout detection
    let requestStartTime = 0;
    const TIMEOUT_THRESHOLD = 5000; // 1 second timeout

    // Function to show toast notifications
    function showToast(type: 'invalid-email' | 'too-many-request' | 'time-out' | 'success') {
        // Create toast container if it doesn't exist
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'fixed top-25 left-1/2 transform -translate-x-1/2 flex flex-col gap-2 z-50';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        
        // Base toast styling
        toast.className = 'flex items-center gap-3 px-4 py-2 rounded-md bg-white text-black shadow-md text-sm transition-all duration-300';
        
        // Set icon and message based on type
        let icon = '';
        let message = '';
        
        switch(type) {
            case 'invalid-email':
                icon = '<i class="ri-mail-close-line text-2xl"></i>';
                message = 'Invalid Email Address';
                break;
            case 'too-many-request':
                icon = '<i class="ri-mail-close-line text-2xl"></i>';
                message = 'Too Many Request';
                break;
            case 'time-out':
                icon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7.774 5.215L6.326 3.767A9.995 9.995 0 0 1 20.23 17.67l-1.445-1.445a7.99 7.99 0 0 0-11.01-11.01m12.588 15.149l-1.279 1.279l-1.413-1.414A9.995 9.995 0 0 1 3.768 6.327l-1.41-1.41l1.278-1.28l1.29 1.292l1.417 1.413L11 11.002V7h1.5v5.25l4.5 2.67l-.75 1.23l-.254-.152Zm-4.136-1.58l-5.793-5.792l-5.218-5.218a7.99 7.99 0 0 0 11.01 11.01"/></svg>';
                message = 'Time Out';
                break;
            case 'success':
                icon = '<i class="ri-mail-check-line text-2xl"></i>';
                message = 'QR Code Successfully Sent';
                break;
        }
        
        // Set toast content with icon and message
        const iconSpan = document.createElement('span');
        iconSpan.className = 'flex-shrink-0';
        iconSpan.innerHTML = icon;
        
        const messageSpan = document.createElement('span');
        messageSpan.textContent = message;
        
        toast.appendChild(iconSpan);
        toast.appendChild(messageSpan);
        toastContainer.appendChild(toast);
        
        // Automatically remove toast after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
                // Remove container if empty
                if (toastContainer.childNodes.length === 0) {
                    document.body.removeChild(toastContainer);
                }
            }, 300);
        }, 3000);
    }

    // Function to validate email
    function isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Function to handle resend with validation and rate limiting
    function handleResend() {
        const now = Date.now();
        
        // 1. Check for invalid email
        if (!guest || !guest.email || !isValidEmail(guest.email)) {
            showToast('invalid-email');
            return;
        }
        
        // 2. Check for too many requests
        // Reset counter if enough time has passed
        if (now - lastClickTime > RESET_TIMEOUT) {
            clickCounter = 0;
        }
        lastClickTime = now;
        clickCounter++;
        
        if (clickCounter >= CLICK_THRESHOLD) {
            showToast('too-many-request');
            return;
        }
        
        // 3. Close the modal immediately for better UX
        onClose();
        
        // 4. Start the resend process in the background
        onResend();
        
        // Show a "sending" toast immediately
        showToast('success');
        
        requestStartTime = now;
        
        // Set timeout detection in background
        const timeoutId = setTimeout(() => {
            showToast('time-out');
        }, TIMEOUT_THRESHOLD);
        
        // Simulate API call in background
        const mockApiCall = new Promise<void>((resolve, reject) => {
            // Simulate server response time (1-6 seconds)
            const responseTime = Math.random() * 6000 + 1000;
            
            setTimeout(() => {
                // 80% chance of success, 20% chance of failure
                if (Math.random() > 0.2) {
                    resolve();
                } else {
                    reject(new Error("API call failed"));
                }
            }, responseTime);
        });
        
        // Handle the API call result
        mockApiCall
            .then(() => {
                clearTimeout(timeoutId);
                // Success toast is already shown immediately after clicking
            })
            .catch((err) => {
                clearTimeout(timeoutId);
                // If it's not a timeout, show a different error
                if (Date.now() - requestStartTime < TIMEOUT_THRESHOLD) {
                    console.error("Request failed:", err);
                    // You could show a different error toast here
                }
                // If it's a timeout, the timeout handler will show the toast
            });
    }
</script>

{#if isOpen}
    <div 
        class="fixed inset-0 bg-opacity-30 backdrop-blur-[2.8px] flex items-center justify-center p-4 sm:p-6 z-50 modal-overlay"
        on:click={(e) => { if (e.target.classList.contains('modal-overlay')) onClose(); }}
    >
        <div 
            class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-[95%] sm:max-w-md lg:max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
        >
            <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center sm:text-left">
                Resend QR Code
            </h2>
            <p class="text-gray-600 mb-6 text-sm sm:text-base text-center sm:text-left break-words">
                Are you sure you want to resend a new QR code to <span class="font-semibold">{guest?.email}</span>?
            </p>
            <div class="flex flex-row justify-end gap-4">
                <button 
                    class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:text-red-500 hover:border-red-500 transition-colors text-sm sm:text-base w-full sm:w-auto"
                    on:click={onClose}
                >
                    Cancel
                </button>
                <button 
                    class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:text-red-500 hover:border-red-500 transition-colors text-sm sm:text-base w-full sm:w-auto"
                    on:click={handleResend}
                >
                    Yes, Resend
                </button>
            </div>
        </div>
    </div>
{/if}