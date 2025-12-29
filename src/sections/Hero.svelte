<script>
  import { onMount } from 'svelte';
  import { theme } from '../stores/theme.js';
  
  let isVisible = false;
  let nameAnimated = false;
  let currentName = 'MEESUM';
  let displayText = 'MEESUM';
  let isAnimating = false;
  let nameIndex = 0;
  let autoScrollInterval;
  let currentTheme = 'dark';
  
  theme.subscribe(value => {
    currentTheme = value;
  });
  
  const names = ['MEESUM', 'MIKKO', 'MEEKO', 'LRXRN'];
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Tech stack with theme-aware colors
  const techStackInitial = [
    { name: 'JavaScript', dark: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40', light: 'bg-yellow-100 text-yellow-700 border-yellow-400' },
    { name: 'Git', dark: 'bg-rose-500/20 text-rose-300 border-rose-500/40', light: 'bg-rose-100 text-rose-700 border-rose-300' },
    { name: 'Java', dark: 'bg-amber-500/20 text-amber-300 border-amber-500/40', light: 'bg-amber-100 text-amber-700 border-amber-300' },
    { name: 'HTML', dark: 'bg-orange-600/20 text-orange-300 border-orange-600/40', light: 'bg-orange-100 text-orange-700 border-orange-300' },
    { name: 'TypeScript', dark: 'bg-blue-500/20 text-blue-300 border-blue-500/40', light: 'bg-blue-100 text-blue-700 border-blue-300' },
    { name: 'C++', dark: 'bg-purple-500/20 text-purple-300 border-purple-500/40', light: 'bg-purple-100 text-purple-700 border-purple-300' },
    { name: 'CSS', dark: 'bg-blue-400/20 text-blue-300 border-blue-400/40', light: 'bg-blue-100 text-blue-700 border-blue-300' },
    { name: 'Node.js', dark: 'bg-green-500/20 text-green-300 border-green-500/40', light: 'bg-green-100 text-green-700 border-green-300' },
    { name: 'MySQL', dark: 'bg-sky-500/20 text-sky-300 border-sky-500/40', light: 'bg-sky-100 text-sky-700 border-sky-300' },
    { name: 'Python', dark: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', light: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
    { name: 'Svelte', dark: 'bg-orange-500/20 text-orange-300 border-orange-500/40', light: 'bg-orange-100 text-orange-700 border-orange-300' },
    { name: 'Next.js', dark: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', light: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
    { name: 'Vue', dark: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40', light: 'bg-emerald-100 text-emerald-600 border-emerald-300' },
    { name: 'PowerShell', dark: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', light: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
    { name: 'Shell', dark: 'bg-gray-500/20 text-gray-300 border-gray-500/40', light: 'bg-gray-100 text-gray-700 border-gray-300' },
    { name: 'Bash', dark: 'bg-lime-500/20 text-lime-300 border-lime-500/40', light: 'bg-lime-100 text-lime-700 border-lime-300' },
    { name: 'Dart', dark: 'bg-sky-400/20 text-sky-300 border-sky-400/40', light: 'bg-sky-100 text-sky-700 border-sky-300' },
    { name: 'Flutter', dark: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/40', light: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
    { name: 'FastAPI', dark: 'bg-teal-500/20 text-teal-300 border-teal-500/40', light: 'bg-teal-100 text-teal-700 border-teal-300' },
    { name: 'R', dark: 'bg-blue-600/20 text-blue-300 border-blue-600/40', light: 'bg-blue-100 text-blue-700 border-blue-300' },
  ];

  let techStack = techStackInitial.sort(() => 0.5 - Math.random());

  onMount(() => {
    // Trigger initial animations
    setTimeout(() => {
      isVisible = true;
    }, 100);
    
    // Name fade animation complete
    setTimeout(() => {
      nameAnimated = true;
    }, 1200);

    // Schedule name changes with random intervals (5-12 seconds)
    function scheduleNextNameChange() {
      const randomDelay = 5000 + Math.random() * 7000; // 5-12 seconds
      autoScrollInterval = setTimeout(() => {
        animateToNextName();
        scheduleNextNameChange();
      }, randomDelay);
    }

    // Start after initial animation
    setTimeout(scheduleNextNameChange, 2000);

    return () => {
      if (autoScrollInterval) clearTimeout(autoScrollInterval);
    };
  });

  function animateToNextName() {
    if (isAnimating) return;
    isAnimating = true;
    
    let nextIndex = (nameIndex + 1) % names.length;
    while (names[nextIndex] === currentName && nextIndex !== nameIndex) {
      nextIndex = (nextIndex + 1) % names.length;
    }
    nameIndex = nextIndex;
    
    const targetName = names[nameIndex];
    const maxLength = Math.max(currentName.length, targetName.length);
    
    let iterations = 0;
    const maxIterations = 8;
    
    const interval = setInterval(() => {
      iterations++;
      let newText = '';
      
      for (let i = 0; i < maxLength; i++) {
        const charSettlePoint = (i / maxLength) * maxIterations;
        if (iterations > charSettlePoint) {
          newText += targetName[i] || '';
        } else {
          newText += letters[Math.floor(Math.random() * letters.length)];
        }
      }
      
      displayText = newText;
      
      if (iterations >= maxIterations) {
        clearInterval(interval);
        displayText = targetName;
        currentName = targetName;
        isAnimating = false;
      }
    }, 30);
  }

  function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
</script>

<section id="home" class="relative min-h-screen flex items-center justify-center px-4 pt-16">
  <div class="text-center max-w-3xl mx-auto">
    <!-- Greeting -->
    <div class="mb-4 overflow-hidden">
      <p class="text-lg font-medium tracking-wide transition-all duration-700 hero-accent {isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}" style="transition-delay: 800ms">
        Hey there, I'm
      </p>
    </div>

    <!-- Name with fade big-to-small animation -->
    <div class="mb-6 overflow-hidden">
      <h1 
        class="font-display font-black tracking-tight hero-name select-none hero-name-animate {isVisible ? 'hero-name-visible' : ''}"
        role="heading"
        aria-label={currentName}
      >
        {displayText}
      </h1>
    </div>

    <!-- Tagline -->
    <div class="mb-8 overflow-hidden">
      <p class="text-lg sm:text-xl leading-relaxed transition-all duration-700 hero-tagline {isVisible && nameAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}">
        Software Engineering student crafting digital experiences.
      </p>
    </div>

    <!-- Tech Stack Pills with Theme-Aware Colors -->
    <div class="flex flex-wrap justify-center gap-2 mb-8 transition-all duration-700 {isVisible && nameAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}" style="transition-delay: 100ms">
      {#each techStack as tech}
        <span class="px-3 py-1 text-xs font-medium rounded-full border {currentTheme === 'light' ? tech.light : tech.dark}">{tech.name}</span>
      {/each}
    </div>

    <!-- CTA Buttons -->
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 {isVisible && nameAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}" style="transition-delay: 200ms">
      <button
        onclick={() => scrollToSection('projects')}
        class="group px-8 py-3 hero-cta-primary font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      >
        <span class="flex items-center gap-2">
          View My Work
          <svg class="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      
      <button
        onclick={() => scrollToSection('contact')}
        class="px-8 py-3 hero-cta-secondary font-medium rounded-full transition-all duration-300 hover:-translate-y-0.5"
      >
        Get In Touch
      </button>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 {isVisible && nameAnimated ? 'opacity-100' : 'opacity-0'}" style="transition-delay: 400ms">
      <div class="flex flex-col items-center gap-2 hero-scroll">
        <span class="text-xs tracking-wider">SCROLL</span>
        <div class="w-5 h-8 rounded-full border-2 hero-scroll-border flex justify-center pt-2">
          <div class="w-1 h-2 hero-scroll-dot rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  /* Hero name animation - big to small fade in */
  .hero-name-animate {
    font-family: 'Lexend', system-ui, sans-serif;
    font-weight: 900;
    font-size: clamp(3rem, 15vw, 8rem);
    opacity: 0;
    transform: scale(1.5);
    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  .hero-name-visible {
    opacity: 1;
    transform: scale(1);
  }

  :global(:not(.light)) .hero-accent { @apply text-red-500; }
  :global(:not(.light)) .hero-name { @apply text-white; }
  :global(:not(.light)) .hero-tagline { @apply text-gray-400; }
  :global(:not(.light)) .hero-cta-primary { @apply bg-white text-black hover:bg-red-500 hover:text-white hover:shadow-red-500/25; }
  :global(:not(.light)) .hero-cta-secondary { @apply border border-gray-600 text-white hover:border-red-500 hover:text-red-400; }
  :global(:not(.light)) .hero-scroll { @apply text-gray-500; }
  :global(:not(.light)) .hero-scroll-border { @apply border-gray-600; }
  :global(:not(.light)) .hero-scroll-dot { @apply bg-gray-500; }

  :global(.light) .hero-accent { @apply text-red-600; }
  :global(.light) .hero-name { @apply text-black; }
  :global(.light) .hero-tagline { @apply text-gray-600; }
  :global(.light) .hero-cta-primary { @apply bg-black text-white hover:bg-red-600 hover:shadow-red-600/25; }
  :global(.light) .hero-cta-secondary { @apply border border-gray-400 text-black hover:border-red-600 hover:text-red-600; }
  :global(.light) .hero-scroll { @apply text-gray-500; }
  :global(.light) .hero-scroll-border { @apply border-gray-400; }
  :global(.light) .hero-scroll-dot { @apply bg-gray-500; }
</style>
