"use client";
import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const PAOCards = () => {
  const [, setHoveredCard] = useState<number | null>(null);
  const controls = useAnimation();

  const paoTypes = [
    {
      title: "Absolute Monarchy",
      description:
        "Centralized power structure with a single ruler making decisions on-chain.",
      icon: "👑",
    },
    {
      title: "Sortition",
      description:
        "Random selection of governance participants for decision-making roles.",
      icon: "🎲",
    },
    {
      title: "Military Junta",
      description:
        "Governance by a committee of military leaders with stratified voting power.",
      icon: "🪖",
    },
    {
      title: "Sociocracy",
      description:
        "Nested circles of decision-making with consent-based governance.",
      icon: "🔄",
    },
    {
      title: "Conviction Voting",
      description:
        "Voting power increases over time to reward long-term stakeholders.",
      icon: "⏳",
    },
    {
      title: "Direct Democracy",
      description:
        "All participants have equal voting rights on all decisions.",
      icon: "🗳️",
    },
  ];

  useEffect(() => {
    const scrollAnimation = async () => {
      await controls.start({
        x: [0, -1600], // Adjust based on total width of cards
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 40,
            ease: "linear",
          },
        },
      });
    };
    scrollAnimation();
  }, [controls]);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-teal-900 via-black to-teal-800 py-20 overflow-hidden">
      {/* Animated background lights */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-teal-500 bg-opacity-20"
          style={{
            width: Math.random() * 20 + 5,
            height: Math.random() * 20 + 5,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}

      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-teal-200 text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Choose or test any PAO you think would suit your organization.
          <span className="block mt-2 text-xl md:text-2xl text-teal-100">
            Your data is safe and secured
          </span>
        </motion.h2>

        <div className="overflow-hidden">
          <motion.div
            className="flex space-x-6"
            animate={controls}
            style={{ width: "200%" }}
          >
            {[...paoTypes, ...paoTypes].map((pao, index) => (
              <motion.div
                key={`${pao.title}-${index}`}
                className="w-80 flex-shrink-0 bg-gradient-to-br from-teal-800 to-teal-600 rounded-xl shadow-lg overflow-hidden relative"
                whileHover={{ scale: 1.05, zIndex: 1 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <motion.div
                  className="absolute inset-0 opacity-50"
                  style={{
                    background: `radial-gradient(circle, rgba(0,128,128,0.4) 0%, rgba(0,0,0,0) 70%)`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                <div className="relative p-6 z-10">
                  <div className="text-4xl mb-4">{pao.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {pao.title}
                  </h3>
                  <p className="text-teal-100 mb-4">{pao.description}</p>
                  <motion.button
                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create {pao.title}
                  </motion.button>
                </div>
                {/* Particle effect for each card */}
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-teal-300 bg-opacity-50"
                    style={{
                      width: Math.random() * 10 + 2,
                      height: Math.random() * 10 + 2,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      x: [0, Math.random() * 50 - 25],
                      y: [0, Math.random() * 50 - 25],
                    }}
                    transition={{
                      duration: Math.random() * 5 + 5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                ))}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PAOCards;
