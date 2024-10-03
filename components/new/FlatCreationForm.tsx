'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { FlatDaoClient, useFlatDaoClient, Time, DaoCreateArgs } from '../../client/flat/initializeFlat';
import { CustomWallet } from './CustomWallet';

const PROGRAM_ID = new PublicKey('FNF2M3rVeAhQ28VTCNVYzfKTnX1ZcStGuDZ9geVzY38Q');

interface FlatDaoCreationFormProps {
  governanceType: 'flat-dao';
}

const FlatDaoCreationForm: React.FC<FlatDaoCreationFormProps> = ({ governanceType }) => {
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<FlatDaoClient | null>(null);
  const router = useRouter();
  const { connection } = useConnection();
  const wallet = useWallet();

  const flatDaoClient = useFlatDaoClient(connection, new CustomWallet(wallet), PROGRAM_ID);

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      setClient(flatDaoClient);
      setLoading(false);
    } else {
      setClient(null);
    }
  }, [wallet.connected, wallet.publicKey, connection, flatDaoClient]);

  if (!wallet.connected) {
    return <div>Please connect your wallet to create a Flat DAO.</div>;
  }

  if (!client) {
    return <div>Initializing client...</div>;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!client || !wallet.publicKey) {
      alert("Wallet not connected or client not initialized");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData(event.currentTarget);
      const args: DaoCreateArgs = {
        time: { [formData.get('time') as string]: {} } as Time,
        threshold: Number(formData.get('threshold')),
        minPollTokens: new BN(formData.get('minPollTokens') as string),
        name: formData.get('name') as string,
      };

      const mintAddress = formData.get('mintAddress') as string;
      const mint = new PublicKey(mintAddress);

      const tx = await client.daoCreate(args, mint);
      console.log('Transaction successful:', tx);
      router.push(`/pao/${tx}`);
    } catch (error) {
      console.error('Error creating Flat DAO:', error);
      alert(`Error creating Flat DAO: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-black bg-opacity-50 p-6 rounded-lg space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-white mb-2">DAO Name</label>
          <input type="text" id="name" name="name" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="time" className="block text-white mb-2">Voting Period</label>
          <select id="time" name="time" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3">
            <option value="FiveSeconds">5 Seconds (for testing)</option>
            <option value="TwentyFourHours">24 Hours</option>
            <option value="FourtyEightHours">48 Hours</option>
            <option value="OneWeek">One Week</option>
          </select>
        </div>
        <div>
          <label htmlFor="threshold" className="block text-white mb-2">Approval Threshold (%)</label>
          <input type="number" id="threshold" name="threshold" min="50" max="100" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="minPollTokens" className="block text-white mb-2">Minimum Tokens to Start Poll</label>
          <input type="number" id="minPollTokens" name="minPollTokens" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="mintAddress" className="block text-white mb-2">Governance Token Mint Address</label>
          <input type="text" id="mintAddress" name="mintAddress" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" placeholder="Enter SPL token mint address" />
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 0.98 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Flat DAO'}
      </motion.button>
    </motion.form>
  );
};

export default FlatDaoCreationForm;