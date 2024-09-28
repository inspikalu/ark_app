"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push('/create');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center text-center p-5 overflow-hidden bg-gradient-to-br from-black to-teal-900">
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            'linear-gradient(45deg, #000000, #001a1a)',
            'linear-gradient(45deg, #001a1a, #003333)',
            'linear-gradient(45deg, #003333, #004d4d)',
            'linear-gradient(45deg, #004d4d, #006666)',
            'linear-gradient(45deg, #006666, #000000)',
          ],
        }}
        transition={{
          duration: 10,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <div className="relative z-10 max-w-4xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold text-teal-200 mb-6 hero-title"
        >
          Para Autonomous Organizations
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-white mb-8 hero-subtitle"
        >
          The future of onchain governance
        </motion.p>
        <div className="flex justify-center items-center space-x-8">
        <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-teal-500 text-white font-semibold py-3 px-8 rounded-full text-lg transition-colors duration-300 hover:bg-teal-600 hero-button"
              onClick={handleClick}
            >
          Launch App
        </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-teal-500 font-semibold py-3 px-8 rounded-full text-lg transition-colors duration-300 hover:bg-teal-100 hover:text-teal-600 hero-button"
          >
            Read Litepaper
          </motion.button>
        </div>
      </div>

      {[...Array(20)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-teal-500 bg-opacity-20"
          style={{
            width: Math.random() * 50 + 10,
            height: Math.random() * 50 + 10,
          }}
          animate={{
            x: [
              `${Math.random() * 100}vw`,
              `${Math.random() * 100}vw`,
              `${Math.random() * 100}vw`,
            ],
            y: [
              `${Math.random() * 100}vh`,
              `${Math.random() * 100}vh`,
              `${Math.random() * 100}vh`,
            ],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      ))}
    </section>
  );
};

export default HeroSection;