<script>
  import { onDestroy } from 'svelte';
  import { status } from '../stores/status.js';

  const STATUSES = { online: 'online', idle: 'idle', dnd: 'do not disturb', offline: 'offline' };
  let presence = $derived(STATUSES[$status] ? $status : null); // unknown values keep the plain dot

  const A = 'lrxrn', B = 'Meesum', RAMP = '.:-=+*#%@';
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let shown = $state(A);
  let target = A, raf = 0, timer = 0;

  // Letters lock left to right; unlocked slots flicker through an ASCII ramp.
  // Always restarts from whatever is on screen, so interrupting never jumps.
  function run(next) {
    target = next;
    cancelAnimationFrame(raf);
    if (reduced) { shown = next; return; }
    const t0 = performance.now(), n = Math.max(shown.length, next.length);
    let last = 0;
    const frame = now => {
      if (now - last >= 40 || now - t0 >= 520) {
        last = now;
        const p = Math.min((now - t0) / 520, 1), locked = Math.floor(p * (n + 1));
        let s = '';
        for (let i = 0; i < n; i++) s += i < locked ? (next[i] ?? '') : RAMP[(Math.random() * RAMP.length) | 0];
        shown = p >= 1 ? next : s;
        if (p >= 1) return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
  }

  // The box never changes size (see .sizer), so the pointer can't fall out of it mid-swap.
  // A short leave delay stops a graze of the edge from restarting the swap.
  const enter = () => { clearTimeout(timer); if (target !== B) run(B); };
  const leave = () => { clearTimeout(timer); timer = setTimeout(() => run(A), 120); };
  // Touch has no hover: each tap steps to the other name. The emulated enter/leave/focus around a tap are ignored.
  const touch = () => matchMedia('(hover: none)').matches;
  const hover = fn => () => { if (!touch()) fn(); };
  const tap = () => { if (touch()) run(target === A ? B : A); };

  onDestroy(() => { cancelAnimationFrame(raf); clearTimeout(timer); });
</script>

<!-- decorative hover swap; focus reveals the same swap for keyboard users -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions, a11y_click_events_have_key_events -->
<h1
  tabindex="0"
  aria-label="Meesum, also known as lrxrn{presence ? `. Discord status: ${STATUSES[presence]}` : ''}"
  onpointerenter={hover(enter)}
  onpointerleave={hover(leave)}
  onfocus={hover(enter)}
  onblur={hover(leave)}
  onclick={tap}
>
  <span class="word" aria-hidden="true">
    <span class="sizer">{B}.</span>
    <span class="live">{shown}{#if presence}<span class="status {presence}" title="Discord: {STATUSES[presence]}"></span>{:else}<span class="dot">.</span>{/if}</span>
  </span>
</h1>

<style>
  h1 { display: flex; width: fit-content; font-size: clamp(56px, 18vw, 120px); line-height: 1.05; letter-spacing: -.05em; font-weight: 600; cursor: default; white-space: nowrap; touch-action: manipulation; }
  @media (hover: none) { h1 { cursor: pointer; user-select: none; -webkit-user-select: none; -webkit-tap-highlight-color: transparent; } }
  .word { display: inline-grid; grid-template-columns: minmax(0, 1fr); }
  .sizer, .live { grid-area: 1 / 1; }
  .sizer { visibility: hidden; }
  .live { min-width: 0; overflow-x: clip; }
  .dot { color: var(--coral); }
  /* Discord's shapes, so the state reads without relying on colour; sized to sit like the full stop */
  .status { display: inline-block; position: relative; width: .2em; height: .2em; margin-left: .07em; border-radius: 50%; background: var(--online); }
  .idle { background: var(--idle); -webkit-mask: radial-gradient(circle at 25% 25%, transparent 36%, #000 38%); mask: radial-gradient(circle at 25% 25%, transparent 36%, #000 38%); }
  .dnd { background: var(--dnd); }
  .dnd::after { content: ""; position: absolute; inset: 39% 18%; border-radius: 999px; background: var(--bg); }
  .offline { background: transparent; border: .055em solid var(--offline); }
</style>
