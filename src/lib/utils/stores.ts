import { persist, createLocalStorage } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';

export const logged_in = writable('');
export const edit_mode = persist(writable(false), createLocalStorage(), 'edit_mode');
