import { useState } from 'react';

/**
 * EventHorizon — Reusable visual component inspired by a black hole's
 * event horizon and accretion disk.
 *
 * Variants:
 *  - hero     : Large decorative ring for profile banner backgrounds
 *  - avatar   : Wraps children (avatar image) with a glowing ring frame
 *  - spinner  : Animated loading spinner
 */

const EventHorizon = ({ variant = 'avatar', children, className = '', size }) => {
  const sizeMap = {
    hero: size || 320,
    avatar: size || 140,
    spinner: size || 40,
  };

  const currentSize = sizeMap[variant] || sizeMap.avatar;

  if (variant === 'spinner') {
    return (
      <div
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: currentSize, height: currentSize }}
      >
        {/* Accretion disk ring */}
        <div
          className="absolute inset-0 rounded-full animate-[accretion-spin_2s_linear_infinite]"
          style={{
            background: `conic-gradient(
              from 0deg,
              transparent 0%,
              var(--color-primary) 25%,
              var(--color-primary-container) 50%,
              transparent 75%,
              var(--color-primary) 100%
            )`,
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
          }}
        />
        {/* Center void */}
        <div
          className="absolute rounded-full bg-background"
          style={{
            width: currentSize - 8,
            height: currentSize - 8,
          }}
        />
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: currentSize, height: currentSize }}
      >
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full opacity-30 blur-xl"
          style={{
            background: `radial-gradient(circle, var(--color-primary) 0%, transparent 70%)`,
          }}
        />
        {/* Accretion disk — slow rotating conic gradient */}
        <div
          className="absolute inset-4 rounded-full animate-[accretion-spin_20s_linear_infinite]"
          style={{
            background: `conic-gradient(
              from 0deg,
              transparent 0%,
              rgba(188,198,231,0.08) 10%,
              rgba(188,198,231,0.25) 25%,
              rgba(32,42,68,0.6) 40%,
              transparent 50%,
              rgba(188,198,231,0.15) 65%,
              rgba(32,42,68,0.4) 80%,
              transparent 100%
            )`,
            mask: 'radial-gradient(farthest-side, transparent 55%, #000 56%, #000 100%)',
            WebkitMask: 'radial-gradient(farthest-side, transparent 55%, #000 56%, #000 100%)',
          }}
        />
        {/* Inner ring edge */}
        <div
          className="absolute rounded-full border border-primary/20"
          style={{
            width: currentSize * 0.55,
            height: currentSize * 0.55,
            boxShadow: '0 0 30px rgba(188,198,231,0.15), inset 0 0 20px rgba(188,198,231,0.1)',
          }}
        />
        {/* Black hole center */}
        <div
          className="absolute rounded-full"
          style={{
            width: currentSize * 0.45,
            height: currentSize * 0.45,
            background: 'radial-gradient(circle, var(--color-event-horizon-void, #07090E) 60%, var(--color-surface) 100%)',
          }}
        />
        {children}
      </div>
    );
  }

  // variant === 'avatar'
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: currentSize, height: currentSize }}
    >
      {/* Outer glow */}
      <div
        className="absolute -inset-1 rounded-full opacity-40"
        style={{
          background: `conic-gradient(
            from 180deg,
            transparent 0%,
            rgba(188,198,231,0.4) 30%,
            transparent 50%,
            rgba(188,198,231,0.2) 80%,
            transparent 100%
          )`,
          filter: 'blur(4px)',
          animation: 'accretion-spin 8s linear infinite',
        }}
      />
      {/* Ring border */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(
            from 0deg,
            var(--color-primary-container) 0%,
            var(--color-primary) 25%,
            var(--color-primary-container) 50%,
            var(--color-primary) 75%,
            var(--color-primary-container) 100%
          )`,
          animation: 'accretion-spin 12s linear infinite',
        }}
      />
      {/* Inner cutout for avatar */}
      <div
        className="absolute rounded-full bg-surface overflow-hidden flex items-center justify-center"
        style={{
          width: currentSize - 6,
          height: currentSize - 6,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default EventHorizon;
