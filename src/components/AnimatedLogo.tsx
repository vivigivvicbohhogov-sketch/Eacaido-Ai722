import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Video, Play } from 'lucide-react';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ size = 'md', onClick }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-xl',
    lg: 'w-20 h-20 text-3xl',
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 40,
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.05, rotateY: 10 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: ['0 0 15px rgba(255,255,255,0.1)', '0 0 25px rgba(255,255,255,0.25)', '0 0 15px rgba(255,255,255,0.1)'],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className={`relative cursor-pointer flex items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-700 text-white shadow-2xl overflow-hidden ${sizeClasses[size]}`}
      title="Escaido AI Logo (Click for Admin)"
    >
      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-zinc-700/30 to-transparent opacity-50 pointer-events-none" />
      <span className="font-black tracking-tighter flex items-center gap-1 z-10">
        <Sparkles size={iconSizes[size]} className="text-zinc-300 animate-pulse" />
        {size === 'lg' && <span className="text-white">EA</span>}
      </span>
    </motion.div>
  );
};
