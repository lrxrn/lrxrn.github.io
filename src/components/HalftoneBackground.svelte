<script>
  import { onMount } from 'svelte';
  import { theme } from '../stores/theme.js';

  let canvas;
  let ctx;
  let animationId;
  let mouseX = -1000;
  let mouseY = -1000;
  let time = 0;
  let scrollY = 0;
  let currentTheme = 'dark';

  // Mouse trail for red accent effect
  let mouseTrail = [];
  const TRAIL_LENGTH = 25;
  const TRAIL_DECAY = 0.04;

  // Configuration
  const DOT_SPACING = 24;
  const BASE_DOT_SIZE = 1.5;
  const MAX_DOT_SIZE = 4;
  const BREATH_SPEED = 0.001;
  const BREATH_AMPLITUDE = 0.1;
  const MOUSE_RADIUS = 150;
  const MOUSE_STRENGTH = 1.2;

  // Subscribe to theme changes
  theme.subscribe(value => {
    currentTheme = value;
  });

  onMount(() => {
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mouseleave', handleMouseLeave);

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  });

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function handleScroll() {
    scrollY = window.scrollY;
  }

  function handleMouseLeave() {
    mouseX = -1000;
    mouseY = -1000;
    mouseTrail = [];
  }

  function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    mouseTrail.push({ 
      x: e.clientX, 
      y: e.clientY, 
      intensity: 1.0
    });
    
    if (mouseTrail.length > TRAIL_LENGTH) {
      mouseTrail.shift();
    }
  }

  function animate() {
    time += BREATH_SPEED;
    
    // Decay trail
    mouseTrail = mouseTrail.filter(point => {
      point.intensity -= TRAIL_DECAY;
      return point.intensity > 0;
    });
    
    drawHalftone();
    animationId = requestAnimationFrame(animate);
  }

  function getRedIntensityAtPoint(x, y) {
    let intensity = 0;
    for (const point of mouseTrail) {
      const dx = x - point.x;
      const dy = y - point.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const radius = 60;
      if (distance < radius) {
        const factor = (1 - distance / radius) * point.intensity;
        intensity = Math.max(intensity, factor);
      }
    }
    return intensity;
  }

  function drawHalftone() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scroll offset for parallax
    const scrollOffset = scrollY * 0.3;

    const cols = Math.ceil(canvas.width / DOT_SPACING) + 1;
    const rows = Math.ceil((canvas.height + scrollOffset) / DOT_SPACING) + 2;
    const startRow = Math.floor(scrollOffset / DOT_SPACING);

    for (let row = startRow; row < startRow + rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Base position with scroll offset
        let x = col * DOT_SPACING;
        let y = row * DOT_SPACING - scrollOffset;

        // Skip if off screen
        if (y < -DOT_SPACING || y > canvas.height + DOT_SPACING) continue;

        // Subtle breathing - all dots move together as a group
        const breathPhase = time + Math.sin(time * 0.5) * 0.2;
        const breathOffsetX = Math.sin(breathPhase) * 0.8;
        const breathOffsetY = Math.cos(breathPhase * 1.3) * 0.8;
        x += breathOffsetX;
        y += breathOffsetY;

        // Distance from mouse
        const dx = x - mouseX;
        const dy = y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Cohesive group movement toward cursor (nexus effect)
        if (distance < MOUSE_RADIUS && mouseX > 0) {
          const influence = (1 - distance / MOUSE_RADIUS);
          const pullStrength = influence * 3;
          x -= (dx / distance) * pullStrength;
          y -= (dy / distance) * pullStrength;
        }

        // Dot size with subtle mouse influence
        const breathFactor = 1 + Math.sin(breathPhase) * BREATH_AMPLITUDE;
        let mouseFactor = 0;
        if (distance < MOUSE_RADIUS && mouseX > 0) {
          mouseFactor = (1 - distance / MOUSE_RADIUS) * MOUSE_STRENGTH;
        }
        const size = Math.min(MAX_DOT_SIZE, BASE_DOT_SIZE * breathFactor + mouseFactor);

        // Red intensity from trail
        const redIntensity = getRedIntensityAtPoint(x, y);
        const baseOpacity = 0.1 + (size / MAX_DOT_SIZE) * 0.2;
        const opacity = baseOpacity + redIntensity * 0.15;

        // Color
        let color;
        if (currentTheme === 'light') {
          if (redIntensity > 0.1) {
            const r = Math.round(40 + redIntensity * 140);
            color = `rgba(${r}, 20, 20, ${opacity})`;
          } else {
            color = `rgba(0, 0, 0, ${opacity * 0.5})`;
          }
        } else {
          if (redIntensity > 0.1) {
            const g = Math.round(255 * (1 - redIntensity * 0.6));
            const b = Math.round(255 * (1 - redIntensity * 0.6));
            color = `rgba(255, ${g}, ${b}, ${opacity})`;
          } else {
            color = `rgba(255, 255, 255, ${opacity * 0.4})`;
          }
        }

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }
  }
</script>

<canvas
  bind:this={canvas}
  class="fixed inset-0 z-0 pointer-events-none"
  aria-hidden="true"
></canvas>
