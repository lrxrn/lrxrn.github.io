<script>
  import { onMount } from 'svelte';
  import { kit } from '../lib/asciify.js';
  import { sea } from '../stores/sea.js';

  let el;

  onMount(() => {
    let o, dead = false;
    kit().then(({ ocean }) => {
      if (dead) return;
      o = ocean(el, {
        // one shark, one manta, one jellyfish and two small schools; more can be added from the footer
        creatures: [
          { kind: 'shark' }, { kind: 'manta' }, { kind: 'jellyfish', count: 1 },
          { kind: 'school', count: 22 }, { kind: 'school', count: 16, size: 0.8 },
        ],
        // one ink per kind, from the palette tokens
        palette: { fish: '--ascii-ink', school: '--ascii-ink', jellyfish: '--coral', shark: '--iris', hammerhead: '--violet', manta: '--teal' },
        ink: '--ascii-ink',
        depth: 0.8,
        label: 'A quiet sea of fish',
      });
      sea.set(o);
    }).catch(() => {});
    return () => { dead = true; sea.set(null); o?.destroy(); };
  });
</script>

<div bind:this={el} aria-hidden="true"></div>

<style>
  /* receives the pointer so the fish react; content above it opts back in (see global.css) */
  div { position: fixed; inset: 0; opacity: var(--sea-opacity); }
</style>
