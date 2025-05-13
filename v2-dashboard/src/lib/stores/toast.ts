import { writable } from 'svelte/store';

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

function createToastStore() {
  const { subscribe, set } = writable<ToastMessage | null>(null);

  return {
    subscribe,
    show: (toast: ToastMessage) => {
      set(toast);
      if (toast.duration !== 0) {
        setTimeout(() => {
          set(null);
        }, toast.duration || 3000);
      }
    },
    hide: () => set(null)
  };
}

export const toast = createToastStore(); 