<script>
  import { onMount } from 'svelte';

  const MESSAGES = [
    'psst, peek into the sea',
    'the fish are shy. say hi',
    'blub? (that means press me)',
    'clear water this way',
    'something swims behind the text',
    'lift the glass, I dare you',
    'dive in, the water is fine',
  ];
  const between = (a, b) => (a + Math.random() * (b - a)) * 1000;

  let text = $state(MESSAGES[0]);
  let on = $state(false);

  // Waits a random while, shows the next message for a random while, repeats.
  onMount(() => {
    let i = 0, timer;
    const wait = (s) => { timer = setTimeout(show, s); };
    function show() {
      const r = anchor.getBoundingClientRect();
      // skip the turn if nobody could see it
      if (document.hidden || r.bottom < 0 || r.top > innerHeight) return wait(between(5, 10));
      text = MESSAGES[i++ % MESSAGES.length];
      on = true;
      timer = setTimeout(() => { on = false; wait(between(18, 45)); }, between(4, 7));
    }
    wait(between(6, 14));
    return () => clearTimeout(timer);
  });

  let anchor;
</script>

<!-- decorative: the button it points at already has a name -->
<span bind:this={anchor} class:on aria-hidden="true">{text}</span>

<style>
  span { position: absolute; right: 0; bottom: calc(100% + 2px); width: max-content; padding: 6px 12px; border-radius: 999px; background: var(--violet); color: var(--on-violet); font: 12px/1.4 var(--mono); pointer-events: none;
    opacity: 0; transform: translateY(4px); transition: opacity 200ms var(--ease-out), transform 200ms var(--ease-out); }
  span::after { content: ""; position: absolute; top: 100%; right: 17px; border: 5px solid transparent; border-top-color: var(--violet); }
  span.on { opacity: 1; transform: none; }
  @media (prefers-reduced-motion: reduce) { span { transform: none; } }
</style>
