"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import Header from "../components/landing/Header"; // Make sure the path is correct

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      <Header />
      <section className="relative min-h-screen flex items-center justify-center text-center p-5 overflow-hidden bg-gradient-to-br from-black to-teal-900">
        <motion.div
          className="absolute inset-0 z-0"
          animate={{
            background: [
              "linear-gradient(45deg, #000000, #001a1a)",
              "linear-gradient(45deg, #001a1a, #003333)",
              "linear-gradient(45deg, #003333, #004d4d)",
              "linear-gradient(45deg, #004d4d, #006666)",
              "linear-gradient(45deg, #006666, #000000)",
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
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold text-teal-200 mb-6"
          >
            404
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-3xl text-white mb-8"
          >
            Oops! Looks like you&apos;ve ventured into an uncharted realm.
            Let&apos;s take you back to ARK🌊.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-teal-500 text-white font-semibold py-3 px-8 rounded-full text-lg transition-colors duration-300 hover:bg-teal-600 flex items-center justify-center mx-auto"
            onClick={() => router.back()}
          >
            <FiArrowLeft className="mr-2" size={20} />
            Go Back
          </motion.button>
        </div>

        {[...Array(30)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-teal-500 bg-opacity-20"
            style={{
              width: Math.random() * 60 + 10,
              height: Math.random() * 60 + 10,
            }}
            initial={{
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
              scale: 0,
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
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
        ))}
      </section>
    </>
  );
}
