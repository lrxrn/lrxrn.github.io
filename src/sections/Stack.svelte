<script>
  import SectionTitle from '../components/SectionTitle.svelte';
  import stack from '../data/stack.json';

  // a new order on every load
  const shuffle = items => items.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(p => p[1]);
  const groups = stack.map(g => ({ ...g, items: shuffle(g.items) }));

  const TWO_ROWS = 70; // two 31px pills and the 8px gap; keep in step with .clip
  let heights = $state([]);
  let open = $state([]);
</script>

<section class="reveal" style="--i:1">
  <SectionTitle>Stack</SectionTitle>
  {#each groups as group, i}
    <div class="stack">
      <span class="k">{group.name}</span>
      <div>
        <!-- clipped, not removed: every pill stays readable to screen readers and search -->
        <div class="clip" class:open={open[i]} id="stack-{i}">
          <ul bind:offsetHeight={heights[i]}>
            {#each group.items as item}<li style="--c:{item.color || '#888'}">{item.name}</li>{/each}
          </ul>
        </div>
        {#if heights[i] > TWO_ROWS}
          <button type="button" aria-expanded={!!open[i]} aria-controls="stack-{i}" aria-label="{open[i] ? 'Show fewer' : 'Show all'} {group.name}" onclick={() => (open[i] = !open[i])}>{open[i] ? 'less' : 'show all'}</button>
        {/if}
      </div>
    </div>
  {/each}
</section>

<style>
  .stack { display: grid; grid-template-columns: 96px 1fr; gap: 12px; padding: 12px 0; }
  .k { font: 13px/2 var(--mono); color: var(--muted); }
  .clip { max-height: 70px; overflow: hidden; }
  .clip.open { max-height: none; }
  button { all: unset; cursor: pointer; display: inline-flex; align-items: center; min-height: 44px; font: 12px var(--mono); color: var(--muted); }
  button:hover { color: var(--violet); }
  button:focus-visible { outline: 2px solid var(--violet); outline-offset: 2px; }
  @media print { .clip { max-height: none; } button { display: none; } }
  ul { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
  li { font-size: 13px; line-height: 1; padding: 8px 12px; border-radius: 999px; color: color-mix(in srgb, var(--c) 55%, var(--fg));
    background: color-mix(in srgb, var(--c) 14%, transparent); border: 1px solid color-mix(in srgb, var(--c) 38%, transparent); }
  @media (max-width: 640px) { .stack { grid-template-columns: 1fr; gap: 4px; } }
</style>
