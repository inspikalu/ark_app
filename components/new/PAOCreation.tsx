"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload } from "react-icons/fi";
import DidYouKnowModal from "./DidYouKnowModal";

const PaoCreationPage = () => {
  const [loading, setLoading] = useState(true);
  const [, setShowModal] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
      setShowModal(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Implement form submission logic
    const paoId = "example-pao-id";
    router.push(`/pao/${paoId}`);
  };

  if (loading) {
    return (
      <div className="flex items-start pt-5 justify-center min-h-screen bg-gradient-to-r from-teal-700 to-teal-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-white text-2xl"
        >
          <AnimatePresence>
            <DidYouKnowModal isLoading={loading} />
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-700 to-teal-900 p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-white mb-8 capitalize"
      >
        Create new {params.type} PAO
      </motion.h1>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-black bg-opacity-50 p-6 rounded-lg space-y-6"
      >
        <div>
          <label className="block text-white mb-2">Flag</label>
          <div className="flex items-center space-x-2">
            <label className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-4 rounded cursor-pointer">
              <FiUpload className="inline-block mr-2" />
              Upload Image
              <input type="file" accept="image/*" required className="hidden" />
            </label>
            <span className="text-white text-sm">No file chosen</span>
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-white mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            required
            className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-white mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            required
            className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3"
          ></textarea>
        </div>

        <div>
          <label htmlFor="nftMint" className="block text-white mb-2">
            NFT Mint Address
          </label>
          <input
            type="text"
            id="nftMint"
            required
            className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3"
          />
        </div>

        <div>
          <label htmlFor="splTokenMint" className="block text-white mb-2">
            SPL Token Mint Address
          </label>
          <input
            type="text"
            id="splTokenMint"
            required
            className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-4 rounded"
        >
          Create
        </motion.button>
      </motion.form>
    </div>
  );
};

export default PaoCreationPage;
