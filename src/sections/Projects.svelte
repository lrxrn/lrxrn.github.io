<script>
  import ProjectCard from '../components/ProjectCard.svelte';
  import { Github } from 'lucide-svelte';
  import projectsData from '../data/projects.json';

  let projects = projectsData;
</script>

<section id="projects" class="relative min-h-screen py-24 px-4">
  <div class="max-w-6xl mx-auto">
    <!-- Section Header -->
    <div class="text-center mb-16">
      <span class="inline-block px-4 py-2 projects-badge text-sm font-medium rounded-full mb-4">
        Portfolio
      </span>
      <h2 class="text-4xl sm:text-5xl font-display font-bold projects-title mb-4">
        Featured Projects
      </h2>
      <p class="projects-subtitle text-lg max-w-2xl mx-auto">
        A collection of projects from my journey exploring different technologies and solving real problems.
      </p>
    </div>

    <!-- Uniform Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each projects as project (project.id)}
        <ProjectCard {project} />
      {/each}
    </div>

    <!-- Empty state -->
    {#if projects.length === 0}
      <div class="text-center py-16">
        <div class="text-6xl mb-4">📂</div>
        <p class="projects-subtitle">No projects yet. Check back soon!</p>
      </div>
    {/if}

    <!-- View More Link -->
    <div class="text-center mt-12">
      <a 
        href="https://github.com/lrxrn" 
        target="_blank" 
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 projects-link transition-colors"
      >
        <Github size={18} />
        <span>View more on GitHub</span>
      </a>
    </div>
  </div>
</section>

<style>
  :global(:not(.light)) .projects-badge { @apply bg-red-500/10 text-red-400; }
  :global(:not(.light)) .projects-title { @apply text-white; }
  :global(:not(.light)) .projects-subtitle { @apply text-gray-400; }
  :global(:not(.light)) .projects-link { @apply text-gray-400 hover:text-red-400; }

  :global(.light) .projects-badge { @apply bg-red-500/10 text-red-600; }
  :global(.light) .projects-title { @apply text-black; }
  :global(.light) .projects-subtitle { @apply text-gray-600; }
  :global(.light) .projects-link { @apply text-gray-600 hover:text-red-600; }
</style>
