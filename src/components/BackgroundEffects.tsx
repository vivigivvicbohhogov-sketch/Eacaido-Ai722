import React from 'react';
import { motion } from 'motion/react';

export const BackgroundEffects: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black text-white">
      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.05]" />

      {/* Floating Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-zinc-800/10 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        animate={{
          x: [0, -80, 100, 0],
          y: [0, 80, -60, 0],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-700/10 rounded-full blur-3xl pointer-events-none"
      />
    </div>
  );
};
