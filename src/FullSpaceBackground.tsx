import { Particles, ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

export default function FullSpaceBackground() {
  return (
    <ParticlesProvider init={async (engine: Engine) => await loadSlim(engine)}>
      <Particles
        id="tsparticles"
      className="fixed inset-0 w-full h-full -z-10 pointer-events-auto"
      options={{
        background: {
          color: {
            value: "#050505",
          },
        },
        fpsLimit: 120,
        interactivity: {
          detectsOn: "window",
          events: {
            onHover: {
              enable: true,
              mode: ["repulse", "grab"],
              parallax: {
                enable: true,
                force: 60,
                smooth: 10,
              },
            },
            resize: { enable: true },
          },
          modes: {
            repulse: {
              distance: 150,
              duration: 0.4,
              factor: 2,
              speed: 1,
            },
            grab: {
              distance: 200,
              links: {
                opacity: 0.5,
                color: "#00E5FF",
              },
            },
          },
        },
        particles: {
          color: {
            value: ["#00E5FF", "#39FF14", "#ffffff"],
          },
          links: {
            color: "#00E5FF",
            distance: 120,
            enable: true,
            opacity: 0.1,
            width: 1,
            triangles: {
              enable: true,
              opacity: 0.03,
            },
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "out",
            },
            random: true,
            speed: 0.5,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              width: 1920,
              height: 1080,
            },
            value: 200,
          },
          opacity: {
            value: { min: 0.1, max: 0.8 },
            animation: {
              enable: true,
              speed: 0.5,
              sync: false,
            },
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 0.5, max: 4 },
            animation: {
              enable: true,
              speed: 2,
              sync: false,
            },
          },
          shadow: {
            enable: true,
            color: "#00E5FF",
            blur: 15,
          },
        },
        detectRetina: true,
      }}
    />
    </ParticlesProvider>
  );
}
