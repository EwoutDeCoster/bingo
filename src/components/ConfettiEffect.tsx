'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiEffectProps {
  active: boolean;
}

export default function ConfettiEffect({ active }: ConfettiEffectProps) {
  useEffect(() => {
    if (active) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ffbe0b', '#ff006e', '#00b4d8', '#ff7096', '#70e000'] // custom color palette matching retro style
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ffbe0b', '#ff006e', '#00b4d8', '#ff7096', '#70e000']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [active]);

  return null;
}
