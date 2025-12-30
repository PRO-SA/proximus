'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const shapes = [
  { size: 400, x: '10%', y: '20%', color: 'var(--blue)', delay: 0 },
  { size: 300, x: '80%', y: '30%', color: 'var(--mauve)', delay: 0.5 },
  { size: 250, x: '20%', y: '70%', color: 'var(--mauve)', delay: 1 },
  { size: 350, x: '70%', y: '80%', color: 'var(--blue)', delay: 1.5 },
];

export function Background() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(var(--foreground) 1px, transparent 1px),
            linear-gradient(90deg, var(--foreground) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating shapes */}
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[100px]"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
            background: shape.color,
            opacity: 0.08,
          }}
          animate={
            reducedMotion
              ? {}
              : {
                  x: [0, 30, -20, 0],
                  y: [0, -20, 30, 0],
                  scale: [1, 1.1, 0.95, 1],
                }
          }
          transition={{
            duration: 20 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: shape.delay,
          }}
        />
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
    </div>
  );
}
