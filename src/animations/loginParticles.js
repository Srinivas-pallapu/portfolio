// src/animations/loginParticles.js

export function initParticles() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas dimensions
  const setCanvasSize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  setCanvasSize();
  window.addEventListener('resize', setCanvasSize);

  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
      this.color = this.getRandomColor();
      this.opacity = Math.random() * 0.5 + 0.2;
      this.wobble = Math.random() * 2;
      this.wobbleSpeed = Math.random() * 0.02 + 0.01;
      this.wobbleOffset = Math.random() * Math.PI * 2;
    }

    getRandomColor() {
      const colors = [
        '#64ffda', // Teal
        '#00bfff', // Deep Sky Blue
        '#4dffea', // Light Teal
        '#a6ffcb', // Mint
        '#00ffff', // Cyan
        '#52d9b8', // Medium Teal
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wobble effect
      this.x += Math.sin(Date.now() * this.wobbleSpeed + this.wobbleOffset) * this.wobble * 0.1;
      this.y += Math.cos(Date.now() * this.wobbleSpeed + this.wobbleOffset) * this.wobble * 0.1;

      // Bounce off edges
      if (this.x > canvas.width) this.x = 0;
      else if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      else if (this.y < 0) this.y = canvas.height;

      // Fade in/out effect
      this.opacity += (Math.random() - 0.5) * 0.02;
      this.opacity = Math.max(0.1, Math.min(0.8, this.opacity));
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();

      // Glow effect
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(
        this.x, this.y, this.size,
        this.x, this.y, this.size * 3
      );
      gradient.addColorStop(0, this.color + '80'); // 50% opacity
      gradient.addColorStop(1, this.color + '00'); // 0% opacity
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  // Connection class for drawing lines between particles
  class Connection {
    constructor(particle1, particle2) {
      this.particle1 = particle1;
      this.particle2 = particle2;
      this.distance = this.calculateDistance();
      this.maxDistance = 150;
      this.opacity = 0.3;
    }

    calculateDistance() {
      const dx = this.particle1.x - this.particle2.x;
      const dy = this.particle1.y - this.particle2.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    update() {
      this.distance = this.calculateDistance();
      this.opacity = Math.max(0, 0.3 - (this.distance / this.maxDistance) * 0.3);
    }

    draw() {
      if (this.distance < this.maxDistance) {
        ctx.beginPath();
        ctx.moveTo(this.particle1.x, this.particle1.y);
        ctx.lineTo(this.particle2.x, this.particle2.y);
        ctx.strokeStyle = `rgba(100, 255, 218, ${this.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  // Create particles
  const particles = [];
  const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 20000));

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Create connections
  const connections = [];
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      connections.push(new Connection(particles[i], particles[j]));
    }
  }

  // Animation loop
  let animationId;
  let lastTime = 0;
  const fps = 60;
  const interval = 1000 / fps;

  function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;

    if (deltaTime >= interval) {
      // Clear canvas with subtle fade effect
      ctx.fillStyle = 'rgba(10, 25, 47, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      connections.forEach(connection => {
        connection.update();
        connection.draw();
      });

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw subtle gradient overlay
      drawGradientOverlay();
      
      lastTime = timestamp - (deltaTime % interval);
    }

    animationId = requestAnimationFrame(animate);
  }

  // Draw gradient overlay for depth
  function drawGradientOverlay() {
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
    );
    gradient.addColorStop(0, 'rgba(10, 25, 47, 0)');
    gradient.addColorStop(0.7, 'rgba(10, 25, 47, 0.3)');
    gradient.addColorStop(1, 'rgba(10, 25, 47, 0.6)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Start animation
  animate();

  // Cleanup function
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', setCanvasSize);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}

// Also export a cleanup function for React component cleanup
export function cleanupParticles() {
  const canvas = document.getElementById('bgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
}