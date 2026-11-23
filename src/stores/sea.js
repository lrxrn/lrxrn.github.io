import { writable } from 'svelte/store';

// The running ocean (set by AsciiBackground) so the footer can add creatures on command.
export const sea = writable(null);
