import { writable } from 'svelte/store';

export const logged_in = writable('');
export const edit_mode = writable(false);
