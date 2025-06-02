import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // <-- substitui isto

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine); // <-- corrige aqui
  }, []);

  const particlesOptions = {
    fullScreen: { enable: false },
    background: { color: "#0f172a" },
    particles: {
      number: { value: 60 },
      color: { value: "#60a5fa" },
      shape: { type: "circle" },
      opacity: { value: 0.3 },
      size: { value: 2 },
      move: { enable: true, speed: 1, direction: "none", outMode: "bounce" },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
      },
      modes: {
        repulse: { distance: 100 },
      },
    },
  };

  return <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />;
};

export default ParticlesBackground;


