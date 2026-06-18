import { useEffect, useRef } from 'react';

export default function CanvasVortexBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Handle Resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX - width / 2;
      mouseY = e.clientY - height / 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Particle Structure (Spiral Galaxy / Vortex)
    const particles: { x: number; y: number; z: number }[] = [];
    const numParticles = 2500;
    const numArms = 4;

    for (let i = 0; i < numParticles; i++) {
      // Distance from center with a slight bias towards the middle
      const r = Math.pow(Math.random(), 1.5) * 1200;
      
      const armIndex = i % numArms;
      const armAngle = (Math.PI * 2 / numArms) * armIndex;
      // The twist makes it a spiral
      const twist = r * 0.003; 

      // Spread of particles around the core arm
      const spread = 30 + (r * 0.05); 
      const randAngle = Math.random() * Math.PI * 2;
      const randDist = Math.random() * spread;

      // Base coordinates forming the spiral
      const xBase = Math.cos(armAngle + twist) * r;
      const zBase = Math.sin(armAngle + twist) * r;

      const x = xBase + Math.cos(randAngle) * randDist;
      const z = zBase + Math.sin(randAngle) * randDist;

      // Height (y) with a subtle bulge in the center
      const ySpread = 60 + (r * 0.015);
      const y = (Math.random() - 0.5) * ySpread;

      particles.push({ x, y, z });
    }

    let time = 0;
    let animationFrameId: number;

    const render = () => {
      time += 0.0015; // Slow intrinsic auto-rotation

      // Smooth Linear Interpolation (Lerp) for heavy, fluid parallax
      targetX += (mouseX - targetX) * 0.02;
      targetY += (mouseY - targetY) * 0.02;

      ctx.clearRect(0, 0, width, height);

      // Mysterious deep base background
      ctx.fillStyle = '#030303';
      ctx.fillRect(0, 0, width, height);

      // Global composite for glow
      ctx.globalCompositeOperation = 'lighter';

      // Position vortex slightly to the right of the screen
      const centerX = width * 0.7;
      const centerY = height * 0.5;

      const fov = 400;
      const viewDistance = 700;

      // Calculate Rotation Matrix Angles (Auto-rotation + Mouse Parallax)
      const rotX = -0.3 + targetY * 0.0004; 
      const rotY = time + targetX * 0.0008;

      const cx = Math.cos(rotX);
      const sx = Math.sin(rotX);
      const cy = Math.cos(rotY);
      const sy = Math.sin(rotY);

      // Sort particles by Z-depth for correct opacity layering
      // We compute rotated Z first.
      const projected = particles.map(p => {
        // Rotate Y
        const x1 = p.x * cy + p.z * sy;
        const z1 = -p.x * sy + p.z * cy;
        const y1 = p.y;
        
        // Rotate X
        const y2 = y1 * cx - z1 * sx;
        const z2 = y1 * sx + z1 * cx;

        return { x: x1, y: y2, z: z2 };
      });

      // Sort back-to-front
      projected.sort((a, b) => b.z - a.z);

      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        
        const zFinal = p.z + viewDistance;
        if (zFinal < 10) continue; // Behind camera

        const scale = fov / zFinal;
        const px = centerX + p.x * scale;
        const py = centerY + p.y * scale;

        // Depth perception: closer = brighter & larger, distant = faded & smaller
        const size = Math.max(0.1, 3.5 * scale);
        const alpha = Math.min(1, Math.max(0, 1.2 * scale - 0.1));

        ctx.fillStyle = `rgba(0, 229, 255, ${alpha})`;
        
        // Draw tiny mathematical dash
        ctx.save();
        ctx.translate(px, py);
        
        // Tilt dashes slightly based on their position to simulate flow
        const angle = Math.atan2(p.y, p.x);
        ctx.rotate(angle + Math.PI / 2);
        
        ctx.fillRect(-size * 0.25, -size * 1.5, size * 0.5, size * 3);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
    />
  );
}
