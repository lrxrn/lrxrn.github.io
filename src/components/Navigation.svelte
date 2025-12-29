<script>
  import { theme, toggleTheme } from '../stores/theme.js';
  import { Menu, X, QrCode, Share2, Copy, Check } from 'lucide-svelte';
  
  let isMenuOpen = false;
  let activeSection = 'home';
  let showQrPopup = false;
  let copyStatus = 'idle'; // 'idle' | 'success' | 'error'

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      isMenuOpen = false;
    }
  }

  function handleScroll() {
    const sections = navItems.map(item => document.getElementById(item.id));
    const scrollPosition = window.scrollY + 100;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section && section.offsetTop <= scrollPosition) {
        activeSection = navItems[i].id;
        break;
      }
    }
  }

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function handleLogoClick() {
    toggleTheme();
  }

  function openQrPopup() {
    showQrPopup = true;
  }

  function closeQrPopup() {
    showQrPopup = false;
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      closeQrPopup();
    }
  }

  async function shareQr() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'lrxrn.is-a.dev',
          text: 'Check out my portfolio!',
          url: 'https://lrxrn.is-a.dev'
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText('https://lrxrn.is-a.dev');
      copyStatus = 'success';
    } catch (err) {
      copyStatus = 'error';
    }
    setTimeout(() => {
      copyStatus = 'idle';
    }, 2000);
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll);
  }
</script>

<nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
  <div class="backdrop-blur-md nav-bg border-b nav-border">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo / Theme Toggle + QR Code -->
        <div class="flex items-center gap-2">
          <button
            onclick={openQrPopup}
            class="p-1.5 rounded-lg nav-qr-btn transition-colors"
            title="Show QR Code"
          >
            <QrCode size={18} />
          </button>
          <button
            onclick={handleLogoClick}
            class="text-xl font-display font-bold nav-logo transition-all duration-300 hover:scale-105"
            title="Toggle light/dark mode"
          >
            lrxrn
          </button>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-8">
          {#each navItems as item}
            <button
              onclick={() => scrollToSection(item.id)}
              class="relative px-1 py-2 text-sm font-medium transition-colors {activeSection === item.id ? 'nav-active' : 'nav-link'}"
            >
              {item.label}
              {#if activeSection === item.id}
                <span class="absolute bottom-0 left-0 right-0 h-0.5 nav-indicator rounded-full"></span>
              {/if}
            </button>
          {/each}
        </div>

        <!-- Mobile Menu Button -->
        <button
          onclick={toggleMenu}
          class="md:hidden p-2 nav-link transition-colors"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {#if isMenuOpen}
            <X size={24} />
          {:else}
            <Menu size={24} />
          {/if}
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    {#if isMenuOpen}
      <div class="md:hidden border-t nav-border animate-fade-in">
        <div class="px-4 py-4 space-y-2">
          {#each navItems as item}
            <button
              onclick={() => scrollToSection(item.id)}
              class="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors {activeSection === item.id ? 'nav-mobile-active' : 'nav-mobile-link'}"
            >
              {item.label}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</nav>

<!-- QR Code Popup -->
{#if showQrPopup}
  <div 
    class="fixed inset-0 z-[100] flex items-center justify-center p-4 qr-overlay"
    onclick={handleOverlayClick}
    role="dialog"
    aria-modal="true"
  >
    <div class="qr-popup rounded-3xl p-8 max-w-sm w-full text-center animate-fade-in">
      <!-- Close button -->
      <button 
        onclick={closeQrPopup}
        class="absolute top-4 right-4 p-2 qr-close rounded-full transition-colors"
      >
        <X size={20} />
      </button>

      <!-- QR Code -->
      <div class="qr-code-container p-4 rounded-2xl mb-6 inline-block">
        <img src="/qr-code.png" alt="QR Code for lrxrn.is-a.dev" class="w-48 h-48 mx-auto" />
      </div>

      <h3 class="text-xl font-display font-bold qr-title mb-2">lrxrn.is-a.dev</h3>
      <p class="qr-subtitle text-sm mb-6">Scan to visit my portfolio</p>

      <!-- Action buttons -->
      <div class="flex justify-center gap-3">
        <button 
          onclick={shareQr}
          class="qr-action-btn flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors"
        >
          <Share2 size={16} />
          Share
        </button>
        <button 
          onclick={copyLink}
          class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 {copyStatus === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : copyStatus === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'qr-action-btn'}"
        >
          {#if copyStatus === 'success'}
            <Check size={16} />
            Copied!
          {:else if copyStatus === 'error'}
            <X size={16} />
            Failed
          {:else}
            <Copy size={16} />
            Copy Link
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(:not(.light)) .nav-bg { @apply bg-black/80; }
  :global(:not(.light)) .nav-border { @apply border-white/10; }
  :global(:not(.light)) .nav-logo { @apply text-white hover:text-red-500; }
  :global(:not(.light)) .nav-link { @apply text-gray-400 hover:text-white; }
  :global(:not(.light)) .nav-active { @apply text-white; }
  :global(:not(.light)) .nav-indicator { @apply bg-red-500; }
  :global(:not(.light)) .nav-mobile-active { @apply bg-red-500/10 text-red-400; }
  :global(:not(.light)) .nav-mobile-link { @apply text-gray-400 hover:bg-white/5 hover:text-white; }
  :global(:not(.light)) .nav-qr-btn { @apply text-gray-500 hover:text-white hover:bg-white/10; }

  :global(.light) .nav-bg { @apply bg-white/80; }
  :global(.light) .nav-border { @apply border-black/10; }
  :global(.light) .nav-logo { @apply text-black hover:text-red-600; }
  :global(.light) .nav-link { @apply text-gray-600 hover:text-black; }
  :global(.light) .nav-active { @apply text-black; }
  :global(.light) .nav-indicator { @apply bg-red-600; }
  :global(.light) .nav-mobile-active { @apply bg-red-500/10 text-red-600; }
  :global(.light) .nav-mobile-link { @apply text-gray-600 hover:bg-black/5 hover:text-black; }
  :global(.light) .nav-qr-btn { @apply text-gray-500 hover:text-black hover:bg-black/10; }

  /* QR Popup Styles */
  :global(:not(.light)) .qr-overlay { @apply bg-black/80 backdrop-blur-sm; }
  :global(:not(.light)) .qr-popup { @apply bg-gray-900 border border-gray-800; }
  :global(:not(.light)) .qr-close { @apply text-gray-500 hover:text-white hover:bg-white/10; }
  :global(:not(.light)) .qr-code-container { @apply bg-white; }
  :global(:not(.light)) .qr-title { @apply text-white; }
  :global(:not(.light)) .qr-subtitle { @apply text-gray-400; }
  :global(:not(.light)) .qr-action-btn { @apply bg-gray-800 text-gray-300 border border-gray-700 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400; }

  :global(.light) .qr-overlay { @apply bg-black/50 backdrop-blur-sm; }
  :global(.light) .qr-popup { @apply bg-white border border-gray-200; }
  :global(.light) .qr-close { @apply text-gray-500 hover:text-black hover:bg-black/10; }
  :global(.light) .qr-code-container { @apply bg-gray-100; }
  :global(.light) .qr-title { @apply text-black; }
  :global(.light) .qr-subtitle { @apply text-gray-600; }
  :global(.light) .qr-action-btn { @apply bg-gray-100 text-gray-700 border border-gray-200 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-600; }

  .qr-popup {
    position: relative;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  .animate-fade-in {
    animation: fadeIn 0.2s ease-out;
  }
</style>
