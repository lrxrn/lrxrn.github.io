<script>
  import AsciiBackground from './components/AsciiBackground.svelte';
  import WAIU from './components/WAIU.svelte';
  import Hero from './sections/Hero.svelte';
  import Stack from './sections/Stack.svelte';
  import Work from './sections/Work.svelte';
  import Experience from './sections/Experience.svelte';
  import Education from './sections/Education.svelte';
  import Contact from './sections/Contact.svelte';
  import Footer from './sections/Footer.svelte';
</script>

<a class="skip" href="#main">Skip to content</a>
<AsciiBackground />
<WAIU />

<main id="main" tabindex="-1">
  <Hero />
  <Stack />
  <Work />
  <Experience />
  <Education />
  <Contact />
  <Footer />
</main>
