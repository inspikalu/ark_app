"use client"
import React from 'react';
import { motion } from 'framer-motion';

const FuturisticLoadingAnimation = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-teal-500 to-teal-700">
      <motion.div
        className="relative w-24 h-24"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <motion.span
          className="absolute inset-0 rounded-full border-4 border-t-white border-r-white border-b-transparent border-l-transparent"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.span
          className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-transparent border-b-white border-l-white"
          animate={{
            rotate: -360,
            scale: [1, 0.8, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-4 bg-white rounded-full"
          animate={{
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
};

export default FuturisticLoadingAnimation;