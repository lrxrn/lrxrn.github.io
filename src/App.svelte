<script>
  import HalftoneBackground from './components/HalftoneBackground.svelte';
  import Navigation from './components/Navigation.svelte';
  import NowPlaying from './components/NowPlaying.svelte';
  import Hero from './sections/Hero.svelte';
  import Projects from './sections/Projects.svelte';
  import Contact from './sections/Contact.svelte';
</script>

<HalftoneBackground />
<Navigation />
<NowPlaying />

<main class="relative z-10">
  <Hero />
  <Projects />
  <Contact />
</main>
