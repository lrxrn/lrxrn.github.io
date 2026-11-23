<script>
  import { onMount } from 'svelte';
  import NameSwap from '../components/NameSwap.svelte';

  // "peek": lift the glass and fade the page so the sea can be played with (Esc to return)
  let peek = $state(false);
  $effect(() => { document.documentElement.classList.toggle('peek', peek); });
  onMount(() => {
    const esc = e => { if (e.key === 'Escape') peek = false; };
    addEventListener('keydown', esc);
    return () => { removeEventListener('keydown', esc); document.documentElement.classList.remove('peek'); };
  });
</script>

<header class="reveal" style="--i:0">
  <div class="top">
    <NameSwap />
    <button type="button" class="peekbtn" aria-pressed={peek} aria-label={peek ? 'Back to the page' : 'Peek into the sea'} title={peek ? 'Back (Esc)' : 'Peek into the sea'} onclick={() => (peek = !peek)}>
      {peek ? '×' : '≈'}
    </button>
  </div>
  <p>Software engineering student who builds tools people actually use.</p>
</header>

<style>
  .top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
  .peekbtn { all: unset; box-sizing: border-box; cursor: pointer; flex: none; width: 44px; height: 44px; margin-top: 8px; display: grid; place-items: center; border-radius: 50%; border: 1px solid var(--line); color: var(--muted); font: 20px/1 var(--mono);
    transition: transform 120ms var(--ease-out), color 120ms ease, border-color 120ms ease, background 120ms ease; }
  .peekbtn:hover { color: var(--violet); border-color: var(--violet); }
  .peekbtn:active { transform: scale(.97); }
  .peekbtn[aria-pressed='true'] { color: var(--on-violet); background: var(--violet); border-color: var(--violet); }
  .peekbtn:focus-visible { outline: 2px solid var(--violet); outline-offset: 2px; }
  p { font-size: clamp(19px, 4.6vw, 26px); line-height: 1.35; font-weight: 300; color: var(--muted); max-width: 30ch; margin-top: 24px; }
  @media (prefers-reduced-motion: reduce) { .peekbtn:active { transform: none; } }
</style>
