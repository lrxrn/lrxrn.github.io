<script>
  import { onMount } from 'svelte';
  import SectionTitle from '../components/SectionTitle.svelte';
  import { kit } from '../lib/asciify.js';

  // shown as me(at)lrxrn.dev; the real address is only assembled in the browser (mailto and copy)
  const email = ['me', 'lrxrn.dev'].join('@');
  const shown = 'me(at)lrxrn.dev';
  let btn, copied = $state(false), timer;

  onMount(() => {
    let b, dead = false;
    kit().then(({ beam }) => { if (!dead) b = beam(btn, { palette: 'mono', mode: 'pulse' }); }).catch(() => {});
    return () => { dead = true; clearTimeout(timer); b?.destroy(); };
  });

  async function copy() {
    try { await navigator.clipboard.writeText(email); } catch { return; }
    copied = true;
    clearTimeout(timer);
    timer = setTimeout(() => { copied = false; }, 1600);
  }
</script>

<section class="reveal" style="--i:5">
  <SectionTitle>Contact</SectionTitle>
  <p class="lede"><span class="dot" aria-hidden="true"></span>Open to stuff. Collabs, good ideas, say hi.</p>
  <div class="actions">
    <a class="btn" href="mailto:{email}" bind:this={btn}>{shown}</a>
    <button class="copy" type="button" onclick={copy}>{copied ? 'Copied' : 'Copy'}</button>
    <span class="sr" aria-live="polite">{copied ? 'Email copied' : ''}</span>
  </div>
  <p class="elsewhere">
    <a class="tip" data-tip="lrxrn" aria-label="GitHub, lrxrn" href="https://github.com/lrxrn">GitHub</a> ·
    <a class="tip" data-tip="meesum-ahmed" aria-label="LinkedIn, meesum-ahmed" href="https://linkedin.com/in/meesum-ahmed">LinkedIn</a> ·
    <a class="tip" data-tip="m13kx" aria-label="Discord, m13kx" href="https://discord.com/users/375599041284669452">Discord</a>
  </p>
</section>

<style>
  .lede { font-size: 17px; margin-bottom: 24px; max-width: 34ch; }
  .dot { display: inline-block; width: 8px; height: 8px; margin-right: 10px; border-radius: 50%; background: var(--coral); vertical-align: 1px; }
  .actions { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
  .btn { position: relative; display: inline-flex; align-items: center; min-height: 48px; padding: 0 24px; border-radius: 999px; background: var(--violet); color: var(--on-violet); font-weight: 600; font-size: 15px; text-decoration: none; overflow-wrap: anywhere; transition: transform 120ms var(--ease-out); }
  .btn:hover { color: var(--on-violet); } .btn:active, .copy:active { transform: scale(.97); }
  .copy { min-height: 48px; min-width: 88px; padding: 0 20px; border-radius: 999px; border: 1px solid var(--line); background: transparent; color: var(--fg); font: 500 15px var(--sans); cursor: pointer; transition: transform 120ms var(--ease-out), border-color 120ms ease; }
  .copy:hover { border-color: var(--violet); }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  .elsewhere { margin-top: 24px; font-size: 15px; color: var(--muted); }
  /* username tooltip on hover or keyboard focus */
  .tip { position: relative; }
  .tip::after { content: attr(data-tip); position: absolute; left: 50%; bottom: calc(100% + 8px); transform: translateX(-50%) scale(.97); transform-origin: bottom center; white-space: nowrap; pointer-events: none; opacity: 0;
    padding: 4px 10px; border-radius: 999px; font: 12px var(--mono); color: var(--fg); background: var(--surface); border: 1px solid var(--line); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); transition: opacity 125ms var(--ease-out), transform 125ms var(--ease-out); }
  .tip:focus-visible::after { opacity: 1; transform: translateX(-50%); }
  @media (hover: hover) and (pointer: fine) { .tip:hover::after { opacity: 1; transform: translateX(-50%); } }
  @media (prefers-reduced-motion: reduce) { .tip::after { transition: opacity 125ms; transform: translateX(-50%); } }
  @media (max-width: 640px) { .btn { flex: 1 1 100%; justify-content: center; padding: 10px 20px; } .copy { flex: 1 1 100%; } }
  @media (prefers-reduced-motion: reduce) { .btn, .copy { transform: none !important; } }
</style>
