<script>
  import { toggleTheme } from '../stores/theme.js';
  import { sea } from '../stores/sea.js';

  const MAX = 8; // extra creatures, so it stays a sea
  const kinds = [
    { kind: 'shark', color: 'var(--iris)' },
    { kind: 'manta', color: 'var(--teal)' },
    { kind: 'jellyfish', color: 'var(--coral)' },
    { kind: 'hammerhead', color: 'var(--violet)' },
  ];

  let extra = $state([]);
  let height = $state(0); // lets the activity pill sit above the docked footer
  $effect(() => document.documentElement.style.setProperty('--footer-h', `${height}px`));

  // native view transition crossfades the theme (cheap on phones); asciify pageDissolve cost 500ms+ long tasks at 4x CPU
  const flip = () => {
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return toggleTheme();
    document.startViewTransition(toggleTheme);
  };

  function add(kind) {
    if (!$sea || extra.length >= MAX) return;
    $sea.add(kind);
    extra = [...extra, kind];
  }
  function clear() {
    // remove() drops only the latest of a kind, so remove once per creature added (the defaults are older and stay)
    for (const k of extra) $sea?.remove(k);
    extra = [];
  }
</script>

<footer class="reveal" style="--i:6" bind:offsetHeight={height}>
  <details class="seabox">
    <summary>◠ sea</summary>
    <div class="chips" role="group" aria-label="Add to the background sea">
      {#each kinds as k}
        <button type="button" onclick={() => add(k.kind)} disabled={!$sea || extra.length >= MAX} style="--c:{k.color}">{k.kind}</button>
      {/each}
      {#if extra.length}<button type="button" class="clear" onclick={clear}>clear {extra.length}</button>{/if}
    </div>
  </details>
  <span>© {new Date().getFullYear()} lrxrn (Meesum Ahmed) · <a href="/privacy/">Privacy</a></span>
  <button class="theme" onclick={flip} aria-label="Toggle theme">◐</button>
</footer>

<style>
  footer { font: 13px var(--mono); color: var(--muted); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; }
  .seabox { flex: 1 1 100%; }
  summary { display: inline-block; list-style: none; cursor: pointer; padding: 10px 14px; margin-left: -14px; min-height: 44px; line-height: 24px; color: var(--muted); border-radius: 999px; transition: color 120ms ease; }
  summary::-webkit-details-marker { display: none; }
  summary:hover, .seabox[open] summary { color: var(--violet); }
  summary:focus-visible { outline: 2px solid var(--violet); }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 0 12px; animation: in 200ms var(--ease-out); }
  .chips button { all: unset; box-sizing: border-box; cursor: pointer; display: inline-flex; align-items: center; min-height: 28px; padding: 0 12px; border-radius: 999px; font: 12px var(--mono); color: var(--fg);
    border: 1px solid color-mix(in srgb, var(--c, var(--muted)) 45%, transparent); background: color-mix(in srgb, var(--c, transparent) 10%, transparent); transition: transform 120ms var(--ease-out), border-color 120ms ease; }
  .chips button:hover:not(:disabled) { border-color: var(--c, var(--violet)); }
  .chips button:active:not(:disabled) { transform: scale(.97); }
  .chips button:disabled { opacity: .4; cursor: default; }
  .chips button:focus-visible { outline: 2px solid var(--violet); outline-offset: 2px; }
  .chips .clear { --c: var(--muted); color: var(--muted); }
  .theme { all: unset; cursor: pointer; width: 44px; height: 44px; display: grid; place-items: center; margin: -12px; }
  .theme:focus-visible { outline: 2px solid var(--violet); }
  /* docked while peeking: sea and theme share a row, so the theme button never drops to its own line */
  :global(html.peek) .seabox { flex: 1; }
  :global(html.peek) footer > span { order: 1; flex-basis: 100%; }
  @media (prefers-reduced-motion: reduce) { .chips { animation: none; } .chips button:active:not(:disabled) { transform: none; } }
</style>
