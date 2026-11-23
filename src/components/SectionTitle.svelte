<script>
  import { onMount } from 'svelte';
  import { kit } from '../lib/asciify.js';

  let { children } = $props();
  let el;

  onMount(() => {
    let d, dead = false;
    kit().then(({ decode }) => { if (!dead) d = decode(el, { trigger: 'scroll', settle: 'text' }); }).catch(() => {});
    return () => { dead = true; d?.destroy(); };
  });
</script>

<h2 bind:this={el}>{@render children()}</h2>

<style>
  h2 { display: block; width: fit-content; font-size: clamp(28px, 6.4vw, 36px); line-height: 1.15; letter-spacing: -.03em; font-weight: 600; color: var(--violet); margin-bottom: 20px; }
</style>
