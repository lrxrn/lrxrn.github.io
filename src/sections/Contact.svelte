<script>
  import { onMount } from 'svelte';
  import { Github, Linkedin, Mail, Hand, User, Heart, Coffee } from 'lucide-svelte';

  let isWaving = false;
  let waveClicked = false;
  let sectionElement;
  let githubStats = null;
  let loading = true;
  let heartHovered = false;

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/lrxrn', icon: Github },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/meesum-ahmed', icon: Linkedin },
    { name: 'Discord', username: 'm13kx' }
  ];

  onMount(async () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !waveClicked) {
          triggerWave();
        }
      });
    }, { threshold: 0.3 });

    if (sectionElement) {
      observer.observe(sectionElement);
    }

    // Fetch GitHub stats
    try {
      const response = await fetch('https://api.github.com/users/lrxrn');
      if (response.ok) {
        const data = await response.json();
        githubStats = {
          avatar: data.avatar_url,
          name: data.name || 'Meesum',
          bio: 'Software Engineering Student'
        };
      }
    } catch (e) {
      console.log('Could not fetch GitHub stats');
    } finally {
      loading = false;
    }

    return () => observer.disconnect();
  });

  function triggerWave() {
    isWaving = true;
    setTimeout(() => {
      isWaving = false;
    }, 1500);
  }

  function handleWaveClick() {
    waveClicked = !waveClicked;
    triggerWave();
  }
</script>

<section id="contact" class="relative min-h-screen py-24 px-4 flex items-center" bind:this={sectionElement}>
  <div class="max-w-4xl mx-auto w-full">
    <!-- Section Header -->
    <div class="text-center mb-16">
      <span class="inline-block px-4 py-2 contact-badge text-sm font-medium rounded-full mb-4">
        Contact
      </span>
      <h2 class="text-4xl sm:text-5xl font-display font-bold contact-title mb-4">
        Let's Connect
      </h2>
      <p class="contact-subtitle text-lg max-w-2xl mx-auto">
        Always open to new opportunities and interesting projects.
      </p>
    </div>

    <!-- Contact Card -->
    <div class="contact-card backdrop-blur-sm rounded-3xl p-8 sm:p-12">
      <!-- Profile Section -->
      <div class="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b contact-border">
        <!-- Avatar -->
        <div class="w-24 h-24 rounded-full contact-avatar overflow-hidden flex items-center justify-center">
          {#if githubStats?.avatar}
            <img src={githubStats.avatar} alt="Profile" class="w-full h-full object-cover" />
          {:else}
            <User size={40} class="contact-avatar-icon" />
          {/if}
        </div>
        
        <!-- Name and Bio -->
        <div class="text-center sm:text-left flex-1">
          <h3 class="text-2xl font-semibold contact-card-title mb-1">
            {githubStats?.name || 'Meesum'}
          </h3>
          <p class="contact-bio text-sm">
            {githubStats?.bio || 'Software Engineering Student'}
          </p>
        </div>

        <!-- Wave and Social icons -->
        <div class="flex items-center gap-4">
          <button 
            onclick={handleWaveClick}
            class="hand-wave cursor-pointer transition-all duration-300 {waveClicked ? 'text-yellow-400' : 'contact-hand'}"
            class:waving={isWaving}
            aria-label="Wave"
          >
            <Hand size={28} />
          </button>
          
          <div class="flex items-center gap-2">
            {#each socialLinks as social}
              {#if social.username}
                <!-- Discord with username pill -->
                <span class="social-pill flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium">
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  {social.username}
                </span>
              {:else}
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-10 h-10 rounded-full contact-social flex items-center justify-center transition-colors"
                  aria-label={social.name}
                >
                  <svelte:component this={social.icon} size={18} class="contact-social-icon" />
                </a>
              {/if}
            {/each}
          </div>
        </div>
      </div>

      <!-- Email Button -->
      <div class="text-center">
        <a 
          href="mailto:mikkoahmd@gmail.com"
          class="inline-flex items-center gap-3 px-8 py-4 contact-cta font-semibold rounded-full transition-all duration-300 hover:shadow-lg"
        >
          <Mail size={20} />
          mikkoahmd<span class="email-at">(at)</span>gmail.com
        </a>
      </div>
    </div>

    <!-- Footer -->
    <footer class="flex justify-center mt-16">
      <div class="footer-glass inline-flex items-center gap-1 px-6 py-3 rounded-full backdrop-blur-md text-sm">
        <span>© {new Date().getFullYear()} Meesum. Built with Svelte &</span>
        <a 
          href="https://buymeacoffee.com/lrxrn"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center heart-coffee-link"
          onmouseenter={() => heartHovered = true}
          onmouseleave={() => heartHovered = false}
        >
          {#if heartHovered}
            <Coffee size={16} class="text-amber-500" />
          {:else}
            <Heart size={16} class="text-red-500" />
          {/if}
        </a>
      </div>
    </footer>
  </div>
</section>

<style>
  /* Wave animation */
  @keyframes wave-hand {
    0%, 100% { transform: rotate(0deg); }
    20% { transform: rotate(20deg); }
    40% { transform: rotate(-10deg); }
    60% { transform: rotate(20deg); }
    80% { transform: rotate(-5deg); }
  }

  .hand-wave.waving {
    animation: wave-hand 1s ease-in-out;
    transform-origin: 70% 70%;
  }

  .heart-coffee-link {
    transition: transform 0.2s ease;
  }
  
  .heart-coffee-link:hover {
    transform: scale(1.2);
  }

  :global(:not(.light)) .contact-badge { @apply bg-red-500/10 text-red-400; }
  :global(:not(.light)) .contact-title { @apply text-white; }
  :global(:not(.light)) .contact-subtitle { @apply text-gray-400; }
  :global(:not(.light)) .contact-card { @apply bg-gray-900/50 border border-gray-800/50; }
  :global(:not(.light)) .contact-border { @apply border-gray-800; }
  :global(:not(.light)) .contact-avatar { @apply bg-gray-800; }
  :global(:not(.light)) .contact-avatar-icon { @apply text-gray-500; }
  :global(:not(.light)) .contact-card-title { @apply text-white; }
  :global(:not(.light)) .contact-bio { @apply text-gray-400; }
  :global(:not(.light)) .contact-hand { @apply text-gray-600; }
  :global(:not(.light)) .contact-cta { @apply bg-white text-black hover:bg-red-500 hover:text-white hover:shadow-red-500/25; }
  :global(:not(.light)) .contact-social { @apply bg-gray-800 border border-gray-700 hover:bg-red-500/20 hover:border-red-500/50; }
  :global(:not(.light)) .contact-social-icon { @apply text-gray-400; }
  :global(:not(.light)) .contact-social:hover .contact-social-icon { @apply text-red-400; }
  :global(:not(.light)) .social-pill { @apply bg-gray-800 border border-gray-700 text-gray-400; }
  :global(:not(.light)) .footer-glass { @apply bg-white/5 border border-white/10 text-gray-400; }

  :global(.light) .contact-badge { @apply bg-red-500/10 text-red-600; }
  :global(.light) .contact-title { @apply text-black; }
  :global(.light) .contact-subtitle { @apply text-gray-600; }
  :global(.light) .contact-card { @apply bg-gray-100/50 border border-gray-200/50; }
  :global(.light) .contact-border { @apply border-gray-200; }
  :global(.light) .contact-avatar { @apply bg-gray-200; }
  :global(.light) .contact-avatar-icon { @apply text-gray-400; }
  :global(.light) .contact-card-title { @apply text-black; }
  :global(.light) .contact-bio { @apply text-gray-600; }
  :global(.light) .contact-hand { @apply text-gray-500; }
  :global(.light) .contact-cta { @apply bg-black text-white hover:bg-red-600 hover:shadow-red-600/25; }
  :global(.light) .contact-social { @apply bg-white border border-gray-200 hover:bg-red-500/10 hover:border-red-500/50; }
  :global(.light) .contact-social-icon { @apply text-gray-600; }
  :global(.light) .contact-social:hover .contact-social-icon { @apply text-red-600; }
  :global(.light) .social-pill { @apply bg-white border border-gray-200 text-black; }
  :global(.light) .footer-glass { @apply bg-black/5 border border-black/10 text-gray-600; }
</style>
