'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { SortitionClient, useSortitionClient } from '../../client/sortition/initializeSortition';
import { CustomWallet } from './CustomWallet';  

const PROGRAM_ID = new PublicKey('7naXQjiC6W4Vz28Z4cPjBqjWVFVbRipVrZ9VQsuUAPcg');

interface SortitionCreationFormProps {
  governanceType: 'sortition';
}

const SortitionCreationForm: React.FC<SortitionCreationFormProps> = ({ governanceType }) => {
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<SortitionClient | null>(null);
  const router = useRouter();
  const { connection } = useConnection();
  const wallet = useWallet();

  const sortitionClient = useSortitionClient(connection, new CustomWallet(wallet), PROGRAM_ID);

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      setClient(sortitionClient);
      setLoading(false);
    } else {
      setClient(null);
    }
  }, [wallet.connected, wallet.publicKey, connection, sortitionClient]);

  if (!wallet.connected) {
    return <div>Please connect your wallet to create a Sortition PAO.</div>;
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
      const args = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        assembly_size: Number(formData.get('assembly_size')),
        regions: Array(10).fill(0).map((_, i) => Number(formData.get(`region_${i}`))),
        age_groups: Array(5).fill(0).map((_, i) => Number(formData.get(`age_group_${i}`))),
        other_demographic: Array(3).fill(0).map((_, i) => Number(formData.get(`other_demographic_${i}`))),
        nft_config: null,  // Implement NFT config logic if needed
        spl_config: null,  // Implement SPL config logic if needed
        nft_symbol: formData.get('nft_symbol') as string,
        spl_symbol: formData.get('spl_symbol') as string,
        nft_supply: new BN(formData.get('nft_supply') as string),
        spl_supply: new BN(formData.get('spl_supply') as string),
        collection_price: new BN(formData.get('collection_price') as string),
        primary_governance_token: { nft: {} },  // or { spl: {} } based on your needs
        initialize_sbt: formData.get('initialize_sbt') === 'true',
      };

      const tx = await client.initializeSortitionGovernance(args);
      console.log('Transaction successful:', tx);
      router.push(`/pao/${tx}`);
    } catch (error) {
      console.error('Error creating Sortition PAO:', error);
      alert(`Error creating Sortition PAO: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
          <label htmlFor="name" className="block text-white mb-2">Name</label>
          <input type="text" id="name" name="name" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="description" className="block text-white mb-2">Description</label>
          <textarea id="description" name="description" rows={4} required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3"></textarea>
        </div>
        <div>
          <label htmlFor="assembly_size" className="block text-white mb-2">Assembly Size</label>
          <input type="number" id="assembly_size" name="assembly_size" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        {/* Add fields for regions, age_groups, and other_demographic */}
        {Array(10).fill(0).map((_, i) => (
          <div key={`region_${i}`}>
            <label htmlFor={`region_${i}`} className="block text-white mb-2">Region {i + 1}</label>
            <input type="number" id={`region_${i}`} name={`region_${i}`} required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
          </div>
        ))}
        {Array(5).fill(0).map((_, i) => (
          <div key={`age_group_${i}`}>
            <label htmlFor={`age_group_${i}`} className="block text-white mb-2">Age Group {i + 1}</label>
            <input type="number" id={`age_group_${i}`} name={`age_group_${i}`} required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
          </div>
        ))}
        {Array(3).fill(0).map((_, i) => (
          <div key={`other_demographic_${i}`}>
            <label htmlFor={`other_demographic_${i}`} className="block text-white mb-2">Other Demographic {i + 1}</label>
            <input type="number" id={`other_demographic_${i}`} name={`other_demographic_${i}`} required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
          </div>
        ))}
        <div>
          <label htmlFor="nft_symbol" className="block text-white mb-2">NFT Symbol</label>
          <input type="text" id="nft_symbol" name="nft_symbol" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="spl_symbol" className="block text-white mb-2">SPL Symbol</label>
          <input type="text" id="spl_symbol" name="spl_symbol" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="nft_supply" className="block text-white mb-2">NFT Supply</label>
          <input type="number" id="nft_supply" name="nft_supply" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="spl_supply" className="block text-white mb-2">SPL Supply</label>
          <input type="number" id="spl_supply" name="spl_supply" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="collection_price" className="block text-white mb-2">Collection Price</label>
          <input type="number" id="collection_price" name="collection_price" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="initialize_sbt" className="block text-white mb-2">Initialize SBT</label>
          <select id="initialize_sbt" name="initialize_sbt" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3">
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 0.98 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Sortition PAO'}
      </motion.button>
    </motion.form>
  );
};

export default SortitionCreationForm;