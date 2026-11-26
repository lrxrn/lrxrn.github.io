import { writable } from 'svelte/store';

// Discord presence (set by WAIU, which owns the socket) shown after the name; null until known.
export const status = writable(null);
