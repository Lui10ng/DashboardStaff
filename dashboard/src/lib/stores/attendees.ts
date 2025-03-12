import { writable, derived } from 'svelte/store';
import type { Attendee, FilterType } from '../types/attendee';


const initialAttendees: Attendee[] = [
    { id: "1", name: "John Doe", date: "Feb 17, 2024", time: "1:23 PM", status: "IN" },
    { id: "2", name: "Jane Smith", date: "Feb 17, 2024", time: "1:24 PM", status: "OUT" },
    // { id: "3", name: "John Smith", date: "Feb 17, 2024", time: "1:23 PM", status: "IN" },
    // { id: "4", name: "John Dong", date: "Feb 17, 2024", time: "1:23 PM", status: "IN" },
    // { id: "5", name: "John Shsh", date: "Feb 17, 2024", time: "1:23 PM", status: "IN" },
    // { id: "6", name: "John Ming", date: "Feb 17, 2024", time: "1:23 PM", status: "IN" },
    // { id: "7", name: "John Koy", date: "Feb 17, 2024", time: "1:23 PM", status: "IN" },
    // { id: "8", name: "John Tong", date: "Feb 17, 2024", time: "1:23 PM", status: "OUT" },
    // { id: "9", name: "Adam Doe", date: "Feb 17, 2024", time: "1:23 PM", status: "OUT" },
    // { id: "10", name: "Plong Doe", date: "Feb 17, 2024", time: "1:23 PM", status: "OUT" },
    // { id: "11", name: "Jannes Smith", date: "Feb 17, 2024", time: "1:24 PM", status: "IN" },
    // { id: "12", name: "Jie Doe", date: "Feb 17, 2024", time: "1:23 PM", status: "IN" },
    // { id: "13", name: "Alice Johnson", date: "Feb 17, 2024", time: "1:25 PM", status: "IN" },
    // { id: "14", name: "Bob Wilson", date: "Feb 17, 2024", time: "1:26 PM", status: "IN" },
    // { id: "15", name: "Carol Brown", date: "Feb 17, 2024", time: "1:27 PM", status: "IN" },
    // { id: "16", name: "David Miller", date: "Feb 17, 2024", time: "1:28 PM", status: "IN" },
    // { id: "17", name: "You Miller", date: "Feb 17, 2024", time: "1:28 PM", status: "IN" }

];


export const attendees = writable<Attendee[]>(initialAttendees);
export const currentPage = writable(1);
export const selectedFilter = writable('IN'); 
export const searchQuery = writable('');
export const isCheckingIn = writable(true);  
export const selectedAttendee = writable<Attendee | null>(null);
export const showAttendeeModal = writable(false); 

export const itemsPerPage = writable(5); 

export const filteredAttendees = derived(
    [attendees, selectedFilter, searchQuery],
    ([$attendees, $filter, $search]) => {
        return $attendees.filter(attendee => {
            const matchesFilter = attendee.status === $filter;
            const matchesSearch = attendee.name.toLowerCase().includes($search.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }
);

export const totalPages = derived(
    [filteredAttendees, itemsPerPage],
    ([$filtered, $perPage]) => Math.max(1, Math.ceil($filtered.length / $perPage))
);