<script module>
  import { kit } from '../lib/asciify.js';

  const ROAM = 15000, FADE = 900;
  let busy = false;

  // One foreground ocean holding one shark: it fades in, wanders the screen on its own, dissolves and is destroyed.
  export async function shark() {
    if (busy || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    busy = true;
    const el = document.createElement('div');
    let o;
    try {
      const { ocean } = await kit();
      el.className = 'shark';
      el.setAttribute('aria-hidden', 'true');
      document.body.append(el);
      o = ocean(el, {
        creatures: [{ kind: 'shark', size: .8 }], seed: Date.now() % 10000, speed: 1.6, depth: 0, interactive: false,
        palette: { shark: '--iris' },
      });
      if (!o.supported) return;
      await el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: FADE, fill: 'both' }).finished;
      await el.animate(
        [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(1.08)' }],
        { delay: ROAM, duration: FADE, easing: 'ease-out', fill: 'forwards' },
      ).finished;
    } catch {
      // no WebGL2 or the chunk failed: the page works without the shark
    } finally {
      o?.destroy();
      el.remove();
      busy = false;
    }
  }
</script>

<style>
  :global(.shark) { position: fixed; z-index: 10; inset: 0; pointer-events: none; }
</style>
