// src/components/AnimatedBackground.js
import React, { useEffect } from "react";
import "../styles/animations.css";
import { createParticle, fadeInOnScroll } from "../animations/animations";

function AnimatedBackground({ children }) {
  // Particle click
  const handleClick = (e) => createParticle(e.clientX, e.clientY);

  // Fade-in elements on scroll
  useEffect(() => {
    fadeInOnScroll();
  }, []);

  return (
    <div className="animated-bg" onClick={handleClick}>
      {children}
    </div>
  );
}

export default AnimatedBackground;
