<script>
  import { onMount, onDestroy } from 'svelte';
  import { Music, X } from 'lucide-svelte';
  const config = {
    discordUserId: '375599041284669452'
  };

  let currentTrack = $state(null);
  let isExpanded = $state(true);
  let progress = $state(0);
  let socket = null;
  let animationFrame = null;
  let startTime = $state(0);
  let endTime = $state(0);

  function connectWebSocket() {
    if (!config.discordUserId) {
      console.warn('Discord User ID not configured');
      return;
    }

    socket = new WebSocket('wss://api.lanyard.rest/socket');
    
    socket.onopen = () => {
      console.log('Lanyard WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.op) {
        case 1: // Hello - send init
          socket.send(JSON.stringify({
            op: 2,
            d: {
              subscribe_to_id: config.discordUserId
            }
          }));
          
          // Set up heartbeat
          setInterval(() => {
            if (socket?.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ op: 3 }));
            }
          }, data.d.heartbeat_interval);
          break;
          
        case 0: // Event
          handlePresenceUpdate(data.d);
          break;
      }
    };

    socket.onclose = () => {
      console.log('Lanyard WebSocket closed, reconnecting...');
      setTimeout(connectWebSocket, 5000);
    };

    socket.onerror = (err) => {
      console.error('Lanyard WebSocket error:', err);
    };
  }

  function handlePresenceUpdate(presence) {
    const spotify = presence.spotify;
    
    if (spotify) {
      currentTrack = {
        name: spotify.song,
        artist: spotify.artist,
        album: spotify.album,
        image: spotify.album_art_url,
        url: `https://open.spotify.com/track/${spotify.track_id}`
      };
      
      startTime = spotify.timestamps.start;
      endTime = spotify.timestamps.end;
      
      updateProgress();
    } else {
      currentTrack = null;
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    }
  }

  function updateProgress() {
    if (!startTime || !endTime) return;
    
    const now = Date.now();
    const duration = endTime - startTime;
    const elapsed = now - startTime;
    progress = Math.min((elapsed / duration) * 100, 100);
    
    if (progress < 100 && currentTrack) {
      animationFrame = requestAnimationFrame(updateProgress);
    }
  }

  function toggleExpand() {
    isExpanded = !isExpanded;
  }

  onMount(() => {
    connectWebSocket();
  });

  onDestroy(() => {
    if (socket) {
      socket.close();
    }
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  });
</script>

{#if currentTrack}
  <div class="now-playing fixed bottom-4 right-4 z-40">
    {#if isExpanded}
      <!-- Expanded pill view -->
      <div class="relative flex items-center gap-3 px-3 py-2 rounded-full backdrop-blur-md bar-bg border bar-border transition-all duration-300 group">
        <!-- Progress ring around album art -->
        <a 
          href={currentTrack.url}
          target="_blank"
          rel="noopener noreferrer"
          class="relative flex-shrink-0 w-10 h-10 rounded-full overflow-hidden hover:scale-105 transition-transform"
        >
          <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="none" stroke-width="2" class="progress-track" />
            <circle 
              cx="20" cy="20" r="18" 
              fill="none" 
              stroke-width="2" 
              class="progress-ring"
              stroke-dasharray="113.1"
              stroke-dashoffset={113.1 - (progress / 100) * 113.1}
              stroke-linecap="round"
            />
          </svg>
          {#if currentTrack.image}
            <img 
              src={currentTrack.image} 
              alt={currentTrack.album}
              class="w-full h-full object-cover rounded-full"
            />
          {:else}
            <div class="w-full h-full flex items-center justify-center bg-white/10 rounded-full">
              <Music size={16} class="text-current opacity-60" />
            </div>
          {/if}
        </a>

        <!-- Track info -->
        <div class="flex flex-col min-w-0 max-w-[160px]">
          <a 
            href={currentTrack.url}
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm font-medium truncate track-title hover:underline"
          >
            {currentTrack.name}
          </a>
          <span class="text-xs truncate track-artist">
            {currentTrack.artist}
          </span>
        </div>

        <!-- Close button -->
        <button
          onclick={toggleExpand}
          class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center close-btn transition-colors"
          aria-label="Minimize now playing"
        >
          <X size={12} />
        </button>
      </div>
    {:else}
      <!-- Minimized icon view -->
      <button
        onclick={toggleExpand}
        class="relative w-12 h-12 rounded-full backdrop-blur-md bar-bg border bar-border flex items-center justify-center transition-all duration-300 hover:scale-110"
        aria-label="Expand now playing"
      >
        <!-- Progress ring -->
        <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="22" fill="none" stroke-width="2" class="progress-track" />
          <circle 
            cx="24" cy="24" r="22" 
            fill="none" 
            stroke-width="2" 
            class="progress-ring"
            stroke-dasharray="138.2"
            stroke-dashoffset={138.2 - (progress / 100) * 138.2}
            stroke-linecap="round"
          />
        </svg>
        
        <!-- Mini album art or equalizer -->
        {#if currentTrack.image}
          <img 
            src={currentTrack.image} 
            alt={currentTrack.album}
            class="w-8 h-8 rounded-full object-cover"
          />
        {:else}
          <div class="equalizer">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </div>
        {/if}
      </button>
    {/if}
  </div>
{/if}

<style>
  /* Dark mode styles */
  :global(:not(.light)) .bar-bg { @apply bg-black/80; }
  :global(:not(.light)) .bar-border { @apply border-white/10; }
  :global(:not(.light)) .track-title { @apply text-white; }
  :global(:not(.light)) .track-artist { @apply text-gray-400; }
  :global(:not(.light)) .close-btn { @apply text-gray-500 hover:text-white hover:bg-white/10; }
  :global(:not(.light)) .progress-track { stroke: rgba(255,255,255,0.1); }
  :global(:not(.light)) .progress-ring { stroke: #1DB954; }

  /* Light mode styles */
  :global(.light) .bar-bg { @apply bg-white/80; }
  :global(.light) .bar-border { @apply border-black/10; }
  :global(.light) .track-title { @apply text-black; }
  :global(.light) .track-artist { @apply text-gray-600; }
  :global(.light) .close-btn { @apply text-gray-500 hover:text-black hover:bg-black/10; }
  :global(.light) .progress-track { stroke: rgba(0,0,0,0.1); }
  :global(.light) .progress-ring { stroke: #1DB954; }

  /* Equalizer animation */
  .equalizer {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 12px;
  }

  .equalizer .bar {
    width: 3px;
    background: #1DB954;
    border-radius: 1px;
    animation: equalize 0.8s ease-in-out infinite;
  }

  .equalizer .bar:nth-child(1) {
    height: 60%;
    animation-delay: 0s;
  }

  .equalizer .bar:nth-child(2) {
    height: 100%;
    animation-delay: 0.2s;
  }

  .equalizer .bar:nth-child(3) {
    height: 40%;
    animation-delay: 0.4s;
  }

  @keyframes equalize {
    0%, 100% {
      height: 40%;
    }
    50% {
      height: 100%;
    }
  }
</style>
