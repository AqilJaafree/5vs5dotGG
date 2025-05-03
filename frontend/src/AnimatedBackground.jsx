import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <motion.div 
      className="fixed inset-0 overflow-hidden -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Top left area */}
      <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
      
      {/* Bottom right area */}
      <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -bottom-40 -right-36 animate-pulse" />
      
      {/* Additional circles with different positions, sizes, and animation speeds */}
      
      {/* Top right */}
      <div className="absolute w-80 h-80 bg-blue-500/15 rounded-full blur-3xl top-0 right-12 animate-pulse-slow" />
      
      {/* Left middle */}
      <div className="absolute w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl left-0 top-1/3 animate-pulse-slower" />
      
      {/* Center left */}
      <div className="absolute w-64 h-64 bg-violet-500/15 rounded-full blur-3xl left-1/4 top-1/2 animate-pulse-fast" />
      
      {/* Center */}
      <div className="absolute w-80 h-80 bg-fuchsia-400/10 rounded-full blur-3xl left-1/2 top-1/3 -translate-x-1/2 animate-ping-slow" />
      
      {/* Right middle */}
      <div className="absolute w-60 h-60 bg-cyan-400/15 rounded-full blur-3xl right-1/4 top-2/3 animate-pulse-slower" />
      
      {/* Bottom left */}
      <div className="absolute w-56 h-56 bg-teal-500/20 rounded-full blur-3xl left-16 bottom-8 animate-pulse-fast" />
      
      {/* Bottom center */}
      <div className="absolute w-64 h-64 bg-rose-400/15 rounded-full blur-3xl left-1/2 bottom-0 -translate-x-1/2 animate-pulse" />
      
      {/* Smaller scattered circles */}
      <div className="absolute w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl left-1/3 top-1/4 animate-bounce-slow" />
      <div className="absolute w-32 h-32 bg-amber-400/15 rounded-full blur-2xl right-1/3 top-1/6 animate-pulse-slower" />
      <div className="absolute w-36 h-36 bg-sky-400/20 rounded-full blur-2xl right-1/5 bottom-1/4 animate-pulse-fast" />
      <div className="absolute w-24 h-24 bg-lime-400/15 rounded-full blur-xl left-2/3 top-2/5 animate-ping-slow" />
    </motion.div>
  );
};

export default AnimatedBackground;