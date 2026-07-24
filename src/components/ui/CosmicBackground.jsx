// @filename src/components/ui/CosmicBackground.jsx

'use client';

import React, { useEffect, useRef } from 'react';

const CosmicBackground = () => {
  const containerRef = useRef(null);
  const starsRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !starsRef.current || !particlesRef.current) return;

    const createStars = () => {
      if (!starsRef.current) return;
      const starCount = Math.min(window.innerWidth / 4, 150);
      const constellationPoints = [];

      for (let i = 0; i < starCount; i++) {
        const size = Math.random() * 2.5 + 0.5;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const opacity = Math.random() * 0.6 + 0.1;
        const delay = Math.random() * 5;

        const color = Math.random() < 0.3 ? 'rgba(224, 246, 255, 0.8)' : 'rgba(255, 255, 255, 0.6)';

        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.opacity = `${opacity}`;
        star.style.animationDelay = `${delay}s`;
        star.style.background = color;
        star.style.boxShadow = `0 0 ${size * 2}px ${color}`;

        starsRef.current?.appendChild(star);

        if (size > 1.8 && Math.random() < 0.15) {
          constellationPoints.push({ x, y, size });
        }
      }

      if (constellationPoints.length > 3 && starsRef.current) {
        const constellation = document.createElement('div');
        constellation.className = 'constellation';
        constellation.innerHTML = generateConstellationPath(constellationPoints);
        starsRef.current.appendChild(constellation);
      }
    };

    const createParticles = () => {
      if (!particlesRef.current) return;
      const particleCount = Math.min(window.innerWidth / 8, 40);

      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 2 + 0.5;
        const startX = Math.random() * 100;
        const startY = -20 - Math.random() * 30;
        const duration = 15 + Math.random() * 20;
        const delay = Math.random() * 10;
        const opacity = Math.random() * 0.3 + 0.1;

        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${startX}%`;
        particle.style.opacity = `${opacity}`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        particlesRef.current?.appendChild(particle);
      }
    };

    const generateConstellationPath = (points) => {
      if (points.length < 2) return '';

      let path = 'M';
      points.forEach((point, index) => {
        path += `${point.x}% ${point.y}% `;
        if (index > 0) {
          const prev = points[index - 1];
          const lineOpacity = 0.1 + (Math.random() * 0.1);
          path += `L ${prev.x}% ${prev.y}% \\\n`;
          path += `Q ${(point.x + prev.x) / 2}% ${(point.y + prev.y) / 2}% `;
        }
      });

      return `<svg width="100%" height="100%"><path d="${path}" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" fill="none"/></svg>`;
    };

    createStars();
    createParticles();

    const handleResize = () => {
      if (!starsRef.current || !particlesRef.current) return;

      starsRef.current.innerHTML = '';
      particlesRef.current.innerHTML = '';

      createStars();
      createParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className="star-background">
      <div ref={starsRef} className="absolute inset-0" />
      <div ref={particlesRef} className="absolute inset-0" />
    </div>
  );
};

export default CosmicBackground;
