/**
 * Matrix Rain Effect - Vanilla JavaScript
 * KEVIN-themed digital rain with Bitcoin/crypto characters
 * Preserves all KEVIN cultural elements from original React component
 */
class MatrixRain {
  constructor(containerId = 'matrix-canvas') {
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.drops = [];
    this.columns = 0;
    this.containerId = containerId;
    
    // Matrix characters (mix of Kevin-themed characters and binary/hex)
    this.characters = '01KEVIN6942Bitcoin♦◊▫▪●◦°·¸¨˙˚ˆ˜¯±×÷≠≤≥∞∑∏√∫∆∂∇';
    this.fontSize = 14;
    
    this.init();
  }

  init() {
    // Create canvas element if it doesn't exist
    let canvas = document.getElementById(this.containerId);
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = this.containerId;
      canvas.className = 'fixed inset-0 pointer-events-none';
      canvas.style.cssText = `
        background: transparent;
        opacity: 0.6;
        z-index: 1;
      `;
      document.body.appendChild(canvas);
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.resizeCanvas();
    this.initDrops();
    this.start();

    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());
  }

  resizeCanvas() {
    if (!this.canvas) return;
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
  }

  initDrops() {
    this.drops = new Array(this.columns);
    
    // Initialize drops at random heights (bottom of screen for upward movement)
    for (let i = 0; i < this.drops.length; i++) {
      this.drops[i] = this.canvas.height + Math.random() * this.canvas.height;
    }
  }

  handleResize() {
    this.resizeCanvas();
    this.initDrops();
  }

  draw() {
    if (!this.ctx) return;

    // Create fade effect (very subtle to avoid blocking content)
    this.ctx.fillStyle = 'rgba(11, 15, 19, 0.03)'; // More transparent background
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Set KEVIN orange color with transparency
    this.ctx.fillStyle = 'rgba(247, 147, 26, 0.8)'; // Kevin orange with transparency
    this.ctx.font = `${this.fontSize}px "Share Tech Mono", monospace`;

    // Draw characters
    for (let i = 0; i < this.drops.length; i++) {
      // Random character from KEVIN-themed set
      const char = this.characters[Math.floor(Math.random() * this.characters.length)];
      
      // Draw character
      this.ctx.fillText(char, i * this.fontSize, this.drops[i]);

      // Move drop upward (decrease y position)
      this.drops[i] -= this.fontSize;

      // Reset drop when it goes off top of screen
      if (this.drops[i] < 0) {
        this.drops[i] = this.canvas.height + Math.random() * this.canvas.height;
      }

      // Random reset for variety
      if (Math.random() > 0.995) {
        this.drops[i] = this.canvas.height + Math.random() * this.canvas.height;
      }
    }
  }

  start() {
    const animate = () => {
      this.draw();
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  destroy() {
    this.stop();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    window.removeEventListener('resize', this.handleResize);
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion) {
    window.matrixRain = new MatrixRain();
  }
});

// Export for manual initialization if needed
window.MatrixRain = MatrixRain;