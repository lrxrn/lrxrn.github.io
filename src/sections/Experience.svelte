<script>
  import SectionTitle from '../components/SectionTitle.svelte';
  import jobs from '../data/experience.json';
  import { months, fmt, label } from '../lib/duration.js';

  const orgs = [...new Set(jobs.map(j => j.org))];
  // org total: earliest start to latest end (or now while any role is current)
  const span = org => {
    const mine = jobs.filter(j => j.org === org);
    const end = mine.some(j => !j.end) ? new Date() : mine.map(j => j.end).sort().at(-1);
    return fmt(months(mine.map(j => j.start).sort()[0], end));
  };
</script>

<section class="reveal" style="--i:3">
  <SectionTitle>Experience</SectionTitle>
  {#each orgs as org}
    <p class="org">{org} · {span(org)}</p>
    {#each jobs.filter(j => j.org === org) as j}
      <div class="row">
        <div><b>{j.role}</b><span>{j.type}</span></div>
        <i>
          {label(j.start)} – {#if j.end}{label(j.end)}{:else}<em class="badge on">Present</em>{/if}
          <small>{fmt(months(j.start, j.end ?? new Date()))}</small>
        </i>
      </div>
    {/each}
  {/each}
</section>

<style>
  em { font-style: normal; }
</style>
