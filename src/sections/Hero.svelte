<script>
  import { onMount } from 'svelte';
  import Nudge from '../components/Nudge.svelte';
  import NameSwap from '../components/NameSwap.svelte';
  import { shark } from '../components/Shark.svelte';

  // "peek": lift the glass and fade the page so the sea can be played with (Esc to return)
  let peek = $state(false);
  let found = $state(false); // once they've used the button, stop nudging
  $effect(() => { document.documentElement.classList.toggle('peek', peek); });
  onMount(() => {
    const esc = e => { if (e.key === 'Escape') peek = false; };
    addEventListener('keydown', esc);
    return () => { removeEventListener('keydown', esc); document.documentElement.classList.remove('peek'); };
  });
</script>

<!-- drop .reveal once it has played: its filled transform would trap the floating button inside the header -->
<header class="reveal" style="--i:0" onanimationend={e => e.currentTarget.classList.remove('reveal')}>
  <div class="top">
    <NameSwap />
    <div class="peekwrap">
      {#if !found}<Nudge />{/if}
      <button type="button" class="peekbtn" aria-pressed={peek} aria-label={peek ? 'Back to the page' : 'Peek into the sea'} title={peek ? 'Back (Esc)' : 'Peek into the sea'} onclick={() => { peek = !peek; found = true; }}>
        {peek ? '×' : '≈'}
      </button>
    </div>
  </div>
  <!-- keyboard activation has detail 0 and is left still: never animate keyboard actions -->
  <p><button type="button" class="fish" onpointerenter={e => e.pointerType === 'mouse' && shark()} onclick={e => e.detail && shark()}>Fish</button> go blub blub.</p>
</header>

<style>
  .top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
  .peekwrap { position: relative; flex: none; }
  .peekbtn { all: unset; box-sizing: border-box; cursor: pointer; flex: none; width: 44px; height: 44px; margin-top: 8px; display: grid; place-items: center; border-radius: 50%; border: 1px solid var(--line); color: var(--muted); font: 20px/1 var(--mono);
    transition: transform 120ms var(--ease-out), color 120ms ease, border-color 120ms ease, background 120ms ease; }
  .peekbtn:hover { color: var(--violet); border-color: var(--violet); }
  .peekbtn:active { transform: scale(.97); }
  .peekbtn[aria-pressed='true'] { color: var(--on-violet); background: var(--violet); border-color: var(--violet); }
  .peekbtn:focus-visible { outline: 2px solid var(--violet); outline-offset: 2px; }
  /* while peeking the way back floats in the corner and stays put on scroll */
  .peekbtn[aria-pressed='true'] { position: fixed; z-index: 15; right: 20px; bottom: calc(20px + env(safe-area-inset-bottom)); }
  p { font-size: clamp(19px, 4.6vw, 26px); line-height: 1.35; font-weight: 300; color: var(--muted); max-width: 30ch; margin-top: 24px; }
  .fish { all: unset; cursor: pointer; display: inline-block; padding: 8px 4px; margin: -8px -4px; text-decoration: underline dotted var(--violet); text-underline-offset: 5px; touch-action: manipulation; }
  .fish:focus-visible { outline: 2px solid var(--violet); }
  @media (prefers-reduced-motion: reduce) { .peekbtn:active { transform: none; } }
</style>
