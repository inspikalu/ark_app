import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { ConvictionClient, useConvictionClient, InitializeGovernanceArgs } from '../../client/conviction/initializeConviction';
import { CustomWallet } from './CustomWallet';
import { TokenConfig } from "../create/DashboardSearch";

const PROGRAM_ID = new PublicKey('ATsZoBzoVyPF97HLn9kt2ffNSGcnYwUApbNxfsVknNVr');

interface ConvictionCreationFormProps {
  governanceType: 'conviction';
}

const ConvictionCreationForm: React.FC<ConvictionCreationFormProps> = ({ governanceType }) => {
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<ConvictionClient | null>(null);
  const [nftTokenType, setNftTokenType] = useState('new');
  const [splTokenType, setSplTokenType] = useState('new');
  const router = useRouter();
  const { connection } = useConnection();
  const wallet = useWallet();

  const convictionClient = useConvictionClient(connection, new CustomWallet(wallet), PROGRAM_ID);

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      setClient(convictionClient);
      setLoading(false);
    } else {
      setClient(null);
    }
  }, [wallet.connected, wallet.publicKey, connection, convictionClient]);

  if (!wallet.connected) {
    return <div>Please connect your wallet to create a Conviction PAO.</div>;
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
      const nftConfig: TokenConfig | null = nftTokenType === 'new'
        ? { tokenType: { new: {} }, customMint: null }
        : { tokenType: { existing: {} }, customMint: new PublicKey(formData.get('nftMintAddress') as string) };

      const splConfig: TokenConfig | null = splTokenType === 'new'
        ? { tokenType: { new: {} }, customMint: null }
        : { tokenType: { existing: {} }, customMint: new PublicKey(formData.get('splMintAddress') as string) };

      const args: InitializeGovernanceArgs = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        nft_symbol: formData.get('nft_symbol') as string,
        spl_symbol: formData.get('spl_symbol') as string,
        nft_supply: new BN(formData.get('nft_supply') as string),
        spl_supply: new BN(formData.get('spl_supply') as string),
        approval_threshold: new BN(formData.get('approval_threshold') as string),
        min_stake_amount: new BN(formData.get('min_stake_amount') as string),
        collection_price: new BN(formData.get('collection_price') as string),
        nft_config: nftConfig,
        spl_config: splConfig,
        primary_governance_token: formData.get('primary_governance_token') === 'nft' ? { nft: {} } : { spl: {} },
        initialize_sbt: formData.get('initialize_sbt') === 'true',
      };

      const tx = await client.initializeConviction(args);
      console.log('Transaction successful:', tx);
      router.push(`/pao/${tx}`);
    } catch (error) {
      console.error('Error creating Conviction PAO:', error);
      alert(`Error creating Conviction PAO: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      {/* Form fields */}
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
          <label htmlFor="approval_threshold" className="block text-white mb-2">Approval Threshold</label>
          <input type="number" id="approval_threshold" name="approval_threshold" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="min_stake_amount" className="block text-white mb-2">Min Stake Amount</label>
          <input type="number" id="min_stake_amount" name="min_stake_amount" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="collection_price" className="block text-white mb-2">Collection Price</label>
          <input type="number" id="collection_price" name="collection_price" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
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
              <input 
                type="text" 
                id="splMintAddress" 
                name="splMintAddress" 
                className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" 
                placeholder="Enter SPL token mint address"
              />
            </div>
          )}
        </div>
        <div>
          <label htmlFor="primary_governance_token" className="block text-white mb-2">Primary Governance Token</label>
          <select id="primary_governance_token" name="primary_governance_token" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3">
            <option value="nft">NFT</option>
            <option value="spl">SPL</option>
          </select>
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
        {loading ? 'Creating...' : 'Create Conviction PAO'}
      </motion.button>
    </motion.form>
  );
};

export default ConvictionCreationForm;