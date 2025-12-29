import { writable } from 'svelte/store';

// Check for saved preference or system preference
function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark';
  
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export const theme = writable('dark');

// Initialize on client side
if (typeof window !== 'undefined') {
  theme.set(getInitialTheme());
  
  theme.subscribe(value => {
    localStorage.setItem('theme', value);
    document.documentElement.classList.toggle('light', value === 'light');
  });
}

export function toggleTheme() {
  theme.update(t => t === 'dark' ? 'light' : 'dark');
}
