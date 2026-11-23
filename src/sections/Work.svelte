<script>
  import SectionTitle from '../components/SectionTitle.svelte';
  import projects from '../data/projects.json';

  const list = projects.filter(p => !p.hidden);
  // 3 random picks from the `featured` pool on every load; everything else sits under "All"
  const pool = list.filter(p => p.featured);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const featured = pool.slice(0, 3);
  const rest = list.filter(p => !featured.includes(p));
  const tip = p => p.share ? `${p.share}% of ${p.contributors} contributor${p.contributors === '1' ? '' : 's'}` : undefined;
  // Round down and add "+": 854 -> "850+", 123 -> "100+", 85 -> "80+", 16 -> "15+"; under 10 stays exact.
  const count = n => {
    const step = n >= 100 ? 50 : n >= 20 ? 10 : n >= 10 ? 5 : 0;
    return step ? `${Math.floor(n / step) * step}+` : `${n}`;
  };
</script>

{#snippet row(p, small)}
  <svelte:element this={p.url ? 'a' : 'div'} class="row" href={p.url} title={tip(p)}>
    {#if small}
      <b>{p.name}</b><span>{p.line}</span>
    {:else}
      <div><b>{p.name}</b><span>{p.line}</span></div>
    {/if}
    <i>{#if p.commits}{count(p.commits)} commits{/if}{#if p.url}{' '}<em class="arrow">→</em>{/if}</i>
  </svelte:element>
{/snippet}

<section class="reveal" style="--i:2">
  <SectionTitle>Work</SectionTitle>
  {#each featured as p}{@render row(p, false)}{/each}
  {#if rest.length}
    <details>
      <summary>All {list.length} projects</summary>
      {#each rest as p}{@render row(p, true)}{/each}
    </details>
  {/if}
</section>

<style>
  em { font-style: normal; }
  summary { font: 13px/44px var(--mono); color: var(--muted); cursor: pointer; list-style: none; border-top: 1px solid var(--line); }
  summary:hover { color: var(--violet); }
  summary::-webkit-details-marker { display: none; }
  summary::before { content: "+ "; } details[open] summary::before { content: "− "; }
  details :global(.row) { display: grid; grid-template-columns: 8.5rem 1fr auto; gap: 12px; padding: 8px 0; min-height: 0; }
  details :global(.row b) { font: 400 13px var(--mono); overflow-wrap: anywhere; }
  @media (max-width: 640px) {
    details :global(.row) { grid-template-columns: 1fr auto; }
    details :global(.row span) { grid-column: 1 / -1; order: 3; }
    details :global(.row i) { width: auto; order: 0; }
  }
</style>
