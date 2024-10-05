import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import idl from '../../idl/the_ark_program.json';

const PROGRAM_ID = new PublicKey('48qaGS4sA7bqiXYE6SyzaFiAb7QNit1A7vdib7LXhW2V');

const InitializeArkAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { connection } = useConnection();
  const wallet = useWallet();

  const initializeArk = async () => {
    if (!wallet.publicKey) return;

    setLoading(true);
    try {
      const provider = new AnchorProvider(connection, wallet as any, {});
      const program = new Program(idl as any, provider);

      const arkAnalytics = web3.Keypair.generate();

      await program.methods.initializeArk()
        .accounts({
          arkAnalytics: arkAnalytics.publicKey,
          signer: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([arkAnalytics])
        .rpc();

      setSuccess(true);
    } catch (error) {
      console.error("Error initializing ARK:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-teal-600 mb-4">Initialize ARK Analytics</h2>
      <motion.button
        onClick={initializeArk}
        disabled={loading || !wallet.connected}
        className={`w-full bg-teal-500 text-white rounded-lg p-2 flex items-center justify-center ${
          loading || !wallet.connected ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-600'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? 'Initializing...' : 'Initialize ARK'}
      </motion.button>
      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-green-600 flex items-center"
        >
          <FiCheck className="mr-2" /> ARK Analytics initialized successfully!
        </motion.div>
      )}
    </motion.div>
  );
};

export default InitializeArkAnalytics;