<script>
  import HalftoneBackground from './components/HalftoneBackground.svelte';
  import Navigation from './components/Navigation.svelte';
  import Hero from './sections/Hero.svelte';
  import Projects from './sections/Projects.svelte';
  import Contact from './sections/Contact.svelte';
</script>

<HalftoneBackground />
<Navigation />

<main class="relative z-10">
  <Hero />
  <Projects />
  <Contact />
</main>
