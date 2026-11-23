<script>
  import SectionTitle from '../components/SectionTitle.svelte';
  import stack from '../data/stack.json';
</script>

<section class="reveal" style="--i:1">
  <SectionTitle>Stack</SectionTitle>
  {#each stack as group}
    <div class="stack">
      <span class="k">{group.name}</span>
      <ul>
        {#each group.items as item}<li style="--c:{item.color || '#888'}">{item.name}</li>{/each}
      </ul>
    </div>
  {/each}
</section>

<style>
  .stack { display: grid; grid-template-columns: 96px 1fr; gap: 12px; padding: 12px 0; }
  .k { font: 13px/2 var(--mono); color: var(--muted); }
  ul { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
  li { font-size: 13px; line-height: 1; padding: 8px 12px; border-radius: 999px; color: color-mix(in srgb, var(--c) 55%, var(--fg));
    background: color-mix(in srgb, var(--c) 14%, transparent); border: 1px solid color-mix(in srgb, var(--c) 38%, transparent); }
  @media (max-width: 640px) { .stack { grid-template-columns: 1fr; gap: 4px; } }
</style>
