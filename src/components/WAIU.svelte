<script>
  import { onMount, onDestroy, tick } from 'svelte';
  import { status } from '../stores/status.js';

  const ORIGIN = 'waiu.lrxrn.workers.dev';
  const WS_URL = `wss://${ORIGIN}/ws`;

  const ICONS = {
    scheduled: `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
    playing: `<line x1="6" y1="11" x2="10" y2="11"/><line x1="8" y1="9" x2="8" y2="13"/><line x1="15" y1="12" x2="15.01" y2="12"/><line x1="18" y1="10" x2="18.01" y2="10"/><path d="M17.32 5H6.68a4 4 0 00-3.978 3.59 27.98 27.98 0 000 6.82 4 4 0 003.979 3.59h10.64a4 4 0 003.979-3.59 27.98 27.98 0 000-6.82A4 4 0 0017.32 5z"/>`,
    watching: `<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>`,
    listening: `<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>`,
    streaming: `<polygon points="23 7 16 12 23 17 23 7" fill="currentColor"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>`,
    competing: `<path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/>`,
  };

  let activities = $state([]);
  let isVisible = $state(false);
  let isExiting = $state(false);
  let progress = $state(0);
  let socket = null;
  let animationFrame = null;
  let isCompact = $state(false);

  let primaryEl = $state(null);
  let secondaryEl = $state(null);
  let primaryScrollDist = $state(0);
  let secondaryScrollDist = $state(0);

  let primary = $derived(activities[0] ?? null);
  let extraCount = $derived(Math.max(0, activities.length - 1));
  let isMusic = $derived(primary?.source === 'lanyard' && /spotify|apple music/i.test(primary.name ?? '') && !!primary.details);
  let brokenArt = $state(null);
  // art is only ever loaded from the worker's own proxy
  let art = $derived(isMusic && primary.art?.startsWith('/art?') && primary.art !== brokenArt ? `https://${ORIGIN}${primary.art}` : null);
  let range = $derived(
    primary?.source === 'waiu' ? [Date.parse(primary.timestart), Date.parse(primary.end)]
    : isMusic && primary.end > primary.start ? [primary.start, primary.end]
    : null
  );

  function formatTime(isoString) {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  function getPrimaryText(activity) {
    if (!activity) return '';
    if (activity.source === 'waiu') return 'Scheduled';
    if (isMusic) return activity.details;
    return activity.name ?? '';
  }

  function getSecondaryText(activity) {
    if (!activity) return '';
    if (activity.source === 'waiu') {
      return `${formatTime(activity.timestart)} – ${formatTime(activity.end)}`;
    }
    if (isMusic) return activity.state ?? '';
    const parts = [activity.details, activity.state].filter(Boolean);
    return parts.join(' · ') || '';
  }

  function getIcon(activity) {
    if (!activity) return ICONS.scheduled;
    return ICONS[activity.type] ?? ICONS.scheduled;
  }

  function checkScroll() {
    isCompact = window.scrollY > 20;
  }

  async function checkOverflow() {
    await tick();
    if (primaryEl) {
      primaryScrollDist = Math.max(0, primaryEl.scrollWidth - primaryEl.parentElement.clientWidth);
    }
    if (secondaryEl) {
      secondaryScrollDist = Math.max(0, secondaryEl.scrollWidth - secondaryEl.parentElement.clientWidth);
    }
  }

  function updateProgress() {
    if (!range) {
      animationFrame = null;
      return;
    }
    const [start, end] = range;
    const now = Date.now();
    progress = Math.min(Math.max((now - start) / (end - start) * 100, 0), 100);
    if (progress < 100) {
      animationFrame = requestAnimationFrame(updateProgress);
    } else {
      animationFrame = null;
    }
  }

  function connect() {
    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log('WAIU WebSocket connected');
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type !== 'update') return;
      status.set(msg.data.discord_status);

      const newActivities = msg.data.current ?? [];

      if (newActivities.length > 0) {
        activities = newActivities;
        isExiting = false;
        isVisible = true;
        if (animationFrame) cancelAnimationFrame(animationFrame);
        progress = 0;
        updateProgress();
        setTimeout(checkOverflow, 100);
      } else {
        if (isVisible) {
          isExiting = true;
          setTimeout(() => {
            activities = [];
            isVisible = false;
            isExiting = false;
            progress = 0;
          }, 400);
        }
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }
      }
    };

    socket.onclose = () => {
      status.set(null);
      setTimeout(connect, 3000);
    };

    socket.onerror = () => socket.close();
  }

  function toggleCompact() {
    isCompact = !isCompact;
  }

  $effect(() => {
    if (!isCompact && isVisible) {
      setTimeout(checkOverflow, 400);
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

{#if isVisible && primary}
  <div class="waiu-wrapper" class:exiting={isExiting}>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="waiu-pill"
      class:compact={isCompact}
      class:music={isMusic}
      onclick={toggleCompact}
      role="button"
      tabindex="0"
      onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleCompact(); }}
    >
      {#if art}
        <div class="art-bg" aria-hidden="true"><img src={art} alt="" /></div>
      {/if}

      {#if range}
        <svg class="progress-ring-svg" aria-hidden="true">
          <rect width="100%" height="100%" rx={isMusic ? 27 : 23} class="progress-track"/>
          <rect width="100%" height="100%" rx={isMusic ? 27 : 23} class="progress-bar"
            pathLength="100" stroke-dasharray="100"
            stroke-dashoffset={100 - progress}/>
        </svg>
      {/if}

      {#if art}
        <img class="art" src={art} alt="" onerror={() => (brokenArt = primary.art)} />
      {:else}
      <div class="icon-container">
        <svg
          class="activity-icon"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          {@html getIcon(primary)}
        </svg>
      </div>
      {/if}

      <div class="track-info" class:hidden={isCompact}>
        <div class="text-container">
          <span
            class="marquee-text secondary-text"
            class:scrolling={secondaryScrollDist > 0}
            style="--scroll-dist: -{secondaryScrollDist}px;"
            bind:this={secondaryEl}
          >{getSecondaryText(primary)}</span>
        </div>
        <div class="text-container">
          <span
            class="marquee-text primary-text"
            class:scrolling={primaryScrollDist > 0}
            style="--scroll-dist: -{primaryScrollDist}px;"
            bind:this={primaryEl}
          >{getPrimaryText(primary)}</span>
        </div>
      </div>

      {#if extraCount > 0 && !isCompact}
        <div class="extra-badge">+{extraCount}</div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .waiu-wrapper {
    position: fixed;
    right: max(1rem, env(safe-area-inset-right));
    bottom: max(1rem, env(safe-area-inset-bottom));
    z-index: 40;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  /* keeps the pill off the theme toggle at the end of the page on narrow screens */
  @media (max-width: 800px) { :global(body:has(.waiu-wrapper) footer) { padding-bottom: 64px; } }

  .waiu-wrapper.exiting {
    animation: slideOut 0.4s cubic-bezier(0.7, 0, 0.84, 0) forwards;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(1.5rem); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(1.5rem); }
  }

  .waiu-pill {
    position: relative;
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

  .waiu-pill.compact {
    width: 52px;
    min-width: 52px;
    padding: 0;
    justify-content: center;
    gap: 0;
  }

  .waiu-pill.compact .icon-container {
    margin: 0;
  }

  .waiu-pill.music { width: 280px; max-width: calc(100vw - 2rem); height: 60px; padding: 0 22px 0 9px; border-color: transparent; }
  /* the cover's centre is the same open or collapsed, so it only scales while the pill closes around it */
  .waiu-pill.music.compact { width: 60px; min-width: 60px; padding: 0 0 0 9px; gap: .75rem; justify-content: flex-start; }
  .waiu-pill.music { transition: width 280ms var(--ease-out), min-width 280ms var(--ease-out), padding 280ms var(--ease-out); }
  .art { width: 40px; height: 40px; flex: none; border-radius: 50%; object-fit: cover; }
  .art { transition: transform 280ms var(--ease-out); }
  .compact .art { transform: scale(1.25); } /* collapsed, the cover fills the circle inside the ring */
  /* the cover, blurred; the wash keeps text readable over any art in both themes */
  .art-bg { position: absolute; inset: 0; z-index: -2; border-radius: inherit; overflow: hidden; }
  .art-bg img { position: absolute; inset: -30px; width: calc(100% + 60px); height: calc(100% + 60px); object-fit: cover; filter: blur(18px) saturate(1.6); }
  .art-bg::after { content: ""; position: absolute; inset: 0; background: color-mix(in srgb, var(--bg) 65%, transparent); }
  /* the text keeps its place and fades; the pill clips it */
  .music .track-info { transition: opacity 200ms var(--ease-out) 80ms; }
  .music .track-info.hidden { flex: 1; width: auto; padding: .15rem 0; transition: opacity 120ms var(--ease-out); }
  .music .secondary-text { opacity: 0.9; }

  @media (prefers-reduced-motion: reduce) { .waiu-pill.music, .art, .music .track-info, .music .track-info.hidden { transition: none; } }

  /* the ring sits just inside the border, so the pill's clipping never cuts it */
  .progress-ring-svg {
    position: absolute;
    inset: 2px;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    pointer-events: none;
    overflow: visible;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: -1;
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
    width: 100%;
    margin: 0;
  }

  .activity-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
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

  .secondary-text {
    display: block;
    white-space: nowrap;
    font-size: 0.7rem;
    opacity: 0.6;
    padding-bottom: 0.1rem;
  }

  .primary-text {
    display: block;
    white-space: nowrap;
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

  .extra-badge {
    flex-shrink: 0;
    font-size: 0.65rem;
    font-weight: 600;
    padding: 0.15rem 0.4rem;
    border-radius: 9999px;
    opacity: 0.7;
  }

  /* Palette tokens follow the theme on their own */
  .waiu-pill {
    background: var(--surface);
    border: 1px solid var(--line);
    color: var(--fg);
  }
  .progress-ring-svg rect { fill: none; stroke-width: 3; stroke-linecap: round; }
  .progress-track { stroke: var(--line); }
  .progress-bar { stroke: var(--coral); }
  .extra-badge {
    background: var(--coral-soft);
    color: var(--coral-text);
  }

  .progress-bar { transition: stroke-dashoffset 0.3s linear; }
</style>
