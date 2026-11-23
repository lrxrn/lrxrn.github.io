<script>
  import SectionTitle from '../components/SectionTitle.svelte';
  import education from '../data/education.json';

  const year = new Date().getFullYear();
</script>

<section class="reveal" style="--i:4">
  <SectionTitle>Education</SectionTitle>
  {#each education as e}
    <div class="row">
      <div>
        <b>{e.degree}{#if e.active} <em class="badge on">Year {year - e.start + 1}</em>{/if}</b>
        <span>{e.school}</span>
      </div>
      <i>{e.start} – {e.end}<small>{e.end - e.start} yrs</small></i>
    </div>
  {/each}
</section>

<style>
  em { font-style: normal; }
</style>
