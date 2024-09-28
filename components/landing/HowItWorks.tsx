"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClipboard, FiSettings, FiFileText, FiSend, FiActivity, FiRefreshCw } from 'react-icons/fi';

const steps = [
  {
    step: 1,
    text: "Begin by filling out the necessary details about your Para Autonomous Organization such as name of organization.",
    icon: FiClipboard,
    reverse: false
  },
  {
    step: 2,
    text: "Define roles, and interactions within your organization",
    icon: FiSettings,
    reverse: true
  },
  {
    step: 3,
    text: "Mint different types of tokens (NFTs, SPL tokens, SBTs) for various purposes (citizenship, governance, voting, proposals).",
    icon: FiFileText,
    reverse: false
  },
  {
    step: 4,
    text: "Invite members to join your PAO by sending them invitations via email or unique links. Members can then register and become part of your organization.",
    icon: FiSend,
    reverse: true
  },
  {
    step: 5,
    text: "Use the dashboard to manage and monitor your PAO's activities. Track performance, review governance decisions, and ensure everything runs smoothly.",
    icon: FiActivity,
    reverse: false
  },
  {
    step: 6,
    text: "Gather feedback from your members and make improvements to your PAO as needed. Test and interact with other governance models, and refine processes.",
    icon: FiRefreshCw,
    reverse: true
  }
];

const HowItWorks = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-teal-500 to-black w-full min-h-screen py-12 md:py-20 overflow-hidden">
      {/* Animated background particles */}
      {[...Array(isMobile ? 25 : 50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-teal-500 bg-opacity-20"
          style={{
            width: Math.random() * (isMobile ? 10 : 20) + 5,
            height: Math.random() * (isMobile ? 10 : 20) + 5,
          }}
          animate={{
            x: [0, `${Math.random() * 100}%`],
            y: [0, `${Math.random() * 100}%`],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
      
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-teal-200 text-center mb-8 md:mb-16 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        How It Works?
      </motion.h1>

      <div className="container mx-auto px-4">
        {steps.map((step, index) => (
          <motion.div 
            key={index} 
            className={`flex flex-col ${isMobile ? '' : (step.reverse ? 'md:flex-row-reverse' : 'md:flex-row')} items-center mb-12 md:mb-16 relative`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <motion.div 
              className="mb-4 md:mb-0 md:mx-8 bg-teal-600 rounded-full p-4 shadow-lg"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <step.icon size={isMobile ? 32 : 48} className="text-white"/>
            </motion.div>
            <motion.div 
              className="w-full md:w-2/3 p-4 md:p-6 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-xl"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-semibold mb-2 md:mb-3 text-teal-300">{step.step}</h2>
              <p className="text-gray-200 text-base md:text-lg">{step.text}</p>
            </motion.div>
            {!isMobile && index < steps.length - 1 && (
              <motion.div 
                className="absolute top-full left-1/2 w-1 h-16 bg-teal-500"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;