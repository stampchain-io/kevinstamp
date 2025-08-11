import { useEffect, useRef } from 'react';

interface MatrixRainProps {
  className?: string;
}

export default function MatrixRain({ className = '' }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters (mix of Kevin-themed characters and binary/hex)
    const characters = '01KEVIN6942Bitcoin♦◊▫▪●◦°·¸¨˙˚ˆ˜¯±×÷≠≤≥∞∑∏√∫∆∂∇';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Array to track each column's position
    const drops: number[] = new Array(columns).fill(canvas.height);

    // Initialize drops at random heights (bottom of screen for upward movement)
    for (let i = 0; i < drops.length; i++) {
      drops[i] = canvas.height + Math.random() * canvas.height;
    }

    const draw = () => {
      // Create fade effect (very subtle to avoid blocking content)
      ctx.fillStyle = 'rgba(11, 15, 19, 0.03)'; // More transparent background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set orange color with some transparency
      ctx.fillStyle = 'rgba(247, 147, 26, 0.8)'; // Kevin orange with transparency
      ctx.font = `${fontSize}px "Share Tech Mono", monospace`;

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = characters[Math.floor(Math.random() * characters.length)];
        
        // Draw character
        ctx.fillText(char, i * fontSize, drops[i]);

        // Move drop upward (decrease y position)
        drops[i] -= fontSize;

        // Reset drop when it goes off top of screen
        if (drops[i] < 0) {
          drops[i] = canvas.height + Math.random() * canvas.height;
        }

        // Random reset for variety
        if (Math.random() > 0.995) {
          drops[i] = canvas.height + Math.random() * canvas.height;
        }
      }
    };

    // Animation loop
    const interval = setInterval(draw, 50); // 20 FPS for smooth animation

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none -z-10 ${className}`}
      style={{ 
        background: 'transparent',
        opacity: 0.8 // Higher opacity since it's now in background
      }}
    />
  );
}