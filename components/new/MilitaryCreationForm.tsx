'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { MilJuntaClient, useMilJuntaClient, InitializeJuntaArgs, JuntaTokenConfig } from '../../client/military/initializeMilitary';
import { CustomWallet } from './CustomWallet';


const PROGRAM_ID = new PublicKey('2fPj7RDkm4FJouSo6DE6vHbE5rjTvdZPnnxJUgFvYVm2');

interface MilJuntaCreationFormProps {
  governanceType: 'military-junta';
}

const MilJuntaCreationForm: React.FC<MilJuntaCreationFormProps> = ({ governanceType }) => {
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<MilJuntaClient | null>(null);
  const [nftTokenType, setNftTokenType] = useState('new');
  const [splTokenType, setSplTokenType] = useState('new');
  const router = useRouter();
  const { connection } = useConnection();
  const wallet = useWallet();

  const milJuntaClient = useMilJuntaClient(connection, new CustomWallet(wallet), PROGRAM_ID);

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      setClient(milJuntaClient);
      setLoading(false);
    } else {
      setClient(null);
    }
  }, [wallet.connected, wallet.publicKey, connection, milJuntaClient]);

  if (!wallet.connected) {
    return <div>Please connect your wallet to create a Military Junta PAO.</div>;
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
      const nftConfig: JuntaTokenConfig = nftTokenType === 'new'
        ? { token_type: { new: {} }, token_mint: PublicKey.default }
        : { token_type: { existing: {} }, token_mint: new PublicKey(formData.get('nftMintAddress') as string) };

      const splConfig: JuntaTokenConfig = splTokenType === 'new'
        ? { token_type: { new: {} }, token_mint: PublicKey.default }
        : { token_type: { existing: {} }, token_mint: new PublicKey(formData.get('splMintAddress') as string) };

      const args: InitializeJuntaArgs = {
        name: formData.get('name') as string,
        supply: Number(formData.get('supply')),
        symbol: formData.get('symbol') as string,
        support_threshold: Number(formData.get('support_threshold')),
        collection_price: new BN(formData.get('collection_price') as string),
        nft_config: nftConfig,
        spl_config: splConfig,
        nft_symbol: formData.get('nft_symbol') as string,
        spl_symbol: formData.get('spl_symbol') as string,
        nft_supply: new BN(formData.get('nft_supply') as string),
        spl_supply: new BN(formData.get('spl_supply') as string),
        primary_junta_token: formData.get('primary_junta_token') === 'NFT' ? { NFT: {} } : { SPL: {} },
      };

      const tx = await client.initializeMilJunta(args);
      console.log('Transaction successful:', tx);
      router.push(`/pao/${tx}`);
    } catch (error) {
      console.error('Error creating Military Junta PAO:', error);
      alert(`Error creating Military Junta PAO: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
          <label htmlFor="supply" className="block text-white mb-2">Supply</label>
          <input type="number" id="supply" name="supply" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="symbol" className="block text-white mb-2">Symbol</label>
          <input type="text" id="symbol" name="symbol" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="support_threshold" className="block text-white mb-2">Support Threshold</label>
          <input type="number" id="support_threshold" name="support_threshold" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="collection_price" className="block text-white mb-2">Collection Price</label>
          <input type="number" id="collection_price" name="collection_price" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
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
        {/* NFT Configuration */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">NFT Configuration</h3>
          <div>
            <label htmlFor="nftTokenType" className="block text-white mb-2">NFT Token Type</label>
            <select 
              id="nftTokenType" 
              name="nftTokenType" 
              className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3"
              value={nftTokenType}
              onChange={(e) => setNftTokenType(e.target.value)}
            >
              <option value="new">Create New NFT</option>
              <option value="existing">Use Existing NFT</option>
            </select>
          </div>
          {nftTokenType === 'existing' && (
            <div>
              <label htmlFor="nftMintAddress" className="block text-white mb-2">NFT Mint Address</label>
              <input 
                type="text" 
                id="nftMintAddress" 
                name="nftMintAddress" 
                className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" 
                placeholder="Enter NFT mint address"
              />
            </div>
          )}
        </div>
        {/* SPL Configuration */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">SPL Token Configuration</h3>
          <div>
            <label htmlFor="splTokenType" className="block text-white mb-2">SPL Token Type</label>
            <select 
              id="splTokenType" 
              name="splTokenType" 
              className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3"
              value={splTokenType}
              onChange={(e) => setSplTokenType(e.target.value)}
            >
              <option value="new">Create New SPL Token</option>
              <option value="existing">Use Existing SPL Token</option>
            </select>
          </div>
          {splTokenType === 'existing' && (
            <div>
              <label htmlFor="splMintAddress" className="block text-white mb-2">SPL Token Mint Address</label>
              <input type="text" 
                id="splMintAddress" 
                name="splMintAddress" 
                className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" 
                placeholder="Enter SPL token mint address"
              />
            </div>
          )}
        </div>
        <div>
          <label htmlFor="primary_junta_token" className="block text-white mb-2">Primary Junta Token</label>
          <select id="primary_junta_token" name="primary_junta_token" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3">
            <option value="NFT">NFT</option>
            <option value="SPL">SPL</option>
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
        {loading ? 'Creating...' : 'Create Military Junta PAO'}
      </motion.button>
    </motion.form>
  );
};

export default MilJuntaCreationForm;