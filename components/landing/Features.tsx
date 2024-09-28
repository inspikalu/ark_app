"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { FiLink, FiSettings, FiLayers, FiGlobe } from 'react-icons/fi';
import Image from 'next/image';


interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon: Icon }) => (
  <motion.div
    className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 sm:p-6 flex flex-col items-center text-center"
    whileHover={{ scale: 1.05, rotateY: 10 }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="text-teal-300 text-3xl sm:text-4xl mb-3 sm:mb-4"
      initial={{ rotateY: 0 }}
      whileHover={{ rotateY: 360 }}
      transition={{ duration: 0.6 }}
    >
      <Icon />
    </motion.div>
    <h3 className="text-lg sm:text-xl font-semibold text-teal-100 mb-2">{title}</h3>
    <p className="text-sm sm:text-base text-gray-300">{description}</p>
  </motion.div>
);

const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: "Interoperability",
      description: "ARK allows for multiple instances (such as different organizations) to interact and collaborate.",
      icon: FiLink
    },
    {
      title: "Flexibility",
      description: "ARK allows users to experiment with different governance models (like transitioning from a DAO to a CAO or another structure) without losing their data or historical records.",
      icon: FiSettings
    },
    {
      title: "Modularity",
      description: "ARK allows users to run multiple instances of its program simultaneously. Independency and parallel execution makes it possible for ARK to handle various tasks without interference.",
      icon: FiLayers
    },
    {
      title: "Governance Agnosticism",
      description: "ARK allows users to seamlessly interact with any governance structure, whether it's a CAO or a DAO",
      icon: FiGlobe
    }
  ];

  return (
    <>
    <section className="w-full bg-black py-2 sm:py-8 text-center flex items-center justify-center">
      <motion.h2 
        className="text-2xl font-bold text-teal-400 font-orbitron pr-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Powered by
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Image
          src="/images/solana.png" 
          alt="Solana Logo"
          width={150}
          height={120}
        />
      </motion.div>
    </section>

      <section className="w-full bg-gradient-to-br from-teal-900 to-black py-12 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-teal-200 text-center mb-3 sm:mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Deciphering the Enigma
          </motion.h2>
          <motion.p 
            className="text-base sm:text-xl text-gray-300 text-center mb-8 sm:mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            PAOs are governance structures that address the limitations of the current DAO structure by providing a flexible and interoperable system through ARK for onchain governance.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturesSection;