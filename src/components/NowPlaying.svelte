<script>
  import { onMount, onDestroy, tick } from 'svelte';
  import AnimatedAudioIcon from './AnimatedAudioIcon.svelte';

  const WS_URL = 'wss://np.lrxrn.workers.dev/am';

  let currentTrack = $state(null);
  let isVisible = $state(false);
  let isExiting = $state(false);
  let progress = $state(0);
  let socket = null;
  let animationFrame = null;
  let startTime = $state(0);
  let endTime = $state(0);
  let isCompact = $state(false);

  let artistEl = $state(null);
  let titleEl = $state(null);
  let artistScrollDist = $state(0);
  let titleScrollDist = $state(0);

  function checkScroll() {
    isCompact = window.scrollY > 20;
  }

  async function checkOverflow() {
    await tick();
    if (artistEl) {
      artistScrollDist = Math.max(0, artistEl.scrollWidth - artistEl.parentElement.clientWidth);
    }
    if (titleEl) {
      titleScrollDist = Math.max(0, titleEl.scrollWidth - titleEl.parentElement.clientWidth);
    }
  }

  function connect() {
    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log('Now Playing WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.playing) {
        currentTrack = {
          title: data.title,
          artist: data.artist,
          duration: data.duration
        };
        startTime = data.startedAt;
        endTime = data.expiresAt;
        isExiting = false;
        isVisible = true;
        updateProgress();
        setTimeout(checkOverflow, 100);
      } else {
        if (isVisible) {
          isExiting = true;
          setTimeout(() => {
            currentTrack = null;
            isVisible = false;
            isExiting = false;
          }, 400);
        }
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      }
    };

    socket.onclose = () => {
      console.log('WebSocket closed, reconnecting...');
      setTimeout(connect, 3000);
    };

    socket.onerror = () => {
      socket.close();
    };
  }

  function updateProgress() {
    if (!startTime || !endTime) return;
    
    const now = Date.now();
    const duration = endTime - startTime;
    const elapsed = now - startTime;
    progress = Math.min((elapsed / duration) * 100, 100);
    
    if (progress < 100 && currentTrack) {
      animationFrame = requestAnimationFrame(updateProgress);
    } else if (progress >= 100 && isVisible) {
      isExiting = true;
      setTimeout(() => {
        currentTrack = null;
        isVisible = false;
        isExiting = false;
      }, 400);
    }
  }

  function toggleCompact() {
    isCompact = !isCompact;
  }

  // Re-check overflow when compact mode changes
  $effect(() => {
    if (!isCompact && isVisible) {
      setTimeout(checkOverflow, 400); // Wait for transition
    }
  });

  onMount(() => {
    connect();
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkOverflow);
  });

  onDestroy(() => {
    window.removeEventListener('scroll', checkScroll);
    window.removeEventListener('resize', checkOverflow);
    if (socket) socket.close();
    if (animationFrame) cancelAnimationFrame(animationFrame);
  });
</script>

{#if isVisible && currentTrack}
  <div class="now-playing-wrapper" class:exiting={isExiting}>


    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div 
      class="now-playing-pill" 
      class:compact={isCompact}
      onclick={toggleCompact}
      role="button"
      tabindex="0"
      onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleCompact(); }}
    >
      <!-- Progress ring - inside pill to match size exactly -->
      <svg class="progress-ring-svg" preserveAspectRatio="none">
        <rect 
          x="0" y="0" 
          width="100%" height="100%" 
          rx="26" ry="26"
          fill="none"
          stroke-width="2"
          class="progress-track"
          vector-effect="non-scaling-stroke"
        />
        <rect 
          x="0" y="0" 
          width="100%" height="100%" 
          rx="26" ry="26"
          fill="none"
          stroke-width="2"
          class="progress-bar"
          vector-effect="non-scaling-stroke"
          pathLength="100"
          stroke-dasharray="100"
          stroke-dashoffset={100 - progress}
        />
      </svg>
      
      <div class="icon-container">
        <AnimatedAudioIcon size={20} strokeWidth={2} isHovered={true} />
      </div>

      <div class="track-info" class:hidden={isCompact}>
        <!-- Artist row -->
        <div class="text-container">
          <span 
            class="marquee-text artist" 
            class:scrolling={artistScrollDist > 0}
            style="--scroll-dist: -{artistScrollDist}px;"
            bind:this={artistEl}
          >{currentTrack.artist}</span>
        </div>
        
        <!-- Title row -->
        <div class="text-container">
          <span 
            class="marquee-text title" 
            class:scrolling={titleScrollDist > 0}
            style="--scroll-dist: -{titleScrollDist}px;"
            bind:this={titleEl}
          >{currentTrack.title}</span>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .now-playing-wrapper {
    position: fixed;
    top: 5rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 40;
    animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .now-playing-wrapper.exiting {
    animation: slideUp 0.4s cubic-bezier(0.7, 0, 0.84, 0) forwards;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateX(-50%) translateY(-1.5rem); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  /* Flex wrapper to shrink-wrap the pill exactly */
  .now-playing-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @keyframes slideUp {
    from { opacity: 1; transform: translateX(-50%) translateY(0); }
    to { opacity: 0; transform: translateX(-50%) translateY(-1.5rem); }
  }

  .progress-ring-svg {
    position: absolute;
    inset: 0;
    width: 100%; /* Ensure it fills parent */
    height: 100%;
    pointer-events: none;
    overflow: visible;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: -1; /* Place behind content */
  }

  .now-playing-pill {
    position: relative; /* Create stacking context for absolute SVG */
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 1.25rem;
    border-radius: 9999px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    width: fit-content;
    max-width: 360px;
    min-width: 180px;
    height: 52px;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;
    overflow: hidden;
  }

  .now-playing-pill.compact {
    width: 52px;
    min-width: 52px;
    padding: 0;
    justify-content: center;
    gap: 0;
  }
  
  /* Ensure icon is centered in compact mode */
  .now-playing-pill.compact .icon-container {
    margin: 0;
  }

  .icon-container {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    width: 20px;
    height: 20px;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .compact .icon-container {
    opacity: 1;
    transform: scale(1.1);
    /* Ensure icon takes full space in compact mode for perfect centering */
    width: 100%;
    margin: 0;
  }

  .track-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
    overflow: hidden;
    gap: 0;
    padding: 0.15rem 0;
    opacity: 1;
    width: auto;
    transition: opacity 0.3s ease, width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .track-info.hidden {
    opacity: 0;
    width: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  .text-container {
    overflow: hidden;
    mask-image: linear-gradient(90deg, black 80%, transparent 100%);
    -webkit-mask-image: linear-gradient(90deg, black 80%, transparent 100%);
    line-height: 1;
  }

  .artist, .title {
    display: block;
    white-space: nowrap;
  }

  .artist {
    font-size: 0.7rem;
    opacity: 0.6;
    margin-top: 0;
    padding-bottom: 0.1rem;
  }

  .title {
    font-size: 0.875rem;
    font-weight: 600;
    padding-bottom: 0.1rem;
  }

  .marquee-text {
    display: inline-block;
    white-space: nowrap;
  }

  .scrolling {
    animation: pingpong 12s linear infinite;
  }

  @keyframes pingpong {
    0%, 15% { transform: translateX(0); }
    50%, 65% { transform: translateX(var(--scroll-dist)); }
    100% { transform: translateX(0); }
  }

  /* Dark mode */
  :global(:not(.light)) .now-playing-pill {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
  }
   :global(:not(.light)) .now-playing-pill.compact {
     background: rgba(0, 0, 0, 0.6);
     border-color: rgba(255, 255, 255, 0.05);
  }
  :global(:not(.light)) .progress-track { stroke: rgba(255, 255, 255, 0.1); }
  :global(:not(.light)) .progress-bar { 
    stroke: #fa2d48; 
    filter: drop-shadow(0 0 6px rgba(250, 45, 72, 0.5)); 
  }

  /* Light mode */
  :global(.light) .now-playing-pill {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(0, 0, 0, 0.1);
    color: black;
  }
  :global(.light) .now-playing-pill.compact {
    background: rgba(255, 255, 255, 0.7);
  }
  :global(.light) .progress-track { stroke: rgba(0, 0, 0, 0.1); }
  :global(.light) .progress-bar { 
    stroke: #fa2d48; 
    filter: drop-shadow(0 0 4px rgba(250, 45, 72, 0.4)); 
  }

  .progress-bar { transition: stroke-dashoffset 0.3s linear; }
</style>
