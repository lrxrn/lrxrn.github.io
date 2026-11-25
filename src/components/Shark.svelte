<script module>
  import { kit } from '../lib/asciify.js';

  // SEED puts the lone shark mid-box facing about HEADING (degrees) mid-flight, so the box can be steered along it.
  // shortcut: SEED depends on the kit's spawn order (found against 4.33.0); re-pick it if the shark enters off centre after an upgrade.
  const SEED = 1016, HEADING = 14, DIR = 20, MS = 2400;
  let busy = false;

  // One foreground ocean holding one shark: it rises out of the deep, grows and swims off screen, then is destroyed.
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
        creatures: [{ kind: 'shark', size: .8 }], seed: SEED, depth: 0, edges: 'wrap', interactive: false,
        palette: { shark: '--iris' },
      });
      if (!o.supported) return;
      const a = DIR * Math.PI / 180;
      const at = (d, s) => `translate(${d * Math.cos(a)}vmax, ${d * Math.sin(a)}vmax) rotate(${DIR - HEADING}deg) scale(${s})`;
      await el.animate(
        [{ transform: at(-75, .3), opacity: 0 }, { opacity: 1, offset: .2 }, { transform: at(115, 1.35), opacity: 1 }],
        { duration: MS, easing: 'linear', fill: 'both' },
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
  /* the mask only fades out the empty cells' hairline grid so the box has no visible edge */
  :global(.shark) { position: fixed; z-index: 10; width: 120vmax; height: 120vmax; left: calc(50vw - 60vmax); top: calc(50vh - 60vmax); pointer-events: none;
    -webkit-mask-image: radial-gradient(closest-side, #000 55%, transparent); mask-image: radial-gradient(closest-side, #000 55%, transparent); }
</style>
