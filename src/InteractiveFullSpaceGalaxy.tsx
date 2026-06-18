import { useEffect, useRef } from "react";

export default function InteractiveFullSpaceGalaxy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Mouse Tracking for Direct Boss-Level Interaction
    let mouseX = width / 2;
    let mouseY = height / 2;
    // For global parallax, we can lerp. But local particle repulsion MUST use instant coords.
    let instantMouseX = width / 2;
    let instantMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      instantMouseX = e.clientX;
      instantMouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Particle Class
    class Particle {
      angle: number;
      radius: number;
      z: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;

      constructor() {
        this.angle = Math.random() * Math.PI * 2;
        this.radius = Math.random() * Math.max(width, height) * 1.5;
        this.z = Math.random() * 150 + 10; // Depth
        this.x = width / 2 + Math.cos(this.angle) * this.radius;
        this.y = height / 2 + Math.sin(this.angle) * this.radius;
        this.vx = 0;
        this.vy = 0;
        this.size = (100 / this.z) * 1.2;
        this.alpha = Math.min(1, 80 / this.z);
      }

      update(fishX: number, fishY: number, globalOffsetX: number, globalOffsetY: number) {
        // Spiral vortex orbit target
        this.angle += 0.0002 * (100 / this.z);
        const targetX = width * 0.7 + Math.cos(this.angle) * this.radius + globalOffsetX * (100 / this.z) * 0.05;
        const targetY = height * 0.5 + Math.sin(this.angle) * this.radius + globalOffsetY * (100 / this.z) * 0.05;

        // 1. MOUSE IS BOSS (Absolute Priority)
        // Instant, Heavy Repulsion
        const mdx = this.x - instantMouseX;
        const mdy = this.y - instantMouseY;
        const mDistSq = mdx * mdx + mdy * mdy;
        const mouseRadiusSq = 120000; // Massive radius (~346px)

        if (mDistSq < mouseRadiusSq) {
          const dist = Math.sqrt(mDistSq);
          const force = (Math.sqrt(mouseRadiusSq) - dist) / Math.sqrt(mouseRadiusSq);
          // Explode outwards rapidly
          this.vx += (mdx / dist) * force * 15.0; 
          this.vy += (mdy / dist) * force * 15.0;
        } else {
          // 2. FISH IS SECONDARY
          // Only interacts if the mouse isn't currently dominating the particle
          const fdx = this.x - fishX;
          const fdy = this.y - fishY;
          const fDistSq = fdx * fdx + fdy * fdy;
          const fishRadiusSq = 15000; // Reduced radius (~122px)
          
          if (fDistSq < fishRadiusSq) {
            const dist = Math.sqrt(fDistSq);
            const force = (Math.sqrt(fishRadiusSq) - dist) / Math.sqrt(fishRadiusSq);
            // Subtle, fluid ripple/eddy
            this.vx += (fdx / dist) * force * 1.5 + (fdy / dist) * force * 0.4;
            this.vy += (fdy / dist) * force * 1.5 - (fdx / dist) * force * 0.4;
          }
        }

        // Spring gently back to vortex orbit
        this.vx += (targetX - this.x) * 0.015;
        this.vy += (targetY - this.y) * 0.015;

        // High friction for snappy, heavy feel (prevents chaotic drifting)
        this.vx *= 0.82;
        this.vy *= 0.82;

        this.x += this.vx;
        this.y += this.vy;
      }

      draw(context: CanvasRenderingContext2D) {
        context.fillStyle = `rgba(0, 229, 255, ${this.alpha * 0.6})`;
        context.save();
        context.translate(this.x, this.y);
        
        // Tilt dash along velocity vector or orbit tangent
        const motionAngle = Math.atan2(this.vy, this.vx);
        context.rotate(motionAngle);
        
        // Mathematical dash shape
        context.fillRect(-this.size, -this.size * 0.25, this.size * 2, this.size * 0.5);
        context.restore();
      }
    }

    // Fish Class
    class DigitalFish {
      x: number;
      y: number;
      angle: number;
      targetAngle: number;
      speed: number;
      segments: { x: number; y: number }[];
      numSegments: number;
      segmentSpacing: number;
      time: number;

      constructor() {
        this.x = width / 2;
        this.y = height / 2;
        this.angle = 0;
        this.targetAngle = 0;
        this.speed = 2.5;
        this.numSegments = 16;
        this.segmentSpacing = 7;
        this.segments = [];
        for (let i = 0; i < this.numSegments; i++) {
          this.segments.push({ x: this.x, y: this.y });
        }
        this.time = 0;
      }

      update() {
        this.time += 0.05;

        // Random wander behavior
        if (Math.random() < 0.03) {
          this.targetAngle += (Math.random() - 0.5) * Math.PI * 1.2;
        }

        // Soft boundary avoidance
        const margin = 150;
        if (
          this.x < margin ||
          this.x > width - margin ||
          this.y < margin ||
          this.y > height - margin
        ) {
          const angleToCenter = Math.atan2(height / 2 - this.y, width / 2 - this.x);
          let diff = angleToCenter - this.targetAngle;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          this.targetAngle += diff * 0.05;
        }

        let angleDiff = this.targetAngle - this.angle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        this.angle += angleDiff * 0.06;

        const wobble = Math.sin(this.time) * 0.4;

        this.x += Math.cos(this.angle + wobble) * this.speed;
        this.y += Math.sin(this.angle + wobble) * this.speed;

        this.segments[0].x = this.x;
        this.segments[0].y = this.y;
        for (let i = 1; i < this.numSegments; i++) {
          const prev = this.segments[i - 1];
          const curr = this.segments[i];
          const dx = prev.x - curr.x;
          const dy = prev.y - curr.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist > this.segmentSpacing) {
            curr.x = prev.x - (dx / dist) * this.segmentSpacing;
            curr.y = prev.y - (dy / dist) * this.segmentSpacing;
          }
        }
      }

      draw(context: CanvasRenderingContext2D) {
        for (let i = 0; i < this.numSegments; i++) {
          const seg = this.segments[i];
          const bodyWidth = Math.sin((i / (this.numSegments - 1)) * Math.PI) * 12 + 1;
          
          let segAngle = this.angle;
          if (i > 0) {
            const prev = this.segments[i - 1];
            segAngle = Math.atan2(prev.y - seg.y, prev.x - seg.x);
          }

          context.save();
          context.translate(seg.x, seg.y);
          context.rotate(segAngle);

          context.fillStyle = `rgba(0, 229, 255, ${1 - i / this.numSegments})`;
          // Optimize physics/render: Minimal shadow usage to guarantee high frame rate
          context.shadowColor = "#00E5FF";
          context.shadowBlur = i % 3 === 0 ? 5 : 0; 
          
          context.fillRect(-this.segmentSpacing / 2, -bodyWidth / 2, this.segmentSpacing * 1.2, bodyWidth);
          
          if (i === 4) {
            context.fillRect(-2, -bodyWidth * 1.5, 4, bodyWidth * 3);
          }
          
          context.restore();
        }
      }
    }

    const particles: Particle[] = [];
    const numParticles = 1800; 
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    const fish = new DigitalFish();
    let animationFrameId: number;

    const render = () => {
      // Global parallax Lerp (Smooth, for the whole galaxy)
      mouseX += (instantMouseX - mouseX) * 0.05;
      mouseY += (instantMouseY - mouseY) * 0.05;
      const globalOffsetX = (width / 2 - mouseX) * 0.5;
      const globalOffsetY = (height / 2 - mouseY) * 0.5;

      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(width * 0.7, height * 0.5, 0, width * 0.7, height * 0.5, 800);
      gradient.addColorStop(0, "rgba(0, 100, 150, 0.15)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "lighter";

      fish.update();

      for (let i = 0; i < particles.length; i++) {
        // Pass instant mouse coords to particles for absolute, instant reaction
        particles[i].update(fish.x, fish.y, globalOffsetX, globalOffsetY);
        particles[i].draw(ctx);
      }

      fish.draw(ctx);

      ctx.globalCompositeOperation = "source-over";
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
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
