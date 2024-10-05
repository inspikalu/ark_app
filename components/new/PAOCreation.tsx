"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, web3, BN } from '@coral-xyz/anchor';
import { FiCheck, FiX } from 'react-icons/fi';
import DidYouKnowModal from "./DidYouKnowModal";
import { GovernanceType } from '../create/DashboardSearch';

// Import your IDL
import idl from '../../idl/absolute_monarchy.json';

const PROGRAM_ID = new PublicKey('ADp9DgS9ZpsVDCXb4ysDjJoB1d8cL3CUmm4ErwVtqWzu');

interface PaoCreationFormProps {
  governanceType: GovernanceType;
}

const PaoCreationForm: React.FC<PaoCreationFormProps> = ({ governanceType }) => {
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState<Program | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [nftTokenType, setNftTokenType] = useState('new');
  const [splTokenType, setSplTokenType] = useState('new');
  const router = useRouter();
  const { connection } = useConnection();
  const wallet = useWallet();

  const [monarchyForm, setMonarchyForm] = useState({
    name: '',
    description: '',
    monarchName: '',
    divineMandate: '',
    collectionPrice: '',
    nftSupply: '',
    splSupply: '',
    royalDecreeThreshold: '',
    minLoyaltyAmount: '',
    membershipTokensThreshold: '',
    knighthoodPrice: '',
    nftMintAddress: '',
    splMintAddress: '',
    nftSymbol: '',
    splSymbol: '',
    primaryKingdomToken: 'NFT',
  });

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      const provider = new AnchorProvider(connection, wallet as any, {});
      const program = new Program(idl as any, provider);
      setProgram(program);
      setLoading(false);
    }
  }, [wallet.connected, wallet.publicKey, connection]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMonarchyForm(prev => ({ ...prev, [name]: value }));
  };

  const initializeAndRegisterGovernment = async () => {
    if (!program || !wallet.publicKey) return;
    setLoading(true);
    setError(null);
    try {
      const [arkAnalyticsPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("ark_analytics")],
        program.programId
      );
      
      const [stateInfoPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("state_info")],
        program.programId
      );

      const tx = await program.methods.initializeAndRegisterGovernment(monarchyForm.name)
        .accounts({
          creator: wallet.publicKey,
          arkAnalytics: arkAnalyticsPda,
          stateInfo: stateInfoPda,
          governmentProgram: program.programId,
          arkProgram: new PublicKey("48qaGS4sA7bqiXYE6SyzaFiAb7QNit1A7vdib7LXhW2V"),
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      console.log("Government initialized and registered. Transaction signature", tx);
      setSuccess("Government initialized and registered successfully");
    } catch (err) {
      console.error("Error in initializeAndRegisterGovernment:", err);
      setError(`Failed to initialize and register government: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!program || !wallet.publicKey) return;
    setLoading(true);
    setError(null);

    try {
      const nftConfig = nftTokenType === 'new'
        ? { tokenType: { new: {} }, customMint: PublicKey.default }
        : { tokenType: { existing: {} }, customMint: new PublicKey(monarchyForm.nftMintAddress) };

      const splConfig = splTokenType === 'new'
        ? { tokenType: { new: {} }, customMint: PublicKey.default }
        : { tokenType: { existing: {} }, customMint: new PublicKey(monarchyForm.splMintAddress) };

      const [kingdomPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("kingdom"), wallet.publicKey.toBuffer()],
        program.programId
      );

      const [monarchPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("monarch"), kingdomPda.toBuffer()],
        program.programId
      );

      const tx = await program.methods.initializeAbsoluteMonarchy({
        name: monarchyForm.name,
        description: monarchyForm.description,
        monarchName: monarchyForm.monarchName,
        divineMandate: monarchyForm.divineMandate,
        collectionPrice: new BN(monarchyForm.collectionPrice),
        nftSupply: new BN(monarchyForm.nftSupply),
        splSupply: new BN(monarchyForm.splSupply),
        royalDecreeThreshold: new BN(monarchyForm.royalDecreeThreshold),
        minLoyaltyAmount: new BN(monarchyForm.minLoyaltyAmount),
        membershipTokensThreshold: new BN(monarchyForm.membershipTokensThreshold),
        knighthoodPrice: new BN(monarchyForm.knighthoodPrice),
        nftConfig,
        splConfig,
        primaryKingdomToken: { [monarchyForm.primaryKingdomToken]: {} },
      })
      .accounts({
        kingdom: kingdomPda,
        monarch: monarchPda,
        authority: wallet.publicKey,
        nftMint: nftConfig.customMint,
        splMint: splConfig.customMint,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        associatedTokenProgram: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();
      console.log('Transaction successful:', tx);
      setSuccess("Absolute Monarchy created successfully");
      router.push(`/pao/${tx}`);
    } catch (error) {
      console.error('Error creating Absolute Monarchy:', error);
      setError(`Error creating Absolute Monarchy: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!wallet.connected) {
    return <div>Please connect your wallet to create an Absolute Monarchy PAO.</div>;
  }

  if (loading) {
    return (
      <div className="flex items-start pt-5 justify-center min-h-screen bg-gradient-to-r from-teal-700 to-teal-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-white text-2xl"
        >
          <DidYouKnowModal isLoading={loading} />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black bg-opacity-50 p-6 rounded-lg space-y-6"
    >
      <motion.div 
        className="bg-white rounded-lg p-6 mb-8 text-gray-800"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-4"><FiCheck className="inline-block mr-2" /> Initialize and Register Government</h2>
        <button
          onClick={initializeAndRegisterGovernment}
          disabled={loading}
          className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
        >
          {loading ? 'Initializing...' : <><FiCheck className="mr-2" /> Initialize and Register Government</>}
        </button>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 text-gray-800"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-4"><FiCheck className="inline-block mr-2" /> Create Absolute Monarchy</h2>
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
          <label htmlFor="monarchName" className="block text-white mb-2">Monarch Name</label>
          <input type="text" id="monarchName" name="monarchName" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="divineMandate" className="block text-white mb-2">Divine Mandate</label>
          <input type="text" id="divineMandate" name="divineMandate" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="collectionPrice" className="block text-white mb-2">Collection Price</label>
          <input type="number" id="collectionPrice" name="collectionPrice" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="nftSupply" className="block text-white mb-2">NFT Supply</label>
          <input type="number" id="nftSupply" name="nftSupply" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="splSupply" className="block text-white mb-2">SPL Supply</label>
          <input type="number" id="splSupply" name="splSupply" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="royalDecreeThreshold" className="block text-white mb-2">Royal Decree Threshold</label>
          <input type="number" id="royalDecreeThreshold" name="royalDecreeThreshold" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="minLoyaltyAmount" className="block text-white mb-2">Min Loyalty Amount</label>
          <input type="number" id="minLoyaltyAmount" name="minLoyaltyAmount" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="membershipTokensThreshold" className="block text-white mb-2">Membership Tokens Threshold</label>
          <input type="number" id="membershipTokensThreshold" name="membershipTokensThreshold" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
        </div>
        <div>
          <label htmlFor="knighthoodPrice" className="block text-white mb-2">Knighthood Price</label>
          <input type="number" id="knighthoodPrice" name="knighthoodPrice" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3" />
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
          <label htmlFor="primaryKingdomToken" className="block text-white mb-2">Primary Kingdom Token</label>
          <select id="primaryKingdomToken" name="primaryKingdomToken" required className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3">
            <option value="nft">NFT</option>
            <option value="spl">SPL</option>
          </select>
        </div>
        </div>
        <motion.button
          whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-4 rounded mt-6"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Absolute Monarchy'}
        </motion.button>
      </motion.form>

      {error && (
        <motion.div 
          className="mt-4 p-4 bg-red-100 text-red-700 rounded flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FiX className="mr-2" /> {error}
        </motion.div>
      )}

      {success && (
        <motion.div 
          className="mt-4 p-4 bg-green-100 text-green-700 rounded flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FiCheck className="mr-2" /> {success}
        </motion.div>
      )}
    </motion.div>
  );
};

export default PaoCreationForm;


