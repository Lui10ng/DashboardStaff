import { writable } from 'svelte/store';
import type { EventData } from '$lib/types/event';

const initialFormData: EventData = {
  eventName: '',
  subdomain: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  location: '',
  description: '',
  companyLogo: null,
  poster: null,
  backgroundImage: null
};

export const eventFormStore = writable(initialFormData);