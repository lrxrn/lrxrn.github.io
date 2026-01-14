<script>
  import { ExternalLink } from 'lucide-svelte';
  
  /** @type {{ project: { id: number, title: string, description: string, link?: string, image?: string, featured?: boolean, tags?: string[] } }} */
  let { project } = $props();
</script>

<article class="group relative card-bg backdrop-blur-sm card-border rounded-2xl overflow-hidden transition-all duration-300 hover:card-border-hover flex flex-col">
  <!-- Image with fade gradient -->
  {#if project.image}
    <div class="relative h-32 overflow-hidden">
      <img 
        src={project.image} 
        alt={project.title} 
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <!-- Fade gradient overlay -->
      <div class="absolute inset-0 card-image-fade"></div>
    </div>
  {/if}

  <!-- Content -->
  <div class="relative p-6 flex-1 flex flex-col {project.image ? '-mt-4' : ''}">
    <div class="flex items-start justify-between gap-3 mb-2">
      <h3 class="text-lg font-display font-semibold card-title transition-colors">
        {project.title}
      </h3>
      {#if project.link}
        <a 
          href={project.link} 
          target="_blank" 
          rel="noopener noreferrer"
          class="flex-shrink-0 p-1.5 rounded-lg card-link-icon transition-colors"
          aria-label="View project"
        >
          <ExternalLink size={16} />
        </a>
      {/if}
    </div>
    
    <p class="card-description text-sm leading-relaxed mb-3 flex-1">
      {project.description}
    </p>

    <!-- Tags -->
    {#if project.tags && project.tags.length > 0}
      <div class="flex flex-wrap gap-1.5 mt-auto">
        {#each project.tags as tag}
          <span class="card-tag px-2 py-0.5 text-xs rounded-full">{tag}</span>
        {/each}
      </div>
    {/if}
  </div>
</article>

<style>
  :global(:not(.light)) .card-bg { @apply bg-gray-900/50; }
  :global(:not(.light)) .card-border { @apply border border-gray-800/50; }
  :global(:not(.light)) .card-border:hover { border-color: rgba(239, 68, 68, 0.3); }
  :global(:not(.light)) .card-title { @apply text-white; }
  :global(:not(.light)) .group:hover .card-title { @apply text-red-400; }
  :global(:not(.light)) .card-description { @apply text-gray-400; }
  :global(:not(.light)) .card-link-icon { @apply text-gray-500 hover:text-red-400 hover:bg-white/5; }
  :global(:not(.light)) .card-tag { @apply bg-gray-800 text-gray-400 border border-gray-700; }
  :global(:not(.light)) .card-image-fade { background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 100%); }

  :global(.light) .card-bg { @apply bg-gray-100/50; }
  :global(.light) .card-border { @apply border border-gray-200/50; }
  :global(.light) .card-border:hover { border-color: rgba(220, 38, 38, 0.3); }
  :global(.light) .card-title { @apply text-black; }
  :global(.light) .group:hover .card-title { @apply text-red-600; }
  :global(.light) .card-description { @apply text-gray-600; }
  :global(.light) .card-link-icon { @apply text-gray-500 hover:text-red-600 hover:bg-black/5; }
  :global(.light) .card-tag { @apply bg-gray-200 text-gray-600 border border-gray-300; }
  :global(.light) .card-image-fade { background: linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.95) 100%); }
</style>
